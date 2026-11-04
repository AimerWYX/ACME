import postgres from "postgres";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "缺少环境变量 POSTGRES_URL，请检查项目根目录的 .env 文件。",
  );
}

// 开发环境热重载会重新执行模块，复用同一实例避免连接池泄漏。
const globalForDb = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>;
};

export const sql = globalForDb.sql ?? postgres(connectionString, { ssl: "require" });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = sql;
}
