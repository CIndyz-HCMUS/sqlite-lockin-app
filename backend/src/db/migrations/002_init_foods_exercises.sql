-- Foods table
CREATE TABLE IF NOT EXISTS foods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,

  serving_size REAL NOT NULL,
  serving_unit TEXT NOT NULL,

  calories REAL NOT NULL,
  protein REAL NOT NULL,
  carb REAL NOT NULL,
  fat REAL NOT NULL,
  fiber REAL,
  sugar REAL,
  sodium REAL,

  image_url TEXT,
  tags TEXT,

  is_verified INTEGER NOT NULL DEFAULT 1,
  created_by_user INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (created_by_user) REFERENCES users(id)
);

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  intensity TEXT,
  calories_per_min REAL NOT NULL,

  image_url TEXT,
  tags TEXT,

  is_verified INTEGER NOT NULL DEFAULT 1,
  created_by_user INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (created_by_user) REFERENCES users(id)
);
