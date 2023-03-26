import { describe, expect, test } from "@jest/globals";
import { BookRepository, LookupRepository, WordRepository } from "./db";
import { EnhancedWord } from "./domain_models";
import { PromisifiedDatabase } from "./tools/promisified_sqlite";

describe("from real db models", () => {
  const path = "vocab.db";
  const db = new PromisifiedDatabase(path);
  const lookups_repo = new LookupRepository(db);
  const words_repo = new WordRepository(db);
  const books_repo = new BookRepository(db);

  test("creates word from db models", async () => {
    const all_words = await words_repo.all();
    const word = all_words[11]; // "en:retches"
    expect(word.stem).toBe("retch");
    const lookups = await lookups_repo.for_word(word.id);
    const books = await books_repo.as_map();
    const actual = new EnhancedWord(word, lookups, books);
    expect(actual.word).toBe("retches");
    expect(actual.lookups).toHaveLength(1);
    expect(actual.lookups[0].book.safe_title).toBe(
      "The Fractal Prince Jean le Flambeur",
    );
    expect(actual.lookups[0].date.getFullYear()).toBe(2016);
    expect(actual.lookups[0].usage).toContain(word.word);
    expect(actual.lookups[0].usage).toContain("::");
  });
});
