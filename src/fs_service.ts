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
    const parsed = matter(content);
    if (book.asin !== parsed.data[FRONT_FIELDS.asin]) {
      const message = `Ambiguous duplicate book: "${book.title}" in "${path}"`;
      // todo - same title but different book - handle this
      throw message;
    }
    // book file already exists - do nothing
    // parsed.data[FRONT_FIELDS.modified_at] = new Date().toISOString();
    // await promises.writeFile(path, stringify(content, parsed.data));
  };

  write_word = async (word: EnhancedWord) => {
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
    // const rendered_lookups = word.lookups.map((l) => {
    //   renderLookupTemplate(as_vars.lookups);
    // });
    //todo: file exists - need to append lookups?

    parsed.data[FRONT_FIELDS.modified_at] = new Date().toISOString();
    await promises.writeFile(path, stringify(content, parsed.data));
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
