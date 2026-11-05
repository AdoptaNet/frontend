'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, AlertCircle, Loader2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/shared/hooks/useModal';
import { followUpService } from '../services/follow-up.service';
import type { FollowUpMilestoneItem } from '../models/follow-up.types';
import { formatFollowUpErrorMessage } from '../utils/follow-up-error';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recordId: string;
  milestone: FollowUpMilestoneItem | null;
  petName: string;
  adopterName: string;
  onSuccess: () => void;
}

export function MilestoneReviewModal({
  isOpen,
  onClose,
  recordId,
  milestone,
  petName,
  adopterName,
  onSuccess,
}: Props) {
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');
  const [shelterFeedback, setShelterFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modalRef = React.useRef<HTMLDivElement>(null);
  useModal({ isOpen, onClose, preventClose: isSubmitting, modalRef });

  if (!isOpen || !milestone) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const resolvedDecision = decision === 'approved' ? 'approved' : 'action_required';
    const notes = shelterFeedback.trim();

    try {
      await followUpService.reviewMilestone(recordId, milestone.id, {
        decision: resolvedDecision,
        reviewNotes: notes || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(
        formatFollowUpErrorMessage(
          err,
          'No fue posible registrar el dictamen del hito. Por favor intenta nuevamente.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFinalMilestone = milestone.milestoneType === '180_days';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              Evaluación de Evidencias ({milestone.daysTarget} Días)
            </h3>
            <p className="text-xs text-stone-500">
              Mascota: <strong className="text-stone-700">{petName}</strong> | Adoptante: <strong className="text-stone-700">{adopterName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {errorMessage && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Adopter submitted notes */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-1">
              Notas enviadas por el adoptante
            </span>
            <p className="text-sm text-stone-800 whitespace-pre-wrap">
              {milestone.adaptationNotes || 'Sin notas adicionales.'}
            </p>
          </div>

          {/* Adopter submitted pictures */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-2">
              Evidencias Fotográficas ({milestone.evidences?.length || 0})
            </span>
            {milestone.evidences && milestone.evidences.length > 0 ? (
              <div className="grid grid-cols-3 gap-2.5">
                {milestone.evidences.map((ev) => {
                  const imgUrl = ev.mediaUrl;
                  return (
                    <a
                      key={ev.id}
                      href={imgUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block aspect-square rounded-lg overflow-hidden border border-stone-200 group relative bg-stone-100"
                    >
                      <img
                        src={imgUrl}
                        alt="Evidencia"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                        Ver grande
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">No se adjuntaron fotos.</p>
            )}
          </div>

          {/* Decision */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
              Dictamen de Revisión *
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision('approved')}
                className={`p-3.5 rounded-xl border-2 text-left flex items-start gap-2.5 transition-all ${
                  decision === 'approved'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold'
                    : 'border-stone-200 hover:border-stone-300 text-stone-600'
                }`}
              >
                <CheckCircle2
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    decision === 'approved' ? 'text-emerald-600' : 'text-stone-400'
                  }`}
                />
                <div>
                  <div className="text-sm">Aprobar Hito</div>
                  <div className="text-[11px] text-stone-500 font-normal">
                    Las fotos y condiciones muestran un entorno adecuado y seguro.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDecision('rejected')}
                className={`p-3.5 rounded-xl border-2 text-left flex items-start gap-2.5 transition-all ${
                  decision === 'rejected'
                    ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-semibold'
                    : 'border-stone-200 hover:border-stone-300 text-stone-600'
                }`}
              >
                <XCircle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    decision === 'rejected' ? 'text-rose-600' : 'text-stone-400'
                  }`}
                />
                <div>
                  <div className="text-sm">Observar / Rechazar</div>
                  <div className="text-[11px] text-stone-500 font-normal">
                    Evidencias insuficientes o señales de alerta que requieren reenvío.
                  </div>
                </div>
              </button>
            </div>
          </div>

          {isFinalMilestone && decision === 'approved' && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs">
              <Award className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Atención:</strong> Al aprobar este último hito (180 días), el expediente pasará a <strong>COMPLETADO</strong> y se generará automáticamente el <strong>Certificado Oficial de Graduación</strong>.
              </span>
            </div>
          )}

          {/* Feedback comments */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Observaciones o Mensaje para el Adoptante
            </label>
            <textarea
              rows={3}
              value={shelterFeedback}
              onChange={(e) => setShelterFeedback(e.target.value)}
              placeholder="Felicita al adoptante o explica qué observaciones debe solventar..."
              className="w-full text-sm rounded-xl border border-stone-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={
                decision === 'approved'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Guardando dictamen...
                </>
              ) : decision === 'approved' ? (
                'Confirmar Aprobación'
              ) : (
                'Registrar Observación'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
