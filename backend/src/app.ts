// src/app.ts
import express from "express";
import cors from "cors";
import path from "path";

import { authRouter } from "./modules/auth/auth.routes";
import { userRouter } from "./modules/users/user.routes";
import { errorHandler } from "./middleware/errorHandler";

import { uploadRouter } from "./modules/upload/upload.routes";

import { foodRouter } from "./modules/foods/food.routes";
import { exerciseRouter } from "./modules/exercise/exercise.routes";

import { mealLogRouter } from "./modules/logs/mealLog.routes";
import { workoutLogRouter } from "./modules/logs/workoutLog.routes";
import { relaxLogRouter } from "./modules/logs/relaxLog.routes";
import { sleepLogRouter } from "./modules/logs/sleepLog.routes";
import { hydrationLogRouter } from "./modules/logs/hydrationLog.routes";


import { favoriteRouter } from "./modules/favourites/favorite.routes";
import { dailySummaryRouter } from "./modules/summary/dailySummary.routes";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const uploadsPath = path.join(__dirname, "..", "uploads");
  app.use("/uploads", express.static(uploadsPath));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Đăng ký router với check rõ tên bị undefined
  const routes: { path: string; router: any; name: string }[] = [
    { path: "/auth", router: authRouter, name: "authRouter" },
    { path: "/upload", router: uploadRouter, name: "uploadRouter" },
    { path: "/foods", router: foodRouter, name: "foodRouter" },
    { path: "/exercises", router: exerciseRouter, name: "exerciseRouter" },

    { path: "/logs/meals", router: mealLogRouter, name: "mealLogRouter" },
    { path: "/logs/workouts", router: workoutLogRouter, name: "workoutLogRouter" },
    { path: "/logs/relax", router: relaxLogRouter, name: "relaxLogRouter" },
    { path: "/logs/sleep", router: sleepLogRouter, name: "sleepLogRouter" },
    { path: "/logs/water", router: hydrationLogRouter, name: "hydrationLogRouter" },

    { path: "/me/daily-summary", router: dailySummaryRouter, name: "dailySummaryRouter" },
    { path: "/me/favorites", router: favoriteRouter, name: "favoriteRouter" },

    { path: "/", router: userRouter, name: "userRouter" },
  ];

  routes.forEach(({ path, router, name }) => {
    if (!router) {
      throw new Error(`Router "${name}" is undefined for path "${path}"`);
    }
    app.use(path, router);
  });

  app.use(errorHandler);

  return app;
}
