import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export function hashPassword(raw: string): string {
  return bcrypt.hashSync(raw, SALT_ROUNDS);
}

export function comparePassword(raw: string, hash: string): boolean {
  return bcrypt.compareSync(raw, hash);
}
