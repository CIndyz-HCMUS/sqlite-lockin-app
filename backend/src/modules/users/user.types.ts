export type Gender = "male" | "female";

export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  age: number | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: string | null;
  goal_type: string | null;
  target_weight_kg: number | null;
  daily_calorie_adjustment: number | null;
  is_premium: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  activityLevel?: string;
  goalType?: string;
  targetWeightKg?: number;
  dailyCalorieAdjustment?: number;
}
