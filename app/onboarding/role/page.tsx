"use client";

import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/shared/components/guards/auth-guard";
import { AuthLayoutCard } from "@/modules/auth/components/AuthLayoutCard";
import { RoleSelector } from "@/modules/auth/components/RoleSelector";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { authService } from "@/modules/auth/services/auth.service";
import type { UserRole } from "@/modules/auth/models/auth.types";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { ApiError } from "@/shared/services/http-client";

function RoleOnboardingContent() {
  const router = useRouter();
  const { user, setAuth, isHydrated } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>("adopter");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Si el usuario ya confirmó su rol previamente, redirigir a /home
  useEffect(() => {
    if (isHydrated && user?.roleSelected) {
      router.replace("/home");
    }
  }, [isHydrated, user, router]);

  const handleConfirm = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await authService.selectRole(selectedRole);
      setAuth(response);
      router.replace("/home");
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Ocurrió un error al guardar tu rol. Por favor, intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background text-foreground py-12 px-4 selection:bg-accent selection:text-accent-foreground">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary/5 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 w-full">
        <AuthLayoutCard
          title="¿Cómo deseas participar?"
          subtitle="Elige tu rol para comenzar en Adoptanet. Esta selección se realiza una sola vez."
          maxWidthClassName="max-w-2xl"
        >
          <div className="space-y-6">
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive"
              >
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Selecciona una opción
              </label>
              <RoleSelector
                value={selectedRole}
                onChange={setSelectedRole}
              />
            </div>

            <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground leading-relaxed">
              💡 Podrás completar las preguntas específicas de tu perfil en cualquier momento desde tu panel.
            </div>

            <Button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="w-full font-semibold cursor-pointer"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  <span>Configurando tu cuenta...</span>
                </>
              ) : (
                <>
                  <span>
                    Continuar como {selectedRole === "shelter" ? "Albergue" : "Adoptante"}
                  </span>
                  <ArrowRight className="size-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </AuthLayoutCard>
      </div>
    </div>
  );
}

export default function RoleOnboardingPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          </div>
        }
      >
        <RoleOnboardingContent />
      </Suspense>
    </AuthGuard>
  );
}
