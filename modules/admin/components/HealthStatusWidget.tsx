"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Database, Radio, Cpu, RefreshCw } from "lucide-react";
import type { SystemHealthResponse, ServiceHealthDetail } from "../models/admin.types";
import { AdminInfoTooltip } from "./AdminInfoTooltip";

interface HealthStatusWidgetProps {
  health: SystemHealthResponse | null;
  loading: boolean;
  onRefresh: () => void;
}

export function HealthStatusWidget({ health, loading, onRefresh }: HealthStatusWidgetProps) {
  const getStatusBadge = (status: ServiceHealthDetail["status"]) => {
    switch (status) {
      case "healthy":
        return (
          <AdminInfoTooltip content="Todos los servicios e infraestructura responden con latencia óptima (< 1000ms en DB, < 2500ms en ML).">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-help">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operativo
            </span>
          </AdminInfoTooltip>
        );
      case "degraded":
        return (
          <AdminInfoTooltip content="Uno o más servicios reportan latencia elevada o están usando mecanismos de contingencia.">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 cursor-help">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Degradado
            </span>
          </AdminInfoTooltip>
        );
      case "down":
      default:
        return (
          <AdminInfoTooltip content="Un servicio crítico no responde o la conexión ha sido rechazada.">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 cursor-help">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Inactivo
            </span>
          </AdminInfoTooltip>
        );
    }
  };

  const getStatusIcon = (status: ServiceHealthDetail["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case "down":
      default:
        return <XCircle className="w-5 h-5 text-rose-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-line p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
        <div>
          <h3 className="font-heading font-bold text-base text-tinta-900 flex items-center gap-2">
            Monitor de Salud e Infraestructura
            {health && getStatusBadge(health.status)}
          </h3>
          <p className="text-xs text-tinta-500 mt-0.5">
            Sondas automáticas de conectividad y latencia hacia los microservicios y bases de datos.
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-xs font-medium text-tinta-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Actualizar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Base de Datos */}
        <div className="p-4 rounded-xl border border-line bg-neutral-50/50 flex flex-col justify-between transition-shadow hover:shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-tinta-900">PostgreSQL / Supabase</h4>
                  <span className="text-[11px] text-tinta-400">Base de Datos Transaccional</span>
                </div>
              </div>
              {health && getStatusIcon(health.services.database.status)}
            </div>
            <p className="text-xs text-tinta-600 mb-3">
              {health?.services.database.message || "Consultando conectividad..."}
            </p>
          </div>
          <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs">
            <span className="text-tinta-500 font-medium">Latencia de sondeo:</span>
            <span className="font-mono font-bold text-tinta-800">
              {health?.services.database.latencyMs ?? "--"} ms
            </span>
          </div>
        </div>

        {/* Realtime Socket.io */}
        <div className="p-4 rounded-xl border border-line bg-neutral-50/50 flex flex-col justify-between transition-shadow hover:shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-800">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-tinta-900">Capa en Tiempo Real</h4>
                  <span className="text-[11px] text-tinta-400">Socket.io Gateway (/messages)</span>
                </div>
              </div>
              {health && getStatusIcon(health.services.realtime.status)}
            </div>
            <p className="text-xs text-tinta-600 mb-3">
              {health?.services.realtime.message || "Monitoreando namespace de mensajería..."}
            </p>
          </div>
          <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs">
            <span className="text-tinta-500 font-medium">Latencia local:</span>
            <span className="font-mono font-bold text-tinta-800">
              {health?.services.realtime.latencyMs ?? "--"} ms
            </span>
          </div>
        </div>

        {/* Python ML Service */}
        <div className="p-4 rounded-xl border border-line bg-neutral-50/50 flex flex-col justify-between transition-shadow hover:shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-violet-100 text-violet-800">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-tinta-900">Microservicio ML</h4>
                  <span className="text-[11px] text-tinta-400">Python FastAPI (:8000)</span>
                </div>
              </div>
              {health && getStatusIcon(health.services.mlService.status)}
            </div>
            <p className="text-xs text-tinta-600 mb-3">
              {health?.services.mlService.message || "Verificando disponibilidad de inferencia..."}
            </p>
          </div>
          <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs">
            <span className="text-tinta-500 font-medium">Latencia HTTP:</span>
            <div className="text-right">
              <span className="font-mono font-bold text-tinta-800">
                {health?.services.mlService.latencyMs ?? "--"} ms
              </span>
              {health?.services.mlService.metadata?.catalogSize !== undefined && (
                <span className="block text-[10px] text-tinta-400">
                  Catálogo: {health.services.mlService.metadata.catalogSize} mascotas
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
