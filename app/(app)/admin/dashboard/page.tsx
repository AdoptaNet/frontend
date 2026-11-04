import { Suspense } from "react";
import { Metadata } from "next";
import { AdminDashboard, AdminGuard } from "@/modules/admin";

export const metadata: Metadata = {
  title: "Panel de Administración — AdoptaNet",
  description: "Métricas consolidadas de adopciones, telemetría ML y monitor de infraestructura.",
};

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <Suspense
        fallback={
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
            <div className="size-8 animate-spin rounded-full border-3 border-verde-700 border-t-transparent" />
            <p className="text-xs text-tinta-500 font-medium">Cargando panel de administración...</p>
          </div>
        }
      >
        <AdminDashboard />
      </Suspense>
    </AdminGuard>
  );
}
