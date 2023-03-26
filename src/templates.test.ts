import { describe, expect, test } from "@jest/globals";
import {
  renderBookTemplate,
  renderLookupTemplate,
  renderWordTemplate,
} from "./templates";

describe("render module", () => {
  const WORD = {
    word: "fooing",
    stem: "foo",
    lookups: [
      {
        usage: "Foo was barred for the bar for fooing",
        book: "At the mountains of madness",
        pos: "677",
        date: null,
      },
      {
        usage: "Foo was fooing for the bar again!!!",
        book: "At the mountains of madness",
        pos: "800",
        date: "2023-03-25",
      },
    ],
  };

  test("renders a single word", () => {
    const vars = {
      word: WORD.word,
      stem: WORD.stem,
      lookups: [],
    };
    const res = renderWordTemplate(vars);
    expect(res).toEqual(`# foo

>[!quote] fooing

## Examples

`);
  });

  test("renders a single word with highlights", () => {
    const vars = WORD;
    const res = renderWordTemplate(vars);
    expect(res).toEqual(`# foo

>[!quote] fooing

## Examples

>[!quote] [[At the mountains of madness]] @ 677
> Foo was barred for the bar for fooing


>[!quote] [[At the mountains of madness]] @ 800
> Foo was fooing for the bar again!!!
> @ 2023-03-25

`);
  });

  test("renders a single lookup (separate tmpl)", () => {
    const vars = WORD.lookups[0];
    const res = renderLookupTemplate(vars, WORD);
    expect(res).toEqual(`>[!quote] [[At the mountains of madness]] @ 677
> Foo was barred for the bar for fooing

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
      latest_lookup_date: new Date("2023-03-25 22:25").toISOString(),
    };
    const res = renderBookTemplate(vars);
    expect(res).toBeTruthy();
    expect(res).toEqual(`---
tags:
  - book
Status: Read
ASIN: B0097DHVGW
Kindle guid: CR!7Z1SMZYP6H6GK0E99HBRQKZ3627A
Latest lookup date: 2023-03-25T21:25:00.000Z
---

# The Ego Tunnel: The Science of the Mind and the Myth of the Self
Author:: Metzinger, Thomas
Cover:: #todo

`);
  });
});
