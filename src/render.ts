import nunjucks, { Environment } from "nunjucks";
import { WordTemplateVariables, wordTemplate } from "./templates/word";

let vars: WordTemplateVariables = {
  word: "foo",
  usage: "Foo was barred for the bar",
};

const res = nunjucks.renderString(wordTemplate, vars);
console.log(res);
