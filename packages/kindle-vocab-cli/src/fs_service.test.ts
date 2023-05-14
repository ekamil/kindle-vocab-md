import { describe, expect, test } from "@jest/globals";
import { Book, LookedUpWord, Lookup, Vocabulary } from "@ekamil/kindle-vocab-api";
import { FSService } from "./fs_service.js";
import { tmpdir } from "os";
import { mkdtempSync, existsSync } from "fs";
import { join } from "path";

describe("render module", () => {
  const vocabulary = prepare_vocabulary();
  const output_dir: string = mkdtempSync(join(tmpdir(), "kindle-vocab-output-tests-"));
  const fss = new FSService(join(output_dir, "books"), join(output_dir, "words"));

  test("WIP: writes a word", async () => {
    vocabulary.words.forEach(async (word) => {
      // console.log(word);
      await fss.write_word(word);
    });

    const expected_file = join(output_dir, "words", "foo.md");
    expect(existsSync(expected_file)).toBeTruthy();
  });
});

function prepare_vocabulary(): Vocabulary {
  const book: Book = {
    book_key: "Anathem:522FC9CB",
    asin: "cc2399ca-4b66-4ebf-bc74-6a596d278f35",
    guid: "Anathem:522FC9CB",
    title: "Anathem",
    safe_title: "Anathem",
    authors: "Neal Stephenson",
  };

  const lookup: Lookup = {
    word_key: "en:fooing",
    usage:
      "Thanks to some adroit sequence-writing that had been done before the Second Sack, we had a few crops that could grow almost year-round.",
    book: book,
    pos: "338916",
    date: new Date("2023-03-25 21:25Z"),
  };

  const word: LookedUpWord = {
    word_key: "en:fooing",
    word: "fooing",
    stem: "foo",
    safe_word: "foo",
    lookups: [lookup],
    latest_lookup_date: new Date("2023-03-25 21:25Z"),
  };

  const vocabulary = new Vocabulary();
  vocabulary.books.set(book.book_key, book);
  vocabulary.lookups_by_word.set(word.word_key, [lookup]);
  vocabulary.words.set(word.word_key, word);
  return vocabulary;
}
