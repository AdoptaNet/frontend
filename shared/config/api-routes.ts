export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    GOOGLE: "/auth/google",
    GOOGLE_CALLBACK: "/auth/google/callback",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFICATION: "/auth/resend-verification",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USERS: {
    ME: "/users/me",
    AVATAR: "/users/me/avatar",
    PASSWORD: "/users/change-password",
    PASSWORD_LEGACY: "/users/me/password",
    ADOPTER_PROFILE: "/users/me/adopter-profile",
    SHELTER_PROFILE: "/users/me/shelter-profile",
    ROLE: "/users/select-role",
    ROLE_LEGACY: "/users/me/role",
  },
  PETS: {
    BASE: "/pets",
    MY_PETS: "/pets/my-pets",
    BY_ID: (id: string) => `/pets/${id}`,
    STATUS: (id: string) => `/pets/${id}/status`,
  },
  MEDIA: {
    UPLOAD: "/media/upload",
    DELETE: "/media",
  },
  SHELTERS: {
    BY_ID: (id: string) => `/shelters/${id}`,
    VERIFY: (id: string) => `/shelters/${id}/verify`,
    ADMIN_VERIFY: (id: string) => `/admin/shelters/${id}/verify`,
  },
} as const;
