import { db } from "../../db";

export interface CreateWorkoutLogInput {
  userId: number;
  exerciseId: number;
  minutes: number;
  loggedAt?: string; // optional
}

export interface WorkoutLogRow {
  id: number;
  user_id: number;
  exercise_id: number;
  minutes: number;
  logged_at: string;
  calories: number;
  created_at: string;
  updated_at: string;
}

function getCaloriesPerMin(exerciseId: number): number {
  const row = db
    .prepare("SELECT calories_per_min FROM exercises WHERE id = ?")
    .get(exerciseId) as { calories_per_min?: number } | undefined;

  if (!row || row.calories_per_min == null) {
    throw new Error("Exercise not found or calories_per_min missing");
  }
  return row.calories_per_min;
}

export function createWorkoutLog(input: CreateWorkoutLogInput): WorkoutLogRow {
  const kcalPerMin = getCaloriesPerMin(input.exerciseId);
  const calories = kcalPerMin * input.minutes;

  const now = new Date().toISOString();
  const loggedAt = input.loggedAt || now;

  const stmt = db.prepare(
    `INSERT INTO workout_logs (
      user_id,
      exercise_id,
      minutes,
      logged_at,
      calories,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const result = stmt.run(
    input.userId,
    input.exerciseId,
    input.minutes,
    loggedAt,
    calories,
    now,
    now
  );

  const row = db
    .prepare("SELECT * FROM workout_logs WHERE id = ?")
    .get(result.lastInsertRowid) as WorkoutLogRow;

  return row;
}

export function toWorkoutLogDTO(row: WorkoutLogRow) {
  return {
    id: row.id,
    userId: row.user_id,
    exerciseId: row.exercise_id,
    minutes: row.minutes,
    loggedAt: row.logged_at,
    calories: row.calories,
  };
}
