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

  const words = await ws.all_words();
  words.forEach(async (word) => {
    const enhanced = await ws.enhance_word(word);
    const include_books = true;
    await fss.write_word(enhanced, include_books);
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
