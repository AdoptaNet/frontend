"use client";

import { useAuthStore } from "../store/auth.store";
import { authService } from "../services/auth.service";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const { user, accessToken, isAuthenticated, isHydrated, logout: storeLogout } =
    useAuthStore();

  const handleLogout = async () => {
    await authService.logout();
    storeLogout();
    router.push("/login");
  };

  return {
    user,
    accessToken,
    isAuthenticated,
    isHydrated,
    isAdopter: user?.role === "adopter",
    isShelter: user?.role === "shelter",
    logout: handleLogout,
  };
}
