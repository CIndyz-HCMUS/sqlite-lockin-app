export interface SleepLogRow {
  id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  duration_min: number;
  sleep_date: string;
  quality: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SleepLogDTO {
  id: number;
  userId: number;
  startTime: string;
  endTime: string;
  durationMin: number;
  sleepDate: string;
  quality?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSleepLogInput {
  userId: number;
  startTime: string;            // ISO string
  endTime: string;              // ISO string
  sleepDate?: string;           // nếu không truyền, backend lấy từ endTime
  quality?: number;
  notes?: string;
}

export interface UpdateSleepLogInput {
  startTime?: string;
  endTime?: string;
  sleepDate?: string;
  quality?: number | null;
  notes?: string | null;
}
