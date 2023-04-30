import { describe, expect, test } from "@jest/globals";
import { get_vocabulary_from_db } from "./word_service.js";
import Database from "better-sqlite3";

const db_path = "test/vocab.db";

describe("WordService works with a real db", () => {
  const db = new Database(db_path);

  test("smoke", async () => {
    const vocabulary = await get_vocabulary_from_db(db);

    expect(vocabulary.words.size).toBe(437);
    expect(vocabulary.books.size).toBe(50);
    expect(vocabulary.lookups.size).toBe(452);

    const word_id = "en:retches";
    // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
    const actual = vocabulary.words.get(word_id)!!;

    expect(actual.word).toBe("retches");
    expect(actual.stem).toBe("retch");
    expect(actual.lookups).toHaveLength(1);
    expect(actual.lookups[0]?.book.safe_title).toBe("The Fractal Prince");
    expect(actual.lookups[0]?.date.getFullYear()).toBe(2016);
    expect(actual.lookups[0]?.date.getMonth()).toBe(7); // zero indexed
    expect(actual.lookups[0]?.usage).toContain("retches");
    expect(actual.lookups[0]?.usage).toContain("==");
  });
});
