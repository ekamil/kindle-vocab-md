import { describe, expect, test } from "@jest/globals";
import { LookupRepository, WordRepository } from "./db";
import { Service } from "./service";
import {
  renderBookTemplate,
  renderLookupTemplate,
  renderWordTemplate,
} from "./templates";
import { PromisifiedDatabase } from "./tools/promisified_sqlite";

describe("from real db models", () => {
  const path = "vocab.db";
  const db = new PromisifiedDatabase(path);
  const words_repo = new WordRepository(db);
  const service = new Service(path);

  test("todo : filter lookups by time", async () => {
    // blueprint for service code
    // todo: encapsulate and change this test
    const lookups_repo = new LookupRepository(db);

    const all_words = await words_repo.all();
    const word = all_words[11];
    let lookups = (await lookups_repo.for_word(word.id)).filter((l) => {
      return new Date(l.timestamp) >= new Date("2016-08-01 00:00Z");
    });
    expect(lookups).toHaveLength(1);
    lookups = (await lookups_repo.for_word(word.id)).filter((l) => {
      return l.timestamp >= new Date("2016-09-01 00:00").valueOf();
    });
    expect(lookups).toHaveLength(0);
  });

  test("creates EnhancedWord from db models", async () => {
    const word_t = await words_repo.get("en:retches");
    const actual = await service.enhance_word(word_t.id);
    expect(service.words.size).toBe(1);

    expect(actual.word).toBe("retches");
    expect(actual.stem).toBe("retch");
    expect(actual.lookups).toHaveLength(1);
    expect(actual.lookups[0].book.safe_title).toBe(
      "The Fractal Prince Jean le Flambeur",
    );
    expect(actual.lookups[0].date.getFullYear()).toBe(2016);
    expect(actual.lookups[0].date.getMonth()).toBe(7); // zero indexed
    expect(actual.lookups[0].usage).toContain("retches");
    expect(actual.lookups[0].usage).toContain("::");
  });

  test("create template vars", async () => {
    const word = (await words_repo.all())[12];
    const enhanced = await service.enhance_word(word.id);
    expect(enhanced).toBeDefined();
    expect(enhanced.lookups).toHaveLength(1);
    const lookup = enhanced.lookups[0];

    const actual = await service.word_to_template_vars(enhanced);

    const rendered_word = renderWordTemplate(actual.word);
    expect(rendered_word).toBeTruthy();
    expect(rendered_word).toContain(enhanced.stem);

    const actual_lookup = actual.lookups[0];

    const rendered_lookup = renderLookupTemplate(actual_lookup);
    expect(rendered_lookup).toBeTruthy();
    expect(rendered_lookup).toContain(enhanced.stem);

    const rendered_book = renderBookTemplate(actual.books[0]);
    expect(rendered_book).toBeTruthy();
    expect(rendered_book).toContain(lookup.book.title);
    expect(rendered_book).toContain(lookup.book.authors);
    expect(rendered_book).toContain(lookup.book.asin);
  });
});
