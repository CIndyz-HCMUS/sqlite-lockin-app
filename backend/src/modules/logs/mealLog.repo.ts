import { db } from "../../db";
import { MealLogRow, MealLogDTO, CreateMealLogInput, UpdateMealLogInput } from "./mealLog.types";
import { FoodRow } from "../foods/food.types";

// helper: lấy food để tính dinh dưỡng
function getFoodById(foodId: number): FoodRow | undefined {
  const stmt = db.prepare("SELECT * FROM foods WHERE id = ?");
  return stmt.get(foodId) as FoodRow | undefined;
}

function computeNutrition(servings: number, food: FoodRow) {
  const factor = servings;
  return {
    calories: food.calories * factor,
    protein: food.protein * factor,
    carb: food.carb * factor,
    fat: food.fat * factor,
  };
}

export function toMealLogDTO(row: MealLogRow & {
  food_name?: string;
  food_image_url?: string | null;
  food_serving_unit?: string;
}): MealLogDTO {
  const dto: MealLogDTO = {
    id: row.id,
    userId: row.user_id,
    foodId: row.food_id,
    servings: row.servings,
    mealType: row.meal_type,
    loggedAt: row.logged_at,
    notes: row.notes ?? undefined,
    calories: row.calories,
    protein: row.protein,
    carb: row.carb,
    fat: row.fat,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (row.food_name) {
    dto.food = {
      id: row.food_id,
      name: row.food_name,
      imageUrl: row.food_image_url,
      servingUnit: row.food_serving_unit || "",
    };
  }

  return dto;
}

export function createMealLog(input: CreateMealLogInput): MealLogRow {
  const food = getFoodById(input.foodId);
  if (!food) {
    throw new Error("FOOD_NOT_FOUND");
  }

  const { calories, protein, carb, fat } = computeNutrition(
    input.servings,
    food
  );

  const now = new Date().toISOString();
  const loggedAt = input.loggedAt ?? now;

  const stmt = db.prepare(
    `INSERT INTO meal_logs (
      user_id, food_id, servings, meal_type, logged_at, notes,
      calories, protein, carb, fat,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const result = stmt.run(
    input.userId,
    input.foodId,
    input.servings,
    input.mealType ?? null,
    loggedAt,
    input.notes ?? null,
    calories,
    protein,
    carb,
    fat,
    now,
    now
  );

  const newId = Number(result.lastInsertRowid);
  return findMealLogById(newId)!;
}

export function findMealLogById(id: number): MealLogRow | undefined {
  const stmt = db.prepare("SELECT * FROM meal_logs WHERE id = ?");
  return stmt.get(id) as MealLogRow | undefined;
}

// danh sách cho 1 user, optional lọc theo date (YYYY-MM-DD)
export function listMealLogsForUser(
  userId: number,
  options: { date?: string }
): (MealLogRow & {
  food_name?: string;
  food_image_url?: string | null;
  food_serving_unit?: string;
})[] {
  const { date } = options;
  const params: any[] = [userId];
  let where = "WHERE ml.user_id = ?";

  if (date) {
    // logged_at bắt đầu bằng "YYYY-MM-DD"
    where += " AND substr(ml.logged_at, 1, 10) = ?";
    params.push(date);
  }

  const sql = `
    SELECT
      ml.*,
      f.name AS food_name,
      f.image_url AS food_image_url,
      f.serving_unit AS food_serving_unit
    FROM meal_logs ml
    JOIN foods f ON ml.food_id = f.id
    ${where}
    ORDER BY ml.logged_at ASC, ml.id ASC
  `;

  const stmt = db.prepare(sql);
  const rows = stmt.all(...params) as (MealLogRow & {
    food_name?: string;
    food_image_url?: string | null;
    food_serving_unit?: string;
  })[];

  return rows;
}

export function updateMealLog(
  id: number,
  userId: number,
  input: UpdateMealLogInput
): MealLogRow | undefined {
  const existing = findMealLogById(id);
  if (!existing || existing.user_id !== userId) {
    return undefined;
  }

  // Nếu đổi servings hoặc đổi food → cần tính lại dinh dưỡng
  let food = getFoodById(input.foodId ?? existing.food_id);
  if (!food) {
    throw new Error("FOOD_NOT_FOUND");
  }

  const servings = input.servings ?? existing.servings;
  const nutrition = computeNutrition(servings, food);

  const now = new Date().toISOString();

  const stmt = db.prepare(
    `UPDATE meal_logs SET
      food_id = ?,
      servings = ?,
      meal_type = ?,
      logged_at = ?,
      notes = ?,
      calories = ?,
      protein = ?,
      carb = ?,
      fat = ?,
      updated_at = ?
    WHERE id = ? AND user_id = ?`
  );

  stmt.run(
    input.foodId ?? existing.food_id,
    servings,
    input.mealType ?? existing.meal_type,
    input.loggedAt ?? existing.logged_at,
    input.notes ?? existing.notes,
    nutrition.calories,
    nutrition.protein,
    nutrition.carb,
    nutrition.fat,
    now,
    id,
    userId
  );

  return findMealLogById(id);
}

export function deleteMealLog(id: number, userId: number): boolean {
  const stmt = db.prepare("DELETE FROM meal_logs WHERE id = ? AND user_id = ?");
  const result = stmt.run(id, userId);
  return result.changes > 0;
}
