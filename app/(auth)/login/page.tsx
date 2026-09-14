import { Suspense } from "react";
import { LoginForm } from "@/modules/auth/components/LoginForm";
import { ENV } from "@/shared/config/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Iniciar sesión | ${ENV.APP_NAME}`,
  description: `Inicia sesión en tu cuenta de ${ENV.APP_NAME}`,
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center p-12">
          <div className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
