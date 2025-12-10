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

export interface ExerciseDTO {
  id: number;
  name: string;
  category?: string | null;
  intensity?: string | null;
  caloriesPerMin: number;
  imageUrl?: string | null;
  tags: string[];
  isVerified: boolean;
  createdByUser?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExerciseInput {
  name: string;
  category?: string;
  intensity?: string; // 'low' | 'moderate' | 'high'
  caloriesPerMin: number;
  imageUrl?: string;
  tags?: string[];
  createdByUser?: number;
}

export interface UpdateExerciseInput extends Partial<CreateExerciseInput> {}
