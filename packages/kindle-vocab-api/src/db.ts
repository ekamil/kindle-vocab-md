import type { BookT, BookKey, LookupT, WordT, WordKey, LookupKey } from "./db_models.js";
import Database from "better-sqlite3";
import { Database as DatabaseType } from "better-sqlite3";
import { ReadListRepository } from "./tools/repository.js";

const queries = {
  book_by_id: "SELECT * FROM book_info WHERE id = ?",
  books: "SELECT * FROM book_info ORDER BY id ASC",

  word_by_id: "SELECT * FROM words WHERE id = ? ORDER BY timestamp ASC",
  word_by_stem: "SELECT * FROM words WHERE stem like ? ORDER BY timestamp ASC",
  words: "SELECT * FROM words ORDER BY timestamp ASC",

  lookups_by_word_key: "SELECT * FROM lookups WHERE word_key = ? ORDER BY timestamp ASC",
  lookup_by_id: "SELECT * FROM lookups WHERE id = ?",
  lookups: "SELECT * FROM lookups ORDER BY timestamp ASC",
};

export type Repositories = {
  books: BookRepository;
  lookups: LookupRepository;
  words: WordRepository;
  _db: DatabaseType;
};

export const createRepositories = async (path_to_db: string): Promise<Repositories> => {
  const db = new Database(path_to_db);
  return {
    books: new BookRepository(db),
    lookups: new LookupRepository(db),
    words: new WordRepository(db),
    _db: db,
  };
};

class BookRepository extends ReadListRepository<BookKey, BookT> {
  constructor(db: Database.Database) {
    super(db, queries.book_by_id, queries.books);
  }
}

class LookupRepository extends ReadListRepository<LookupKey, LookupT> {
  private cache = new Array<LookupT>();
  constructor(db: Database.Database) {
    super(db, queries.lookup_by_id, queries.lookups);
  }

  async for_word(word: WordKey): Promise<LookupT[]> {
    if (this.cache.length == 0) {
      (await this.all()).forEach((element) => {
        this.cache.push(element);
      });
    }
    const from_cache = this.cache.filter((l) => l.word_key == word);
    return Promise.resolve(from_cache);
  }
}

class WordRepository extends ReadListRepository<WordKey, WordT> {
  constructor(db: Database.Database) {
    super(db, queries.word_by_id, queries.words);
  }
}
