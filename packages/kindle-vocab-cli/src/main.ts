#!/usr/bin/env node

import { getKindleVocabulary } from "@ekamil/kindle-vocab-api";
import assert from "assert";
import { program } from "./cli.js";
import { FSService } from "./fs_service.js";

async function main(): Promise<void> {
  program.parse();
  const options = program.opts();
  console.debug(options);
  assert(options.outputBooks);
  assert(options.outputWords);

  const fss = new FSService(options.outputBooks, options.outputWords);

  const vocabulary = await getKindleVocabulary(options.database);
  vocabulary.words.forEach(async (word) => {
    // console.log(word);
    await fss.write_word(word);
  });
  vocabulary.books.forEach(async (book) => {
    // console.log(book);
    await fss.write_book(book);
  });
}

main().then(
  (result) => {
    console.debug(result != undefined ? result : "");
  },
  (err) => {
    console.error(err);
  },
);
