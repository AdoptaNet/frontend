"use client";

import * as React from "react";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  Clock,
  Loader2,
  Mail,
  RefreshCw,
} from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    token ? null : "No se proporcionó ningún token de verificación en el enlace."
  );
  const [resendEmail, setResendEmail] = useState("");
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        if (isMounted) {
          setStatus("success");
        }
      } catch (err) {
        if (isMounted) {
          setStatus("error");
          if (err instanceof ApiError) {
            setErrorMessage(err.message);
          } else {
            setErrorMessage("El enlace de verificación es inválido o ha expirado.");
          }
        }
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail || resendCooldown > 0) return;

    setIsResending(true);
    setResendSuccess(null);

    try {
      const res = await authService.resendVerification(resendEmail);
      setResendSuccess(res.message);
      setResendCooldown(120);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Error al reenviar el correo de verificación.");
      }
    } finally {
      setIsResending(false);
    }
  };

  if (status === "loading") {
    return (
      <AuthLayoutCard
        title="Verificando cuenta"
        subtitle="Por favor espera un momento mientras activamos tu acceso..."
        maxWidthClassName="max-w-md"
      >
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">
            Validando token criptográfico de seguridad...
          </p>
        </div>
      </AuthLayoutCard>
    );
  }

  if (status === "success") {
    return (
      <AuthLayoutCard
        title="¡Cuenta activada con éxito!"
        subtitle="Tu correo ha sido confirmado correctamente"
        maxWidthClassName="max-w-md"
      >
        <div className="space-y-6 text-center py-4">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="size-7" />
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Ya puedes iniciar sesión con tus credenciales y comenzar a utilizar
            Adoptanet.
          </p>

          <Link href="/login" className="block w-full">
            <Button className="w-full font-semibold">Iniciar Sesión</Button>
          </Link>
        </div>
      </AuthLayoutCard>
    );
  }

  return (
    <AuthLayoutCard
      title="Error de verificación"
      subtitle="No pudimos activar tu cuenta con este enlace"
      maxWidthClassName="max-w-md"
    >
      <div className="space-y-5">
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive"
        >
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">{errorMessage}</p>
        </div>

        {resendSuccess && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{resendSuccess}</span>
          </div>
        )}

        <form onSubmit={handleResend} className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="resend-email" className="text-xs font-medium">
              Ingresa tu correo para recibir un nuevo enlace (24h vigencia):
            </Label>
            <Input
              id="resend-email"
              type="email"
              placeholder="tu@correo.com"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              required
              disabled={isResending}
            />
          </div>

          <Button
            type="submit"
            variant="outline"
            disabled={isResending || resendCooldown > 0}
            className="w-full text-xs font-medium"
          >
            {resendCooldown > 0 ? (
              <>
                <Clock className="size-3.5 mr-2 animate-pulse" />
                <span>Reenviar en {resendCooldown}s</span>
              </>
            ) : isResending ? (
              <>
                <Loader2 className="size-3.5 mr-2 animate-spin" />
                <span>Enviando enlace...</span>
              </>
            ) : (
              <>
                <Mail className="size-3.5 mr-2" />
                <span>Reenviar enlace de activación</span>
              </>
            )}
          </Button>
        </form>

        <div className="pt-2 text-center">
          <Link
            href="/login"
            className="text-xs font-semibold text-primary underline-offset-4 hover:underline"
          >
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </AuthLayoutCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
