import nunjucks from "nunjucks";

import lookup from "./templates/lookup.njk";
import word from "./templates/word.njk";
import book from "./templates/book.njk";

type WordTemplateLookup = {
  usage: string;
  book: string; // safe title
  pos: string;
  date: string | null;
};

type WordTemplateVariables = {
  word: string;
  stem: string;
  lookups: WordTemplateLookup[];
};

export const renderLookupTemplate = (
  v: WordTemplateLookup,
  parent: WordTemplateVariables,
) => {
  let vars = copy(v);
  vars.usage = v.usage.replaceAll(parent.word, `::${parent.word}::`);
  return nunjucks.renderString(lookup, vars);
};

export const renderWordTemplate = (v: WordTemplateVariables) => {
  // todo: sorting - here or method higher?
  // todo: date format - higher
  // todo: use `renderLookupTemplate`
  let vars = copy(v);
  vars.lookups.forEach((lookup) => {
    lookup.usage = lookup.usage.replaceAll(vars.word, `::${vars.word}::`);
  });
  return nunjucks.renderString(word, vars);
};

type BookTemplateVariables = {
  // safe title - as in ready to be a file name
  safe_title: string;
  title: string;
  authors: string;
  asin: string;
  guid: string;
  latest_lookup_date: Date;
};
export const renderBookTemplate = (v: BookTemplateVariables) => {
  return nunjucks.renderString(book, v);
};

function copy<Type>(obj: Type): Type {
  return JSON.parse(JSON.stringify(obj)) as Type;
}
