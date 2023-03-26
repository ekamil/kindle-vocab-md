import { PromisifiedDatabase } from "./promisified_sqlite";

const not_found = "not found";

interface ID<K> {
  id: K;
}

export class ReadListRepository<K, V extends ID<K>> {
  protected cache = new Map<K, V>();
  constructor(
    protected readonly db: PromisifiedDatabase,
    private readonly by_id_query: string,
    private readonly all_query: string,
  ) {
    this.cache = new Map<K, V>();
  }

  async as_map(): Promise<ReadonlyMap<K, V>> {
    if (this.cache.size == 0) {
      await this.all();
    }
    return new Map(this.cache.entries());
  }

  async get(key: K): Promise<V> {
    const from_cache = this.cache.get(key);
    if (from_cache !== undefined) {
      return Promise.resolve(from_cache);
    }

    const from_db = await this.db.get<V>(this.by_id_query, [key]);
    if (from_db?.id !== undefined) {
      this.cache.set(key, from_db);
      return Promise.resolve(from_db);
    }
    return Promise.reject(not_found + " " + this.constructor.name);
  }

  async all(only_cache = false): Promise<V[]> {
    if (!only_cache || this.cache.size == 0) {
      const from_db = await this.db.all<V[]>(this.all_query, []);
      from_db.forEach((element) => {
        this.cache.set(element.id, element);
      });
    }

    const from_cache = new Array(...this.cache.values());
    if (from_cache !== undefined) {
      return Promise.resolve(from_cache);
    }
    return Promise.reject(not_found);
  }
}
