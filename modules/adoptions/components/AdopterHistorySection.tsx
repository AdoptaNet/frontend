'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  ShieldAlert,
  Award,
  PawPrint,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronDown,
  AlertTriangle,
  Calendar,
  Building2,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import type { AdopterHistoryData } from '../models/adoption.types';
import { formatDate } from '@/shared/utils/date';

interface AdopterHistorySectionProps {
  history: AdopterHistoryData | null;
  isLoading?: boolean;
  error?: string | null;
}

export function AdopterHistorySection({
  history,
  isLoading = false,
  error = null,
}: AdopterHistorySectionProps) {
  const [showAllPets, setShowAllPets] = useState(false);

  if (isLoading) {
    return (
      <div className="p-4 rounded-xl border border-line bg-superficie-1 flex items-center justify-center gap-2.5 text-xs text-tinta-600 py-8">
        <Loader2 className="w-4 h-4 animate-spin text-verde-700" />
        <span>Consultando historial y antecedentes del adoptante...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/70 text-xs text-rose-800 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
        <span>No se pudo cargar el historial del postulante: {error}</span>
      </div>
    );
  }

  if (!history) {
    return null;
  }

  const { summary, trustLevel, badgeLabel, badgeDescription, previousAdoptions, returns } =
    history;

  // Visual badge style configuration
  const trustBadgeConfig = {
    certified: {
      bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      icon: Award,
      iconColor: 'text-emerald-700',
    },
    experienced: {
      bg: 'bg-blue-50 text-blue-900 border-blue-200',
      icon: PawPrint,
      iconColor: 'text-blue-700',
    },
    with_returns: {
      bg: 'bg-amber-50 text-amber-950 border-amber-300',
      icon: ShieldAlert,
      iconColor: 'text-amber-700',
    },
    first_time: {
      bg: 'bg-stone-100 text-stone-800 border-stone-200',
      icon: Sparkles,
      iconColor: 'text-stone-600',
    },
  }[trustLevel] || {
    bg: 'bg-stone-100 text-stone-800 border-stone-200',
    icon: Sparkles,
    iconColor: 'text-stone-600',
  };

  const TrustIcon = trustBadgeConfig.icon;
  const visiblePets = showAllPets ? previousAdoptions : previousAdoptions.slice(0, 2);

  return (
    <div className="p-4 sm:p-5 bg-superficie-1 rounded-xl border border-line space-y-4">
      {/* Header with Title & Trust Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-line/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-verde-50 text-verde-800 rounded-lg border border-verde-200/80">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-tinta-900 uppercase tracking-wider">
              Historial y Confiabilidad
            </h3>
            <p className="text-[11px] text-tinta-500">
              Evaluación de antecedentes, adopciones formalizadas y seguimiento
            </p>
          </div>
        </div>

        {/* Trust Badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs self-start sm:self-auto ${trustBadgeConfig.bg}`}
        >
          <TrustIcon className={`w-3.5 h-3.5 ${trustBadgeConfig.iconColor}`} />
          <span>{badgeLabel}</span>
        </div>
      </div>

      {/* Badge Description helper */}
      <p className="text-xs text-tinta-600 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-line/80 italic">
        {badgeDescription}
      </p>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* KPI 1: Adopciones Formalizadas */}
        <div className="p-3 bg-white rounded-xl border border-line shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-tinta-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Adopciones</span>
            <PawPrint className="w-3.5 h-3.5 text-verde-700" />
          </div>
          <div className="text-xl font-bold font-heading text-tinta-900">
            {summary.approvedAdoptions}
          </div>
          <div className="text-[10px] text-tinta-500 font-medium">
            {summary.approvedAdoptions === 1 ? 'Mascota recibida' : 'Mascotas recibidas'}
          </div>
        </div>

        {/* KPI 2: Seguimientos Concluidos */}
        <div className="p-3 bg-white rounded-xl border border-line shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-tinta-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Certificados</span>
            <Award className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl font-bold font-heading text-purple-950">
            {summary.completedFollowUps}
          </div>
          <div className="text-[10px] text-purple-800 font-medium">
            {summary.certificatesCount > 0
              ? `${summary.certificatesCount} con constancia`
              : 'Sin constancias aún'}
          </div>
        </div>

        {/* KPI 3: Postulaciones Activas */}
        <div className="p-3 bg-white rounded-xl border border-line shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-tinta-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">En Curso</span>
            <FileText className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-bold font-heading text-blue-950">
            {summary.activeApplications}
          </div>
          <div className="text-[10px] text-blue-800 font-medium">
            {summary.totalApplications} solicitudes totales
          </div>
        </div>

        {/* KPI 4: Retornos Registrados */}
        <div
          className={`p-3 rounded-xl border shadow-2xs space-y-1 ${
            summary.totalReturns > 0
              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
              : 'bg-white border-line text-tinta-900'
          }`}
        >
          <div className="flex items-center justify-between text-tinta-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Retornos</span>
            <RotateCcw
              className={`w-3.5 h-3.5 ${
                summary.totalReturns > 0 ? 'text-amber-600' : 'text-stone-400'
              }`}
            />
          </div>
          <div
            className={`text-xl font-bold font-heading ${
              summary.totalReturns > 0 ? 'text-amber-900 font-black' : 'text-tinta-900'
            }`}
          >
            {summary.totalReturns}
          </div>
          <div
            className={`text-[10px] font-medium ${
              summary.totalReturns > 0 ? 'text-amber-800 font-bold' : 'text-tinta-500'
            }`}
          >
            {summary.totalReturns === 0
              ? 'Sin devoluciones'
              : `${summary.totalReturns} registrada(s)`}
          </div>
        </div>
      </div>

      {/* Previous Adoptions List (if any) */}
      {previousAdoptions.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-tinta-700 font-semibold">
            <span className="flex items-center gap-1.5">
              <PawPrint className="w-3.5 h-3.5 text-verde-700" />
              <span>Mascotas formalizadas con anterioridad ({previousAdoptions.length}):</span>
            </span>
          </div>

          <div className="space-y-2">
            {visiblePets.map((pet) => (
              <div
                key={pet.adoptionId}
                className="p-3 bg-white rounded-xl border border-line flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {pet.photoUrl ? (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-line">
                      <Image
                        src={pet.photoUrl}
                        alt={pet.petName}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-500 flex items-center justify-center shrink-0 border border-line">
                      <PawPrint className="w-5 h-5" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="font-bold text-tinta-900 truncate flex items-center gap-1.5">
                      <span>{pet.petName}</span>
                      <span className="text-[11px] font-normal text-tinta-500">
                        ({pet.species === 'dog' ? 'Perro' : pet.species === 'cat' ? 'Gato' : pet.species} • {pet.breed || 'Mestizo'})
                      </span>
                    </div>
                    <div className="text-[11px] text-tinta-500 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 truncate">
                        <Building2 className="w-3 h-3 text-tinta-400 shrink-0" />
                        <span>{pet.shelterName}</span>
                      </span>
                      {pet.adoptedAt && (
                        <span className="shrink-0">
                          • {formatDate(pet.adoptedAt, 'D MMM YYYY')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Follow up status badge */}
                <div className="shrink-0 text-right">
                  {pet.certificateCode ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Certificado #{pet.certificateCode}</span>
                    </span>
                  ) : pet.followUpStatus === 'in_progress' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-900 border border-amber-200">
                      <span>Seguimiento activo</span>
                    </span>
                  ) : pet.followUpStatus === 'completed' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Completado</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-tinta-400 font-medium">
                      Formalizada
                    </span>
                  )}
                </div>
              </div>
            ))}

            {previousAdoptions.length > 2 && (
              <button
                type="button"
                onClick={() => setShowAllPets(!showAllPets)}
                className="w-full py-1.5 text-[11px] font-semibold text-verde-800 hover:text-verde-900 text-center flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>
                  {showAllPets
                    ? 'Mostrar menos mascotas'
                    : `Ver ${previousAdoptions.length - 2} mascota(s) anterior(es) más`}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${showAllPets ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Documented Returns Alert (if any) */}
      {returns.length > 0 && (
        <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-950">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Retorno de mascota registrado en la plataforma</span>
          </div>
          <p className="text-[11px] text-amber-800">
            AdoptaNet promueve el protocolo de cero abandono. El adoptante devolvió formalmente a una mascota al albergue:
          </p>
          <div className="space-y-1.5 pt-1">
            {returns.map((ret) => (
              <div
                key={ret.id}
                className="p-2.5 bg-white/80 rounded-lg border border-amber-200/80 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-amber-950">
                    Mascota: <strong>{ret.petName}</strong> {ret.shelterName ? `(Albergue: ${ret.shelterName})` : ''}
                  </span>
                  <span className="text-[10px] text-amber-800 font-normal">
                    {formatDate(ret.createdAt, 'D MMM YYYY')}
                  </span>
                </div>
                <div className="text-[11px] text-amber-900">
                  <strong>Causa declarada:</strong> {ret.reasonLabel}
                </div>
                {ret.explanation && (
                  <div className="text-[11px] text-amber-800 italic bg-amber-100/50 p-1.5 rounded">
                    &ldquo;{ret.explanation}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* First-time friendly banner */}
      {summary.approvedAdoptions === 0 && returns.length === 0 && (
        <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl flex items-start gap-2.5 text-xs text-stone-600">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-stone-800 block mb-0.5">
              Postulante sin antecedentes previos
            </span>
            No registra adopciones ni devoluciones anteriores en el sistema. Te recomendamos evaluar con atención sus respuestas de vivienda, rutina y la puntuación predictiva de compatibilidad.
          </div>
        </div>
      )}
    </div>
  );
}
