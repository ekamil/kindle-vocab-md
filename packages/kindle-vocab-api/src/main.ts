#!/usr/bin/env node

import { createRepositories } from "./db.js";
import { BookI, LookedUpWordI, LookupI } from "./domain_types.js";
import { Vocabulary } from "./domain_models.js";
import { get_vocabulary_from_db } from "./word_service.js";

async function getKindleVocabulary(path_to_vocab_db: string): Promise<Vocabulary> {
  const repos = await createRepositories(path_to_vocab_db);
  const vocabulary = await get_vocabulary_from_db(repos);
  repos._db.close();
  return vocabulary;
}

export { getKindleVocabulary, Vocabulary };
export type { BookI, LookedUpWordI, LookupI };
