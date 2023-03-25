import { describe, expect, test } from "@jest/globals";
import { Repository } from "./db";
import { PromisifiedDatabase } from "./tools/promisified_sqlite";

describe("test DB version", () => {
  test("vocab.db is in the test version", async () => {
    const path = "vocab.db";
    const db = new PromisifiedDatabase(path);
    const actual: { sscnt: number } = await db.get(
      "SELECT sscnt FROM metadata WHERE id = ?",
      ["WORDS"],
    );
    expect(actual.sscnt).toBe(206);
  });
});

describe("db module - repository", () => {
  const repo = new Repository("vocab.db");
  test("finds a single word", async () => {
    const actual = await repo.findWord("boring");
    expect(actual).toBeDefined();
    expect(actual).not.toBeNull();
    expect(actual).toHaveProperty("id", "en:boring");
  });
  test("non-existent word", async () => {
    const actual = await repo.findWord("xdxxxxxxx");
    expect(actual).toBeUndefined();
  });
  test("finds lookups", async () => {
    const word = await repo.findWord("boring");
    const actual = await repo.getLookupsForWord(word);
    expect(actual).toBeDefined();
    expect(actual).toHaveLength(1);
    expect(actual[0].word_key).toBe(word.id);
    expect(actual[0].usage).toContain(word.word);
  });
});
