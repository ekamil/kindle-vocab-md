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

  // Lookups and Words reference each other
  // 1st pass is creating a map of words sans lookups
  // then load lookups while attaching them onto words

  (await words_repo.all()).forEach(async (word) => {
    const enhanced = new LookedUpWord(word);
    vocabulary.words.set(word.id, enhanced);
  });

  (await lookups_repo.all()).forEach((db_lookup) => {
    const book = vocabulary.books.get(db_lookup.book_key);
    if (book === undefined) {
      throw `missing book key:${db_lookup.book_key} for lookup id:${db_lookup.id}`;
    }
    const word = vocabulary.words.get(db_lookup.word_key);
    if (word === undefined) {
      throw `missing word key:${db_lookup.word_key} for lookup id:${db_lookup.id}`;
    }
    const lookup = new Lookup(db_lookup, book, word.word);
    word.append_lookup(lookup);
  });

  return Promise.resolve(vocabulary);
}
