import { describe, expect, test } from "@jest/globals";
import { type BookT, type LookupT, type WordT } from "./db_models";
import { Book, EnhancedWord } from "./domain_models";

describe("domain models", () => {
  const book_info: BookT = {
    id: "At_the_Mountains_of_Madness:AE289D66",
    asin: "95f7df0a-3408-11e1-b961-001cc0a62c0b",
    guid: "At_the_Mountains_of_Madness:AE289D66",
    lang: "en",
    title:
      "  $$$At the Mountains of   Madness: 1 \
         ",
    authors: "Howard Phillips Lovecraft",
  };

  test("sanitizes title", () => {
    const book = new Book(book_info);
    expect(book.title).toBe(book_info.title);
    expect(book.safe_title).toBe("At the Mountains of Madness 1");
    expect(book.asin).toBe(book_info.asin);
    expect(book.guid).toBe(book_info.guid);
    expect(book.authors).toBe(book_info.authors);
  });

  it.each([
    [
      "  $$$At the Mountains of   Madness: 1 \
    ",
      "At the Mountains of Madness 1",
    ],
    [
      "  $$$At the Mountains of   Madness: 1 \
    ",
      "At the Mountains of Madness 1",
    ],
    [" 23 ", "23"],
  ])("sanitizes '%s'", (title, expected) => {
    const book_info_copy = { ...book_info };
    book_info_copy.title = title;
    const book = new Book(book_info_copy);
    expect(book.safe_title).toBe(expected);
  });
});
describe("from db models", () => {
  const word: WordT = {
    id: "en:adroit",
    stem: "adroit",
    word: "adroit",
    lang: "en",
    category: 0,
    timestamp: 1507190128401,
  };

  const books: Map<string, BookT> = new Map([
    [
      "Anathem:522FC9CB",
      {
        id: "Anathem:522FC9CB",
        asin: "cc2399ca-4b66-4ebf-bc74-6a596d278f35",
        guid: "Anathem:522FC9CB",
        lang: "en",
        title: "Anathem",
        authors: "Neal Stephenson",
      },
    ],
    [
      "The_Left_Hand_Of_Darkness:D7812BE3",
      {
        id: "The_Left_Hand_Of_Darkness:D7812BE3",
        asin: "9bbcd6ae-06fb-4161-a52d-f84900ec8da9",
        guid: "The_Left_Hand_Of_Darkness:D7812BE3",
        lang: "en",
        title: "The Left Hand Of Darkness",
        authors: "Ursula K. Le Guin",
      },
    ],
  ]);

  const lookups: LookupT[] = [
    {
      id: "Anathem:522FC9CB:338916:9",
      word_key: "en:adroit",
      book_key: "Anathem:522FC9CB",
      dict_key: "B0053VMNYW",
      pos: "338916",
      usage:
        "Thanks to some adroit sequence-writing that had been done before the Second Sack, we had a few crops that could grow almost year-round. ",
      timestamp: 1494922357178,
    },
    {
      id: "The_Left_Hand_Of_Darkness:D7812BE3:40268:9",
      word_key: "en:adroit",
      book_key: "The_Left_Hand_Of_Darkness:D7812BE3",
      dict_key: "B0053VMNYW",
      pos: "40268",
      usage:
        "He was not merely adroit and not merely powerful, he was faithless. ",
      timestamp: 1507190128428,
    },
  ];
  test("creates word from db models", () => {
    const actual = new EnhancedWord(word, lookups, books);
    expect(actual.word).toBe("adroit");
    expect(actual.lookups).toHaveLength(2);
    expect(actual.lookups[0].book.safe_title).toBe("Anathem");
    expect(actual.lookups[0].date.getFullYear()).toBe(2017);
    expect(actual.lookups[0].usage).toContain(word.word);
    expect(actual.lookups[0].usage).toContain("::");
  });
});
