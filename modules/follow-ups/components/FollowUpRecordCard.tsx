'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle,
  User as UserIcon,
  Home,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Award,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FollowUpStatusBadge } from './FollowUpStatusBadge';
import { MilestoneStatusBadge } from './MilestoneStatusBadge';
import { AdoptionCertificateCard } from './AdoptionCertificateCard';
import type {
  FollowUpRecordItem,
  FollowUpMilestoneItem,
} from '../models/follow-up.types';

interface Props {
  record: FollowUpRecordItem;
  currentUserId?: string;
  currentUserRole?: string;
  onOpenUploadEvidence: (recordId: string, milestone: FollowUpMilestoneItem) => void;
  onOpenReviewMilestone: (recordId: string, milestone: FollowUpMilestoneItem) => void;
  onOpenRequestReturn: (record: FollowUpRecordItem) => void;
  onOpenCoordinateReturn: (record: FollowUpRecordItem) => void;
}

export function FollowUpRecordCard({
  record,
  currentUserId,
  currentUserRole,
  onOpenUploadEvidence,
  onOpenReviewMilestone,
  onOpenRequestReturn,
  onOpenCoordinateReturn,
}: Props) {
  const isAdopter = currentUserRole === 'adopter' || record.adopterId === currentUserId;
  const isShelterOrAdmin =
    currentUserRole === 'shelter' ||
    currentUserRole === 'admin' ||
    record.shelterId === currentUserId;

  const activeReturn = record.activeReturn;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header with Pet & Status */}
      <div className="p-5 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-50/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-stone-200 flex-shrink-0 bg-stone-100">
            {record.pet.primaryPhotoUrl ? (
              <img
                src={record.pet.primaryPhotoUrl}
                alt={record.pet.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400">
                🐾
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-stone-900">
                {record.pet.name}
              </h3>
              <FollowUpStatusBadge status={record.status} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
              <span className="capitalize">{record.pet.species}</span>
              {record.pet.breed && <span>• {record.pet.breed}</span>}
              <span>• Inicio: {new Date(record.startDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Roles information & action triggers */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <UserIcon className="w-3.5 h-3.5 text-stone-400" />
            <span>Adoptante: <strong className="text-stone-800">{record.adopter.fullName || record.adopter.name || record.adopter.email}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-stone-400" />
            <span>Albergue: <strong className="text-stone-800">{record.shelter.name || record.shelter.email}</strong></span>
          </div>

          {/* Adopter return button */}
          {isAdopter && record.status === 'in_progress' && !activeReturn && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenRequestReturn(record)}
              className="border-rose-200 text-rose-700 hover:bg-rose-50 text-xs h-7 gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Solicitar Retorno
            </Button>
          )}
        </div>
      </div>

      {/* Return alert banner if return protocol is initiated */}
      {activeReturn && (
        <div className="mx-5 my-4 p-4 rounded-xl border border-rose-200 bg-rose-50/70 text-rose-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-lg mt-0.5">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-rose-900">
                  Solicitud de Retorno en Proceso ({activeReturn.status})
                </h4>
                <span className="text-xs bg-rose-200/80 text-rose-800 px-2 py-0.5 rounded-full font-medium">
                  Causa: {activeReturn.reason}
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-1 max-w-2xl">
                &ldquo;{activeReturn.explanation}&rdquo;
              </p>
              {activeReturn.scheduledReturnDate && (
                <p className="text-xs text-rose-800 font-semibold mt-1">
                  📅 Fecha de entrega coordinada: {new Date(activeReturn.scheduledReturnDate).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {isShelterOrAdmin && activeReturn.status !== 'returned' && (
            <Button
              size="sm"
              onClick={() => onOpenCoordinateReturn(record)}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5 flex-shrink-0"
            >
              {activeReturn.status === 'requested' ? 'Coordinar Logística' : 'Confirmar Recepción'}
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      )}

      {/* Graduation Certificate card if completed */}
      {record.status === 'completed' && (
        <div className="p-5">
          <AdoptionCertificateCard record={record} />
        </div>
      )}

      {/* Milestones Progress Timeline */}
      <div className="p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Etapas de Adaptación (30, 90 y 180 Días)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {record.milestones.map((m) => {
            const isDemoMode = process.env.NEXT_PUBLIC_FOLLOW_UP_DEMO_MODE === 'true';
            const sortedMilestones = [...record.milestones].sort((a, b) => a.daysTarget - b.daysTarget);
            const currentIndex = sortedMilestones.findIndex((item) => item.id === m.id);
            const previousMilestone = currentIndex > 0 ? sortedMilestones[currentIndex - 1] : null;
            const isPreviousApproved =
              !previousMilestone ||
              previousMilestone.status === 'completed' ||
              previousMilestone.status === 'approved';
            const isLockedBySequence = isAdopter && !isDemoMode && !isPreviousApproved;

            const isSubmitted = m.status === 'submitted';
            const isApproved = m.status === 'approved' || m.status === 'completed';
            const isOverdue = m.status === 'overdue';
            const isActionRequired = m.status === 'rejected' || m.status === 'action_required';
            const canUpload =
              isAdopter &&
              !isLockedBySequence &&
              (m.status === 'pending' || isOverdue || isActionRequired) &&
              record.status === 'in_progress';
            const canReview = isShelterOrAdmin && isSubmitted;

            return (
              <div
                key={m.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isApproved
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : isOverdue
                    ? 'border-amber-300 bg-amber-50/40'
                    : isSubmitted
                    ? 'border-blue-200 bg-blue-50/30'
                    : 'border-stone-200 bg-stone-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {m.daysTarget} Días
                    </span>
                    <MilestoneStatusBadge status={m.status} />
                  </div>

                  <div className="text-xs text-stone-500 mb-3">
                    Vencimiento: <strong className="text-stone-700">{new Date(m.dueDate).toLocaleDateString()}</strong>
                  </div>

                  {/* Evidences summary */}
                  {m.evidences && m.evidences.length > 0 ? (
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                        <Camera className="w-3.5 h-3.5 text-stone-500" />
                        <span>{m.evidences.length} foto(s) cargada(s)</span>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {m.evidences.map((ev) => (
                          <img
                            key={ev.id}
                            src={ev.mediaUrl || ev.photoUrl}
                            alt="Evidencia"
                            className="w-10 h-10 rounded-md object-cover border border-stone-200 flex-shrink-0"
                          />
                        ))}
                      </div>
                      {m.adaptationNotes && (
                        <p className="text-[11px] text-stone-600 line-clamp-2 italic bg-white/70 p-1.5 rounded border border-stone-100">
                          &ldquo;{m.adaptationNotes}&rdquo;
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-stone-400 italic mb-3">
                      Sin evidencias enviadas aún
                    </div>
                  )}

                  {/* Feedback if any */}
                  {m.shelterFeedback && (
                    <div className="p-2 rounded bg-white/80 border border-stone-200 text-[11px] text-stone-700 mb-3">
                      <span className="font-semibold text-stone-800 block mb-0.5">
                        Observación del Albergue:
                      </span>
                      {m.shelterFeedback}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-end">
                  {canUpload && (
                    <Button
                      size="sm"
                      onClick={() => onOpenUploadEvidence(record.id, m)}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs h-8 gap-1.5 shadow-sm"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      {isActionRequired ? 'Subir Nuevas Evidencias' : 'Subir Evidencias'}
                    </Button>
                  )}

                  {isLockedBySequence && (
                    <div className="w-full text-center py-1.5 px-2 bg-stone-100 rounded-lg text-[11px] text-stone-500 font-medium flex items-center justify-center gap-1.5 border border-stone-200/60">
                      <Lock className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                      <span>Requiere hito de {previousMilestone?.daysTarget}d aprobado</span>
                    </div>
                  )}

                  {canReview && (
                    <Button
                      size="sm"
                      onClick={() => onOpenReviewMilestone(record.id, m)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Dictaminar Hito
                    </Button>
                  )}

                  {!canUpload && !canReview && !isLockedBySequence && isSubmitted && isAdopter && (
                    <span className="text-xs font-medium text-blue-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> En evaluación por el albergue
                    </span>
                  )}

                  {!canUpload && !canReview && !isLockedBySequence && isApproved && (
                    <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado satisfactoriamente
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
