import type { Lookup, Word } from "./db_models";
import { PromisifiedDatabase } from "./tools/promisified_sqlite";

const queries = {
  word_query: "SELECT * FROM words WHERE stem like ?",
  lookups_for_word:
    "SELECT * FROM lookups WHERE word_key = ? ORDER BY timestamp ASC",
};

export class Repository {
  private readonly db: PromisifiedDatabase;
  constructor(path = "vocab.db") {
    this.db = new PromisifiedDatabase(path);
  }

  async findWord(partial: string): Promise<Word> {
    return this.db.get(queries.word_query, [partial]);
  }

  async getLookupsForWord(word: Word): Promise<Lookup[]> {
    return this.db.all(queries.lookups_for_word, [word.id]);
  }
}
