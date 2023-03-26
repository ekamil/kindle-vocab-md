import { promises } from "fs";
import { join } from "path";
import { Book } from "./domain_models";
import { renderBookTemplate } from "./templates";
import { book_to_template_vars } from "./tools/mappers";

export class FSService {
  constructor(
    private readonly books_dir: string,
    private readonly words_dir: string,
  ) {}
  write_book = async (book: Book) => {
    const path = join(this.books_dir, book.safe_title);
    try {
      await promises.access(path);
      // book file already exists - we should update title
      if (book.latest_lookup_date) {
        this.update_book_time(book);
      }
    } catch {
      const as_vars = book_to_template_vars(book);
      const content = renderBookTemplate(as_vars);
      await promises.writeFile(path, content);
    }
  };
  update_book_time = async (book: Book) => {
    throw "unimplemented";
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
