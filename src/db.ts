import { Database } from "sqlite3";

export const openDB = (path = "vocab.db") => {
  return new Database(path);
};

interface Lookup {
  id: string;
  word_key: string;
  book_key: string;
  dict_key: string;
  pos: string;
  usage: string;
  timestamp: number;
}
interface Word {
  id: string;
  word: string;
  lang: string;
  stem: string;
  timestamp: number;
}

export class Repository {
  private readonly db: Database;
  constructor(path: string = "vocab.db") {
    this.db = new Database(path);
  }

  async findWord(partial: string): Promise<Word> {
    return new Promise<Word>((resolve, reject) => {
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
