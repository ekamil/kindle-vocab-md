import type { BookInfo, BookKey, Lookup, Word } from "./db_models";

// intermediary between db_models and templates
export class Book {
  readonly title: string;
  readonly authors: string;
  readonly asin: string;
  readonly guid: string;
  public get safe_title(): string {
    // safe title - as in ready to be a file name
    return this.title.replaceAll(/\W/g, " ").replaceAll(/ +/g, " ").trim();
  }

  constructor(book_info: BookInfo) {
    this.title = book_info.title;
    this.authors = book_info.authors;
    this.asin = book_info.asin;
    this.guid = book_info.guid;
  }
}

export interface EnhancedLookup {
  usage: string;
  book: Book;
  pos: string;
  date: Date;
}

export class EnhancedWord {
  word_key: string;
  word: string; // possibly declinated or sth
  stem: string;
  lookups: EnhancedLookup[];
  constructor(word: Word, lookups: Lookup[], books: Map<BookKey, BookInfo>) {
    this.word_key = word.id;
    this.word = word.word;
    this.stem = word.stem;
    this.lookups = lookups
      .map((l) => {
        const book_info = books.get(l.book_key);
        if (book_info === undefined) {
          throw `missing book for lookup ${l}`;
        }
        return {
          usage: l.usage, // consider highlighting here
          pos: l.pos,
          date: new Date(l.timestamp),
          book: new Book(book_info),
        };
      })
      .map((l) => {
        l.usage = l.usage.replaceAll(word.word, `::${word.word}::`);
        return l;
      })
      .sort((l1, l2) => {
        return l1.date < l2.date ? -1 : 1;
      });
  }
}
