import { promises } from "fs";
import { join } from "path";
import matter, { stringify } from "gray-matter";
import { Book, LookedUpWord, Lookup } from "./domain_models";
import {
  renderBookTemplate,
  renderLookupTemplate,
  renderWordTemplate,
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
      content = renderBookTemplate(as_vars);
      await promises.writeFile(path, content);
      return;
    }
    await this.maybeUpdateBook(book, path, content);
  };

  private async maybeUpdateBook(book: Book, path: string, content: string) {
    // book file already exists - only write ASIN for later if it isn't already there
    const parsed = matter(content);
    const asin_in_file = parsed.data[FRONT_FIELDS.asin];
    if (asin_in_file === undefined) {
      console.info(`Writing ASIN to file ${path}`);
      parsed.data[FRONT_FIELDS.asin] = book.asin;
      parsed.data[FRONT_FIELDS.modified_at] = new Date().toISOString();
      await promises.writeFile(path, stringify(content, parsed.data));
    } else if (book.asin !== asin_in_file) {
      const message = `Ambiguous duplicate book: "${book.title}" in "${path}"`;
      // todo: - same title but different book - handle this
      throw message;
    }
  }

  write_word = async (word: LookedUpWord) => {
    const path = join(this.words_dir, word.safe_word) + MARKDOWN;
    const as_vars = word_to_template_vars(word);

    let content;
    try {
      content = await promises.readFile(path, { encoding: "utf-8" });
    } catch {
      as_vars.word.lookups = as_vars.lookups;
      content = renderWordTemplate(as_vars.word);
      await promises.writeFile(path, content);
      return;
    }
    const parsed = matter(content);
    let needs_write = false;
    for (let index = 0; index < as_vars.lookups.length; index++) {
      // append missing lookups, using date for disambiguation
      const lookup = word.lookups[index];
      if (parsed.content.includes(lookup.date.toISOString())) {
        // console.log("Lookup already in file");
        continue;
      }
      needs_write = true;
      this.appendNewLookup(parsed, lookup);
    }
    if (needs_write) {
      await promises.writeFile(path, stringify(content, parsed.data));
    }
  };

  private appendNewLookup(
    parsed: matter.GrayMatterFile<string>,
    lookup: Lookup,
  ) {
    const vars = lookup_to_template_vars(lookup);
    const rendered = renderLookupTemplate(vars);
    parsed.content += "\n";
    parsed.content += rendered;

    parsed.data[FRONT_FIELDS.modified_at] = new Date().toISOString();
    parsed.data[FRONT_FIELDS.latest_lookup_date] = lookup.date.toISOString();
  }
}
