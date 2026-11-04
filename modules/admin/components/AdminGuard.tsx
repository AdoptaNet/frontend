"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { ShieldAlert } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated } = useAuthStore();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isHydrated) {
      if (!isAuthenticated) {
        router.replace(`/login?redirect=${encodeURIComponent("/admin/dashboard")}`);
      } else if (!isAdmin) {
        router.replace("/home");
      }
    }
  }, [isAuthenticated, isAdmin, isHydrated, router]);

  if (!isHydrated || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="size-8 animate-spin rounded-full border-3 border-verde-700 border-t-transparent" />
        <p className="text-xs text-tinta-500 font-medium">Verificando permisos de administración...</p>
      </div>
    );
  }

  return <>{children}</>;
}
