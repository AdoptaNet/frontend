'use client';

import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
  FileCheck2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/shared/hooks/useModal';
import { adoptionsService } from '../services/adoptions.service';
import type {
  AdoptionRequest,
  AdoptionStatus,
  AdoptionRejectionReason,
} from '../models/adoption.types';
import { ADOPTION_REJECTION_REASONS } from '../models/adoption.types';

interface ReviewAdoptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  adoption: AdoptionRequest | null;
  onSuccess: () => void;
}

export function ReviewAdoptionModal({
  isOpen,
  onClose,
  adoption,
  onSuccess,
}: ReviewAdoptionModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<AdoptionStatus>('approved');
  const [rejectionReason, setRejectionReason] =
    useState<AdoptionRejectionReason>('incompatible_housing');
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modalRef = React.useRef<HTMLDivElement>(null);
  useModal({ isOpen, onClose, preventClose: isSubmitting, modalRef });

  if (!isOpen || !adoption) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (selectedStatus === 'approved') {
        await adoptionsService.reviewAdoption(adoption.id, {
          status: 'approved',
          reviewNotes: reviewNotes.trim() || undefined,
        });
      } else if (selectedStatus === 'rejected') {
        await adoptionsService.reviewAdoption(adoption.id, {
          status: 'rejected',
          rejectionReason,
          rejectionNotes: rejectionNotes.trim() || undefined,
        });
      } else {
        await adoptionsService.reviewAdoption(adoption.id, {
          status: 'under_review',
          reviewNotes: reviewNotes.trim() || undefined,
        });
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        errorObj.response?.data?.message ||
        errorObj.message ||
        'No se pudo registrar la resolución. Inténtalo nuevamente.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-hidden overscroll-contain animate-in fade-in duration-150"
    >
      <div className="fixed inset-0" onClick={isSubmitting ? undefined : onClose} />

      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Dictaminar Solicitud"
        data-lenis-prevent
        className="relative w-full max-w-lg bg-white rounded-2xl border border-line shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh] h-full sm:h-auto min-h-0 overscroll-contain outline-none animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-line bg-superficie-1">
          <div>
            <h2 className="text-base font-bold text-tinta-900 font-heading">
              Dictaminar Solicitud
            </h2>
            <p className="text-xs text-tinta-600">
              Postulante: <strong>{adoption.adopter?.fullName || 'Adoptante'}</strong> para{' '}
              <strong>{adoption.pet?.name || 'Mascota'}</strong>
            </p>
          </div>
          {!isSubmitting && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md text-tinta-500 hover:text-tinta-900 hover:bg-superficie-2 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form
          data-lenis-prevent
          tabIndex={0}
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto overscroll-contain space-y-5 flex-1 min-h-0 focus:outline-none"
        >
          {/* Action Decision Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-tinta-900 block">
              Resolución a emitir:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedStatus('approved')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedStatus === 'approved'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                    : 'border-line hover:border-emerald-300 text-tinta-700'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                <span className="text-xs block">Aprobar</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('under_review')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedStatus === 'under_review'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20 font-bold'
                    : 'border-line hover:border-blue-300 text-tinta-700'
                }`}
              >
                <Eye className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <span className="text-xs block">En Revisión</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('rejected')}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedStatus === 'rejected'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20 font-bold'
                    : 'border-line hover:border-rose-300 text-tinta-700'
                }`}
              >
                <XCircle className="w-5 h-5 mx-auto mb-1 text-rose-600" />
                <span className="text-xs block">No Aceptar</span>
              </button>
            </div>
          </div>

          {/* Conditional UI according to decision */}
          {selectedStatus === 'approved' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-amber-950">
                    Confirmación de Adopción
                  </p>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Al confirmar la aprobación, <strong>{adoption.pet?.name}</strong> pasará automáticamente al estado <strong>adoptado</strong> y todas las demás solicitudes en curso para esta mascota se cerrarán con una notificación respetuosa de agradecimiento.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-tinta-900 block">
                  Notas de coordinación o entrega (opcional):
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Detalles sobre lugar y horario de entrega, documentación o firmas de contrato requeridas..."
                  className="w-full p-2.5 text-xs rounded-xl border border-line bg-white focus:border-verde-600 focus:ring-1 focus:ring-verde-600 outline-none resize-none"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {selectedStatus === 'under_review' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <p className="text-xs text-tinta-600 leading-relaxed">
                Cambia el estado para indicar que estás examinando el expediente, verificando referencias o agendando una entrevista inicial con el postulante.
              </p>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-tinta-900 block">
                  Notas internas (opcional):
                </label>
                <textarea
                  rows={2}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Ej: Entrevista telefónica programada para mañana..."
                  className="w-full p-2.5 text-xs rounded-xl border border-line bg-white focus:border-verde-600 focus:ring-1 focus:ring-verde-600 outline-none resize-none"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {selectedStatus === 'rejected' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-tinta-900 block">
                  Motivo de la decisión:
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value as AdoptionRejectionReason)}
                  className="w-full p-2.5 text-xs rounded-xl border border-line bg-white focus:border-verde-600 focus:ring-1 focus:ring-verde-600 outline-none cursor-pointer"
                  disabled={isSubmitting}
                >
                  {ADOPTION_REJECTION_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label} — {r.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-tinta-900 block">
                  Feedback constructivo para el adoptante (opcional):
                </label>
                <textarea
                  rows={3}
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  placeholder="Proporciona orientación constructiva (ej: sugerir mascotas más tranquilas, requerimiento de mallas de seguridad, etc.)..."
                  className="w-full p-2.5 text-xs rounded-xl border border-line bg-white focus:border-verde-600 focus:ring-1 focus:ring-verde-600 outline-none resize-none"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-coral-50 border border-coral-200 rounded-xl text-coral-800 text-xs">
              {errorMessage}
            </div>
          )}

          <div className="shrink-0 flex items-center justify-end gap-2 pt-2 border-t border-line">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-9 px-4 text-xs font-semibold border-line text-tinta-700 hover:bg-superficie-2 cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`h-9 px-5 text-xs font-semibold text-white cursor-pointer shadow-xs ${
                selectedStatus === 'approved'
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : selectedStatus === 'rejected'
                  ? 'bg-rose-700 hover:bg-rose-800'
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>Confirmar Dictamen</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
