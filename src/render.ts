import nunjucks, { Environment } from "nunjucks";
import type { WordTemplateVariables } from "./templates";
import { WordTemplate } from "./templates";

const vars: WordTemplateVariables = {
  word: "foo",
  usage: "Foo was barred for the bar",
};

export const testRender = () => {
  const res = nunjucks.renderString(WordTemplate, vars);
  console.log(res);
};
