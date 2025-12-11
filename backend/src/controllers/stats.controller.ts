// backend/src/controllers/stats.controller.ts
import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { query } from "../db";   // 👈 chỉ import query

function getTodayRange() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export const StatsController = {
  // GET /stats/today
  getTodayStats: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.userId;
      const { start, end } = getTodayRange();

      const startIso = start.toISOString();
      const endIso = end.toISOString();

      // Calories in từ meal_logs
      const mealsResult = await query(
        `
        SELECT
          COALESCE(SUM(calories), 0) AS calories_in,
          COUNT(*) AS meals_count
        FROM meal_logs
        WHERE user_id = ?
          AND date_time BETWEEN ? AND ?
        `,
        [userId, startIso, endIso]
      );

      const caloriesIn = Number(mealsResult.rows[0]?.calories_in ?? 0);
      const mealsCount = Number(mealsResult.rows[0]?.meals_count ?? 0);

      // Calories burned từ workout_logs
      const workoutResult = await query(
        `
        SELECT
          COALESCE(SUM(calories_burned), 0) AS calories_burned,
          COUNT(*) AS workouts_count
        FROM workout_logs
        WHERE user_id = ?
          AND date_time BETWEEN ? AND ?
        `,
        [userId, startIso, endIso]
      );

      const caloriesBurned = Number(workoutResult.rows[0]?.calories_burned ?? 0);
      const workoutsCount = Number(workoutResult.rows[0]?.workouts_count ?? 0);

      // Hydration
      const hydrationResult = await query(
        `
        SELECT
          COALESCE(SUM(amount_ml), 0) AS hydration_ml,
          COUNT(*) AS hydration_logs_count
        FROM hydration_logs
        WHERE user_id = ?
          AND date_time BETWEEN ? AND ?
        `,
        [userId, startIso, endIso]
      );

      const hydrationMl = Number(hydrationResult.rows[0]?.hydration_ml ?? 0);

      // Sleep (phút)
      const sleepResult = await query(
        `
        SELECT
          COALESCE(SUM((julianday(end_time) - julianday(start_time)) * 24 * 60), 0) AS sleep_minutes,
          COUNT(*) AS sleep_sessions_count
        FROM sleep_logs
        WHERE user_id = ?
          AND start_time BETWEEN ? AND ?
        `,
        [userId, startIso, endIso]
      );

      const sleepMinutes = Number(sleepResult.rows[0]?.sleep_minutes ?? 0);
      const sleepSessionsCount = Number(
        sleepResult.rows[0]?.sleep_sessions_count ?? 0
      );

      // Relax (phút)
      const relaxResult = await query(
        `
        SELECT
          COALESCE(SUM((julianday(end_time) - julianday(start_time)) * 24 * 60), 0) AS relax_minutes,
          COUNT(*) AS relax_sessions_count
        FROM relax_logs
        WHERE user_id = ?
          AND start_time BETWEEN ? AND ?
        `,
        [userId, startIso, endIso]
      );

      const relaxMinutes = Number(relaxResult.rows[0]?.relax_minutes ?? 0);
      const relaxSessionsCount = Number(
        relaxResult.rows[0]?.relax_sessions_count ?? 0
      );

      const todayStr = start.toISOString().slice(0, 10); // YYYY-MM-DD

      return res.json({
        date: todayStr,
        summary: {
          calories_in: caloriesIn,
          calories_burned: caloriesBurned,
          hydration_ml: hydrationMl,
          sleep_minutes: sleepMinutes,
          relax_minutes: relaxMinutes,
        },
        details: {
          meals_count: mealsCount,
          workouts_count: workoutsCount,
          relax_sessions_count: relaxSessionsCount,
          sleep_sessions_count: sleepSessionsCount,
        },
      });
    } catch (error) {
      console.error("Error in getTodayStats:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
