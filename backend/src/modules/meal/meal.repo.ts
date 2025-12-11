// backend/src/modules/meal/meal.repo.ts
import { db } from "../../db";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface CreateMealLogInput {
  userId: number;
  mealType: MealType;
  foodId: number;
  servings: number;      // số serving
  date: string;          // YYYY-MM-DD
}

export interface MealLogRow {
  id: number;
  user_id: number;
  meal_type: string;
  food_id: number;
  servings: number;
  calories: number;
  date: string;
  created_at: string;
  updated_at: string;
}

// Lấy calories của 1 serving từ bảng foods
function getCaloriesPerServing(foodId: number): number {
  const row = db
    .prepare("SELECT calories FROM foods WHERE id = ?")
    .get(foodId) as { calories?: number } | undefined;

  if (!row || row.calories == null) {
    throw new Error("Food not found");
  }
  return row.calories;
}

export function createMealLog(input: CreateMealLogInput): MealLogRow {
  const kcalPerServing = getCaloriesPerServing(input.foodId);
  const calories = kcalPerServing * input.servings;

  const now = new Date().toISOString();

  const stmt = db.prepare(
    `INSERT INTO meal_logs (
        user_id,
        meal_type,
        food_id,
        servings,
        calories,
        date,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const result = stmt.run(
    input.userId,
    input.mealType,
    input.foodId,
    input.servings,
    calories,
    input.date,
    now,
    now
  );

  const row = db
    .prepare("SELECT * FROM meal_logs WHERE id = ?")
    .get(result.lastInsertRowid) as MealLogRow;

  return row;
}

// DTO gửi ra cho frontend (camelCase)
export function toMealLogDTO(row: MealLogRow) {
  return {
    id: row.id,
    userId: row.user_id,
    mealType: row.meal_type,
    foodId: row.food_id,
    servings: row.servings,
    calories: row.calories,
    date: row.date,
  };
}
