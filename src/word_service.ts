import { BookRepository, LookupRepository, WordRepository } from "./db";
import type { WordKey, WordT, BookKey, LookupT, LookupKey } from "./db_models";
import { Book, LookedUpWord, Lookup } from "./domain_models";
import { PromisifiedDatabase } from "./tools/promisified_sqlite";

export class WordService {
  public readonly words: Map<WordKey, LookedUpWord> = new Map();
  public readonly books: Map<BookKey, Book> = new Map();
  public readonly lookups: Map<LookupKey, Lookup> = new Map();
  private ready: boolean = false;

  constructor(private readonly db: PromisifiedDatabase) {}

  public async load(): Promise<WordService> {
    if (this.ready) return Promise.resolve(this);

    const lookups_repo = new LookupRepository(this.db);
    const words_repo = new WordRepository(this.db);
    const books_repo = new BookRepository(this.db);

    (await books_repo.all()).forEach((db_book) => {
      this.books.set(db_book.id, new Book(db_book));
    });

    (await lookups_repo.all()).forEach((db_lookup) => {
      this.loadLookups(db_lookup);
    });

    (await words_repo.all()).forEach(async (word) => {
      const enhanced = this.enhance_word(word);
      this.words.set(word.id, enhanced);
    });
    this.ready = true;
    return Promise.resolve(this);
  }

  private loadLookups(db_lookup: LookupT) {
    const book = this.books.get(db_lookup.book_key);
    if (book === undefined) {
      throw `missing book for lookup ${db_lookup}`;
    }
    const lookup = new Lookup(db_lookup, book);
    this.lookups.set(db_lookup.id, lookup);
  }

  private lookups_by_word(word_id: WordKey): Lookup[] {
    var results: Lookup[] = [];
    this.lookups.forEach((lookup) => {
      if (lookup.word_key == word_id) {
        results.push(lookup);
      }
    });

    return results;
  }

  private enhance_word(word: WordT): LookedUpWord {
    const lookups = this.lookups_by_word(word.id);
    if (lookups === undefined) {
      throw `missing lookups for word ${word}`;
    }
    return new LookedUpWord(word, lookups);
  }
}
