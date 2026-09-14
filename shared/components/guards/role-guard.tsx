"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import type { UserRole } from "@/modules/auth/models/auth.types";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRole: UserRole;
  fallbackUrl?: string;
}

export function RoleGuard({
  children,
  allowedRole,
  fallbackUrl = "/home",
}: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (user?.role !== allowedRole) {
        router.replace(fallbackUrl || "/home");
      }
    }
  }, [user, isAuthenticated, isHydrated, allowedRole, fallbackUrl, router]);

  if (!isHydrated || !isAuthenticated || user?.role !== allowedRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
