import { describe, expect, test } from "@jest/globals";
import { createRepositories } from "./db.js";

const not_found = "not found";
const expected_word_count = 437;
const db_path = "test/vocab.db";

describe("db module - lookup repository", () => {
  const repos = createRepositories(db_path);
  const known_id = "Starfish:840C8DB8:194286:11";
  const known_word = "en:arsenide";
  test("finds a single lookup", async () => {
    const actual = await (await repos).lookups.get(known_id);
    expect(actual).toBeDefined();
    expect(actual).not.toBeNull();
    expect(actual).toHaveProperty("word_key", known_word);
  });
  test("non-existent lookup id", async () => {
    const actual = (await repos).lookups.get("xdxxxxxxx");
    expect(actual).rejects.toContain(not_found);
  });
  test("non-existent word", async () => {
    const actual = await (await repos).lookups.for_word("xdxxxxxxx");
    expect(actual).toHaveLength(0);
  });
  test("finds lookups for word", async () => {
    const actual = await (await repos).lookups.for_word(known_word);
    expect(actual).toBeDefined();
    expect(actual).toHaveLength(1);
    expect(actual[0]?.word_key).toBe(known_word);
    expect(actual[0]?.id).toBe(known_id);
  });
});

describe("db module - word repository", () => {
  const repos = createRepositories(db_path);
  const known_word = "en:arsenide";

  test("finds a single lookup", async () => {
    const actual = await (await repos).words.get(known_word);
    expect(actual).toHaveProperty("word", "arsenide");
  });
  test("non-existent word", async () => {
    const actual = (await repos).words.get("xdxxxxxxx");
    expect(actual).rejects.toContain(not_found);
  });
  test("list all", async () => {
    const actual = await (await repos).words.all();
    expect(actual).toHaveLength(expected_word_count);
  });
});
