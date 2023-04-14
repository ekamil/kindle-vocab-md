import nunjucks from "nunjucks";

import lookup from "./templates/lookup.njk";
import word from "./templates/word.njk";
import book from "./templates/book.njk";

export type LookupVars = {
  usage: string;
  book: string; // safe title
  pos: string;
  date: string | null;
};

export type WordVars = {
  word: string;
  stem: string;
  lookups?: LookupVars[];
  latest_lookup_date?: string;
  modified_at: string;
};

export const render_lookup_template = (v: LookupVars) => {
  const vars = copy(v);
  return nunjucks.renderString(lookup, vars);
};

export const render_word_template = (v: WordVars) => {
  // todo: use `renderLookupTemplate`
  const vars = copy(v);
  return nunjucks.renderString(word, vars);
};

export type BookVars = {
  // safe title - as in ready to be a file name
  safe_title: string;
  title: string;
  authors: string;
  asin: string;
  guid: string;
  modified_at: string;
};
export const render_book_template = (v: BookVars) => {
  return nunjucks.renderString(book, v);
};

function copy<Type>(obj: Type): Type {
  return JSON.parse(JSON.stringify(obj)) as Type;
}
