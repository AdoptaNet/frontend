import { Metadata } from "next";
import { AdminDashboard, AdminGuard } from "@/modules/admin";

export const metadata: Metadata = {
  title: "Panel de Administración — AdoptaNet",
  description: "Métricas consolidadas de adopciones, telemetría ML y monitor de infraestructura.",
};

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
