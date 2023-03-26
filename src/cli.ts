import { Command, Option } from "@commander-js/extra-typings";
import { join } from "path";
import { name, version, description } from "../package.json";

export const program = new Command()
  .description(description)
  .version(version)
  .name(name)
  .option(
    "-d, --database <path>",
    "path to vocab.db SQLite database",
    "./vocab.db",
  )
  .option("--output <path>", "directory or file for the results", "./out")
  .addOption(
    new Option("--output-books <path>", "directory for book files")
      .conflicts("output")
      .default(null),
  )
  .addOption(
    new Option("--output-words <path>", "directory for word files")
      .conflicts("output")
      .default(null),
  )
  .action((options) => {
    // TODO: maybe don't require both -
    // no outputWords == only write book files and vice versa ?
    if (options.outputBooks || options.outputWords) {
      if (options.outputBooks === null || options.outputWords === null) {
        throw "Both --output-books and --output-words are required";
      }
      if (options.outputBooks === options.outputWords) {
        console.log("Output for words and books is the same");
      }
    } else {
      options.outputBooks = join(options.output, "books");
      options.outputWords = join(options.output, "words");
    }
  });
