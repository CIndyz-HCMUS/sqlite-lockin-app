import { findUserById } from "./user.repo";
import { UserRow } from "./user.types";

export function sanitizeUser(user: UserRow) {
  const { password_hash, ...rest } = user;
  return {
    ...rest,
    is_premium: !!rest.is_premium,
  };
}

export function getUserByIdPublic(id: number) {
  const user = findUserById(id);
  if (!user) return null;
  return sanitizeUser(user);
}
