import { describe, expect, test } from "@jest/globals";
import { openDB, Repository } from "./db";

describe("db module - basics", () => {
  let db = openDB();
  test("selects a single word", () => {
    db.get("SELECT * from words where stem like 'boring'", (_, row: any) => {
      expect(row).not.toBeNull();
      expect(row.id).toBe("en:boring");
    });
  });
  test("selects a single word with params", () => {
    db.get(
      "SELECT * from words where stem like ?",
      ["boring"],
      (_, row: any) => {
        expect(row).not.toBeNull();
        expect(row.id).toBe("en:boring");
      },
    );
  });
});

describe("db module - repository", () => {
  let repo = new Repository("vocab.db");
  test("finds a single word", async () => {
    let actual = await repo.findWord("boring");
    expect(actual).toBeDefined();
    expect(actual).not.toBeNull();
    expect(actual).toHaveProperty("id", "en:boring");
  });
});
