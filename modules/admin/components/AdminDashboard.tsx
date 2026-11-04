"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Cpu,
  Activity,
  Building2,
  RefreshCw,
  Shield,
  Clock,
} from "lucide-react";
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
import { useAuthStore } from "@/modules/auth/store/auth.store";

export function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
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
    }
  }, [tabParam]);

  const handleTabChange = (tab: "kpis" | "ml" | "health" | "shelters") => {
    setActiveTab(tab);
    router.replace(`/admin/dashboard?tab=${tab}`, { scroll: false });
  };

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
              Panel de Administración
            </span>
            {metrics?.timestamp && (
              <span className="text-[11px] text-tinta-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Actualizado: {new Date(metrics.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-tinta-900 font-heading">
            Centro de Mando y Analítica Global
          </h1>
          <p className="text-xs text-tinta-500 mt-1">
            Bienvenido, <strong className="text-tinta-700">{user?.fullName || "Administrador"}</strong>. Supervisión de KPIs de adopción, telemetría de Machine Learning y estado del sistema.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-verde-700 hover:bg-verde-800 text-white text-xs font-semibold shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Actualizando..." : "Sincronizar"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Tabs de Navegación del Dashboard */}
      <div className="flex items-center gap-2 border-b border-line pb-2 overflow-x-auto">
        <button
          onClick={() => handleTabChange("kpis")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "kpis"
              ? "bg-verde-50 text-verde-800 border border-verde-200"
              : "text-tinta-500 hover:text-tinta-900 hover:bg-white"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>KPIs de Adopción</span>
        </button>

        <button
          onClick={() => handleTabChange("ml")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "ml"
              ? "bg-violet-50 text-violet-800 border border-violet-200"
              : "text-tinta-500 hover:text-tinta-900 hover:bg-white"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Telemetría ML</span>
        </button>

        <button
          onClick={() => handleTabChange("health")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "health"
              ? "bg-blue-50 text-blue-800 border border-blue-200"
              : "text-tinta-500 hover:text-tinta-900 hover:bg-white"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Salud de Servicios</span>
        </button>

        <button
          onClick={() => handleTabChange("shelters")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "shelters"
              ? "bg-purple-50 text-purple-800 border border-purple-200"
              : "text-tinta-500 hover:text-tinta-900 hover:bg-white"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Albergues ({shelters?.total ?? 0})</span>
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
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
