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
  const isVerifiedParam = searchParams.get("verified") === "true";

  const initialOAuthMessage =
    oauthError === "oauth_cancelled"
      ? "Has cancelado el inicio de sesión con Google. Puedes intentar nuevamente cuando desees."
      : null;

  const [errorMessage, setErrorMessage] = useState<string | null>(
    initialOAuthMessage
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(
    isVerifiedParam
      ? "¡Cuenta activada exitosamente! Ya puedes iniciar sesión."
      : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUnverified, setIsUnverified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsUnverified(false);
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
          setErrorMessage(
            "Correo o contraseña incorrectos. Por favor, verifica tus datos."
          );
        } else if (err.statusCode === 403) {
          // US-01 Escenario 4: Bloqueo de inicio de sesión para cuenta no verificada
          setIsUnverified(true);
          setUnverifiedEmail(values.email);
          setErrorMessage(
            "Debe verificar su correo electrónico antes de ingresar. Por favor revisa tu bandeja de entrada."
          );
        } else {
          setErrorMessage(err.message);
        }
      } else {
        setErrorMessage(
          "No se pudo conectar con el servidor. Revisa tu conexión."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!unverifiedEmail || resendCooldown > 0) return;
    setIsLoading(true);

    try {
      const res = await authService.resendVerification(unverifiedEmail);
      setSuccessMessage(res.message);
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
    isUnverified,
    unverifiedEmail,
    resendCooldown,
    handleResend,
    setErrorMessage,
  };
}
