import { promises } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { Book } from "./domain_models";
import { renderBookTemplate } from "./templates";
import { book_to_template_vars } from "./tools/mappers";

const MARKDOWN = ".md";

export class FSService {
  constructor(
    private readonly books_dir: string,
    private readonly words_dir: string,
  ) {}
  write_book = async (book: Book) => {
    const path = join(this.books_dir, book.safe_title) + MARKDOWN;
    var content;
    try {
      content = await promises.readFile(path, { encoding: "utf-8" });
    } catch {
      const as_vars = book_to_template_vars(book);
      content = renderBookTemplate(as_vars);
      await promises.writeFile(path, content);
      return;
    }
    const parsed = matter(content);
    console.log(parsed.data["Latest lookup date"]);
    if (book.asin !== parsed.data?.ASIN) {
      const message = `Ambiguous duplicate book: "${book.title}" in "${path}"`;
      // todo - same title but different book - handle this
      throw message;
    }
    // book file already exists - we should update last excerpt's time
    if (book.latest_lookup_date) {
      parsed.data["Latest lookup date"] = book.latest_lookup_date.toISOString();
    }
    parsed.data["Modified at"] = new Date().toISOString();
    promises.writeFile(path, parsed.stringify());
  };
  write_word = async () => {
    throw "unimplemented";
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

  existing_files = () => {
    throw "unimplemented";
  };
}
