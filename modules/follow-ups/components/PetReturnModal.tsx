'use client';

import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle, ShieldAlert, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/shared/hooks/useModal';
import { followUpService } from '../services/follow-up.service';
import { PET_RETURN_REASONS, type PetReturnReason } from '../models/follow-up.types';
import { formatFollowUpErrorMessage } from '../utils/follow-up-error';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recordId: string;
  petName: string;
  shelterName: string;
  onSuccess: () => void;
}

export function PetReturnModal({
  isOpen,
  onClose,
  recordId,
  petName,
  shelterName,
  onSuccess,
}: Props) {
  const [reason, setReason] = useState<PetReturnReason>('behavioral_issue');
  const [explanation, setExplanation] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [confirmedProtocol, setConfirmedProtocol] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modalRef = React.useRef<HTMLDivElement>(null);
  useModal({ isOpen, onClose, preventClose: isSubmitting, modalRef });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) {
      setErrorMessage('Por favor detalla el motivo de la solicitud de retorno.');
      return;
    }
    if (!confirmedProtocol) {
      setErrorMessage('Debes confirmar que comprendes el protocolo de retorno responsable.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await followUpService.requestPetReturn(recordId, {
        reason,
        explanation: explanation.trim(),
        emergencyContactPhone: emergencyContactPhone.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(
        formatFollowUpErrorMessage(
          err,
          'No se pudo registrar la solicitud de retorno. Por favor intenta de nuevo.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedReasonObj = PET_RETURN_REASONS.find((r) => r.value === reason);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-rose-50/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Protocolo de Retorno Responsable
              </h3>
              <p className="text-xs text-stone-500">
                Mascota: <strong className="text-stone-700">{petName}</strong> | Albergue: <strong className="text-stone-700">{shelterName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {errorMessage && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Política de Cero Abandono y Protección Animal</span>
              AdoptaNet y <strong className="font-semibold">{shelterName}</strong> garantizan que la mascota será recibida de forma segura para encontrarle un nuevo hogar idóneo. Nunca abandones a un animal ni lo entregues a terceros sin notificación.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Causa Principal del Retorno *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as PetReturnReason)}
              className="w-full text-sm rounded-xl border border-stone-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              {PET_RETURN_REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            {selectedReasonObj && (
              <p className="text-xs text-stone-500 mt-1 italic">
                {selectedReasonObj.description}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Explicación Detallada de la Situación *
            </label>
            <textarea
              rows={4}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explica qué ha sucedido, qué medidas se intentaron y las circunstancias que motivan esta decisión difícil..."
              className="w-full text-sm rounded-xl border border-stone-300 p-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Teléfono de Contacto para Coordinación
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder="+51 987 654 321"
                className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer hover:bg-stone-100/70 transition-colors">
            <input
              type="checkbox"
              checked={confirmedProtocol}
              onChange={(e) => setConfirmedProtocol(e.target.checked)}
              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
            />
            <span className="text-xs text-stone-700 leading-relaxed">
              Confirmo que he cuidado de la mascota con respeto, mantengo sus cartillas de salud al día y me comprometo a llevarla al albergue en la fecha y hora que coordinemos.
            </span>
          </label>

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
              disabled={isSubmitting || !explanation.trim() || !confirmedProtocol}
              className="bg-rose-600 hover:bg-rose-700 text-white gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Registrando retorno...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Iniciar Retorno Responsable
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
