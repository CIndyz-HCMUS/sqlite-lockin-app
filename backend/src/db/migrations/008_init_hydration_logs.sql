CREATE TABLE IF NOT EXISTS hydration_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,

  amount_ml REAL NOT NULL,        -- lượng nước uống (ml)
  logged_at TEXT NOT NULL,        -- thời điểm uống (ISO datetime)
  drink_date TEXT NOT NULL,       -- ngày dùng để query (YYYY-MM-DD)

  source TEXT,                    -- optional: water, tea, coffee...
  notes TEXT,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
