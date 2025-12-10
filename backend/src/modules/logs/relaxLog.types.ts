export interface RelaxLogRow {
  id: number;
  user_id: number;
  relax_id: number | null;
  method_name: string;
  duration_min: number;
  logged_at: string;
  mood_before: number | null;
  mood_after: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RelaxLogDTO {
  id: number;
  userId: number;
  relaxId?: number | null;
  methodName: string;
  durationMin: number;
  loggedAt: string;
  moodBefore?: number | null;
  moodAfter?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRelaxLogInput {
  userId: number;
  methodName: string;
  durationMin: number;
  loggedAt?: string;
  moodBefore?: number;
  moodAfter?: number;
  notes?: string;
  relaxId?: number; // sau này liên kết với bảng relax master nếu muốn
}

export interface UpdateRelaxLogInput {
  methodName?: string;
  durationMin?: number;
  loggedAt?: string;
  moodBefore?: number | null;
  moodAfter?: number | null;
  notes?: string | null;
  relaxId?: number | null;
}
