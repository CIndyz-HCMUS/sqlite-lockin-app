export interface MealLogRow {
  id: number;
  user_id: number;
  food_id: number;
  servings: number;
  meal_type: string | null;
  logged_at: string;
  notes: string | null;
  calories: number;
  protein: number;
  carb: number;
  fat: number;
  created_at: string;
  updated_at: string;
}

export interface MealLogDTO {
  id: number;
  userId: number;
  foodId: number;
  servings: number;
  mealType?: string | null;
  loggedAt: string;
  notes?: string | null;
  calories: number;
  protein: number;
  carb: number;
  fat: number;
  food?: {
    id: number;
    name: string;
    imageUrl?: string | null;
    servingUnit: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateMealLogInput {
  userId: number;
  foodId: number;
  servings: number;
  mealType?: string;
  loggedAt?: string; // nếu không gửi, backend dùng now
  notes?: string;
}

export interface UpdateMealLogInput {
  servings?: number;
  mealType?: string;
  loggedAt?: string;
  notes?: string | null;
  foodId?: number; // nếu sau này bạn cho phép đổi món
}
