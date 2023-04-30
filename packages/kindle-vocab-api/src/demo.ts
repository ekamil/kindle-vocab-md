#!/usr/bin/env node

import { getKindleVocabulary } from "./main.js";

async function main(): Promise<void> {
  const db_path = process.argv[-1] as string;
  console.log(`Opening DB at ${db_path}`);
  const vocabulary = await getKindleVocabulary(db_path);
  let loop = 5;
  for (const word of vocabulary.words) {
    console.log(word);
    loop = loop - 1;
    if (loop == 0) {
      break;
    }
  }
  loop = 5;
  for (const book of vocabulary.books) {
    console.log(book);
    loop = loop - 1;
    if (loop == 0) {
      break;
    }
  }
}

main().then(
  (result) => {
    console.debug(result != undefined ? result : "Done");
  },
  (err) => {
    console.error(err);
  },
);
