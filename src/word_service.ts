import { BookRepository, LookupRepository, WordRepository } from "./db";
import type { WordKey, WordT, BookKey } from "./db_models";
import { Book, LookedUpWord, Lookup } from "./domain_models";
import { PromisifiedDatabase } from "./tools/promisified_sqlite";

export class WordService {
  private readonly lookups_repo: LookupRepository;
  private readonly words_repo: WordRepository;
  private readonly books_repo: BookRepository;
  public readonly words: Map<WordKey, LookedUpWord>;
  public readonly books: Map<BookKey, Book>;
  public readonly lookups_by_word: Map<WordKey, Lookup[]>;
  public readonly lookups_by_book: Map<BookKey, Lookup[]>;

  constructor(private readonly db: PromisifiedDatabase) {
    this.lookups_repo = new LookupRepository(this.db);
    this.words_repo = new WordRepository(this.db);
    this.books_repo = new BookRepository(this.db);
    this.words = new Map();
    this.books = new Map();
    this.lookups_by_word = new Map();
    this.lookups_by_book = new Map();
  }

  public load = async () => {
    (await this.books_repo.all()).forEach((db_book) => {
      this.books.set(db_book.id, new Book(db_book));
      this.lookups_by_book.set(db_book.id, new Array());
    });

    (await this.lookups_repo.all()).forEach((db_lookup) => {
      const book = this.books.get(db_lookup.book_key);
      if (book === undefined) {
        throw `missing book for lookup ${db_lookup}`;
      }
      const lookup = new Lookup(db_lookup, book);

      const wk = db_lookup.word_key;
      if (this.lookups_by_word.has(wk)) {
        this.lookups_by_word.get(wk)?.push(lookup);
      } else {
        this.lookups_by_word.set(wk, [lookup]);
      }
      const bk = db_lookup.book_key;
      if (this.lookups_by_book.has(bk)) {
        this.lookups_by_book.get(bk)?.push(lookup);
      } else {
        this.lookups_by_book.set(bk, [lookup]);
      }
    });

    (await this.words_repo.all()).forEach(async ({ id }) => {
      const enhanced = await this.enhance_word(id);
      this.words.set(id, enhanced);
    });
  };

  async all_words(): Promise<string[]> {
    // TODO: filtering
    return (await this.words_repo.all()).map((word) => {
      return word.id;
    });
  }

  async enhance_word(word_key: WordKey): Promise<LookedUpWord> {
    const from_cache = this.words.get(word_key);
    if (from_cache !== undefined) {
      return Promise.resolve(from_cache);
    }
    const word: WordT = await this.words_repo.get(word_key);
    const lookups = this.lookups_by_word.get(word.id) || [];
    const enhanced = new LookedUpWord(word, lookups);
    this.words.set(word_key, enhanced);
    return Promise.resolve(enhanced);
  }
}
