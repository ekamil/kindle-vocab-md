import type { BookT, BookKey, LookupT, WordT } from "./db_models";

// intermediary between db_models and templates
export class Book {
  readonly id: BookKey;
  readonly title: string;
  readonly authors: string;
  readonly asin: string;
  readonly guid: string;

  public get safe_title(): string {
    // safe title - as in ready to be a file name
    return this.title.replaceAll(/\W/g, " ").replaceAll(/ +/g, " ").trim();
  }

  constructor(book_info: BookT) {
    this.id = book_info.id;
    this.title = book_info.title;
    this.authors = book_info.authors;
    this.asin = book_info.asin;
    this.guid = book_info.guid;
  }
}

interface Lookup {
  usage: string;
  book: Book;
  pos: string;
  date: Date;
}

export class LookedUpWord {
  word_key: string;
  word: string; // possibly declinated or sth
  stem: string;
  lookups: Lookup[];

  public get safe_word(): string {
    // safe word stem - ready to be a file name
    return this.stem.replaceAll(/\W/g, " ").replaceAll(/ +/g, " ").trim();
  }

  public get latest_lookup_date(): Date {
    let from_lookup;
    if (this.lookups) {
      from_lookup = this.lookups[-1]?.date;
    } else {
      from_lookup = null;
    }
    const long_time_ago = new Date("1970-01-01 12:00Z");
    return from_lookup != null ? from_lookup : long_time_ago;
  }

  constructor(
    word: WordT,
    lookups: LookupT[],
    books: ReadonlyMap<BookKey, Book>,
  ) {
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
          usage: l.usage,
          pos: l.pos,
          date: new Date(l.timestamp),
          book: book_info,
        };
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
