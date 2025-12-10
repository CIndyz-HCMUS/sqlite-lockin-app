export interface FoodRow {
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
  sugar: number | null;
  sodium: number | null;
  image_url: string | null;
  tags: string | null;
  is_verified: number;
  created_by_user: number | null;
  created_at: string;
  updated_at: string;
}

export interface FoodDTO {
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
  tags: string[];
  isVerified: boolean;
  createdByUser?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFoodInput {
  name: string;
  brand?: string;
  category?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carb: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  imageUrl?: string;
  tags?: string[];
  createdByUser?: number;
}

export interface UpdateFoodInput extends Partial<CreateFoodInput> {}
