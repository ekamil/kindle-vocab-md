import { describe, expect, test } from "@jest/globals";
import { Repository } from "./db";

describe("db module - repository", () => {
  const repo = new Repository("vocab.db");
  test("finds a single word", async () => {
    const actual = await repo.findWord("boring");
    expect(actual).toBeDefined();
    expect(actual).not.toBeNull();
    expect(actual).toHaveProperty("id", "en:boring");
  });
  test("non-existent word", async () => {
    const actual = await repo.findWord("xdxxxxxxx");
    expect(actual).toBeUndefined();
  });
});
