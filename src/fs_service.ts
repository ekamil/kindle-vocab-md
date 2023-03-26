import { readFileSync } from "fs";

const file = readFileSync("./filename.txt", "utf-8");

export class FSService {
  // https://nodejs.org/api/fs.html
  write_book = () => {};
  update_book_time = () => {};
  write_word = () => {};
  append_word = () => {};
  ensure_dirs = () => {};
}
