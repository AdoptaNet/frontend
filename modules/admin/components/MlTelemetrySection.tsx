"use client";

import React from "react";
import { Sparkles, ShieldCheck } from "lucide-react";
import type { AdminMetricsResponse } from "../models/admin.types";
import { AdminInfoTooltip } from "./AdminInfoTooltip";

interface MlTelemetrySectionProps {
  telemetry: AdminMetricsResponse["mlTelemetry"];
}

export function MlTelemetrySection({ telemetry }: MlTelemetrySectionProps) {
  const { interactions, resilience } = telemetry;

  return (
    <div className="space-y-6">
      {/* Sección 1: Interacciones y Rendimiento de Recomendación */}
      <div className="bg-white rounded-2xl border border-line p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-line">
          <div>
            <h3 className="font-heading font-bold text-base text-tinta-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-600" />
              Telemetría del Motor de Recomendación (&apos;Para Ti&apos;)
            </h3>
            <p className="text-xs text-tinta-500 mt-0.5">
              Métricas de interacción capturadas a través de eventos de impresión, clic y postulación formal.
            </p>
          </div>
          <AdminInfoTooltip
            content="El motor combina filtrado colaborativo basado en usuarios similares y filtrado de contenido basado en las 33 variables de estilo de vida del adoptante."
          >
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 cursor-help">
              Algoritmo Híbrido (Content + Collaborative)
            </span>
          </AdminInfoTooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Impresiones */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-line transition-shadow hover:shadow-xs">
            <span className="text-xs text-tinta-500 font-medium block mb-1">
              Impresiones Generadas
            </span>
            <span className="text-2xl font-extrabold text-tinta-900 font-heading">
              {interactions.totalImpressions}
            </span>
            <p className="text-[11px] text-tinta-400 mt-1">
              Visualizaciones de fichas en sección &quot;Para ti&quot;
            </p>
          </div>

          {/* Clics y CTR */}
          <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-100 transition-shadow hover:shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-violet-700 font-medium">
                  Clics (Detalle de Mascota)
                </span>
                <AdminInfoTooltip
                  content={
                    <div>
                      <strong className="block text-white mb-1">Click-Through Rate (CTR)</strong>
                      Fórmula: (Clics / Impresiones) × 100. Representa el atractivo visual y efectividad de las sugerencias iniciales del algoritmo.
                    </div>
                  }
                />
              </div>
              <span className="text-xs font-bold text-violet-800 bg-violet-100 px-2 py-0.5 rounded-full border border-violet-200">
                CTR: {interactions.ctr}%
              </span>
            </div>
            <span className="text-2xl font-extrabold text-violet-900 font-heading">
              {interactions.totalClicks}
            </span>
            <p className="text-[11px] text-violet-600/80 mt-1">
              Tasa de Clics (Click-Through Rate)
            </p>
          </div>

          {/* Postulaciones y Conversión */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 transition-shadow hover:shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-emerald-700 font-medium">
                  Postulaciones desde Recs
                </span>
                <AdminInfoTooltip
                  content={
                    <div>
                      <strong className="block text-white mb-1">Tasa de Conversión (Conversion Rate)</strong>
                      Fórmula: (Postulaciones Iniciadas / Impresiones) × 100. Mide cuántas sugerencias del motor se tradujeron en adopciones potenciales reales.
                    </div>
                  }
                />
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                Conv: {interactions.conversionRate}%
              </span>
            </div>
            <span className="text-2xl font-extrabold text-emerald-900 font-heading">
              {interactions.totalApplies}
            </span>
            <p className="text-[11px] text-emerald-600/80 mt-1">
              Conversión a adopción iniciada
            </p>
          </div>
        </div>

        {/* Barra de progreso de embudo ML */}
        <div className="p-4 rounded-xl bg-neutral-50/70 border border-line">
          <div className="flex justify-between items-center text-xs font-semibold text-tinta-700 mb-2">
            <div className="flex items-center gap-1.5">
              <span>Conversión de Clic a Postulación (Interés a Acción)</span>
              <AdminInfoTooltip
                content={
                  <div>
                    <strong className="block text-white mb-1">Ratio de Alta Intención</strong>
                    Fórmula: (Postulaciones / Clics) × 100. Mide cuántos adoptantes que examinaron la ficha detallada decidieron postularse formalmente.
                  </div>
                }
              />
            </div>
            <span className="font-mono text-emerald-700 font-bold">
              {interactions.clickToApplyRate}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, interactions.clickToApplyRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sección 2: Resiliencia y Fallback */}
      <div className="bg-white rounded-2xl border border-line p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-line">
          <div>
            <h3 className="font-heading font-bold text-base text-tinta-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Arquitectura de Resiliencia y Degradación Elegante
            </h3>
            <p className="text-xs text-tinta-500 mt-0.5">
              Proporción de inferencias atendidas por el microservicio ML híbrido frente al fallback heurístico de contingencia.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {resilience.totalCached} registros en caché
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Modelo Híbrido ML */}
          <div className="p-4 rounded-xl border border-line bg-neutral-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-tinta-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Modelo Híbrido ML (Inferencia Activa)</span>
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {resilience.hybridRatio}%
              </span>
            </div>
            <span className="text-2xl font-bold text-tinta-900 font-heading">
              {resilience.hybridCount}
            </span>
            <p className="text-[11px] text-tinta-400 mt-1">
              Predicciones calculadas por LightGBM + Reglas de Compatibilidad + DINOv2
            </p>
          </div>

          {/* Fallback Heurístico */}
          <div className="p-4 rounded-xl border border-line bg-neutral-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-tinta-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Fallback Heurístico de Contingencia</span>
                <AdminInfoTooltip
                  content={
                    <div>
                      <strong className="block text-white mb-1">Fallback Heurístico</strong>
                      Motor de reglas en NestJS que responde en menos de 50ms si el microservicio Python experimenta frío o timeout (&gt; 10s).
                    </div>
                  }
                />
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {resilience.fallbackRatio}%
              </span>
            </div>
            <span className="text-2xl font-bold text-tinta-900 font-heading">
              {resilience.fallbackCount}
            </span>
            <p className="text-[11px] text-tinta-400 mt-1">
              Atendido por motor de reglas locales en caso de timeout o arranque en frío
            </p>
          </div>
        </div>

        {/* Barra comparativa de resiliencia */}
        <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden flex">
          <div
            className="bg-emerald-500 h-3 transition-all duration-500"
            style={{ width: `${resilience.hybridRatio}%` }}
            title={`Modelo Híbrido: ${resilience.hybridRatio}%`}
          />
          <div
            className="bg-amber-500 h-3 transition-all duration-500"
            style={{ width: `${resilience.fallbackRatio}%` }}
            title={`Fallback: ${resilience.fallbackRatio}%`}
          />
        </div>
      </div>
    </div>
  );
}
