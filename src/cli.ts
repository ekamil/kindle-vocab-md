import { Command, Option } from "@commander-js/extra-typings";
import { name, version, description } from "../package.json";

const enum OutputFormat {
  MarkdownFile = "md-file",
  MarkdownDir = "md-dir",
  CSV = "csv",
}

export const program = new Command()
  .description(description)
  .version(version)
  .name(name)
  .option(
    "-d, --database <path>",
    "path to vocab.db SQLite database",
    "./vocab.db"
  )
  .option("-o, --output <path>", "directory or file for the results", "./out")
  .addOption(
    new Option("-f, --format <format>", "output format")
      .choices([
        OutputFormat.MarkdownFile,
        OutputFormat.MarkdownDir,
        OutputFormat.CSV,
      ])
      .default(OutputFormat.MarkdownDir)
  );
