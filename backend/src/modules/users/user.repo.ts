import { db } from "../../db";
import { CreateUserInput, UserRow } from "./user.types";

export function findUserByEmail(email: string): UserRow | undefined {
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  const row = stmt.get(email) as UserRow | undefined;
  return row;
}

export function findUserById(id: number): UserRow | undefined {
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  const row = stmt.get(id) as UserRow | undefined;
  return row;
}

export function createUser(input: CreateUserInput): UserRow {
  const now = new Date().toISOString();

  const stmt = db.prepare(
    `INSERT INTO users (
      email, password_hash, first_name, last_name,
      age, gender, height_cm, weight_kg,
      activity_level, goal_type, target_weight_kg,
      daily_calorie_adjustment, is_premium,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
  );

  const result = stmt.run(
    input.email,
    input.passwordHash,
    input.firstName,
    input.lastName,
    input.age ?? null,
    input.gender ?? null,
    input.heightCm ?? null,
    input.weightKg ?? null,
    input.activityLevel ?? null,
    input.goalType ?? null,
    input.targetWeightKg ?? null,
    input.dailyCalorieAdjustment ?? null,
    now,
    now
  );

  const newId = Number(result.lastInsertRowid);
  const newUser = findUserById(newId);
  if (!newUser) {
    throw new Error("Failed to fetch newly created user");
  }
  return newUser;
}
export function updateUser(
  id: number,
  data: Partial<UserRow>
): UserRow | undefined {
  const fields = Object.keys(data);
  if (fields.length === 0) return findUserById(id);

  const setClauses = fields.map((f) => `${f} = ?`).join(", ");
  const values = Object.values(data);
  const now = new Date().toISOString();

  const stmt = db.prepare(
    `UPDATE users SET ${setClauses}, updated_at = ? WHERE id = ?`
  );

  stmt.run(...values, now, id);

  return findUserById(id);
}
