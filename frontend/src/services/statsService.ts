import { apiRequest } from "./api";

export interface TodayStats {
  date: string;
  summary: {
    calories_in: number;
    calories_burned: number;
    hydration_ml: number;
    sleep_minutes: number;
    relax_minutes: number;
  };
  details: {
    meals_count: number;
    workouts_count: number;
    relax_sessions_count: number;
    sleep_sessions_count: number;
  };
}

export async function getTodayStats(): Promise<TodayStats> {
  return apiRequest<TodayStats>("/stats/today", {
    method: "GET",
  });
}
