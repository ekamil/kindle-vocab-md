import nunjucks from "nunjucks";

import word from "./word.njk";
import note from "./note.njk";

type WordTemplateVariables = {
  word: string;
  usage: string;
};

export let renderWordTemplate = (v: WordTemplateVariables) => {
  return nunjucks.renderString(word, v);
};

type NoteTemplateVariables = {
  word: string;
  usage: string;
};
export let renderNoteTemplate = (v: NoteTemplateVariables) => {
  return nunjucks.renderString(note, v);
};
