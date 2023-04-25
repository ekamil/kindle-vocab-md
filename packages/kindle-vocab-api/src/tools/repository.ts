import { PromisifiedDatabase } from "./promisified_sqlite.js";

const not_found = "not found";

interface ID<K> {
  id: K;
}

export class ReadListRepository<K, V extends ID<K>> {
  constructor(
    protected readonly db: PromisifiedDatabase,
    private readonly by_id_query: string,
    private readonly all_query: string,
  ) {}

  async get(key: K): Promise<V> {
    const from_db = await this.db.get<V>(this.by_id_query, [key]);
    if (from_db?.id !== undefined) {
      return Promise.resolve(from_db);
    }
    return Promise.reject(not_found + " " + this.constructor.name);
  }

  async all(): Promise<V[]> {
    return await this.db.all<V[]>(this.all_query, []);
  }
}
