"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRegister } from "../hooks/useRegister";
import { AuthLayoutCard } from "./AuthLayoutCard";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { RoleSelector } from "./RoleSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Camera, Eye, EyeOff, Loader2, X } from "lucide-react";
import type { UserRole } from "../models/auth.types";

interface RegisterFormProps {
  initialRole?: UserRole;
}

export function RegisterForm({ initialRole }: RegisterFormProps) {
  const {
    form,
    onSubmit,
    isLoading,
    errorMessage,
    avatarPreview,
    handleAvatarChange,
  } = useRegister(initialRole);

  const [showPassword, setShowPassword] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentRole = watch("role");

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleAvatarChange(file);
  };

  const removeAvatar = () => {
    handleAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <AuthLayoutCard
      title="Crea tu cuenta"
      subtitle="Únete a Adoptanet y transforma vidas"
      maxWidthClassName="max-w-xl"
    >
      <div className="space-y-5">
        {/* Role Selector */}
        <div className="space-y-2.5">
          <Label className="text-xs font-semibold text-foreground tracking-wide">
            Tipo de cuenta
          </Label>
          <RoleSelector
            value={currentRole}
            onChange={(role) => setValue("role", role)}
          />
        </div>

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

        {/* Register Form */}
        <form onSubmit={onSubmit} className="space-y-4.5">
          {/* Avatar Upload (Optional) */}
          <div className="flex items-center gap-4 py-1">
            <div className="relative flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-border bg-secondary/50 overflow-hidden">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar preview"
                  width={56}
                  height={56}
                  className="size-full object-cover"
                />
              ) : (
                <Camera className="size-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={onFileSelected}
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs"
                >
                  {avatarPreview ? "Cambiar foto" : "Subir foto"}
                </Button>
                {avatarPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAvatar}
                    className="size-8 p-0 text-muted-foreground hover:text-destructive"
                    aria-label="Quitar foto"
                  >
                    <X className="size-4" />
                  </Button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Opcional. JPG, PNG o WEBP (máx. 5MB)
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="fullName">
              {currentRole === "shelter"
                ? "Nombre del albergue o encargado"
                : "Nombre completo"}
            </Label>
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder={
                currentRole === "shelter"
                  ? "Albergue Huellitas Felices"
                  : "María Ramos"
              }
              disabled={isLoading}
              aria-invalid={!!errors.fullName}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive font-medium pt-0.5">
                {errors.fullName.message}
              </p>
            )}
          </div>

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
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
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
                <span>Creando cuenta...</span>
              </>
            ) : (
              <span>Crear cuenta</span>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center pt-1">
          <div className="w-full border-t border-border" />
          <span className="absolute bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
            o regístrate con
          </span>
        </div>

        {/* Google OAuth Button at the bottom */}
        <GoogleLoginButton text="Registrarse con Google" />

        <p className="text-[11px] text-center text-muted-foreground leading-relaxed pt-1">
          Al registrarte, aceptas nuestras{" "}
          <Link
            href="/terms"
            className="font-medium text-foreground underline underline-offset-2 hover:text-primary transition-colors"
          >
            Condiciones del Servicio
          </Link>{" "}
          y{" "}
          <Link
            href="/privacy"
            className="font-medium text-foreground underline underline-offset-2 hover:text-primary transition-colors"
          >
            Política de Privacidad
          </Link>{" "}
          para el bienestar animal.
        </p>

        {/* Bottom Switch to Login */}
        <div className="pt-1 text-center text-xs text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Inicia sesión
          </Link>
        </div>
      </div>
    </AuthLayoutCard>
  );
}
