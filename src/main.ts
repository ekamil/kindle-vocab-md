import assert from "assert";
import { program } from "./cli";
import { FSService } from "./fs_service";
import {
  log_connection,
  PromisifiedDatabase,
} from "./tools/promisified_sqlite";
import { WordService } from "./word_service";

async function main(): Promise<void> {
  program.parse();
  const options = program.opts();
  console.debug(options);
  assert(options.outputBooks);
  assert(options.outputWords);

  const fss = new FSService(options.outputBooks, options.outputWords);

  await fss.ensure_dirs();

  const db = new PromisifiedDatabase(
    options.database,
    log_connection(options.database),
  );
  const ws = new WordService(db);
  await ws.load();
  ws.words.forEach(async (word) => {
    await fss.write_word(word);
  });
  ws.books.forEach(async (book) => {
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

export { PromisifiedDatabase, WordService };
