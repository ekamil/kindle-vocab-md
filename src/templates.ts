import nunjucks from "nunjucks";

import word from "./templates/word.njk";
import book from "./templates/book.njk";

type WordTemplateLookup = {
  usage: string;
  book: string;
  pos: string;
  date: string | null;
};

type WordTemplateVariables = {
  word: string;
  stem: string;
  lookups: WordTemplateLookup[];
};

export const renderWordTemplate = (v: WordTemplateVariables) => {
  // todo: sorting - here or method higher?
  // todo: date format - higher
  // todo: highlight - here
  v.lookups.forEach((lookup) => {
    lookup.usage = lookup.usage.replaceAll(v.word, `::${v.word}::`);
    console.log(`Highlighting ${v.word}`);
    // lookup.date = lookup.date ? lookup.date.toISOString() : null;
  });
  return nunjucks.renderString(word, v);
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
