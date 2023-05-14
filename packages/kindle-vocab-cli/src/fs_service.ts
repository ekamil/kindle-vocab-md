import { promises } from "fs";
import matter from "gray-matter";
const { stringify } = matter;

import { Book, LookedUpWord, Lookup } from "@ekamil/kindle-vocab-api";
import { join } from "path";

import { render_book, render_lookup, render_word } from "./mappers.js";

const MARKDOWN = ".md";
const FRONT_FIELDS = {
  latest_lookup_date: "Latest lookup date",
  modified_at: "Modified at",
  asin: "ASIN",
};

export class FSService {
  constructor(private readonly books_dir: string, private readonly words_dir: string) {}

  ensure_dir = async (d: string) => {
    await promises.mkdir(d, { recursive: true });
  };

  write_book = async (book: Book) => {
    await this.ensure_dir(this.books_dir);
    const path = join(this.books_dir, book.safe_title) + MARKDOWN;
    let content;
    try {
      content = await promises.readFile(path, { encoding: "utf-8" });
    } catch {
      content = render_book(book);
      await promises.writeFile(path, content);
      return;
    }
    const parsed = matter(content);
    const asin_in_file = parsed.data[FRONT_FIELDS.asin];
    if (asin_in_file === undefined) {
      console.debug(`Writing ASIN to file ${path}`);
      await this.write_book_ASIN(book, path, parsed, content);
      return;
    } else if (book.asin !== asin_in_file) {
      await this.handle_conflict(book, path, content);
      return;
    }
  };

  private async write_book_ASIN(
    book: Book,
    path: string,
    parsed: matter.GrayMatterFile<string>,
    content: string,
  ) {
    parsed.data[FRONT_FIELDS.asin] = book.asin;
    parsed.data[FRONT_FIELDS.modified_at] = new Date().toISOString();
    await promises.writeFile(path, stringify(content, parsed.data));
  }

  private async handle_conflict(book: Book, path: string, content: string) {
    // creating another file with trailing number
    const message = `Ambiguous duplicate book: "${book.title}" in "${path}"`;
    const path_1 = join(this.books_dir, book.safe_title) + " 1" + MARKDOWN;
    console.log(`${message}. Writing another file ${path_1}`);
    content = render_book(book);
    await promises.writeFile(path_1, content);
  }

  write_word = async (word: LookedUpWord) => {
    await this.ensure_dir(this.words_dir);
    const path = join(this.words_dir, word.safe_word) + MARKDOWN;

    let content;
    try {
      content = await promises.readFile(path, { encoding: "utf-8" });
    } catch {
      content = render_word(word);
      await promises.writeFile(path, content);
    }
    await this.write_word_lookups(word, path, content);
  };

  async write_word_lookups(word: LookedUpWord, path: string, existing_content: string) {
    const parsed = matter(existing_content);
    let needs_write = false;
    word.lookups.forEach((lookup) => {
      if (!parsed.content.includes(lookup.date.toISOString())) {
        this.append_lookup_to_content(parsed, lookup);
      }
      needs_write = true;
    });
    if (needs_write) {
      await promises.writeFile(path, stringify(parsed.content, parsed.data));
    }
  }

  private append_lookup_to_content(parsed: matter.GrayMatterFile<string>, lookup: Lookup) {
    const rendered = render_lookup(lookup);
    parsed.content += "\n";
    parsed.content += rendered;

    parsed.data[FRONT_FIELDS.modified_at] = new Date().toISOString();
    parsed.data[FRONT_FIELDS.latest_lookup_date] = lookup.date.toISOString();
  }
}
