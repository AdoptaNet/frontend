import { Suspense } from "react";
import { RegisterForm } from "@/modules/auth/components/RegisterForm";
import { ENV } from "@/shared/config/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Crear cuenta | ${ENV.APP_NAME}`,
  description: `Crea tu cuenta en ${ENV.APP_NAME} como adoptante o rescatista/albergue`,
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center p-12">
          <div className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
