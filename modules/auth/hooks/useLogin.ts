"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { loginSchema, type LoginFormData } from "../schemas/auth.schemas";
import { ApiError } from "@/shared/services/http-client";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const oauthError = searchParams.get("error");
  const initialOAuthMessage =
    oauthError === "oauth_cancelled"
      ? "Has cancelado el inicio de sesión con Google. Puedes intentar nuevamente cuando desees."
      : null;

  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialOAuthMessage
  );
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await authService.login(values);
      setAuth(response);

      const redirect = searchParams.get("redirect");
      if (redirect && redirect.startsWith("/")) {
        router.push(redirect);
      } else {
        router.push("/home");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.statusCode === 401) {
          setErrorMessage("Correo o contraseña incorrectos. Por favor, verifica tus datos.");
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
    setErrorMessage,
  };
}
