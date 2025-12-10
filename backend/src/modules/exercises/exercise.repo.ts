import { db } from "../../db";
import {
  CreateExerciseInput,
  ExerciseRow,
  UpdateExerciseInput,
} from "./exercise.types";

export function toExerciseDTO(row: ExerciseRow) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    intensity: row.intensity,
    caloriesPerMin: row.calories_per_min,
    imageUrl: row.image_url,
    tags: row.tags ? (JSON.parse(row.tags) as string[]) : [],
    isVerified: !!row.is_verified,
    createdByUser: row.created_by_user,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createExercise(input: CreateExerciseInput): ExerciseRow {
  const now = new Date().toISOString();
  const tagsJson = input.tags ? JSON.stringify(input.tags) : null;

  const stmt = db.prepare(
    `INSERT INTO exercises (
      name, category, intensity, calories_per_min,
      image_url, tags, is_verified, created_by_user,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`
  );

  const result = stmt.run(
    input.name,
    input.category ?? null,
    input.intensity ?? null,
    input.caloriesPerMin,
    input.imageUrl ?? null,
    tagsJson,
    input.createdByUser ?? null,
    now,
    now
  );

  const newId = Number(result.lastInsertRowid);
  const row = findExerciseById(newId);
  if (!row) throw new Error("Failed to fetch created exercise");
  return row;
}

export function findExerciseById(id: number): ExerciseRow | undefined {
  const stmt = db.prepare("SELECT * FROM exercises WHERE id = ?");
  return stmt.get(id) as ExerciseRow | undefined;
}

export function listExercises(options: {
  search?: string;
  tag?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): ExerciseRow[] {
  const { search, tag, category, limit = 50, offset = 0 } = options;
  const clauses: string[] = [];
  const params: any[] = [];

  if (search) {
    clauses.push("name LIKE ?");
    params.push(`%${search}%`);
  }
  if (tag) {
    clauses.push("tags LIKE ?");
    params.push(`%${tag}%`);
  }
  if (category) {
    clauses.push("category = ?");
    params.push(category);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const sql = `SELECT * FROM exercises ${where} ORDER BY name LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const stmt = db.prepare(sql);
  return stmt.all(...params) as ExerciseRow[];
}

export function updateExercise(
  id: number,
  input: UpdateExerciseInput
): ExerciseRow | undefined {
  const fields: string[] = [];
  const values: any[] = [];

  if (input.name !== undefined) {
    fields.push("name = ?");
    values.push(input.name);
  }
  if (input.category !== undefined) {
    fields.push("category = ?");
    values.push(input.category ?? null);
  }
  if (input.intensity !== undefined) {
    fields.push("intensity = ?");
    values.push(input.intensity ?? null);
  }
  if (input.caloriesPerMin !== undefined) {
    fields.push("calories_per_min = ?");
    values.push(input.caloriesPerMin);
  }
  if (input.imageUrl !== undefined) {
    fields.push("image_url = ?");
    values.push(input.imageUrl ?? null);
  }
  if (input.tags !== undefined) {
    fields.push("tags = ?");
    values.push(input.tags ? JSON.stringify(input.tags) : null);
  }

  if (!fields.length) {
    return findExerciseById(id);
  }

  const now = new Date().toISOString();
  fields.push("updated_at = ?");
  values.push(now, id);

  const sql = `UPDATE exercises SET ${fields.join(", ")} WHERE id = ?`;
  const stmt = db.prepare(sql);
  stmt.run(...values);

  return findExerciseById(id);
}

export function deleteExercise(id: number): void {
  const stmt = db.prepare("DELETE FROM exercises WHERE id = ?");
  stmt.run(id);
}
