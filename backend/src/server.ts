import { createApp } from "./app";
import { ENV } from "./config/env";
import { runMigrations } from "./db";   // dùng named import

// Chạy migrations trước
runMigrations();

const app = createApp();

app.listen(ENV.PORT, () => {
  console.log(`LockIn backend listening on port ${ENV.PORT}`);
});
