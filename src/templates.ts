import nunjucks from "nunjucks";

import word from "./templates/word.njk";
import note from "./templates/note.njk";
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
  // todo: date format - here
  // todo: highlight - here
  v.lookups.forEach((lookup) => {
    lookup.usage = lookup.usage.replaceAll(v.word, `::${v.word}::`);
    // lookup.date = lookup.date ? lookup.date.toISOString() : null;
  });
  return nunjucks.renderString(word, v);
};

type NoteTemplateVariables = {
  word: string;
  usage: string;
};
export const renderNoteTemplate = (v: NoteTemplateVariables) => {
  return nunjucks.renderString(note, v);
};

type BookTemplateVariables = {
  title: string;
  asin: string;
  authors: string;
  guid: string;
};
export const renderBookTemplate = (v: BookTemplateVariables) => {
  return nunjucks.renderString(book, v);
};
