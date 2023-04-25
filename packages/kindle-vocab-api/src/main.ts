#!/usr/bin/env node

import { Vocabulary, Book, LookedUpWord, Lookup } from "./domain_models.js";
import {
  log_connection,
  PromisifiedDatabase,
} from "./tools/promisified_sqlite.js";
import { get_vocabulary_from_db } from "./word_service.js";

async function getKindleVocabulary(
  path_to_vocab_db: string,
): Promise<Vocabulary> {
  const db = new PromisifiedDatabase(
    path_to_vocab_db,
    log_connection(path_to_vocab_db),
  );
  const vocabulary = await get_vocabulary_from_db(db);
  return vocabulary;
}

export { getKindleVocabulary, Vocabulary, Book, LookedUpWord, Lookup };
