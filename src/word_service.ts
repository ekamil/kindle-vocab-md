import { BookRepository, LookupRepository, WordRepository } from "./db";
import type { WordKey, WordT } from "./db_models";
import { Book, EnhancedWord } from "./domain_models";
import { PromisifiedDatabase } from "./tools/promisified_sqlite";

export class WordService {
  private readonly lookups_repo: LookupRepository;
  private readonly words_repo: WordRepository;
  private readonly books_repo: BookRepository;
  public readonly words: Map<WordKey, EnhancedWord>;
  public readonly books: Book[];

  constructor(private readonly db: PromisifiedDatabase) {
    this.lookups_repo = new LookupRepository(this.db);
    this.words_repo = new WordRepository(this.db);
    this.books_repo = new BookRepository(this.db);
    this.words = new Map<WordKey, EnhancedWord>();
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

  async enhance_word(word_key: WordKey): Promise<EnhancedWord> {
    const from_cache = this.words.get(word_key);
    if (from_cache !== undefined) {
      return Promise.resolve(from_cache);
    }
    const word: WordT = await this.words_repo.get(word_key);
    const lookups = await this.lookups_repo.for_word(word.id);
    const books = await this.books_repo.as_map();
    const enhanced = new EnhancedWord(word, lookups, books);
    this.words.set(word_key, enhanced);
    return Promise.resolve(enhanced);
  }
}
