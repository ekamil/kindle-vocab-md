import { Database } from "sqlite3";

// Open a SQLite database, stored in the file db.sqlite
const db = new Database("vocab.db");

// const statement = db.prepare(
//     `UPDATE articles SET title=Third article' WHERE id=?`
//   )
//   statement.run([3]);

export const testSelect = () => {
  db.get("SELECT * from words limit 1", (_, res) => console.log(res));
  db.get("SELECT * from lookups limit 1", (_, res) => console.log(res.usage));
};
