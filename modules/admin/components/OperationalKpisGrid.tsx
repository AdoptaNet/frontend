"use client";

import React from "react";
import {
  PawPrint,
  FileCheck,
  Building2,
  HeartHandshake,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { AdminMetricsResponse } from "../models/admin.types";
import { AdminInfoTooltip } from "./AdminInfoTooltip";

interface OperationalKpisGridProps {
  operational: AdminMetricsResponse["operational"];
}

export function OperationalKpisGrid({ operational }: OperationalKpisGridProps) {
  const { pets, adoptions, followUps, shelters } = operational;

  return (
    <div className="space-y-6">
      {/* Tarjetas Principales de Resumen Superior */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Mascotas */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-tinta-500 uppercase tracking-wider">
              Total Mascotas
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <PawPrint className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-tinta-900 font-heading">
              {pets.total}
            </span>
            <AdminInfoTooltip
              content={`Porcentaje de mascotas en estado 'adopted' respecto al total del catálogo: (${pets.adopted}/${pets.total || 1}) × 100.`}
            >
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {pets.adoptionRate}% adoptadas
              </span>
            </AdminInfoTooltip>
          </div>
          <p className="text-xs text-tinta-400 mt-2">
            {pets.available} disponibles • {pets.inProcess} en proceso
          </p>
        </div>

        {/* Solicitudes de Adopción */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-tinta-500 uppercase tracking-wider">
              Solicitudes Totales
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-tinta-900 font-heading">
              {adoptions.total}
            </span>
            <AdminInfoTooltip
              content={`Tasa de Efectividad: (Aprobadas / [Aprobadas + Rechazadas]) × 100 = ${adoptions.approvalRate}%.`}
            >
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {adoptions.approvalRate}% efectividad
              </span>
            </AdminInfoTooltip>
          </div>
          <p className="text-xs text-tinta-400 mt-2">
            {adoptions.approved} aprobadas • {adoptions.rejected} rechazadas
          </p>
        </div>

        {/* Seguimiento Post-Adopción */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-tinta-500 uppercase tracking-wider">
              Post-Adopción
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-tinta-900 font-heading">
              {followUps.active}
            </span>
            <AdminInfoTooltip
              content="Adopciones que culminaron exitosamente sus hitos de seguimiento (30, 90 y 180 días) con constancia formal."
            >
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {followUps.completed180d} exitosas
              </span>
            </AdminInfoTooltip>
          </div>
          <p className="text-xs text-tinta-400 mt-2 flex items-center gap-1">
            <span>{followUps.returnsCount} retornos</span>
            <AdminInfoTooltip
              content={`Porcentaje de retornos formalizados por causales de fuerza mayor tipificadas (${followUps.returnRate}%).`}
            >
              <span className="text-[11px] text-amber-800 font-semibold underline decoration-dotted">
                ({followUps.returnRate}%)
              </span>
            </AdminInfoTooltip>
          </p>
        </div>

        {/* Albergues Registrados */}
        <div className="bg-white p-5 rounded-2xl border border-line shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-tinta-500 uppercase tracking-wider">
              Albergues Aliados
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-tinta-900 font-heading">
              {shelters.total}
            </span>
            <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              {shelters.verificationRate}% verificados
            </span>
          </div>
          <p className="text-xs text-tinta-400 mt-2">
            {shelters.verified} verificados • {shelters.unverified} pendientes
          </p>
        </div>
      </div>

      {/* Bloque Detallado de Distribución y Embudo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución del Catálogo de Mascotas */}
        <div className="bg-white p-6 rounded-2xl border border-line shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-heading font-bold text-base text-tinta-900 flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-emerald-600" />
              Distribución del Catálogo de Mascotas
            </h4>
          </div>
          <p className="text-xs text-tinta-500 mb-5">
            Estado de los animales registrados por los albergues en la plataforma.
          </p>

          <div className="space-y-4">
            {/* Disponibles */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-tinta-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Disponibles para adopción</span>
                </span>
                <span className="font-bold text-tinta-900">
                  {pets.available} ({pets.total > 0 ? ((pets.available / pets.total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${pets.total > 0 ? (pets.available / pets.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* En Proceso */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-tinta-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>En proceso de evaluación</span>
                </span>
                <span className="font-bold text-tinta-900">
                  {pets.inProcess} ({pets.total > 0 ? ((pets.inProcess / pets.total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${pets.total > 0 ? (pets.inProcess / pets.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Adoptadas */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="text-tinta-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span>Adoptadas formalmente</span>
                </span>
                <span className="font-bold text-tinta-900">
                  {pets.adopted} ({pets.adoptionRate}%)
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${pets.adoptionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Embudo de Solicitudes de Adopción */}
        <div className="bg-white p-6 rounded-2xl border border-line shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-heading font-bold text-base text-tinta-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              Embudo de Postulación y Adopciones
            </h4>
          </div>
          <p className="text-xs text-tinta-500 mb-5">
            Flujo de resolución y ratio de efectividad de las postulaciones procesadas.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-neutral-50 border border-line text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-[11px] font-medium text-tinta-500 block">Recibidas / Revisión</span>
              <span className="text-lg font-bold text-tinta-900">
                {adoptions.submitted + adoptions.inReview}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-[11px] font-medium text-emerald-700 block">Aprobadas</span>
              <span className="text-lg font-bold text-emerald-800">
                {adoptions.approved}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertCircle className="w-4 h-4 text-rose-600" />
              </div>
              <span className="text-[11px] font-medium text-rose-700 block">Rechazadas</span>
              <span className="text-lg font-bold text-rose-800">
                {adoptions.rejected}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-line flex items-center justify-between text-xs">
            <span className="text-tinta-600 font-medium">Tasa de Aprobación vs. Rechazo:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {adoptions.approvalRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
