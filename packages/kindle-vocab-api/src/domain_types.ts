import type { BookKey, WordKey } from "./db_models.js";

export type BookI = {
  readonly book_key: BookKey;
  readonly title: string;
  readonly authors: string;
  readonly asin: string;
  readonly guid: string;
  readonly safe_title: string;
};

export type LookupI = {
  readonly word_key: WordKey;
  readonly word: string;
  readonly usage: string;
  readonly book: BookI;
  readonly pos: string;
  readonly date: Date;
};

export type LookedUpWordI = {
  readonly word_key: string;
  readonly word: string; // possibly declinated or sth
  readonly stem: string;
  readonly lookups: LookupI[];
  readonly safe_word: string;

  readonly latest_lookup_date: Date;
};
