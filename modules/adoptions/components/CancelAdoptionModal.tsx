'use client';

import React, { useState } from 'react';
import { Ban, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adoptionsService } from '../services/adoptions.service';
import type { AdoptionRequest } from '../models/adoption.types';

interface CancelAdoptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  adoption: AdoptionRequest | null;
  onSuccess: () => void;
}

export function CancelAdoptionModal({
  isOpen,
  onClose,
  adoption,
  onSuccess,
}: CancelAdoptionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !adoption) return null;

  const handleCancel = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await adoptionsService.cancelAdoption(adoption.id);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        errorObj.response?.data?.message ||
        errorObj.message ||
        'No fue posible cancelar la solicitud. Inténtalo nuevamente.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={isSubmitting ? undefined : onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl border border-line shadow-2xl z-10 p-6 space-y-4 animate-in zoom-in-95 duration-150 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center mx-auto">
          <Ban className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-tinta-900 font-heading">
            ¿Desistir de la postulación?
          </h3>
          <p className="text-xs sm:text-sm text-tinta-600 leading-relaxed">
            Estás a punto de cancelar voluntariamente tu solicitud de adopción para{' '}
            <strong>{adoption.pet?.name || 'la mascota'}</strong>. Se liberará tu cupo de postulación activa.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-coral-50 border border-coral-200 rounded-xl text-coral-800 text-xs text-left">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto h-9 px-4 text-xs font-semibold text-tinta-700 border-line hover:bg-superficie-2 cursor-pointer"
          >
            No, mantener solicitud
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto h-9 px-4 text-xs font-semibold bg-rose-700 hover:bg-rose-800 text-white cursor-pointer shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Cancelando...</span>
              </>
            ) : (
              <span>Sí, cancelar postulación</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
