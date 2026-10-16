'use client';

import React from 'react';
import {
  X,
  User,
  Home,
  Users,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/shared/hooks/useModal';
import { AdoptionStatusBadge } from './AdoptionStatusBadge';
import type { AdoptionRequest } from '../models/adoption.types';
import { ADOPTION_REJECTION_REASONS } from '../models/adoption.types';

interface AdoptionApplicantDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  adoption: AdoptionRequest | null;
  onOpenReview?: (adoption: AdoptionRequest) => void;
  isShelterView?: boolean;
}

export function AdoptionApplicantDossierModal({
  isOpen,
  onClose,
  adoption,
  onOpenReview,
  isShelterView = false,
}: AdoptionApplicantDossierModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  useModal({ isOpen, onClose, modalRef });

  if (!isOpen || !adoption) return null;

  const snapshot = adoption.adopterSnapshot || {};
  const housing = snapshot.housing || {};
  const household = snapshot.household || {};
  const routine = snapshot.routine || {};
  const demographics = snapshot.demographics || {};

  const rejectionReasonInfo = ADOPTION_REJECTION_REASONS.find(
    (r) => r.value === adoption.rejectionReason,
  );

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-hidden overscroll-contain animate-in fade-in duration-150"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={`Expediente de ${adoption.adopter?.fullName || 'Adoptante'}`}
        data-lenis-prevent
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-line shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh] h-full sm:h-auto min-h-0 overscroll-contain outline-none animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-line bg-superficie-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-verde-50 border border-verde-200 text-verde-700 flex items-center justify-center font-bold font-heading text-lg">
              {adoption.adopter?.fullName ? adoption.adopter.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-tinta-900 font-heading">
                  Expediente de {adoption.adopter?.fullName || 'Adoptante'}
                </h2>
                <AdoptionStatusBadge status={adoption.status} />
              </div>
              <p className="text-xs text-tinta-600">
                Postulación para <strong>{adoption.pet?.name || 'Mascota'}</strong> • Enviada el{' '}
                {new Date(adoption.createdAt).toLocaleDateString('es-PE', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-tinta-500 hover:text-tinta-900 hover:bg-superficie-2 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div
          data-lenis-prevent
          tabIndex={0}
          className="p-6 overflow-y-auto overscroll-contain space-y-6 flex-1 min-h-0 text-xs sm:text-sm focus:outline-none"
        >
          {/* Status & Outcome Banner */}
          {adoption.status === 'rejected' && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-rose-900">
              <div className="flex items-center gap-2 font-semibold">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Solicitud no aceptada</span>
              </div>
              {rejectionReasonInfo && (
                <p className="text-xs text-rose-800">
                  <strong>Motivo:</strong> {rejectionReasonInfo.label} — {rejectionReasonInfo.description}
                </p>
              )}
              {adoption.rejectionNotes && (
                <div className="text-xs text-rose-800 bg-white/70 p-2.5 rounded-lg border border-rose-200/60 mt-1">
                  <strong>Comentarios del albergue:</strong> <em>&ldquo;{adoption.rejectionNotes}&rdquo;</em>
                </div>
              )}
            </div>
          )}

          {adoption.status === 'approved' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-emerald-900">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Solicitud aprobada — Adopción formalizada</span>
              </div>
              {adoption.approvedAt && (
                <p className="text-xs text-emerald-800">
                  Fecha de aprobación:{' '}
                  {new Date(adoption.approvedAt).toLocaleDateString('es-PE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
              {adoption.reviewNotes && (
                <p className="text-xs text-emerald-800 bg-white/70 p-2.5 rounded-lg border border-emerald-200/60">
                  <strong>Notas de dictamen:</strong> {adoption.reviewNotes}
                </p>
              )}
            </div>
          )}

          {/* Contact Details */}
          <div className="p-4 bg-superficie-1 rounded-xl border border-line">
            <h3 className="text-xs font-bold text-tinta-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-verde-700" />
              <span>Datos del Postulante</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-tinta-700">
                <Mail className="w-3.5 h-3.5 text-tinta-500 shrink-0" />
                <span className="truncate">{adoption.adopter?.email || 'No especificado'}</span>
              </div>
              {adoption.adopter?.phoneNumber && (
                <div className="flex items-center gap-2 text-tinta-700">
                  <Phone className="w-3.5 h-3.5 text-tinta-500 shrink-0" />
                  <span>{adoption.adopter.phoneNumber}</span>
                </div>
              )}
              {demographics.district && (
                <div className="text-tinta-700">
                  <strong>Ubicación:</strong> {demographics.district}, {demographics.city || 'Lima'}
                </div>
              )}
              {demographics.occupation && (
                <div className="text-tinta-700">
                  <strong>Ocupación:</strong> {demographics.occupation}
                </div>
              )}
            </div>
          </div>

          {/* Motivation Letter */}
          <div className="p-4 bg-superficie-1 rounded-xl border border-line space-y-2">
            <h3 className="text-xs font-bold text-tinta-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-verde-700" />
              <span>Carta de Motivación</span>
            </h3>
            <p className="text-xs sm:text-sm text-tinta-800 leading-relaxed italic bg-white p-3 rounded-lg border border-line">
              &ldquo;{adoption.motivationLetter}&rdquo;
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Compromiso de tenencia responsable aceptado formalmente</span>
            </div>
          </div>

          {/* Immutable Snapshot Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <h3 className="text-xs font-bold text-tinta-900 uppercase tracking-wider">
                Expediente del Postulante
              </h3>
              <span className="text-[10px] text-tinta-500">
                Registrado:{' '}
                {snapshot.snapshotTimestamp
                  ? new Date(snapshot.snapshotTimestamp).toLocaleString('es-PE')
                  : 'N/A'}
              </span>
            </div>

            {/* 1. Vivienda */}
            <div className="p-4 bg-superficie-1 rounded-xl border border-line space-y-2.5">
              <h4 className="text-xs font-bold text-tinta-800 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-verde-700" />
                <span>Condiciones de Vivienda</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-tinta-700">
                <div>
                  <span className="text-tinta-500 block text-[10px]">Tipo de inmueble</span>
                  <span className="font-semibold capitalize">
                    {housing.housingType ? (housing.housingType === 'house' ? 'Casa' : 'Departamento') : 'No indicado'}
                  </span>
                </div>
                <div>
                  <span className="text-tinta-500 block text-[10px]">Patio o Jardín</span>
                  <span className="font-semibold">
                    {housing.hasYard ? (housing.yardFenced ? 'Sí, cercado' : 'Sí, sin cercar') : 'No tiene'}
                  </span>
                </div>
                <div>
                  <span className="text-tinta-500 block text-[10px]">Régimen de tenencia</span>
                  <span className="font-semibold">
                    {housing.ownsHome ? 'Propia' : 'Alquilada'}
                  </span>
                </div>
                <div>
                  <span className="text-tinta-500 block text-[10px]">Permiso de arrendador</span>
                  <span className="font-semibold">
                    {housing.landlordAllowsPets !== undefined
                      ? housing.landlordAllowsPets
                        ? 'Permitido'
                        : 'No permitido'
                      : 'No aplica'}
                  </span>
                </div>
                <div>
                  <span className="text-tinta-500 block text-[10px]">Mallas / Protección</span>
                  <span className="font-semibold">
                    {housing.hasBalconyProtection !== undefined
                      ? housing.hasBalconyProtection
                        ? 'Instaladas'
                        : 'Sin mallas'
                      : 'No especificado'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Hogar y Familia */}
            <div className="p-4 bg-superficie-1 rounded-xl border border-line space-y-2.5">
              <h4 className="text-xs font-bold text-tinta-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-verde-700" />
                <span>Composición del Hogar</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-tinta-700">
                <div>
                  <span className="text-tinta-500 block text-[10px]">Adultos en casa</span>
                  <span className="font-semibold">{household.adultsCount ?? 'No indicado'}</span>
                </div>
                <div>
                  <span className="text-tinta-500 block text-[10px]">Niños en casa</span>
                  <span className="font-semibold">{household.childrenCount ?? 0}</span>
                </div>
                <div>
                  <span className="text-tinta-500 block text-[10px]">Otras mascotas</span>
                  <span className="font-semibold">
                    {household.hasOtherPets ? (household.otherPetsDetails || 'Sí tiene') : 'Ninguna'}
                  </span>
                </div>
                <div>
                  <span className="text-tinta-500 block text-[10px]">Consenso familiar</span>
                  <span className="font-semibold">
                    {household.allMembersAgree ? 'Todos de acuerdo' : 'En discusión'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Rutina y Cuidados */}
            <div className="p-4 bg-superficie-1 rounded-xl border border-line space-y-2.5">
              <h4 className="text-xs font-bold text-tinta-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-verde-700" />
                <span>Rutina y Presupuesto</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-tinta-700">
                <div>
                  <span className="text-tinta-500 block text-[10px]">Horas a solas al día</span>
                  <span className="font-semibold">
                    {routine.hoursAlonePerDay !== null && routine.hoursAlonePerDay !== undefined
                      ? `${routine.hoursAlonePerDay} horas`
                      : 'No indicado'}
                  </span>
                </div>
                <div>
                  <span className="text-tinta-500 block text-[10px]">Experiencia previa</span>
                  <span className="font-semibold capitalize">
                    {routine.experienceLevel || 'Principiante'}
                  </span>
                </div>
                <div>
                  <span className="text-tinta-500 block text-[10px]">Tiempo de paseo/juego</span>
                  <span className="font-semibold">
                    {routine.exerciseTimeMinutes ? `${routine.exerciseTimeMinutes} min/día` : 'No indicado'}
                  </span>
                </div>
                <div>
                  <span className="text-tinta-500 block text-[10px]">Presupuesto mensual est.</span>
                  <span className="font-semibold">
                    {routine.budgetMonthlyPen ? `S/ ${routine.budgetMonthlyPen}` : 'No indicado'}
                  </span>
                </div>
                <div>
                  <span className="text-tinta-500 block text-[10px]">Cuidado en viajes</span>
                  <span className="font-semibold truncate block">
                    {routine.petCareTravel || 'Familiar / Guardería'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 p-4 border-t border-line bg-superficie-1 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-9 px-4 text-xs font-semibold border-line text-tinta-700 hover:bg-superficie-2 cursor-pointer"
          >
            Cerrar
          </Button>

          {isShelterView && onOpenReview && (adoption.status === 'pending' || adoption.status === 'under_review') && (
            <Button
              type="button"
              onClick={() => {
                onClose();
                onOpenReview(adoption);
              }}
              className="h-9 px-5 text-xs font-semibold bg-verde-700 hover:bg-verde-800 text-white cursor-pointer shadow-xs"
            >
              Dictaminar Solicitud
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
