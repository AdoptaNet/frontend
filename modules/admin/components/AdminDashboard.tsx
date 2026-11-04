"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw, Shield, Clock } from "lucide-react";
import { adminService } from "../services/admin.service";
import type {
  AdminMetricsResponse,
  AdminSheltersResponse,
  SystemHealthResponse,
} from "../models/admin.types";
import { OperationalKpisGrid } from "./OperationalKpisGrid";
import { MlTelemetrySection } from "./MlTelemetrySection";
import { HealthStatusWidget } from "./HealthStatusWidget";
import { AdminSheltersTable } from "./AdminSheltersTable";
import { AdminInfoTooltip } from "./AdminInfoTooltip";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export function AdminDashboard() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as "kpis" | "ml" | "health" | "shelters" | null;

  const [activeTab, setActiveTab] = useState<"kpis" | "ml" | "health" | "shelters">(
    tabParam && ["kpis", "ml", "health", "shelters"].includes(tabParam)
      ? tabParam
      : "kpis"
  );

  useEffect(() => {
    if (tabParam && ["kpis", "ml", "health", "shelters"].includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (!tabParam) {
      setActiveTab("kpis");
    }
  }, [tabParam]);

  const [metrics, setMetrics] = useState<AdminMetricsResponse | null>(null);
  const [health, setHealth] = useState<SystemHealthResponse | null>(null);
  const [shelters, setShelters] = useState<AdminSheltersResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      const [m, h, s] = await Promise.all([
        adminService.getMetrics(),
        adminService.getHealth(),
        adminService.getShelters(),
      ]);
      setMetrics(m);
      setHealth(h);
      setShelters(s);
    } catch (err: any) {
      console.error("Error al cargar dashboard de administración:", err);
      setError("No se pudieron cargar las métricas administrativas. Verifica que tu sesión sea válida.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const sectionMeta = {
    kpis: {
      badge: "KPIs y Métricas Operacionales",
      title: "Centro de Mando de Adopciones",
      description: `Supervisión general del catálogo de animales, embudo de solicitudes y efectividad global de la plataforma. Administrador: ${user?.fullName || "Administrador"}.`,
    },
    ml: {
      badge: "Inteligencia Artificial y ML",
      title: "Telemetría del Motor de Recomendación ('Para Ti')",
      description: "Análisis de clics (CTR), conversión a adopción y ratio de resiliencia del recomendador híbrido frente al fallback de contingencia.",
    },
    health: {
      badge: "Monitoreo de Infraestructura",
      title: "Salud y Disponibilidad de Servicios",
      description: "Sondas de conectividad en tiempo real y latencias de PostgreSQL, capa Socket.io y microservicio FastAPI ML.",
    },
    shelters: {
      badge: "Gestión y Acreditación",
      title: `Directorio de Albergues Registrados (${shelters?.total ?? 0})`,
      description: "Fiscalización comunitaria, verificación de identidad institucional y supervisión de albergues aliados.",
    },
  }[activeTab];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="size-8 animate-spin rounded-full border-3 border-verde-700 border-t-transparent" />
        <p className="text-xs text-tinta-500 font-medium">Cargando métricas analíticas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header del Panel */}
      <div className="bg-white rounded-2xl border border-line p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-verde-50 text-verde-700 border border-verde-200">
              <Shield className="w-3.5 h-3.5" />
              {sectionMeta.badge}
            </span>
            <AdminInfoTooltip
              content="Privilegios de Administrador del sistema AdoptaNet. Acceso irrestricto a telemetría global y configuración."
            />
            {metrics?.timestamp && (
              <span className="text-[11px] text-tinta-400 flex items-center gap-1 ml-2">
                <Clock className="w-3 h-3" />
                Actualizado: {new Date(metrics.timestamp).toLocaleTimeString()}
                <AdminInfoTooltip
                  content="Hora exacta de la última consulta analítica ejecutada contra la base de datos PostgreSQL."
                />
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-tinta-900 font-heading">
            {sectionMeta.title}
          </h1>
          <p className="text-xs text-tinta-500 mt-1">
            {sectionMeta.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AdminInfoTooltip
            content="Recalcula al instante las métricas operacionales, telemetría de IA y sondea la salud de los servicios."
            side="left"
          >
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-verde-700 hover:bg-verde-800 text-white text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Actualizando..." : "Sincronizar"}</span>
            </button>
          </AdminInfoTooltip>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Contenido controlado exclusivamente por la sección activa del navbar */}
      {activeTab === "kpis" && metrics && (
        <OperationalKpisGrid operational={metrics.operational} />
      )}

      {activeTab === "ml" && metrics && (
        <MlTelemetrySection telemetry={metrics.mlTelemetry} />
      )}

      {activeTab === "health" && (
        <HealthStatusWidget
          health={health}
          loading={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      {activeTab === "shelters" && shelters && (
        <AdminSheltersTable
          shelters={shelters.shelters}
          onShelterUpdated={fetchDashboardData}
        />
      )}
    </div>
  );
}
