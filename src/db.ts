import { Database } from "sqlite3";
import type { Lookup, Word } from "./models";

export class Repository {
  private readonly db: Database;
  constructor(path = "vocab.db") {
    this.db = new Database(path);
  }

  async findWord(partial: string): Promise<Word> {
    return new Promise<Word>((resolve) => {
      this.db.get(
        "SELECT * from words where stem like ?",
        [partial],
        (_, row) => {
          resolve(row as Word);
        },
      );
    });
  }

  getLookupsForWord(word: Word): Lookup[] {
    return [];
  }
}
