export type UserRole = "adopter" | "shelter" | "admin";
export type RegisterRole = "adopter" | "shelter";

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  roleSelected?: boolean;
  hasPassword?: boolean;
  isEmailVerified?: boolean;
  createdAt: string;
  adopterProfile?: Record<string, unknown> | null;
  shelterProfile?: Record<string, unknown> | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
  role: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName?: string;
  role?: UserRole;
}

export interface VerifyEmailDto {
  token: string;
}

export interface ResendVerificationDto {
  email: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface DeleteAccountDto {
  password?: string;
  confirmation?: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  error?: string;
  message: string | string[];
  timestamp?: string;
  path?: string;
}
