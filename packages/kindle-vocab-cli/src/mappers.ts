import { Book, LookedUpWord, Lookup } from "@ekamil/kindle-vocab-api";
import type { BookVars, WordVars, LookupVars } from "./templates";

export const book_to_template_vars = (book: Book): BookVars => {
  return {
    safe_title: book.safe_title,
    title: book.title,
    authors: book.authors,
    asin: book.asin,
    guid: book.guid,
    modified_at: new Date().toISOString(),
  };
};

export const word_to_template_vars = (word: LookedUpWord): WordVars => {
  return {
    word: word.word,
    stem: word.stem,
    latest_lookup_date: word.latest_lookup_date.toISOString(),
    modified_at: new Date().toISOString(),
  };
};

export function lookup_to_template_vars(lookup: Lookup): LookupVars {
  return {
    usage: lookup.usage,
    book: lookup.book.safe_title,
    pos: lookup.pos,
    date: lookup.date.toISOString(),
  };
}
