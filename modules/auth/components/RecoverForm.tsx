"use client";

import * as React from "react";
import Link from "next/link";
import { AuthLayoutCard } from "./AuthLayoutCard";
import { authService } from "../services/auth.service";
import { ApiError } from "@/shared/services/http-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

export function RecoverForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setErrorMessage(null);
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("No se pudo conectar con el servidor. Revisa tu conexión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayoutCard
      title="Recuperar contraseña"
      subtitle="Te enviaremos instrucciones para restablecer tu acceso"
      maxWidthClassName="max-w-xl"
    >
      {submitted ? (
        <div className="space-y-4 text-center py-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            <CheckCircle2 className="size-6" />
          </div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            Correo enviado
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Si existe una cuenta asociada a{" "}
            <strong className="text-foreground">{email}</strong>, recibirás un
            enlace para restablecer tu contraseña con una vigencia de{" "}
            <strong>30 minutos</strong>.
          </p>
          <div className="pt-4">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Volver a iniciar sesión
              </Button>
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
            <Label htmlFor="recover-email">Correo electrónico registrado</Label>
            <Input
              id="recover-email"
              type="email"
              placeholder="tu@correo.com"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full font-semibold cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                <span>Enviando enlace...</span>
              </>
            ) : (
              <span>Enviar enlace de recuperación</span>
            )}
          </Button>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Volver a iniciar sesión</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayoutCard>
  );
}
