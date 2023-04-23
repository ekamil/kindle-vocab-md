import { describe, expect, test } from "@jest/globals";
import {
  render_book_template,
  render_lookup_template,
  render_word_template,
} from "./templates";

describe("render module", () => {
  const WORD = {
    word: "fooing",
    stem: "foo",
    modified_at: new Date("2023-03-25 21:25Z").toISOString(),
  };

  test("renders a single word", () => {
    const vars = {
      word: WORD.word,
      stem: WORD.stem,
      modified_at: new Date("2023-03-25 21:25Z").toISOString(),
    };
    const res = render_word_template(vars);
    expect(res).toEqual(`---
Modified at: '2023-03-25T21:25:00.000Z'
Latest lookup date: ''
---
# foo

>[!quote] fooing

## Examples
`);
  });

  test("renders a single word with highlights", () => {
    const vars = WORD;
    const res = render_word_template(vars);
    expect(res).toEqual(`---
Modified at: '2023-03-25T21:25:00.000Z'
Latest lookup date: ''
---
# foo

>[!quote] fooing

## Examples
`);
  });

  test("renders a single lookup (separate tmpl)", () => {
    const lookups = [
      {
        usage: "Foo was barred for the bar for fooing",
        book: "At the mountains of madness",
        pos: "677",
        date: null,
      },
      {
        usage: "Foo was fooing for the bar agaFin!!!",
        book: "At the mountains of madness",
        pos: "800",
        date: "2023-03-25",
      },
    ];
    const first = render_lookup_template(lookups[0]);
    expect(first).toEqual(`>[!quote] [[At the mountains of madness]] @ \`677\`
> Foo was barred for the bar for fooing

`);
    const second = render_lookup_template(lookups[1]);
    expect(second).toEqual(`>[!quote] [[At the mountains of madness]] @ \`800\`
> Foo was fooing for the bar agaFin!!!
> @ 2023-03-25
`);
  });

  test("renders a book note", () => {
    const vars = {
      safe_title:
        "The Ego Tunnel The Science of the Mind and the Myth of the Self",
      title: "The Ego Tunnel: The Science of the Mind and the Myth of the Self",
      authors: "Metzinger, Thomas",
      asin: "B0097DHVGW",
      guid: "CR!7Z1SMZYP6H6GK0E99HBRQKZ3627A",
      modified_at: new Date("2023-03-25 22:25Z").toISOString(),
    };
    const res = render_book_template(vars);
    expect(res).toBeTruthy();
    expect(res).toEqual(`---
tags:
  - book
ASIN: B0097DHVGW
Kindle guid: 'CR!7Z1SMZYP6H6GK0E99HBRQKZ3627A'
Modified at: '2023-03-25T22:25:00.000Z'
Status: Read
---

# The Ego Tunnel: The Science of the Mind and the Myth of the Self
Author:: Metzinger, Thomas
Cover:: #todo

`);
  });
});
