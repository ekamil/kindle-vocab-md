import { describe, expect, test } from "@jest/globals";
import { type BookInfo } from "./db_models";
import { Book } from "./domain_models";

describe("domain models", () => {
  test("sanitizes title", () => {
    const book_info: BookInfo = {
      id: "At_the_Mountains_of_Madness:AE289D66",
      asin: "95f7df0a-3408-11e1-b961-001cc0a62c0b",
      guid: "At_the_Mountains_of_Madness:AE289D66",
      lang: "en",
      title:
        "  $$$At the Mountains of   Madness 1 \
       ",
      authors: "Howard Phillips Lovecraft",
    };
    const book = new Book(book_info);
    expect(book.safe_title).toBe("At the Mountains of Madness 1");
  });
});
