import { BookRepository, LookupRepository, WordRepository } from "./db";
import type { WordKey, WordT } from "./db_models";
import { Book, LookedUpWord } from "./domain_models";
import { PromisifiedDatabase } from "./tools/promisified_sqlite";

export class WordService {
  private readonly lookups_repo: LookupRepository;
  private readonly words_repo: WordRepository;
  private readonly books_repo: BookRepository;
  public readonly words: Map<WordKey, LookedUpWord>;
  public readonly books: Book[];

  constructor(private readonly db: PromisifiedDatabase) {
    this.lookups_repo = new LookupRepository(this.db);
    this.words_repo = new WordRepository(this.db);
    this.books_repo = new BookRepository(this.db);
    this.words = new Map<WordKey, LookedUpWord>();
    this.books = new Array<Book>();
  }

  async all_words(): Promise<string[]> {
    // TODO: filtering
    return (await this.words_repo.all()).map((word) => {
      return word.id;
    });
  }

  async all_books(): Promise<Book[]> {
    const all = await this.books_repo.all();
    return all.map((it) => {
      return new Book(it);
    });
  }

  async enhance_word(word_key: WordKey): Promise<LookedUpWord> {
    const from_cache = this.words.get(word_key);
    if (from_cache !== undefined) {
      return Promise.resolve(from_cache);
    }
    const word: WordT = await this.words_repo.get(word_key);
    const lookups = await this.lookups_repo.for_word(word.id);

    const books = new Map(
      (await this.books_repo.all()).map((db_book) => {
        return [db_book.id, new Book(db_book)];
      }),
    );

    const enhanced = new LookedUpWord(word, lookups, books);
    this.words.set(word_key, enhanced);
    return Promise.resolve(enhanced);
  }
}
