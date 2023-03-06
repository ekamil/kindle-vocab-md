import { describe, expect, test } from "@jest/globals";
import { renderNoteTemplate, renderWordTemplate } from "./templates";

describe("render module", () => {
  test("renders a single word", () => {
    const vars = {
      word: "foo",
      usage: "Foo was barred for the bar",
    };
    const res = renderWordTemplate(vars);
    expect(res).toBe(`foo

> [!quote]
> Foo was barred for the bar
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
});
