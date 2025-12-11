import { db } from "../../db";

export interface ExerciseRow {
  id: number;
  name: string;
  category: string | null;
  intensity: string | null;
  calories_per_min: number;

  image_url: string | null;
  tags: string | null;

  is_verified: number;
  created_by_user: number | null;
  created_at: string;
  updated_at: string;
}

export interface ListExercisesParams {
  search?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}

export function listExercises(params: ListExercisesParams): ExerciseRow[] {
  const {
    search,
    tag,
    limit = 100,
    offset = 0,
  } = params;

  const where: string[] = [];
  const args: any[] = [];

  if (search && search.trim() !== "") {
    where.push("lower(name) LIKE ?");
    args.push(`%${search.trim().toLowerCase()}%`);
  }

  if (tag && tag.trim() !== "") {
    where.push("tags LIKE ?");
    args.push(`%${tag.trim()}%`);
  }

  let sql = `
    SELECT *
    FROM exercises
  `;

  if (where.length > 0) {
    sql += " WHERE " + where.join(" AND ");
  }

  sql += " ORDER BY name LIMIT ? OFFSET ?";
  args.push(limit, offset);

  const stmt = db.prepare(sql);
  return stmt.all(...args) as ExerciseRow[];
}

export function findExerciseById(id: number): ExerciseRow | undefined {
  const stmt = db.prepare("SELECT * FROM exercises WHERE id = ?");
  const row = stmt.get(id) as ExerciseRow | undefined;
  return row;
}

// DTO gửi ra frontend (camelCase)
export function toExerciseDTO(row: ExerciseRow) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    intensity: row.intensity,
    caloriesPerMin: row.calories_per_min,
    imageUrl: row.image_url,
    tags: row.tags,
    isVerified: !!row.is_verified,
  };
}
