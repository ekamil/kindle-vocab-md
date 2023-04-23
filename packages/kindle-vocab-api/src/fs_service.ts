import { promises } from "fs";
import { join } from "path";
import matter, { stringify } from "gray-matter";
import { Book, LookedUpWord, Lookup } from "./domain_models";
import {
  render_book_template,
  render_lookup_template,
  render_word_template,
} from "./templates";
import {
  book_to_template_vars,
  lookup_to_template_vars,
  word_to_template_vars,
} from "./mappers";

const MARKDOWN = ".md";
const FRONT_FIELDS = {
  latest_lookup_date: "Latest lookup date",
  modified_at: "Modified at",
  asin: "ASIN",
};

export class FSService {
  constructor(
    private readonly books_dir: string,
    private readonly words_dir: string,
  ) {}

  ensure_dirs = async () => {
    [this.books_dir, this.words_dir].forEach(async (d) => {
      try {
        await promises.access(d);
        console.log(`${d} already exists`);
      } catch (error) {
        await promises.mkdir(d, { recursive: true });
      }
    });
  };

  write_book = async (book: Book) => {
    const path = join(this.books_dir, book.safe_title) + MARKDOWN;
    let content;
    try {
      content = await promises.readFile(path, { encoding: "utf-8" });
    } catch {
      const as_vars = book_to_template_vars(book);
      content = render_book_template(as_vars);
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
    const as_vars = book_to_template_vars(book);
    content = render_book_template(as_vars);
    await promises.writeFile(path, content);
  }

  write_word = async (word: LookedUpWord) => {
    const path = join(this.words_dir, word.safe_word) + MARKDOWN;
    const as_vars = word_to_template_vars(word);

    let content;
    try {
      content = await promises.readFile(path, { encoding: "utf-8" });
    } catch {
      content = render_word_template(as_vars);
      await promises.writeFile(path, content);
    }
    this.write_word_lookups(word, path, content);
  };

  async write_word_lookups(
    word: LookedUpWord,
    path: string,
    existing_content: string,
  ) {
    const parsed = matter(existing_content);
    var needs_write = false;
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

  private append_lookup_to_content(
    parsed: matter.GrayMatterFile<string>,
    lookup: Lookup,
  ) {
    const vars = lookup_to_template_vars(lookup);
    const rendered = render_lookup_template(vars);
    parsed.content += "\n";
    parsed.content += rendered;

    parsed.data[FRONT_FIELDS.modified_at] = new Date().toISOString();
    parsed.data[FRONT_FIELDS.latest_lookup_date] = lookup.date.toISOString();
  }
}
