import { db } from "../../db";
import { DailySummaryDTO } from "./dailySummary.types";

export function getDailySummary(userId: number, date: string): DailySummaryDTO {
  // 1) Meal logs
  const mealStmt = db.prepare(
    `
    SELECT
      COALESCE(SUM(calories), 0) AS caloriesIntake,
      COALESCE(SUM(protein), 0)  AS protein,
      COALESCE(SUM(carb), 0)     AS carb,
      COALESCE(SUM(fat), 0)      AS fat,
      COUNT(*)                   AS totalMeals
    FROM meal_logs
    WHERE user_id = ?
      AND substr(logged_at, 1, 10) = ?
    `
  );
  const meal = mealStmt.get(userId, date) as {
    caloriesIntake: number;
    protein: number;
    carb: number;
    fat: number;
    totalMeals: number;
  };

  // 2) Workout logs
  const workoutStmt = db.prepare(
    `
    SELECT
      COALESCE(SUM(calories_burned), 0) AS caloriesBurned,
      COALESCE(SUM(duration_min), 0)    AS totalWorkoutMin,
      COUNT(*)                          AS totalWorkouts
    FROM workout_logs
    WHERE user_id = ?
      AND substr(logged_at, 1, 10) = ?
    `
  );
  const workout = workoutStmt.get(userId, date) as {
    caloriesBurned: number;
    totalWorkoutMin: number;
    totalWorkouts: number;
  };

  // 3) Relax logs
  const relaxStmt = db.prepare(
    `
    SELECT
      COALESCE(SUM(duration_min), 0)    AS totalRelaxMin,
      COUNT(*)                          AS totalRelaxSessions,
      AVG(mood_before)                  AS avgMoodBefore,
      AVG(mood_after)                   AS avgMoodAfter
    FROM relax_logs
    WHERE user_id = ?
      AND substr(logged_at, 1, 10) = ?
    `
  );
  const relax = relaxStmt.get(userId, date) as {
    totalRelaxMin: number;
    totalRelaxSessions: number;
    avgMoodBefore: number | null;
    avgMoodAfter: number | null;
  };

  // 4) Sleep logs (theo sleep_date)
  const sleepStmt = db.prepare(
    `
    SELECT
      COALESCE(SUM(duration_min), 0) AS totalSleepMin,
      AVG(quality)                   AS avgSleepQuality
    FROM sleep_logs
    WHERE user_id = ?
      AND sleep_date = ?
    `
  );
  const sleep = sleepStmt.get(userId, date) as {
    totalSleepMin: number;
    avgSleepQuality: number | null;
  };

  // 5) Hydration logs (theo drink_date)
  const waterStmt = db.prepare(
    `
    SELECT
      COALESCE(SUM(amount_ml), 0) AS totalWaterMl,
      COUNT(*)                    AS totalWaterEvents
    FROM hydration_logs
    WHERE user_id = ?
      AND drink_date = ?
    `
  );
  const water = waterStmt.get(userId, date) as {
    totalWaterMl: number;
    totalWaterEvents: number;
  };

  const caloriesIntake = meal.caloriesIntake || 0;
  const caloriesBurned = workout.caloriesBurned || 0;

  const summary: DailySummaryDTO = {
    date,
    caloriesIntake,
    caloriesBurned,
    netCalories: caloriesIntake - caloriesBurned,

    totalMeals: meal.totalMeals || 0,
    macros: {
      protein: meal.protein || 0,
      carb: meal.carb || 0,
      fat: meal.fat || 0,
    },

    totalWorkouts: workout.totalWorkouts || 0,
    totalWorkoutMin: workout.totalWorkoutMin || 0,

    totalRelaxSessions: relax.totalRelaxSessions || 0,
    totalRelaxMin: relax.totalRelaxMin || 0,
    avgMoodBefore: relax.avgMoodBefore ?? null,
    avgMoodAfter: relax.avgMoodAfter ?? null,

    totalSleepMin: sleep.totalSleepMin || 0,
    avgSleepQuality: sleep.avgSleepQuality ?? null,

    totalWaterMl: water.totalWaterMl || 0,
    totalWaterEvents: water.totalWaterEvents || 0,
  };

  return summary;
}
