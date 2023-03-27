import { promises } from "fs";
import { join } from "path";
import matter, { stringify } from "gray-matter";
import { Book, EnhancedWord } from "./domain_models";
import {
  renderBookTemplate,
  renderLookupTemplate,
  renderWordTemplate,
} from "./templates";
import { book_to_template_vars, word_to_template_vars } from "./mappers";

const MARKDOWN = ".md";
const FRONT_FIELDS = {
  latest_lookup_date: "Latest lookup date",
  modified_at: "Modified at",
  asin: "ASIN",
};

export class FSService {
  // TODO: extract rendering
  constructor(
    private readonly books_dir: string,
    private readonly words_dir: string,
  ) {}

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
    let needs_write = false;
    const parsed = matter(content);
    if (parsed.data[FRONT_FIELDS.asin] === undefined) {
      console.info(`Writing ASIN to file ${path}`);
      parsed.data[FRONT_FIELDS.asin] = book.asin;
      needs_write = true;
    } else if (book.asin !== parsed.data[FRONT_FIELDS.asin]) {
      const message = `Ambiguous duplicate book: "${book.title}" in "${path}"`;
      // todo: - same title but different book - handle this
      throw message;
    }
    // book file already exists - do nothing
    parsed.data[FRONT_FIELDS.modified_at] = new Date().toISOString();
    if (needs_write) {
      await promises.writeFile(path, stringify(content, parsed.data));
    }
  };

  write_word = async (word: EnhancedWord, include_books = false) => {
    const path = join(this.words_dir, word.safe_word) + MARKDOWN;
    const as_vars = word_to_template_vars(word);

    let content;
    try {
      content = await promises.readFile(path, { encoding: "utf-8" });
    } catch {
      as_vars.word.lookups = as_vars.lookups;
      content = renderWordTemplate(as_vars.word);
      await promises.writeFile(path, content);
      if (include_books) {
        word.lookups
          .map((l) => {
            return l.book;
          })
          .forEach((b) => {
            this.write_book(b);
          });
      }
      return;
    }
    const parsed = matter(content);
    let needs_write = false;
    for (let index = 0; index < as_vars.lookups.length; index++) {
      // append missing lookups, using date for disambiguation
      const { date } = word.lookups[index];
      if (parsed.content.includes(date.toISOString())) {
        console.log("Lookup already in file");
        continue;
      }
      needs_write = true;

      const for_template = as_vars.lookups[index];
      const rendered = renderLookupTemplate(for_template);
      parsed.content += "\n";
      parsed.content += rendered;

      parsed.data[FRONT_FIELDS.modified_at] = new Date().toISOString();
      parsed.data[FRONT_FIELDS.latest_lookup_date] = date.toISOString();
    }
    if (needs_write) {
      await promises.writeFile(path, stringify(content, parsed.data));
    }
  };

  append_usage_to_word = async () => {
    throw "unimplemented";
  };

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
}
