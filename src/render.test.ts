import nunjucks from "nunjucks";
import { describe, expect, test } from "@jest/globals";
import { WordTemplate } from "./templates";

describe("render module", () => {
  test("renders a single word", () => {
    const vars = {
      word: "foo",
      usage: "Foo was barred for the bar",
    };
    const res = nunjucks.renderString(WordTemplate, vars);
    expect(res).toBe("");
  });
});
