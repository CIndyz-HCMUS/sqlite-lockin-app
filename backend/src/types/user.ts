export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface PublicUser {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
}
