import { db } from "../../db";
import {
  CreateWorkoutLogInput,
  UpdateWorkoutLogInput,
  WorkoutLogDTO,
  WorkoutLogRow,
} from "./workoutLog.types";
import { ExerciseRow } from "../exercise/exercise.types";

function getExerciseById(id: number): ExerciseRow | undefined {
  const stmt = db.prepare("SELECT * FROM exercises WHERE id = ?");
  return stmt.get(id) as ExerciseRow | undefined;
}

function computeCalories(durationMin: number, exercise: ExerciseRow) {
  return durationMin * exercise.calories_per_min;
}

export function toWorkoutLogDTO(
  row: WorkoutLogRow & {
    exercise_name?: string;
    exercise_image_url?: string | null;
    exercise_category?: string | null;
  }
): WorkoutLogDTO {
  const dto: WorkoutLogDTO = {
    id: row.id,
    userId: row.user_id,
    exerciseId: row.exercise_id,
    durationMin: row.duration_min,
    intensity: row.intensity,
    loggedAt: row.logged_at,
    notes: row.notes ?? undefined,
    caloriesBurned: row.calories_burned,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (row.exercise_name) {
    dto.exercise = {
      id: row.exercise_id,
      name: row.exercise_name,
      imageUrl: row.exercise_image_url,
      category: row.exercise_category,
    };
  }

  return dto;
}

export function createWorkoutLog(
  input: CreateWorkoutLogInput
): WorkoutLogRow {
  const exercise = getExerciseById(input.exerciseId);
  if (!exercise) {
    throw new Error("EXERCISE_NOT_FOUND");
  }

  const now = new Date().toISOString();
  const loggedAt = input.loggedAt ?? now;
  const calories = computeCalories(input.durationMin, exercise);

  const stmt = db.prepare(
    `INSERT INTO workout_logs (
      user_id, exercise_id, duration_min, intensity, logged_at, notes,
      calories_burned, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const result = stmt.run(
    input.userId,
    input.exerciseId,
    input.durationMin,
    input.intensity ?? null,
    loggedAt,
    input.notes ?? null,
    calories,
    now,
    now
  );

  const newId = Number(result.lastInsertRowid);
  return findWorkoutLogById(newId)!;
}

export function findWorkoutLogById(
  id: number
): WorkoutLogRow | undefined {
  const stmt = db.prepare("SELECT * FROM workout_logs WHERE id = ?");
  return stmt.get(id) as WorkoutLogRow | undefined;
}

export function listWorkoutLogsForUser(
  userId: number,
  options: { date?: string }
): (WorkoutLogRow & {
  exercise_name?: string;
  exercise_image_url?: string | null;
  exercise_category?: string | null;
})[] {
  const { date } = options;
  const params: any[] = [userId];
  let where = "WHERE wl.user_id = ?";

  if (date) {
    where += " AND substr(wl.logged_at, 1, 10) = ?";
    params.push(date);
  }

  const sql = `
    SELECT
      wl.*,
      e.name AS exercise_name,
      e.image_url AS exercise_image_url,
      e.category AS exercise_category
    FROM workout_logs wl
    JOIN exercises e ON wl.exercise_id = e.id
    ${where}
    ORDER BY wl.logged_at ASC, wl.id ASC
  `;

  const stmt = db.prepare(sql);
  return stmt.all(...params) as any;
}

export function updateWorkoutLog(
  id: number,
  userId: number,
  input: UpdateWorkoutLogInput
): WorkoutLogRow | undefined {
  const existing = findWorkoutLogById(id);
  if (!existing || existing.user_id !== userId) {
    return undefined;
  }

  const exercise = getExerciseById(
    input.exerciseId ?? existing.exercise_id
  );
  if (!exercise) {
    throw new Error("EXERCISE_NOT_FOUND");
  }

  const duration = input.durationMin ?? existing.duration_min;
  const calories = computeCalories(duration, exercise);
  const now = new Date().toISOString();

  const stmt = db.prepare(
    `UPDATE workout_logs SET
      exercise_id = ?,
      duration_min = ?,
      intensity = ?,
      logged_at = ?,
      notes = ?,
      calories_burned = ?,
      updated_at = ?
    WHERE id = ? AND user_id = ?`
  );

  stmt.run(
    input.exerciseId ?? existing.exercise_id,
    duration,
    input.intensity ?? existing.intensity,
    input.loggedAt ?? existing.logged_at,
    input.notes ?? existing.notes,
    calories,
    now,
    id,
    userId
  );

  return findWorkoutLogById(id);
}

export function deleteWorkoutLog(
  id: number,
  userId: number
): boolean {
  const stmt = db.prepare(
    "DELETE FROM workout_logs WHERE id = ? AND user_id = ?"
  );
  const result = stmt.run(id, userId);
  return result.changes > 0;
}
