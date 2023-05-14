import nunjucks from "nunjucks";

import { Book, LookedUpWord, Lookup } from "@ekamil/kindle-vocab-api";
import {
  BookVars,
  WordVars,
  LookupVars,
  book_template,
  word_template,
  lookup_template,
} from "./templates.js";

const book_to_template_vars = (book: Book): BookVars => {
  return {
    safe_title: book.safe_title,
    title: book.title,
    authors: book.authors,
    asin: book.asin,
    guid: book.guid,
    modified_at: new Date().toISOString(),
  };
};

export const render_book = (book: Book, template: string = book_template): string => {
  const vars = book_to_template_vars(book);
  return nunjucks.renderString(template, vars);
};

const word_to_template_vars = (word: LookedUpWord): WordVars => {
  return {
    word: word.word,
    stem: word.stem,
    latest_lookup_date: word.latest_lookup_date.toISOString(),
    modified_at: new Date().toISOString(),
  };
};

export const render_word = (
  word: LookedUpWord,
  template: string | undefined = undefined,
): string => {
  const vars = word_to_template_vars(word);
  return nunjucks.renderString(template ?? word_template, vars);
};

function lookup_to_template_vars(lookup: Lookup): LookupVars {
  return {
    usage: lookup.usage,
    book: lookup.book.safe_title,
    pos: lookup.pos,
    date: lookup.date.toISOString(),
  };
}

export const render_lookup = (lookup: Lookup, template: string | undefined = undefined): string => {
  const vars = lookup_to_template_vars(lookup);
  return nunjucks.renderString(template ?? lookup_template, vars);
};
