import { describe, expect, test } from "@jest/globals";
import { WordService } from "./word_service";
import {
  render_book_template,
  render_lookup_template,
  render_word_template,
} from "./templates";
import {
  log_connection,
  PromisifiedDatabase,
} from "./tools/promisified_sqlite";
import { word_to_template_vars } from "./mappers";

const db_path = "test/vocab.db";

describe("WordService works with a real db", () => {
  const db = new PromisifiedDatabase(db_path, log_connection(db_path));
  const service = new WordService(db);

  test("smoke", async () => {
    await service.load();

    expect(service.words.size).toBe(437);
    expect(service.books.size).toBe(50);
    expect(
      Array.from(service.lookups_by_book.values())[0].length,
    ).toBeGreaterThan(0);

    const word_id = "en:retches";
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const actual = service.words.get(word_id)!!;

    expect(actual.word).toBe("retches");
    expect(actual.stem).toBe("retch");
    expect(actual.lookups).toHaveLength(1);
    expect(actual.lookups[0].book.safe_title).toBe(
      "The Fractal Prince Jean le Flambeur",
    );
    expect(actual.lookups[0].date.getFullYear()).toBe(2016);
    expect(actual.lookups[0].date.getMonth()).toBe(7); // zero indexed
    expect(actual.lookups[0].usage).toContain("retches");
    expect(actual.lookups[0].usage).toContain("==");
  });

  test("create template vars", async () => {
    await service.load();

    const word_id = "en:retches";
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const word = service.words.get(word_id)!!;

    expect(word).toBeDefined();
    expect(word.lookups).toHaveLength(1);
    const lookup = word.lookups[0];

    const actual = word_to_template_vars(word);

    const rendered_word = render_word_template(actual.word);
    expect(rendered_word).toBeTruthy();
    expect(rendered_word).toContain(word.stem);

    const actual_lookup = actual.lookups[0];

    const rendered_lookup = render_lookup_template(actual_lookup);
    expect(rendered_lookup).toBeTruthy();
    expect(rendered_lookup).toContain(word.stem);

    const rendered_book = render_book_template(actual.books[0]);
    expect(rendered_book).toBeTruthy();
    expect(rendered_book).toContain(lookup.book.title);
    expect(rendered_book).toContain(lookup.book.authors);
    expect(rendered_book).toContain(lookup.book.asin);
  });
});
