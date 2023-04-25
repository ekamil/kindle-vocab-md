import { getKindleVocabulary } from "./main.js";

async function main(): Promise<void> {
  const vocabulary = await getKindleVocabulary("test/vocab.db");
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
    console.debug(result != undefined ? result : "");
  },
  (err) => {
    console.error(err);
  },
);
