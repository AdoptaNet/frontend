"use client";

import * as React from "react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayoutCard } from "@/modules/auth/components/AuthLayoutCard";
import { authService } from "@/modules/auth/services/auth.service";
import { ApiError } from "@/shared/services/http-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    token ? null : "Enlace no válido. Falta el token de restablecimiento."
  );
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (newPassword.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      await authService.resetPassword({
        token,
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login?passwordReset=true");
      }, 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(
          "El enlace es inválido o ha expirado. Por favor solicita uno nuevo."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayoutCard
      title="Restablecer contraseña"
      subtitle="Ingresa una nueva contraseña segura para tu cuenta"
      maxWidthClassName="max-w-xl"
    >
      {success ? (
        <div className="space-y-4 text-center py-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            <CheckCircle2 className="size-6" />
          </div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            ¡Contraseña restablecida!
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tu contraseña ha sido actualizada con éxito. Serás redirigido al
            inicio de sesión en unos momentos...
          </p>
          <div className="pt-4">
            <Link href="/login">
              <Button className="w-full">Ir a Iniciar Sesión</Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{errorMessage}</p>
            </div>
          )}

          <div className="space-y-2.5">
            <Label htmlFor="new-password">Nueva contraseña</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                required
                disabled={isLoading || !token}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Repite la contraseña"
              required
              disabled={isLoading || !token}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground leading-relaxed">
            Requisito: al menos 8 caracteres.
          </div>

          <Button
            type="submit"
            disabled={isLoading || !token}
            className="w-full font-semibold cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                <span>Actualizando contraseña...</span>
              </>
            ) : (
              <span>Guardar nueva contraseña</span>
            )}
          </Button>

          <div className="pt-2 text-center">
            <Link
              href="/recover"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ¿El enlace expiró? Solicitar uno nuevo
            </Link>
          </div>
        </form>
      )}
    </AuthLayoutCard>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
