import * as React from "react";
import { GuestGuard } from "@/shared/components/guards/guest-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GuestGuard>
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background text-foreground py-12 px-4 selection:bg-accent selection:text-accent-foreground">
        {/* Subtle ambient lighting effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-3xl pointer-events-none rounded-full" />
        <div className="relative z-10 w-full">{children}</div>
      </div>
    </GuestGuard>
  );
}
