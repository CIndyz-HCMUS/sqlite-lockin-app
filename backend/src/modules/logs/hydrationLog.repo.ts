import { db } from "../../db";
import {
  CreateHydrationLogInput,
  HydrationLogDTO,
  HydrationLogRow,
  UpdateHydrationLogInput,
} from "./hydrationLog.types";

function inferDrinkDate(loggedAt: string): string {
  return new Date(loggedAt).toISOString().slice(0, 10); // YYYY-MM-DD
}

export function toHydrationLogDTO(row: HydrationLogRow): HydrationLogDTO {
  return {
    id: row.id,
    userId: row.user_id,
    amountMl: row.amount_ml,
    loggedAt: row.logged_at,
    drinkDate: row.drink_date,
    source: row.source ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}


export function createHydrationLog(
  input: CreateHydrationLogInput
): HydrationLogRow {
  const now = new Date().toISOString();
  const loggedAt = input.loggedAt ?? now;
  const drinkDate = input.drinkDate ?? inferDrinkDate(loggedAt);

  const stmt = db.prepare(
    `INSERT INTO hydration_logs (
      user_id, amount_ml, logged_at, drink_date,
      source, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const result = stmt.run(
    input.userId,
    input.amountMl,
    loggedAt,
    drinkDate,
    input.source ?? null,
    input.notes ?? null,
    now,
    now
  );

  const newId = Number(result.lastInsertRowid);
  return findHydrationLogById(newId)!;
}

export function findHydrationLogById(
  id: number
): HydrationLogRow | undefined {
  const stmt = db.prepare("SELECT * FROM hydration_logs WHERE id = ?");
  return stmt.get(id) as HydrationLogRow | undefined;
}

export function listHydrationLogsForUser(
  userId: number,
  options: { date?: string }
): HydrationLogRow[] {
  const { date } = options;
  const params: any[] = [userId];
  let where = "WHERE user_id = ?";

  if (date) {
    where += " AND drink_date = ?";
    params.push(date);
  }

  const sql = `
    SELECT *
    FROM hydration_logs
    ${where}
    ORDER BY logged_at ASC, id ASC
  `;

  const stmt = db.prepare(sql);
  return stmt.all(...params) as HydrationLogRow[];
}

export function updateHydrationLog(
  id: number,
  userId: number,
  input: UpdateHydrationLogInput
): HydrationLogRow | undefined {
  const existing = findHydrationLogById(id);
  if (!existing || existing.user_id !== userId) {
    return undefined;
  }

  const fields: string[] = [];
  const values: any[] = [];

  if (input.amountMl !== undefined) {
    fields.push("amount_ml = ?");
    values.push(input.amountMl);
  }
  if (input.loggedAt !== undefined) {
    fields.push("logged_at = ?");
    values.push(input.loggedAt);

    // nếu không truyền drinkDate nhưng đổi loggedAt thì nên update drink_date
    if (input.drinkDate === undefined) {
      const inferred = inferDrinkDate(input.loggedAt);
      fields.push("drink_date = ?");
      values.push(inferred);
    }
  }
  if (input.drinkDate !== undefined) {
    fields.push("drink_date = ?");
    values.push(input.drinkDate);
  }
  if (input.source !== undefined) {
    fields.push("source = ?");
    values.push(input.source);
  }
  if (input.notes !== undefined) {
    fields.push("notes = ?");
    values.push(input.notes);
  }

  if (!fields.length) {
    return existing;
  }

  const now = new Date().toISOString();
  fields.push("updated_at = ?");
  values.push(now, id, userId);

  const sql = `UPDATE hydration_logs SET ${fields.join(
    ", "
  )} WHERE id = ? AND user_id = ?`;

  const stmt = db.prepare(sql);
  stmt.run(...values);

  return findHydrationLogById(id);
}

export function deleteHydrationLog(
  id: number,
  userId: number
): boolean {
  const stmt = db.prepare(
    "DELETE FROM hydration_logs WHERE id = ? AND user_id = ?"
  );
  const result = stmt.run(id, userId);
  return result.changes > 0;
}
