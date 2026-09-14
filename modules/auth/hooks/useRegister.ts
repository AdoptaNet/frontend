"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schemas";
import { ApiError } from "@/shared/services/http-client";
import type { UserRole } from "../models/auth.types";

export function useRegister(initialRole?: UserRole) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const queryRole = (searchParams.get("role") || searchParams.get("rol")) as UserRole | null;
  const effectiveRole: UserRole =
    initialRole || (queryRole === "shelter" ? "shelter" : "adopter");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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

      setAuth(response);
      router.push("/home");
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

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    errorMessage,
    avatarPreview,
    handleAvatarChange,
    setErrorMessage,
  };
}
