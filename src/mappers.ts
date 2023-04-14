import { Book, LookedUpWord, Lookup } from "./domain_models";
import type { TemplateVars } from "./templates";

type BookVars = TemplateVars["books"][0];
type WordVars = TemplateVars["word"];
type LookupVars = TemplateVars["lookups"][0];

export const book_to_template_vars = (book: Book): BookVars => {
  const mapped = {
    safe_title: book.safe_title,
    title: book.title,
    authors: book.authors,
    asin: book.asin,
    guid: book.guid,
    modified_at: new Date().toISOString(),
  };
  return mapped;
};

export const word_to_template_vars = (word: LookedUpWord): TemplateVars => {
  const word_vars: WordVars = {
    word: word.word,
    stem: word.stem,
    latest_lookup_date: word.latest_lookup_date.toISOString(),
    modified_at: new Date().toISOString(),
  };

  const lookup_vars: LookupVars[] = [];
  const book_vars: BookVars[] = [];
  word.lookups // already sorted by date
    .map((actual_lookup) => {
      lookup_vars.push(lookup_to_template_vars(actual_lookup));
      return actual_lookup;
    })
    .map((actual_lookup) => {
      book_vars.push(book_to_template_vars(actual_lookup.book));
    });
  return {
    word: word_vars,
    lookups: lookup_vars,
    books: book_vars,
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
