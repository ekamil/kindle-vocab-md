import { BookRepository, LookupRepository, WordRepository } from "./db";
import type { WordKey, WordT } from "./db_models";
import { EnhancedWord } from "./domain_models";
import { type TemplateVars } from "./templates";
import { PromisifiedDatabase } from "./tools/promisified_sqlite";

export class WordService {
  private readonly lookups_repo: LookupRepository;
  private readonly words_repo: WordRepository;
  private readonly books_repo: BookRepository;
  public readonly words: Map<WordKey, EnhancedWord>;

  constructor(private readonly db: PromisifiedDatabase) {
    this.lookups_repo = new LookupRepository(this.db);
    this.words_repo = new WordRepository(this.db);
    this.books_repo = new BookRepository(this.db);
    this.words = new Map<WordKey, EnhancedWord>();
  }

  async all_words() {
    return await this.words_repo.all();
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

  async word_to_template_vars(word: EnhancedWord): Promise<TemplateVars> {
    type WordVars = TemplateVars["word"];
    type LookupVars = TemplateVars["lookups"];
    type BookVars = TemplateVars["books"];

    const word_vars: WordVars = {
      word: word.word,
      stem: word.stem,
    };

    const lookup_vars: LookupVars = [];
    const book_vars: BookVars = [];
    word.lookups // already sorted by date
      .map((actual_lookup) => {
        lookup_vars.push({
          usage: actual_lookup.usage,
          book: actual_lookup.book.safe_title,
          pos: actual_lookup.pos,
          date: actual_lookup.date.toISOString(),
        });
        return actual_lookup;
      })
      .map((actual_lookup) => {
        book_vars.push({
          safe_title: actual_lookup.book.safe_title,
          title: actual_lookup.book.title,
          authors: actual_lookup.book.authors,
          asin: actual_lookup.book.asin,
          guid: actual_lookup.book.guid,
          latest_lookup_date: actual_lookup.date.toISOString(),
        });
      });

    return Promise.resolve({
      word: word_vars,
      lookups: lookup_vars,
      books: book_vars,
    });
  }
}
