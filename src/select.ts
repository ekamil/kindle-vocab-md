import { Database } from "sqlite3";

const db = new Database("vocab.db");

export const testSelect = () => {
  db.get("SELECT * from words limit 1", (_, res) => console.log(res));
  db.get("SELECT * from lookups limit 1", (_, res) => console.log(res.usage));
};
