import type { BookKey, BookT, LookupT, WordKey, WordT } from "./db_models.js";
import type { BookI, LookupI, LookedUpWordI } from "./domain_types.js";
import { normalize_book_title, normalize_word } from "./tools/normalize.js";

export class Book implements BookI {
  readonly book_key: BookKey;
  readonly title: string;
  readonly authors: string;
  readonly asin: string;
  readonly guid: string;
  readonly safe_title: string;

  constructor(book_info: BookT) {
    this.book_key = book_info.id;
    this.title = book_info.title;
    this.authors = book_info.authors;
    this.asin = book_info.asin;
    this.guid = book_info.guid;
    this.safe_title = normalize_book_title(book_info.title);
  }
}

export class Lookup implements LookupI {
  word_key: WordKey;
  word: string;
  usage: string;
  book: Book;
  pos: string;
  date: Date;

  constructor(l: LookupT, book: Book, word: string) {
    this.word_key = l.word_key;
    this.word = word;
    this.usage = l.usage;
    this.pos = l.pos;
    this.date = new Date(l.timestamp);
    this.book = book;
  }
}

export class LookedUpWord implements LookedUpWordI {
  word_key: string;
  word: string; // possibly declinated or sth
  stem: string;
  lookups: Lookup[] = [];
  safe_word: string;

  public get latest_lookup_date(): Date {
    const from_lookup = this.lookups[-1]?.date;
    const long_time_ago = new Date("1970-01-01 12:00Z");
    return from_lookup != null ? from_lookup : long_time_ago;
  }

  constructor(word: WordT) {
    this.word_key = word.id;
    this.word = word.word;
    this.stem = word.stem;
    this.safe_word = normalize_word(word.stem);
  }
  append_lookup = (lookup: Lookup) => {
    this.lookups.push(lookup);
    this.lookups = this.lookups.sort((l1, l2) => {
      return l1.date < l2.date ? -1 : 1;
    });
  };
}

export class Vocabulary {
  // Main entry point for this API, books, words, lookups.
  public readonly words: Map<WordKey, LookedUpWord> = new Map();
  public readonly books: Map<BookKey, Book> = new Map();
}
