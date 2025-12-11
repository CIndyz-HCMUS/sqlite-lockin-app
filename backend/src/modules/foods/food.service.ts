// backend/src/modules/food/food.service.ts
import { db } from "../../db";

export interface Food {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein: number;
  carb: number;
  fat: number;
  fiber: number | null;
  image_url: string | null;
}

export function listFoods(search?: string): Food[] {
  const baseSql = `
    SELECT
      id,
      name,
      brand,
      category,
      serving_size,
      serving_unit,
      calories,
      protein,
      carb,
      fat,
      fiber,
      image_url
    FROM foods
  `;

  if (search && search.trim() !== "") {
    const term = `%${search.trim().toLowerCase()}%`;
    const stmt = db.prepare<unknown[], Food>(
      baseSql + " WHERE lower(name) LIKE ? ORDER BY name LIMIT 100"
    );
    return stmt.all(term) as Food[];
  }

  const stmt = db.prepare<unknown[], Food>(
    baseSql + " ORDER BY name LIMIT 100"
  );
  return stmt.all() as Food[];
}
