import { Database } from "better-sqlite3";

const not_found = "not found";

interface ID<K> {
  id: K;
}

export class ReadListRepository<K, V extends ID<K>> {
  constructor(
    protected readonly db: Database,
    private readonly by_id_query: string,
    private readonly all_query: string,
  ) {}

  async get(key: K): Promise<V> {
    const from_db = (await this.db.prepare(this.by_id_query).get([key])) as V;
    if (from_db?.id !== undefined) {
      return Promise.resolve(from_db);
    }
    return Promise.reject(not_found + " " + this.constructor.name);
  }

  async all(): Promise<V[]> {
    return this.db.prepare(this.all_query).all() as V[];
  }
}
