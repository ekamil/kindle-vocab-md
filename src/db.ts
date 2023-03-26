import type {
  BookT,
  BookKey,
  LookupT,
  WordT,
  WordKey,
  LookupKey,
} from "./db_models";
import { PromisifiedDatabase } from "./tools/promisified_sqlite";
import { ReadListRepository } from "./tools/repository";

const queries = {
  book_by_id: "SELECT * FROM books WHERE id = ?",
  books: "SELECT * FROM books ORDER BY id ASC",

  word_by_id: "SELECT * FROM words WHERE id = ? ORDER BY timestamp ASC",
  word_by_stem: "SELECT * FROM words WHERE stem like ? ORDER BY timestamp ASC",
  words: "SELECT * FROM words ORDER BY timestamp ASC",

  lookups_by_word_key:
    "SELECT * FROM lookups WHERE word_key = ? ORDER BY timestamp ASC",
  lookup_by_id: "SELECT * FROM lookups WHERE id = ?",
  lookups: "SELECT * FROM lookups ORDER BY timestamp ASC",
};

export class BookRepository extends ReadListRepository<BookKey, BookT> {
  constructor(db: PromisifiedDatabase) {
    super(db, queries.book_by_id, queries.books);
  }
}

export class LookupRepository extends ReadListRepository<LookupKey, LookupT> {
  constructor(db: PromisifiedDatabase) {
    super(db, queries.lookup_by_id, queries.lookups);
  }

  async for_word(word: WordKey): Promise<LookupT[]> {
    const from_cache = new Array(...this.cache.values()).filter(
      (l) => l.word_key == word,
    );
    return Promise.resolve(from_cache);
  }
}

export class WordRepository extends ReadListRepository<WordKey, WordT> {
  constructor(db: PromisifiedDatabase) {
    super(db, queries.word_by_id, queries.words);
  }
}
