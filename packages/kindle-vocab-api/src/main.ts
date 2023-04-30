#!/usr/bin/env node

import { Book, LookedUpWord, Lookup, Vocabulary } from "./domain_models.js";
import { get_vocabulary_from_db } from "./word_service.js";
import Database from "better-sqlite3";

async function getKindleVocabulary(path_to_vocab_db: string): Promise<Vocabulary> {
  const db = new Database(path_to_vocab_db);
  const vocabulary = await get_vocabulary_from_db(db);
  return vocabulary;
}

export { getKindleVocabulary, Vocabulary, Book, LookedUpWord, Lookup };
