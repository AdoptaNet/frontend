"use client";

import * as React from "react";
import Link from "next/link";
import { useLogin } from "../hooks/useLogin";
import { AuthLayoutCard } from "./AuthLayoutCard";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm() {
  const { form, onSubmit, isLoading, errorMessage } = useLogin();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <AuthLayoutCard
      title="Bienvenido de vuelta"
      subtitle="Ingresa a tu cuenta para continuar"
      maxWidthClassName="max-w-xl"
    >
      <div className="space-y-5">
        {/* Backend Error Alert */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive"
          >
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {/* Email / Password Form */}
        <form onSubmit={onSubmit} className="space-y-4.5">
          <div className="space-y-2.5">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              disabled={isLoading}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive font-medium pt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link
                href="/recover"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={isLoading}
                aria-invalid={!!errors.password}
                className="pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive font-medium pt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full font-semibold mt-2"
            size="default"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <span>Ingresar</span>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center pt-1">
          <div className="w-full border-t border-border" />
          <span className="absolute bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
            o continúa con
          </span>
        </div>

        {/* Google OAuth Button at the bottom */}
        <GoogleLoginButton text="Continuar con Google" />

        {/* Bottom Switch to Register */}
        <div className="pt-1 text-center text-xs text-muted-foreground">
          ¿Aún no tienes una cuenta?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Crear cuenta
          </Link>
        </div>

        {/* Legal notice for OAuth compliance */}
        <p className="text-[11px] text-center text-muted-foreground leading-relaxed pt-0.5">
          Al iniciar sesión, aceptas nuestras{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Condiciones del Servicio
          </Link>{" "}
          y{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Política de Privacidad
          </Link>
          .
        </p>
      </div>
    </AuthLayoutCard>
  );
}
