import knex from "knex";
import path from "path";

const connection = knex({
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "database.sqlite"),
  },
  useNullAsDefault: true,
  debug: true,
  pool: {
    min: 1,
    max: 20,
  },
});

export default connection;
