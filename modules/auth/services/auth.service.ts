import { httpClient } from "@/shared/services/http-client";
import { API_ROUTES } from "@/shared/config/api-routes";
import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  User,
} from "../models/auth.types";

export const authService = {
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    return httpClient.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, dto, {
      skipAuth: true,
    });
  },

  register: async (dto: RegisterDto, avatarFile?: File | null): Promise<AuthResponse> => {
    if (avatarFile) {
      const formData = new FormData();
      formData.append("email", dto.email);
      formData.append("password", dto.password);
      if (dto.fullName) {
        formData.append("fullName", dto.fullName);
      }
      if (dto.role) {
        formData.append("role", dto.role);
      }
      formData.append("avatar", avatarFile);

      return httpClient.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, formData, {
        skipAuth: true,
      });
    }

    return httpClient.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, dto, {
      skipAuth: true,
    });
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return httpClient.post<AuthResponse>(
      API_ROUTES.AUTH.REFRESH,
      { refreshToken },
      { skipAuth: true }
    );
  },

  logout: async (): Promise<void> => {
    try {
      await httpClient.post(API_ROUTES.AUTH.LOGOUT);
    } catch {
      // Even if network or server errors on logout, we continue client-side cleanup
    }
  },

  getMe: async (): Promise<User> => {
    return httpClient.get<User>(API_ROUTES.USERS.ME);
  },
};
