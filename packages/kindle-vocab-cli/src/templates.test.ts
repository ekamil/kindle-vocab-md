import { describe, expect, test } from "@jest/globals";
import { render_book, render_lookup, render_word } from "./mappers.js";
import { BookI, LookedUpWordI, LookupI } from "@ekamil/kindle-vocab-api";

describe("render module", () => {
  const word: LookedUpWordI = {
    word_key: "en:adroit",
    word: "adroit",
    stem: "adroit",
    safe_word: "adroit",
    lookups: [],
    latest_lookup_date: new Date("2023-03-25 21:25Z"),
  };
  const book: BookI = {
    book_key: "Anathem:522FC9CB",
    asin: "cc2399ca-4b66-4ebf-bc74-6a596d278f35",
    guid: "Anathem:522FC9CB",
    title: "Anathem",
    safe_title: "Anathem",
    authors: "Neal Stephenson",
  };
  const lookup: LookupI = {
    word_key: "en:adroit",
    word: "adroit",
    usage:
      "Thanks to some adroit sequence-writing that had been done before the Second Sack, we had a few crops that could grow almost year-round.",
    book: book,
    pos: "338916",
    date: new Date("2023-03-25 21:25Z"),
  };

  test("renders a single word from default template", () => {
    const res = render_word(word);
    expect(res).toContain("Latest lookup date: '2023-03-25T21:25:00.000Z");
    expect(res).toContain(">[!quote] adroit");
    expect(res).toContain("## Examples");
  });

  test("renders a single lookup (separate tmpl)", () => {
    const first = render_lookup(lookup);
    expect(first).toEqual(`>[!quote] [[Anathem]] @ \`338916\`
> Thanks to some ==adroit== sequence-writing that had been done before the Second Sack, we had a few crops that could grow almost year-round.
> @ 2023-03-25T21:25:00.000Z
`);
  });

  test("renders a single lookup (separate tmpl) with highlights", () => {
    const first = render_lookup(lookup, undefined, false);
    expect(first).toEqual(`>[!quote] [[Anathem]] @ \`338916\`
> Thanks to some adroit sequence-writing that had been done before the Second Sack, we had a few crops that could grow almost year-round.
> @ 2023-03-25T21:25:00.000Z
`);
  });

  test("renders a book note", () => {
    const res = render_book(book);
    expect(res).toContain("ASIN: cc2399ca-4b66-4ebf-bc74-6a596d278f35");
  });
});
