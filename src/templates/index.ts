import word from "./word.njk";
import note from "./note.njk";

export type WordTemplateVariables = {
  word: string;
  usage: string;
};

export const WordTemplate = word;
export const NoteTemplate = note;
