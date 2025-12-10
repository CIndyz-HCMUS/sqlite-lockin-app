CREATE TABLE IF NOT EXISTS sleep_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,

  start_time TEXT NOT NULL,      -- ISO datetime (khi bắt đầu ngủ)
  end_time TEXT NOT NULL,        -- ISO datetime (khi thức dậy)
  duration_min REAL NOT NULL,    -- tổng phút ngủ (backend tự tính)
  sleep_date TEXT NOT NULL,      -- ngày ghi nhận giấc ngủ (thường là ngày thức dậy, YYYY-MM-DD)

  quality INTEGER,               -- chất lượng giấc ngủ 1–5
  notes TEXT,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
