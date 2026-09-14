import { Suspense } from "react";
import { RecoverForm } from "@/modules/auth/components/RecoverForm";
import { ENV } from "@/shared/config/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Recuperar contraseña | ${ENV.APP_NAME}`,
  description: `Restablece el acceso a tu cuenta de ${ENV.APP_NAME}`,
};

export default function RecoverPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center p-12">
          <div className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        </div>
      }
    >
      <RecoverForm />
    </Suspense>
  );
}
