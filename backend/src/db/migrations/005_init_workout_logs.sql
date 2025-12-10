CREATE TABLE IF NOT EXISTS workout_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  exercise_id INTEGER NOT NULL,

  duration_min REAL NOT NULL,      -- thời lượng tập (phút)
  intensity TEXT,                  -- optional: 'low' | 'moderate' | 'high'
  logged_at TEXT NOT NULL,         -- ISO datetime
  notes TEXT,

  calories_burned REAL NOT NULL,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);
