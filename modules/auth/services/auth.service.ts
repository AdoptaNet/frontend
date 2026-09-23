import { httpClient } from "@/shared/services/http-client";
import { API_ROUTES } from "@/shared/config/api-routes";
import type {
  AuthResponse,
  DeleteAccountDto,
  LoginDto,
  RegisterDto,
  RegisterResponse,
  ResetPasswordDto,
  User,
  UserRole,
} from "../models/auth.types";

export const authService = {
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    return httpClient.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, dto, {
      skipAuth: true,
    });
  },

  register: async (
    dto: RegisterDto,
    avatarFile?: File | null
  ): Promise<RegisterResponse> => {
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

      return httpClient.post<RegisterResponse>(
        API_ROUTES.AUTH.REGISTER,
        formData,
        {
          skipAuth: true,
        }
      );
    }

    return httpClient.post<RegisterResponse>(API_ROUTES.AUTH.REGISTER, dto, {
      skipAuth: true,
    });
  },

  verifyEmail: async (token: string): Promise<{ message: string }> => {
    return httpClient.post<{ message: string }>(
      API_ROUTES.AUTH.VERIFY_EMAIL,
      { token },
      { skipAuth: true }
    );
  },

  resendVerification: async (email: string): Promise<{ message: string }> => {
    return httpClient.post<{ message: string }>(
      API_ROUTES.AUTH.RESEND_VERIFICATION,
      { email },
      { skipAuth: true }
    );
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return httpClient.post<{ message: string }>(
      API_ROUTES.AUTH.FORGOT_PASSWORD,
      { email },
      { skipAuth: true }
    );
  },

  resetPassword: async (dto: ResetPasswordDto): Promise<{ message: string }> => {
    return httpClient.post<{ message: string }>(
      API_ROUTES.AUTH.RESET_PASSWORD,
      dto,
      { skipAuth: true }
    );
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

  selectRole: async (role: UserRole): Promise<AuthResponse> => {
    return httpClient.post<AuthResponse>(API_ROUTES.USERS.ROLE, { role });
  },

  deleteAccount: async (dto?: DeleteAccountDto): Promise<{ message: string }> => {
    return httpClient.delete<{ message: string }>(
      API_ROUTES.USERS.ME,
      dto ? { body: dto } : undefined
    );
  },
};
