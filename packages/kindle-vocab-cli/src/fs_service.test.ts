import { Book, LookedUpWord, Lookup } from "@ekamil/kindle-vocab-api";
import { describe, expect, test } from "@jest/globals";
import { existsSync, mkdtempSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { FSService } from "./fs_service.js";

describe("render module", () => {
  const book: Book = {
    book_key: "Anathem:522FC9CB",
    asin: "cc2399ca-4b66-4ebf-bc74-6a596d278f35",
    guid: "Anathem:522FC9CB",
    title: "Anathem",
    safe_title: "Anathem",
    authors: "Neal Stephenson",
  };

  const output_dir: string = mkdtempSync(join(tmpdir(), "kindle-vocab-output-tests-"));
  const books_dir = join(output_dir, "books");
  const words_dir = join(output_dir, "words");
  const fss = new FSService(books_dir, words_dir);

  test("writes a word", async () => {
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

    const expected_file = join(words_dir, "foo.md");

    await fss.write_word(word);
    expect(existsSync(expected_file)).toBeTruthy();
  });

  test("appends a lookup to word", async () => {
    const lookup: Lookup = {
      word_key: "en:abut",
      usage:
        "The commoners who live abutting the mere, who watch Grendel and his mother and report to their king.",
      book: book,
      pos: "338916",
      date: new Date("2023-03-25 21:25Z"),
    };

    const word: LookedUpWord = {
      word_key: "en:abut",
      word: "abutting",
      stem: "abut",
      safe_word: "abut",
      lookups: [lookup],
      latest_lookup_date: new Date("2023-03-25 21:25Z"),
    };

    const expected_file = join(words_dir, "abut.md");

    await fss.write_word(word);
    expect(existsSync(expected_file)).toBeTruthy();
    expect(readFileSync(expected_file, { encoding: "utf-8" })).toContain("Grendel");

    word.lookups.push({
      word_key: "en:abut",
      usage: "Test datum",
      book: book,
      pos: "338916",
      date: new Date("2023-03-25 21:35Z"), // different date
    });
    await fss.write_word(word);
    expect(existsSync(expected_file)).toBeTruthy();
    expect(readFileSync(expected_file, { encoding: "utf-8" })).toContain("Grendel");
    expect(readFileSync(expected_file, { encoding: "utf-8" })).toContain("Test datum");
  });

  test("writes a book", async () => {
    await fss.write_book(book);
    const expected_file = join(books_dir, "Anathem.md");
    expect(existsSync(expected_file)).toBeTruthy();
  });
});
