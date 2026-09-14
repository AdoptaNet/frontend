"use client";

import React, { useEffect } from "react";
import { AppShell } from "@/shared/components/layouts/app-shell";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { mockAdopterUser } from "@/modules/users/mocks/mock-users";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, setUser, isHydrated } = useAuthStore();

  // In development/prototype mode: if no user is logged in, populate a default mock user
  useEffect(() => {
    if (isHydrated && !user) {
      setUser({
        id: mockAdopterUser.id,
        email: mockAdopterUser.email,
        fullName: mockAdopterUser.fullName,
        avatarUrl: mockAdopterUser.avatarUrl,
        role: mockAdopterUser.role,
        createdAt: mockAdopterUser.createdAt,
      });
    }
  }, [isHydrated, user, setUser]);

  return <AppShell>{children}</AppShell>;
}
