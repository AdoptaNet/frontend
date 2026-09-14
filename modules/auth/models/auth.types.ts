export type UserRole = "adopter" | "shelter";

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
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

export interface ApiErrorResponse {
  statusCode: number;
  error?: string;
  message: string | string[];
  timestamp?: string;
  path?: string;
}
