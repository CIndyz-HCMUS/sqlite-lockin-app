CREATE TABLE IF NOT EXISTS relax_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,

  -- Tuỳ bạn: nếu sau này có bảng relax_methods thì dùng cột này làm FK
  relax_id INTEGER,
  method_name TEXT NOT NULL,          -- tên phương pháp thư giãn (thiền, nghe nhạc...)

  duration_min REAL NOT NULL,         -- thời lượng (phút)
  logged_at TEXT NOT NULL,            -- ISO datetime

  mood_before INTEGER,                -- 1-5 (tuỳ bạn quy ước)
  mood_after INTEGER,                 -- 1-5
  notes TEXT,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
