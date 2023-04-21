import { describe, expect, test } from "@jest/globals";
import { getKindleVocabulary } from "./word_service";
import {
  render_book_template,
  render_lookup_template,
  render_word_template,
} from "./templates";
import {
  log_connection,
  PromisifiedDatabase,
} from "./tools/promisified_sqlite";
import {
  book_to_template_vars,
  lookup_to_template_vars,
  word_to_template_vars,
} from "./mappers";

const db_path = "test/vocab.db";

describe("WordService works with a real db", () => {
  const db = new PromisifiedDatabase(db_path, log_connection(db_path));

  test("smoke", async () => {
    const vocabulary = await getKindleVocabulary(db);

    expect(vocabulary.words.size).toBe(437);
    expect(vocabulary.books.size).toBe(50);
    expect(vocabulary.lookups.size).toBe(452);

    const word_id = "en:retches";
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const actual = vocabulary.words.get(word_id)!!;

    expect(actual.word).toBe("retches");
    expect(actual.stem).toBe("retch");
    expect(actual.lookups).toHaveLength(1);
    expect(actual.lookups[0].book.safe_title).toBe("The Fractal Prince");
    expect(actual.lookups[0].date.getFullYear()).toBe(2016);
    expect(actual.lookups[0].date.getMonth()).toBe(7); // zero indexed
    expect(actual.lookups[0].usage).toContain("retches");
    expect(actual.lookups[0].usage).toContain("==");
  });

  test("create template vars", async () => {
    const vocabulary = await getKindleVocabulary(db);

    const word_id = "en:retches";
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const word = vocabulary.words.get(word_id)!!;

    expect(word).toBeDefined();
    expect(word.lookups).toHaveLength(1);
    const lookup = word.lookups[0];

    const word_vars = word_to_template_vars(word);
    const rendered_word = render_word_template(word_vars);
    expect(rendered_word).toBeTruthy();
    expect(rendered_word).toContain(word.stem);

    const lookup_vars = lookup_to_template_vars(lookup);
    const rendered_lookup = render_lookup_template(lookup_vars);
    expect(rendered_lookup).toBeTruthy();
    expect(rendered_lookup).toContain(word.stem);

    const books_vars = book_to_template_vars(lookup.book);
    const rendered_book = render_book_template(books_vars);
    expect(rendered_book).toBeTruthy();
    expect(rendered_book).toContain(lookup.book.title);
    expect(rendered_book).toContain(lookup.book.authors);
    expect(rendered_book).toContain(lookup.book.asin);
  });
});
