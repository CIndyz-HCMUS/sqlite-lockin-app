import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { runMigrations } from "./db";

import { authRouter } from "./modules/auth/auth.routes"; // 👈 named import
import statsRouter from "./routes/stats.routes";         // statsRouter vẫn default như đã viết
import { mealRouter } from "./modules/meal/meal.routes";
import { foodRouter } from "./modules/foods/food.routes";
const app = express();

runMigrations();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/stats", statsRouter);
app.use("/foods", foodRouter);
app.use("/meal-logs", mealRouter);

const PORT = ENV.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
