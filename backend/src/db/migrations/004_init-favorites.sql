CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  item_type TEXT NOT NULL,     -- 'food' | 'exercise'
  item_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,

  UNIQUE(user_id, item_type, item_id),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
