import type { BookInfo, BookKey, Lookup, Word } from "./db_models";
import { PromisifiedDatabase } from "./tools/promisified_sqlite";

const queries = {
  word_query: "SELECT * FROM words WHERE stem like ? ORDER BY timestamp ASC",
  lookups_for_word:
    "SELECT * FROM lookups WHERE word_key = ? ORDER BY timestamp ASC",
  book_by_id: "SELECT * FROM books WHERE id = ?",
  books: "SELECT * FROM books ORDER BY id ASC",
};
const not_found = "not found";

class BookRepository {
  private books = new Map<BookKey, BookInfo>();
  constructor(private readonly db: PromisifiedDatabase) {}

  async get(book_key: BookKey): Promise<BookInfo> {
    const from_cache = this.books.get(book_key);
    if (from_cache !== undefined) {
      return Promise.resolve(from_cache);
    }
    const from_db = await this.db.get<BookInfo>(queries.book_by_id, [book_key]);
    if (from_db.id) {
      this.books.set(book_key, from_db);
      return Promise.resolve(from_db);
    }
    return Promise.reject(not_found);
  }
}
export class Repository {
  private readonly db: PromisifiedDatabase;
  private readonly books: BookRepository;
  constructor(path = "vocab.db") {
    this.db = new PromisifiedDatabase(path);
    this.books = new BookRepository(this.db);
  }

  async findWord(partial: string): Promise<Word> {
    return this.db.get(queries.word_query, [partial]);
  }

  async getLookupsForWord(word: Word): Promise<Lookup[]> {
    return this.db.all(queries.lookups_for_word, [word.id]);
  }
}
