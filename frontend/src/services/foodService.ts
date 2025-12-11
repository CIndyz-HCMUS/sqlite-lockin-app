// frontend/src/services/foodService.ts
import { apiRequest } from "./api";

export interface FoodDto {
  id: number;
  name: string;
  brand?: string | null;
  category?: string | null;

  servingSize: number;
  servingUnit: string;

  calories: number;
  protein: number;
  carb: number;
  fat: number;
  fiber?: number | null;
  sugar?: number | null;
  sodium?: number | null;

  imageUrl?: string | null;
  tags?: string | null;
}

interface FoodsResponse {
  items: FoodDto[];
}

/**
 * Gọi GET /foods?search=&tag=&limit=&offset=
 * theo đúng router bạn đã viết:
 *   return res.json({ items: foods });
 */
export async function fetchFoods(search?: string): Promise<FoodDto[]> {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  // nếu sau này bạn muốn dùng tag/limit/offset thì set thêm ở đây

  const qs = params.toString() ? `?${params.toString()}` : "";
  const res = await apiRequest<FoodsResponse>(`/foods${qs}`, {
    method: "GET",
  });

  return res.items;
}
