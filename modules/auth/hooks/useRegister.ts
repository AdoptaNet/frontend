"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../services/auth.service";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schemas";
import { ApiError } from "@/shared/services/http-client";
import type { UserRole } from "../models/auth.types";

export function useRegister(initialRole?: UserRole) {
  const searchParams = useSearchParams();

  const queryRole = (searchParams.get("role") || searchParams.get("rol")) as UserRole | null;
  const effectiveRole: UserRole =
    initialRole || (queryRole === "shelter" ? "shelter" : "adopter");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Rate limiting local timer for resend
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: effectiveRole,
    },
  });

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    } else {
      setAvatarPreview(null);
    }
  };

  const onSubmit = async (values: RegisterFormData) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await authService.register(
        {
          email: values.email,
          password: values.password,
          fullName: values.fullName?.trim() ? values.fullName.trim() : undefined,
          role: values.role,
        },
        avatarFile
      );

      setIsRegistered(true);
      setRegisteredEmail(response.email || values.email);
      setSuccessMessage(response.message);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 409 || err.errorName?.includes("AlreadyInUse")) {
          setErrorMessage("Este correo electrónico ya está registrado. ¿Deseas iniciar sesión?");
        } else {
          setErrorMessage(err.message);
        }
      } else {
        setErrorMessage("No se pudo conectar con el servidor. Revisa tu conexión.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!registeredEmail || resendCooldown > 0) return;
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await authService.resendVerification(registeredEmail);
      setSuccessMessage(res.message);
      // Start 2-minute cooldown
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
      setIsLoading(false);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    errorMessage,
    successMessage,
    isRegistered,
    registeredEmail,
    resendCooldown,
    avatarPreview,
    handleAvatarChange,
    handleResend,
    setErrorMessage,
  };
}
