import nunjucks from "nunjucks";

import { BookI, LookedUpWordI, LookupI } from "@ekamil/kindle-vocab-api";
import {
  BookVars,
  WordVars,
  LookupVars,
  book_template,
  word_template,
  lookup_template,
} from "./templates.js";

const book_to_template_vars = (book: BookI): BookVars => {
  return {
    safe_title: book.safe_title,
    title: book.title,
    authors: book.authors,
    asin: book.asin,
    guid: book.guid,
    modified_at: new Date().toISOString(),
  };
};

export const render_book = (book: BookI, template: string = book_template): string => {
  const vars = book_to_template_vars(book);
  return nunjucks.renderString(template, vars);
};

const word_to_template_vars = (word: LookedUpWordI): WordVars => {
  return {
    word: word.word,
    stem: word.stem,
    latest_lookup_date: word.latest_lookup_date.toISOString(),
    modified_at: new Date().toISOString(),
  };
};

export const render_word = (
  word: LookedUpWordI,
  template: string | undefined = undefined,
): string => {
  const vars = word_to_template_vars(word);
  return nunjucks.renderString(template ?? word_template, vars);
};

export const render_lookup = (
  lookup: LookupI,
  template: string | undefined = undefined,
  highlightWord = true,
): string => {
  const usage = highlightWord
    ? lookup.usage.replaceAll(lookup.word, `==${lookup.word}==`)
    : lookup.usage;
  const vars: LookupVars = {
    usage: usage,
    book: lookup.book.safe_title,
    pos: lookup.pos,
    date: lookup.date.toISOString(),
  };
  return nunjucks.renderString(template ?? lookup_template, vars);
};
