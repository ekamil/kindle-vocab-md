import nunjucks from "nunjucks";

import lookup from "./templates/lookup.njk";
import word from "./templates/word.njk";
import book from "./templates/book.njk";

type LookupVars = {
  usage: string;
  book: string; // safe title
  pos: string;
  date: string | null;
};

type WordVars = {
  word: string;
  stem: string;
  lookups: LookupVars[];
};

export const renderLookupTemplate = (v: LookupVars, parent: WordVars) => {
  const vars = copy(v);
  return nunjucks.renderString(lookup, vars);
};

export const renderWordTemplate = (v: WordVars) => {
  // todo: sorting - here or method higher?
  // todo: date format - higher
  // todo: use `renderLookupTemplate`
  const vars = copy(v);
  return nunjucks.renderString(word, vars);
};

type BookVars = {
  // safe title - as in ready to be a file name
  safe_title: string;
  title: string;
  authors: string;
  asin: string;
  guid: string;
  latest_lookup_date: string | null;
};
export const renderBookTemplate = (v: BookVars) => {
  return nunjucks.renderString(book, v);
};

function copy<Type>(obj: Type): Type {
  return JSON.parse(JSON.stringify(obj)) as Type;
}
