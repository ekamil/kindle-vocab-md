import type { BookInfo } from "./db_models";

// intermediary between db_models and templates
export class Book {
  readonly title: string;
  readonly authors: string;
  readonly asin: string;
  readonly guid: string;
  public get safe_title(): string {
    // safe title - as in ready to be a file name
    // TODO: remove \W , strip whitespaces
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

export interface EnhancedWord {
  word_key: string;
  word: string; // possibly declinated or sth
  stem: string;
  lookups: EnhancedLookup[]; // todo: sorting - here or method higher?
}
