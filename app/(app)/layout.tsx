"use client";

import React from "react";
import { AppShell } from "@/shared/components/layouts/app-shell";
import { AuthGuard } from "@/shared/components/guards/auth-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
