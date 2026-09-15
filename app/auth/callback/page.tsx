"use client";

import * as React from "react";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { authService } from "@/modules/auth/services/auth.service";
import { PawPrint, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokens, setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    const processOAuth = async () => {
      if (!accessToken || !refreshToken) {
        setError("No se recibieron los tokens de autenticación de Google.");
        return;
      }

      try {
        setTokens({ accessToken, refreshToken });


        // Retrieve current user profile
        const user = await authService.getMe();
        setUser(user);
        router.replace("/home");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al sincronizar tu sesión de Google."
        );
      }
    };

    processOAuth();
  }, [searchParams, setTokens, setUser, router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="size-6" />
        </div>
        <h1 className="font-heading text-xl font-bold text-foreground">
          Error en la autenticación
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
          {error}
        </p>
        <Link href="/login" className="mt-6">
          <Button variant="default">Volver a intentar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm animate-pulse mb-6">
        <PawPrint className="size-6 fill-current" />
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Loader2 className="size-4 animate-spin text-primary" />
        <span>Iniciando sesión con Google...</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Estamos preparando tu experiencia en Adoptanet
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
