import { db } from "../../db";
import { CreateFavoriteInput, FavoriteDTO, FavoriteItemType, FavoriteRow } from "./favorite.types";
import { FoodRow } from "../foods/food.types";
import { ExerciseRow } from "../exercises/exercise.types";

function toDTO(row: FavoriteRow): FavoriteDTO {
  return {
    id: row.id,
    userId: row.user_id,
    itemType: row.item_type as FavoriteItemType,
    itemId: row.item_id,
    createdAt: row.created_at,
  };
}

export function createFavorite(input: CreateFavoriteInput): FavoriteRow {
  const now = new Date().toISOString();

  // đảm bảo không trùng (UNIQUE cũng check, nhưng mình có thể bắt lỗi đẹp hơn)
  const existing = findFavoriteByUserAndItem(input.userId, input.itemType, input.itemId);
  if (existing) {
    return existing;
  }

  const stmt = db.prepare(
    `INSERT INTO favorites (user_id, item_type, item_id, created_at)
     VALUES (?, ?, ?, ?)`
  );

  const result = stmt.run(input.userId, input.itemType, input.itemId, now);
  const newId = Number(result.lastInsertRowid);
  return findFavoriteById(newId)!;
}

export function findFavoriteById(id: number): FavoriteRow | undefined {
  const stmt = db.prepare("SELECT * FROM favorites WHERE id = ?");
  return stmt.get(id) as FavoriteRow | undefined;
}

export function findFavoriteByUserAndItem(
  userId: number,
  itemType: FavoriteItemType,
  itemId: number
): FavoriteRow | undefined {
  const stmt = db.prepare(
    "SELECT * FROM favorites WHERE user_id = ? AND item_type = ? AND item_id = ?"
  );
  return stmt.get(userId, itemType, itemId) as FavoriteRow | undefined;
}

// xoá, chỉ xoá nếu thuộc về user đó
export function deleteFavorite(id: number, userId: number): boolean {
  const stmt = db.prepare("DELETE FROM favorites WHERE id = ? AND user_id = ?");
  const result = stmt.run(id, userId);
  return result.changes > 0;
}

// Lấy danh sách favorites + join với foods/exercises để có thông tin item
export function listFavoritesWithItems(
  userId: number,
  itemType?: FavoriteItemType
): FavoriteDTO[] {
  const favoritesStmt = itemType
    ? db.prepare("SELECT * FROM favorites WHERE user_id = ? AND item_type = ? ORDER BY created_at DESC")
    : db.prepare("SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC");

  const rows = itemType
    ? (favoritesStmt.all(userId, itemType) as FavoriteRow[])
    : (favoritesStmt.all(userId) as FavoriteRow[]);

  const result: FavoriteDTO[] = [];

  for (const row of rows) {
    const dto = toDTO(row);

    if (row.item_type === "food") {
      const food = findFoodById(row.item_id);
      if (food) {
        dto.item = {
          id: food.id,
          name: food.name,
          imageUrl: food.image_url,
          tags: food.tags ? (JSON.parse(food.tags) as string[]) : [],
          type: "food",
        };
      }
    } else if (row.item_type === "exercise") {
      const ex = findExerciseById(row.item_id);
      if (ex) {
        dto.item = {
          id: ex.id,
          name: ex.name,
          imageUrl: ex.image_url,
          tags: ex.tags ? (JSON.parse(ex.tags) as string[]) : [],
          type: "exercise",
        };
      }
    }

    result.push(dto);
  }

  return result;
}

// helper: lấy food
function findFoodById(id: number): FoodRow | undefined {
  const stmt = db.prepare("SELECT * FROM foods WHERE id = ?");
  return stmt.get(id) as FoodRow | undefined;
}

// helper: lấy exercise
function findExerciseById(id: number): ExerciseRow | undefined {
  const stmt = db.prepare("SELECT * FROM exercises WHERE id = ?");
  return stmt.get(id) as ExerciseRow | undefined;
}
