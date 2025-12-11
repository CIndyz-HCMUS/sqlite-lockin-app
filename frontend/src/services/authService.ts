// src/services/authService.ts
import { apiRequest } from "./api";

export interface AuthUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  // ... nếu backend trả thêm gì thì bổ sung sau
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}

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

export async function loginApi(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(
  payload: RegisterPayload
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
