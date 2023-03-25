import { describe, expect, test } from "@jest/globals";
import { renderNoteTemplate, renderWordTemplate } from "./templates";

describe("render module", () => {
  test("renders a single word", () => {
    const vars = {
      word: "fooing",
      stem: "foo",
      lookups: [
        {
          usage: "Foo was barred for the bar",
          book: "At the mountains of madness",
          pos: "677",
          date: null,
        },
        {
          usage: "Foo was barred for the bar again!!!",
          book: "At the mountains of madness",
          pos: "800",
          date: "2023-03-25",
        },
      ],
    };
    const res = renderWordTemplate(vars);
    expect(res).toEqual(`# foo

## Examples

>[!quote] [[At the mountains of madness]] @ 677
> Foo was barred for the bar


>[!quote] [[At the mountains of madness]] @ 800
> Foo was barred for the bar again!!!
> @ 2023-03-25

`);
  });
  test("renders a note", () => {
    const vars = {
      word: "foo",
      usage: "Foo was barred for the bar",
    };
    const res = renderNoteTemplate(vars);
    expect(res).toBeTruthy();
  });
  test("renders word with usages", () => {
    const vars = {
      word: "foo",
      usage: "Foo was barred for the bar",
    };
    const res = renderNoteTemplate(vars);
    expect(res).toBeTruthy();
  });
});
