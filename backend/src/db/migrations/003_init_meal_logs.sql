CREATE TABLE IF NOT EXISTS meal_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  food_id INTEGER NOT NULL,

  servings REAL NOT NULL,            -- số khẩu phần: 0.5, 1, 2...
  meal_type TEXT,                    -- 'breakfast' | 'lunch' | 'dinner' | 'snack'
  logged_at TEXT NOT NULL,           -- ISO date-time string
  notes TEXT,

  calories REAL NOT NULL,
  protein REAL NOT NULL,
  carb REAL NOT NULL,
  fat REAL NOT NULL,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
);
