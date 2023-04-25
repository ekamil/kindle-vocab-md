import sqlite3 from "sqlite3";

export class PromisifiedDatabase {
  private readonly db: sqlite3.Database;

  constructor(path: string, callback?: (err: Error | null) => void) {
    this.db = new sqlite3.Database(path, callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T>(sql: string, params: any): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);

        resolve(row as T);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async all<T>(sql: string, params: any): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
      this.db.all(sql, params, (err, row) => {
        if (err) reject(err);

        resolve(row as T);
      });
    });
  }
}
export function log_connection(path: string): (err: Error | null) => void {
  return (err) => {
    if (err) {
      console.error(err);
      throw new Error("Failed to connect to database");
    }
    console.debug(`Connected to sqlite db ${path}`);
  };
}
