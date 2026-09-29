import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getPool, closePool } from "../packages/shared/src/db/pool";

config({ path: resolve(process.cwd(), ".env") });

(async () => {
  const file = process.argv[2] ?? "sql/001_user.sql";
  const sql = readFileSync(resolve(process.cwd(), file), "utf-8");
  getPool()
    .query(sql)
    .then((result) =>
      console.log("Migrated ", file),
    );
  await closePool();
})().catch((error) => {
  console.log(error);
  process.exit(1);
});
