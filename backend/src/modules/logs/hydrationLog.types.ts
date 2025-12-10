export interface HydrationLogRow {
  id: number;
  user_id: number;
  amount_ml: number;
  logged_at: string;
  drink_date: string;
  source: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface HydrationLogDTO {
  id: number;
  userId: number;
  amountMl: number;
  loggedAt: string;
  drinkDate: string;
  source?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHydrationLogInput {
  userId: number;
  amountMl: number;
  loggedAt?: string;   // nếu không truyền, backend dùng now
  drinkDate?: string;  // nếu không truyền, lấy từ loggedAt
  source?: string;
  notes?: string;
}

export interface UpdateHydrationLogInput {
  amountMl?: number;
  loggedAt?: string;
  drinkDate?: string;
  source?: string | null;
  notes?: string | null;
}
