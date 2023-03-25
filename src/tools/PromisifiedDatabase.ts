import { Database } from "sqlite3";

export class PromisifiedDatabase {
  private readonly db: Database;

  constructor(path: string) {
    this.db = new Database(path, (err) => {
      if (err) {
        console.error(err);
        throw new Error("Failed to connect to database");
      }
      console.debug(`Connected to db ${path}`);
    });
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
