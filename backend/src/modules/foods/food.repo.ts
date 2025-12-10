import { db } from "../../db";
import { CreateFoodInput, FoodRow, UpdateFoodInput } from "./food.types";

export function toFoodDTO(row: FoodRow) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    servingSize: row.serving_size,
    servingUnit: row.serving_unit,
    calories: row.calories,
    protein: row.protein,
    carb: row.carb,
    fat: row.fat,
    fiber: row.fiber,
    sugar: row.sugar,
    sodium: row.sodium,
    imageUrl: row.image_url,
    tags: row.tags ? (JSON.parse(row.tags) as string[]) : [],
    isVerified: !!row.is_verified,
    createdByUser: row.created_by_user,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createFood(input: CreateFoodInput): FoodRow {
  const now = new Date().toISOString();
  const tagsJson = input.tags ? JSON.stringify(input.tags) : null;

  const stmt = db.prepare(
    `INSERT INTO foods (
      name, brand, category,
      serving_size, serving_unit,
      calories, protein, carb, fat,
      fiber, sugar, sodium,
      image_url, tags,
      is_verified, created_by_user,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`
  );

  const result = stmt.run(
    input.name,
    input.brand ?? null,
    input.category ?? null,
    input.servingSize,
    input.servingUnit,
    input.calories,
    input.protein,
    input.carb,
    input.fat,
    input.fiber ?? null,
    input.sugar ?? null,
    input.sodium ?? null,
    input.imageUrl ?? null,
    tagsJson,
    input.createdByUser ?? null,
    now,
    now
  );

  const newId = Number(result.lastInsertRowid);
  const row = findFoodById(newId);
  if (!row) {
    throw new Error("Failed to fetch created food");
  }
  return row;
}

export function findFoodById(id: number): FoodRow | undefined {
  const stmt = db.prepare("SELECT * FROM foods WHERE id = ?");
  const row = stmt.get(id) as FoodRow | undefined;
  return row;
}

export function listFoods(options: {
  search?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}): FoodRow[] {
  const { search, tag, limit = 50, offset = 0 } = options;
  const clauses: string[] = [];
  const params: any[] = [];

  if (search) {
    clauses.push("(name LIKE ? OR brand LIKE ? OR category LIKE ?)");
    const pattern = `%${search}%`;
    params.push(pattern, pattern, pattern);
  }

  if (tag) {
    // SQLite LIKE trên JSON string, đơn giản: %tag%
    clauses.push("tags LIKE ?");
    params.push(`%${tag}%`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const sql = `SELECT * FROM foods ${where} ORDER BY name LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const stmt = db.prepare(sql);
  const rows = stmt.all(...params) as FoodRow[];
  return rows;
}

export function updateFood(
  id: number,
  input: UpdateFoodInput
): FoodRow | undefined {
  const fields: string[] = [];
  const values: any[] = [];

  if (input.name !== undefined) {
    fields.push("name = ?");
    values.push(input.name);
  }
  if (input.brand !== undefined) {
    fields.push("brand = ?");
    values.push(input.brand ?? null);
  }
  if (input.category !== undefined) {
    fields.push("category = ?");
    values.push(input.category ?? null);
  }
  if (input.servingSize !== undefined) {
    fields.push("serving_size = ?");
    values.push(input.servingSize);
  }
  if (input.servingUnit !== undefined) {
    fields.push("serving_unit = ?");
    values.push(input.servingUnit);
  }
  if (input.calories !== undefined) {
    fields.push("calories = ?");
    values.push(input.calories);
  }
  if (input.protein !== undefined) {
    fields.push("protein = ?");
    values.push(input.protein);
  }
  if (input.carb !== undefined) {
    fields.push("carb = ?");
    values.push(input.carb);
  }
  if (input.fat !== undefined) {
    fields.push("fat = ?");
    values.push(input.fat);
  }
  if (input.fiber !== undefined) {
    fields.push("fiber = ?");
    values.push(input.fiber ?? null);
  }
  if (input.sugar !== undefined) {
    fields.push("sugar = ?");
    values.push(input.sugar ?? null);
  }
  if (input.sodium !== undefined) {
    fields.push("sodium = ?");
    values.push(input.sodium ?? null);
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
    return findFoodById(id);
  }

  const now = new Date().toISOString();
  fields.push("updated_at = ?");
  values.push(now, id);

  const sql = `UPDATE foods SET ${fields.join(", ")} WHERE id = ?`;
  const stmt = db.prepare(sql);
  stmt.run(...values);

  return findFoodById(id);
}

export function deleteFood(id: number): void {
  const stmt = db.prepare("DELETE FROM foods WHERE id = ?");
  stmt.run(id);
}
