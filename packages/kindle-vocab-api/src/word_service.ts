import { Repositories } from "./db.js";
import { Book, LookedUpWord, Lookup, Vocabulary } from "./domain_models.js";

export async function get_vocabulary_from_db(repositories: Repositories): Promise<Vocabulary> {
  const vocabulary = new Vocabulary();

  const lookups_repo = repositories.lookups;
  const words_repo = repositories.words;
  const books_repo = repositories.books;

  (await books_repo.all()).forEach((db_book) => {
    vocabulary.books.set(db_book.id, new Book(db_book));
  });

  (await lookups_repo.all()).forEach((db_lookup) => {
    const book = vocabulary.books.get(db_lookup.book_key);
    if (book === undefined) {
      throw `missing book for lookup ${db_lookup}`;
    }
    const lookup = new Lookup(db_lookup, book);
    vocabulary.lookups.set(db_lookup.id, lookup);

    const word_key = db_lookup.word_key;
    if (vocabulary.lookups_by_word.has(word_key)) {
      vocabulary.lookups_by_word.get(word_key)?.push(lookup);
    } else {
      vocabulary.lookups_by_word.set(word_key, [lookup]);
    }
  });

  (await words_repo.all()).forEach(async (word) => {
    const lookups = vocabulary.lookups_by_word.get(word.id);
    if (lookups === undefined) {
      throw `missing lookups for word ${word}`;
    }
    const enhanced = new LookedUpWord(word, lookups);
    vocabulary.words.set(word.id, enhanced);
  });

  return Promise.resolve(vocabulary);
}
