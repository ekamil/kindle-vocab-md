import { describe, expect, test } from "@jest/globals";
import { LookupRepository, WordRepository } from "./db";
import type { BookKey, BookT } from "./db_models";
import { PromisifiedDatabase } from "./tools/promisified_sqlite";
import { ReadListRepository } from "./tools/repository";

const not_found = "not found";
const expected_sscnt = 206;
const expected_book_count = 50;
const expected_word_count = 437;
const db_path = "test/vocab.db";

describe("test DB version", () => {
  test("vocab.db is in the test version", async () => {
    const db = new PromisifiedDatabase(db_path);
    const actual: { sscnt: number } = await db.get(
      "SELECT sscnt FROM metadata WHERE id = ?",
      ["WORDS"],
    );
    expect(actual.sscnt).toBe(expected_sscnt);
  });
});

describe("db module - lookup repository", () => {
  const db = new PromisifiedDatabase(db_path);
  const lookups = new LookupRepository(db);
  const known_id = "Starfish:840C8DB8:194286:11";
  const known_word = "en:arsenide";
  test("finds a single lookup", async () => {
    const actual = await lookups.get(known_id);
    expect(actual).toBeDefined();
    expect(actual).not.toBeNull();
    expect(actual).toHaveProperty("word_key", known_word);
  });
  test("non-existent lookup id", async () => {
    const actual = lookups.get("xdxxxxxxx");
    expect(actual).rejects.toContain(not_found);
  });
  test("non-existent word", async () => {
    const actual = await lookups.for_word("xdxxxxxxx");
    expect(actual).toHaveLength(0);
  });
  test("finds lookups for word", async () => {
    const actual = await lookups.for_word(known_word);
    expect(actual).toBeDefined();
    expect(actual).toHaveLength(1);
    expect(actual[0].word_key).toBe(known_word);
    expect(actual[0].id).toBe(known_id);
  });
});

describe("db module - word repository", () => {
  const db = new PromisifiedDatabase(db_path);
  const lookups = new WordRepository(db);
  const known_word = "en:arsenide";

  test("finds a single lookup", async () => {
    const actual = await lookups.get(known_word);
    expect(actual).toHaveProperty("word", "arsenide");
  });
  test("non-existent word", async () => {
    const actual = lookups.get("xdxxxxxxx");
    expect(actual).rejects.toContain(not_found);
  });
  test("list all", async () => {
    const actual = await lookups.all();
    expect(actual).toHaveLength(expected_word_count);
  });
});

describe("db module - generic repo", () => {
  const db = new PromisifiedDatabase(db_path);

  const generic_repo = new ReadListRepository<BookKey, BookT>(
    db,
    "select * from book_info where id = ?",
    "select * from book_info order by id asc",
  );
  test("can get a book", async () => {
    const actual = await generic_repo.get("Bloodchild:A6F32010");
    expect(actual.authors).toBe("Octavia E. Butler");
  });
  test("handles non-existent books", () => {
    const actual = generic_repo.get("xd");
    expect(actual).rejects.toContain(not_found);
  });
  test("list books", async () => {
    const actual = await generic_repo.all();
    expect(actual).toHaveLength(expected_book_count);
  });
});
