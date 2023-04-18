import { describe, expect, test } from "@jest/globals";
import { type BookT, type LookupT, type WordT } from "./db_models";
import { Book, LookedUpWord, Lookup } from "./domain_models";

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
    expect(book.safe_title).toBe("At the Mountains of Madness");
    expect(book.asin).toBe(book_info.asin);
    expect(book.guid).toBe(book_info.guid);
    expect(book.authors).toBe(book_info.authors);
  });

  it.each([
    [
      "  $$$At the Mountains of   Madness: 1 \
    ",
      "At the Mountains of Madness",
    ],
    [
      "  $$$At the Mountains of   Madness: 1 \
    ",
      "At the Mountains of Madness",
    ],
    [" 23 ", "23"],
    ["The Great Gatsby", "The Great Gatsby"],
    ["A Desolation Called Peace: 2 (Teixcalaan)", "A Desolation Called Peace"],
    [
      "The Curious Incident of the Dog in the Night-time",
      "The Curious Incident of the Dog in the Night time",
    ],
    ["Interference (Semiosis Duology)", "Interference"],
    ["The Player Of Games (Culture series)", "The Player Of Games"],
    ["Excession (A Culture Novel Book)", "Excession"],
    ["Use Of Weapons (Culture series)", "Use Of Weapons"],
    ["Ancillary Justice: 1 (Imperial Radch)", "Ancillary Justice"],
    ["Inversions (A Culture Novel Book)", "Inversions"],
    ["Look To Windward (Culture series)", "Look To Windward"],
    [
      "Accelerate: The Science of Lean Software and DevOps: Building and Scaling High Performing Technology Organizations",
      "Accelerate The Science of Lean Software and DevOps",
    ],
  ])("sanitizes '%s'", (title, expected) => {
    const book_info_copy = { ...book_info };
    book_info_copy.title = title;
    const book = new Book(book_info_copy);
    expect(book.safe_title).toBe(expected);
  });

  test("creates word with empty lookups", () => {
    const actual = new LookedUpWord(
      {
        id: "en:crèche",
        stem: "crèche",
        word: "crèche",
        lang: "en",
        category: 0,
        timestamp: 1552410116996,
      },
      new Array(),
    );
    expect(actual.word).toBe("crèche");
    expect(actual.safe_word).toBe("creche");
    expect(actual.lookups).toHaveLength(0);
    expect(actual.latest_lookup_date).not.toBeNull();
    expect(actual.latest_lookup_date.getFullYear()).toBe(1970);
  });
});

describe("from db models", () => {
  const db_word: WordT = {
    id: "en:adroit",
    stem: "adroit",
    word: "adroit",
    lang: "en",
    category: 0,
    timestamp: 1507190128401,
  };

  const db_books: BookT[] = [
    {
      id: "Anathem:522FC9CB",
      asin: "cc2399ca-4b66-4ebf-bc74-6a596d278f35",
      guid: "Anathem:522FC9CB",
      lang: "en",
      title: "Anathem",
      authors: "Neal Stephenson",
    },
    {
      id: "The_Left_Hand_Of_Darkness:D7812BE3",
      asin: "9bbcd6ae-06fb-4161-a52d-f84900ec8da9",
      guid: "The_Left_Hand_Of_Darkness:D7812BE3",
      lang: "en",
      title: "The Left Hand Of Darkness",
      authors: "Ursula K. Le Guin",
    },
  ];

  const db_lookups: LookupT[] = [
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
    const books = db_books.map((db_book) => {
      return new Book(db_book);
    });
    const lookups = db_lookups.map((db_lookup) => {
      const filtered = books.filter((book) => {
        return book.book_key == db_lookup.book_key;
      });
      expect(filtered).toHaveLength(1);
      return new Lookup(db_lookup, filtered[0]);
    });
    const actual = new LookedUpWord(db_word, lookups);
    expect(actual.word).toBe("adroit");
    expect(actual.lookups).toHaveLength(2);
    expect(actual.lookups[0].book.safe_title).toBe("Anathem");
    expect(actual.lookups[0].date.getFullYear()).toBe(2017);
    expect(actual.lookups[0].usage).toContain(db_word.word);
    expect(actual.lookups[0].usage).toContain("==");
  });
});
