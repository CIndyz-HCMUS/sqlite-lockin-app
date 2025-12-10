import { db } from "../../db";
import {
  CreateSleepLogInput,
  SleepLogDTO,
  SleepLogRow,
  UpdateSleepLogInput,
} from "./sleepLog.types";

function calcDurationMinutes(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const diffMs = end - start;
  // nếu user nhập ngược thì cho 0
  if (!isFinite(diffMs) || diffMs <= 0) return 0;
  return diffMs / 1000 / 60;
}

function inferSleepDate(endTime: string): string {
  // lấy YYYY-MM-DD từ endTime
  return new Date(endTime).toISOString().slice(0, 10);
}

export function toSleepLogDTO(row: SleepLogRow): SleepLogDTO {
  return {
    id: row.id,
    userId: row.user_id,
    startTime: row.start_time,
    endTime: row.end_time,
    durationMin: row.duration_min,
    sleepDate: row.sleep_date,
    quality: row.quality ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createSleepLog(input: CreateSleepLogInput): SleepLogRow {
  const durationMin = calcDurationMinutes(input.startTime, input.endTime);
  const sleepDate = input.sleepDate ?? inferSleepDate(input.endTime);
  const now = new Date().toISOString();

  const stmt = db.prepare(
    `INSERT INTO sleep_logs (
      user_id, start_time, end_time, duration_min, sleep_date,
      quality, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const result = stmt.run(
    input.userId,
    input.startTime,
    input.endTime,
    durationMin,
    sleepDate,
    input.quality ?? null,
    input.notes ?? null,
    now,
    now
  );

  const newId = Number(result.lastInsertRowid);
  return findSleepLogById(newId)!;
}

export function findSleepLogById(id: number): SleepLogRow | undefined {
  const stmt = db.prepare("SELECT * FROM sleep_logs WHERE id = ?");
  return stmt.get(id) as SleepLogRow | undefined;
}

export function listSleepLogsForUser(
  userId: number,
  options: { date?: string }
): SleepLogRow[] {
  const { date } = options;
  const params: any[] = [userId];
  let where = "WHERE user_id = ?";

  if (date) {
    where += " AND sleep_date = ?";
    params.push(date);
  }

  const sql = `
    SELECT *
    FROM sleep_logs
    ${where}
    ORDER BY start_time ASC, id ASC
  `;

  const stmt = db.prepare(sql);
  return stmt.all(...params) as SleepLogRow[];
}

export function updateSleepLog(
  id: number,
  userId: number,
  input: UpdateSleepLogInput
): SleepLogRow | undefined {
  const existing = findSleepLogById(id);
  if (!existing || existing.user_id !== userId) {
    return undefined;
  }

  // dùng giá trị mới nếu có, nếu không dùng cũ
  const startTime = input.startTime ?? existing.start_time;
  const endTime = input.endTime ?? existing.end_time;
  const durationMin = calcDurationMinutes(startTime, endTime);
  const sleepDate = input.sleepDate ?? existing.sleep_date;

  const fields: string[] = [];
  const values: any[] = [];

  if (input.startTime !== undefined) {
    fields.push("start_time = ?");
    values.push(startTime);
  }
  if (input.endTime !== undefined) {
    fields.push("end_time = ?");
    values.push(endTime);
  }
  // luôn update duration & sleep_date nếu thời gian đổi
  fields.push("duration_min = ?");
  values.push(durationMin);

  if (input.sleepDate !== undefined) {
    fields.push("sleep_date = ?");
    values.push(sleepDate);
  }

  if (input.quality !== undefined) {
    fields.push("quality = ?");
    values.push(input.quality);
  }

  if (input.notes !== undefined) {
    fields.push("notes = ?");
    values.push(input.notes);
  }

  const now = new Date().toISOString();
  fields.push("updated_at = ?");
  values.push(now, id, userId);

  const sql = `UPDATE sleep_logs SET ${fields.join(
    ", "
  )} WHERE id = ? AND user_id = ?`;
  const stmt = db.prepare(sql);
  stmt.run(...values);

  return findSleepLogById(id);
}

export function deleteSleepLog(id: number, userId: number): boolean {
  const stmt = db.prepare(
    "DELETE FROM sleep_logs WHERE id = ? AND user_id = ?"
  );
  const result = stmt.run(id, userId);
  return result.changes > 0;
}
