'use client';

import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, XCircle, RotateCcw, AlertTriangle, Loader2, Sparkles, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { useModal } from '@/shared/hooks/useModal';
import { followUpService } from '../services/follow-up.service';
import {
  type PetReturnItem,
  getPetReturnReasonLabel,
  parseReturnExplanationAndPhone,
} from '../models/follow-up.types';
import { formatFollowUpErrorMessage } from '../utils/follow-up-error';
import dayjs, { formatDate } from '@/shared/utils/date';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  petReturn: PetReturnItem | null;
  petName: string;
  adopterName: string;
  onSuccess: () => void;
}

export function ShelterReturnCoordinationModal({
  isOpen,
  onClose,
  petReturn,
  petName,
  adopterName,
  onSuccess,
}: Props) {
  // Step 1: Coordination (if requested)
  const [scheduledReturnDate, setScheduledReturnDate] = useState('');
  const [coordinationNotes, setCoordinationNotes] = useState('');

  // Step 2: Final completion (if under_coordination)
  const [decision, setDecision] = useState<'accept' | 'reject'>('accept');
  const [shelterObservations, setShelterObservations] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modalRef = React.useRef<HTMLDivElement>(null);
  useModal({ isOpen, onClose, preventClose: isSubmitting, modalRef });

  if (!isOpen || !petReturn) return null;

  const isCoordinatingPhase = petReturn.status === 'requested';

  const handleCoordinate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledReturnDate) {
      setErrorMessage('Por favor selecciona una fecha acordada para la entrega.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Send date at midday (12:00) so timezone conversions preserve the exact selected date
      const isoDate = dayjs(scheduledReturnDate).hour(12).minute(0).second(0).toISOString();
      await followUpService.coordinatePetReturn(petReturn.id, {
        scheduledReturnDate: isoDate,
        coordinationNotes: coordinationNotes.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setErrorMessage(
        formatFollowUpErrorMessage(
          err,
          'No se pudo coordinar la fecha de retorno. Por favor verifica la fecha e intenta de nuevo.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await followUpService.completePetReturn(petReturn.id, {
        decision,
        shelterObservations: shelterObservations.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setErrorMessage(
        formatFollowUpErrorMessage(
          err,
          'No se pudo registrar la recepción o conclusión del retorno. Por favor intenta de nuevo.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              {isCoordinatingPhase ? 'Coordinar Logística de Retorno' : 'Confirmar Recepción de Mascota'}
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

        {isCoordinatingPhase ? (
          <form onSubmit={handleCoordinate} className="p-6 space-y-4 overflow-y-auto">
            {errorMessage && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                {errorMessage}
              </div>
            )}

            {(() => {
              const { cleanExplanation, phone } = parseReturnExplanationAndPhone(
                petReturn.explanation,
                petReturn.emergencyContactPhone,
              );

              return (
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Motivo reportado por el adoptante
                  </span>
                  <p className="text-xs font-semibold text-rose-950 bg-rose-100/70 border border-rose-200 px-2.5 py-1 rounded-lg w-fit">
                    {getPetReturnReasonLabel(petReturn.reason)}
                  </p>
                  {cleanExplanation && (
                    <p className="text-xs text-stone-600 italic leading-relaxed">
                      &ldquo;{cleanExplanation}&rdquo;
                    </p>
                  )}
                  {phone && (
                    <div className="flex items-center gap-1.5 text-xs text-stone-700 bg-white border border-stone-200 px-2.5 py-1.5 rounded-lg w-fit mt-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-stone-500">Teléfono celular de contacto:</span>
                      <a href={`tel:${phone}`} className="font-bold text-stone-900 underline hover:text-emerald-700">
                        {phone}
                      </a>
                    </div>
                  )}
                </div>
              );
            })()}

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Fecha Acordada de Recepción en Albergue *</span>
                <span className="text-[11px] font-normal text-stone-400 lowercase">
                  (Día de entrega física)
                </span>
              </label>
              <DatePicker
                value={scheduledReturnDate}
                onChange={(dateStr) => setScheduledReturnDate(dateStr)}
                minDate={new Date()}
                placeholder="Seleccionar fecha acordada de recepción..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Instrucciones Logísticas para el Adoptante
              </label>
              <textarea
                rows={3}
                value={coordinationNotes}
                onChange={(e) => setCoordinationNotes(e.target.value)}
                placeholder="Indica la dirección exacta, llevar cartilla de vacunación, correa/transportador..."
                className="w-full text-sm rounded-xl border border-stone-300 p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !scheduledReturnDate}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando fecha...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Programar Cita de Retorno
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleComplete} className="p-6 space-y-4 overflow-y-auto">
            {errorMessage && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                {errorMessage}
              </div>
            )}

            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Reactivación Automática de Mascota</span>
                Al confirmar la recepción física, el estado de <strong className="font-semibold">{petName}</strong> cambiará inmediatamente a <strong>DISPONIBLE</strong> en el catálogo público para que nuevas familias puedan solicitar su adopción.
              </div>
            </div>

            {petReturn.scheduledReturnDate && (
              <div className="flex items-center gap-2.5 p-3 bg-amber-50/80 border border-amber-200 text-amber-950 rounded-xl text-xs">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Fecha de entrega coordinada:{" "}
                  <strong className="capitalize">
                    {formatDate(petReturn.scheduledReturnDate, "dddd, D [de] MMMM [de] YYYY")}
                  </strong>
                </span>
              </div>
            )}

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 block mb-2">
                Resultado de la Recepción Física *
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDecision('accept')}
                  className={`p-3 rounded-xl border-2 text-left flex items-start gap-2.5 transition-all ${
                    decision === 'accept'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <CheckCircle2
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      decision === 'accept' ? 'text-emerald-600' : 'text-stone-400'
                    }`}
                  />
                  <div>
                    <div className="text-sm">Recibir Mascota</div>
                    <div className="text-[11px] text-stone-500 font-normal">
                      Mascota recibida físicamente e ingresada al albergue.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDecision('reject')}
                  className={`p-3 rounded-xl border-2 text-left flex items-start gap-2.5 transition-all ${
                    decision === 'reject'
                      ? 'border-rose-500 bg-rose-50 text-rose-950 font-semibold'
                      : 'border-stone-200 hover:border-stone-300 text-stone-600'
                  }`}
                >
                  <XCircle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      decision === 'reject' ? 'text-rose-600' : 'text-stone-400'
                    }`}
                  />
                  <div>
                    <div className="text-sm">Rechazar / Cancelar</div>
                    <div className="text-[11px] text-stone-500 font-normal">
                      Adoptante desistió o no se concretó la entrega.
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Observaciones del Albergue
              </label>
              <textarea
                rows={3}
                value={shelterObservations}
                onChange={(e) => setShelterObservations(e.target.value)}
                placeholder="Estado físico y anímico al momento de la entrega, pertenencias entregadas..."
                className="w-full text-sm rounded-xl border border-stone-300 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={
                  decision === 'accept'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white gap-2'
                    : 'bg-rose-600 hover:bg-rose-700 text-white gap-2'
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Completando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Formalizar y Reactivar Mascota
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
