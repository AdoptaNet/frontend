export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    GOOGLE: "/auth/google",
    GOOGLE_CALLBACK: "/auth/google/callback",
  },
  USERS: {
    ME: "/users/me",
    AVATAR: "/users/me/avatar",
    PASSWORD: "/users/me/password",
    ADOPTER_PROFILE: "/users/me/adopter-profile",
    SHELTER_PROFILE: "/users/me/shelter-profile",
    ROLE: "/users/me/role",
  },
} as const;

