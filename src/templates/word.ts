import * as fs from "fs";
import path from "path";

export type WordTemplateVariables = {
  word: string;
  usage: string;
};

export const wordTemplate = fs.readFileSync(
  path.join(__dirname, "word.njk"),
  {
    encoding: "utf8",
    flag: "r",
  }
);
