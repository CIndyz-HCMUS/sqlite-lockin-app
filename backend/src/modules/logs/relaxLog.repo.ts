import { db } from "../../db";
import {
  CreateRelaxLogInput,
  RelaxLogDTO,
  RelaxLogRow,
  UpdateRelaxLogInput,
} from "./relaxLog.types";

export function toRelaxLogDTO(row: RelaxLogRow): RelaxLogDTO {
  return {
    id: row.id,
    userId: row.user_id,
    relaxId: row.relax_id ?? undefined,
    methodName: row.method_name,
    durationMin: row.duration_min,
    loggedAt: row.logged_at,
    moodBefore: row.mood_before ?? undefined,
    moodAfter: row.mood_after ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createRelaxLog(input: CreateRelaxLogInput): RelaxLogRow {
  const now = new Date().toISOString();
  const loggedAt = input.loggedAt ?? now;

  const stmt = db.prepare(
    `INSERT INTO relax_logs (
      user_id, relax_id, method_name,
      duration_min, logged_at,
      mood_before, mood_after, notes,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const result = stmt.run(
    input.userId,
    input.relaxId ?? null,
    input.methodName,
    input.durationMin,
    loggedAt,
    input.moodBefore ?? null,
    input.moodAfter ?? null,
    input.notes ?? null,
    now,
    now
  );

  const newId = Number(result.lastInsertRowid);
  return findRelaxLogById(newId)!;
}

export function findRelaxLogById(id: number): RelaxLogRow | undefined {
  const stmt = db.prepare("SELECT * FROM relax_logs WHERE id = ?");
  return stmt.get(id) as RelaxLogRow | undefined;
}

export function listRelaxLogsForUser(
  userId: number,
  options: { date?: string }
): RelaxLogRow[] {
  const { date } = options;
  const params: any[] = [userId];
  let where = "WHERE user_id = ?";

  if (date) {
    // logged_at bắt đầu bằng 'YYYY-MM-DD'
    where += " AND substr(logged_at, 1, 10) = ?";
    params.push(date);
  }

  const sql = `
    SELECT *
    FROM relax_logs
    ${where}
    ORDER BY logged_at ASC, id ASC
  `;

  const stmt = db.prepare(sql);
  return stmt.all(...params) as RelaxLogRow[];
}

export function updateRelaxLog(
  id: number,
  userId: number,
  input: UpdateRelaxLogInput
): RelaxLogRow | undefined {
  const existing = findRelaxLogById(id);
  if (!existing || existing.user_id !== userId) {
    return undefined;
  }

  const fields: string[] = [];
  const values: any[] = [];

  if (input.methodName !== undefined) {
    fields.push("method_name = ?");
    values.push(input.methodName);
  }
  if (input.durationMin !== undefined) {
    fields.push("duration_min = ?");
    values.push(input.durationMin);
  }
  if (input.loggedAt !== undefined) {
    fields.push("logged_at = ?");
    values.push(input.loggedAt);
  }
  if (input.moodBefore !== undefined) {
    fields.push("mood_before = ?");
    values.push(input.moodBefore);
  }
  if (input.moodAfter !== undefined) {
    fields.push("mood_after = ?");
    values.push(input.moodAfter);
  }
  if (input.notes !== undefined) {
    fields.push("notes = ?");
    values.push(input.notes);
  }
  if (input.relaxId !== undefined) {
    fields.push("relax_id = ?");
    values.push(input.relaxId);
  }

  if (!fields.length) {
    return existing;
  }

  const now = new Date().toISOString();
  fields.push("updated_at = ?");
  values.push(now, id, userId);

  const sql = `UPDATE relax_logs SET ${fields.join(
    ", "
  )} WHERE id = ? AND user_id = ?`;

  const stmt = db.prepare(sql);
  stmt.run(...values);

  return findRelaxLogById(id);
}

export function deleteRelaxLog(id: number, userId: number): boolean {
  const stmt = db.prepare(
    "DELETE FROM relax_logs WHERE id = ? AND user_id = ?"
  );
  const result = stmt.run(id, userId);
  return result.changes > 0;
}
