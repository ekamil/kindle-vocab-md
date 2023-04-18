import type { BookT, BookKey, LookupT, WordT, WordKey } from "./db_models";

import { normalize_book_title, normalize_word } from "./tools/normalize";

export class Book {
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

export class Lookup {
  word_key: WordKey;
  usage: string;
  book: Book;
  pos: string;
  date: Date;

  constructor(l: LookupT, book: Book) {
    this.word_key = l.word_key;
    this.usage = l.usage;
    this.pos = l.pos;
    this.date = new Date(l.timestamp);
    this.book = book;
  }
}

export class LookedUpWord {
  word_key: string;
  word: string; // possibly declinated or sth
  stem: string;
  lookups: Lookup[];
  safe_word: string;

  public get latest_lookup_date(): Date {
    let from_lookup = this.lookups[-1]?.date;
    const long_time_ago = new Date("1970-01-01 12:00Z");
    return from_lookup != null ? from_lookup : long_time_ago;
  }

  constructor(word: WordT, lookups: Lookup[]) {
    this.word_key = word.id;
    this.word = word.word;
    this.stem = word.stem;
    this.safe_word = normalize_word(word.stem);
    this.lookups = lookups
      .map((l) => {
        if (l.word_key != this.word_key) {
          throw `invalid lookup ${l} for word ${this.word_key}`;
        }
        return l;
      })
      .map((l) => {
        // markdown highlighting in sentence
        l.usage = l.usage.replaceAll(word.word, `==${word.word}==`);
        return l;
      })
      .sort((l1, l2) => {
        return l1.date < l2.date ? -1 : 1;
      });
  }
}

// class Vocabulary {
//   // Main entry point for this API, books, words, lookups.
// }
