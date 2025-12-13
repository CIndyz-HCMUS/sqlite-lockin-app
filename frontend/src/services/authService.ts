// src/services/authService.ts
import { apiRequest } from "./api";

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  age?: number | null;
  gender?: string | null;
  heightCm?: number | null;
  weightKg?: number | null;
  activityLevel?: string | null;
  goalType?: string | null;
  targetWeightKg?: number | null;
  dailyCalorieAdjustment?: number | null;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

/**
 * Gọi API login
 */
export async function loginApi(email: string, password: string) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Payload đăng kí: phần thông tin cơ bản + info ở màn Get Started
 */
export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  activityLevel?: string;
  goalType?: string;
  targetWeightKg?: number;
  dailyCalorieAdjustment?: number;
}

/**
 * Gọi API register
 */
export async function registerApi(payload: RegisterPayload) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
