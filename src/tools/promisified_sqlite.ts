import { Database } from "sqlite3";

export class PromisifiedDatabase {
  private readonly db: Database;

  constructor(path: string, callback?: (err: Error | null) => void) {
    this.db = new Database(path, callback);
  }

  async get<T>(sql: string, params: any): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);

        resolve(row as T);
      });
    });
  }

  async all<T>(sql: string, params: any): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
      this.db.all(sql, params, (err, row) => {
        if (err) reject(err);

        resolve(row as T);
      });
    });
  }
}
