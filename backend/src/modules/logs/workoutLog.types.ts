export interface WorkoutLogRow {
  id: number;
  user_id: number;
  exercise_id: number;
  duration_min: number;
  intensity: string | null;
  logged_at: string;
  notes: string | null;
  calories_burned: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutLogDTO {
  id: number;
  userId: number;
  exerciseId: number;
  durationMin: number;
  intensity?: string | null;
  loggedAt: string;
  notes?: string | null;
  caloriesBurned: number;
  exercise?: {
    id: number;
    name: string;
    imageUrl?: string | null;
    category?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkoutLogInput {
  userId: number;
  exerciseId: number;
  durationMin: number;
  intensity?: string;
  loggedAt?: string;
  notes?: string;
}

export interface UpdateWorkoutLogInput {
  durationMin?: number;
  intensity?: string;
  loggedAt?: string;
  notes?: string | null;
  exerciseId?: number; // nếu cho phép đổi bài tập
}
