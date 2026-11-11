'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/shared/hooks/useModal';
import { usersService } from '../services/users.service';

interface VerificationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationName?: string | null;
  isVerified?: boolean;
  isRequested?: boolean;
  isOwner?: boolean;
  onSuccess?: () => void;
}

export function VerificationInfoModal({
  isOpen,
  onClose,
  organizationName,
  isVerified = false,
  isRequested = false,
  isOwner = true,
  onSuccess,
}: VerificationInfoModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  useModal({ isOpen, onClose, modalRef });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasRequestedLocally, setHasRequestedLocally] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setHasRequestedLocally(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const displayName = organizationName?.trim() || 'tu albergue';
  const pendingReview = isRequested || hasRequestedLocally;

  const handleRequestVerification = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      await usersService.requestShelterVerification();
      setHasRequestedLocally(true);
      onSuccess?.();
    } catch (err: unknown) {
      const errorWithResponse = err as {
        response?: { data?: { message?: string | string[] } };
        message?: string;
      };
      const msg =
        errorWithResponse?.response?.data?.message ||
        errorWithResponse?.message ||
        'Error al enviar la solicitud de verificación. Verifica tus datos de contacto e inténtalo de nuevo.';
      setErrorMessage(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-hidden overscroll-contain animate-in fade-in-0 duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} />
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-verification-title"
        data-lenis-prevent
        className="relative w-full max-w-lg bg-white rounded-2xl border border-line shadow-xl overflow-hidden my-8 z-10 flex flex-col max-h-[85vh] h-full sm:h-auto min-h-0 overscroll-contain outline-none"
      >
        {/* Header */}
        <div className="shrink-0 flex items-start justify-between p-6 pb-4 border-b border-line bg-superficie-1">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isVerified
                  ? 'bg-emerald-100 text-emerald-700'
                  : pendingReview
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-amber-100 text-amber-700'
              }`}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3
                id="modal-verification-title"
                className="text-lg font-heading font-bold text-tinta-900 leading-snug"
              >
                {isVerified
                  ? 'Albergue Verificado por AdoptaNet'
                  : pendingReview
                    ? 'Solicitud en Revisión'
                    : 'Acreditación Oficial de Albergues'}
              </h3>
              <p className="text-xs text-tinta-600">
                {isVerified
                  ? 'Tu organización cuenta con respaldo oficial'
                  : pendingReview
                    ? 'El equipo de administración está evaluando tu solicitud'
                    : 'Distintivo de confianza y transparencia'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-tinta-400 hover:text-tinta-700 p-1 rounded-lg hover:bg-superficie-2 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div
          data-lenis-prevent
          tabIndex={0}
          className="p-6 space-y-5 text-sm text-tinta-700 flex-1 min-h-0 overflow-y-auto focus:outline-none"
        >
          {isVerified ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Estado actual: Acreditado y Verificado</span>
              </div>
              <p className="text-xs leading-relaxed text-emerald-700">
                Todas las fichas de tus mascotas rescatadas cuentan con la insignia verde de
                confianza en el catálogo público, garantizando a los adoptantes que su proceso
                es respaldado por una organización seria y validada.
              </p>
            </div>
          ) : pendingReview ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs text-amber-800">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Estado actual: Solicitud en revisión</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-800">
                La solicitud de acreditación para <strong>{displayName}</strong> se encuentra
                en evaluación administrativa. Corroboraremos tus datos institucionales y
                recibirás una respuesta por correo electrónico a la brevedad.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>¿Por qué no hay un botón de auto-verificación?</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-800">
                Para prevenir criaderos ilegales, estafas y resguardar la seguridad de los animales,
                la verificación <strong>no es automática ni de libre auto-asignación</strong>. Es un dictamen
                administrativo otorgado por el equipo de AdoptaNet tras corroborar la
                autenticidad de cada refugio o rescatista.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Pasos para verificarse */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-tinta-900">
              ¿Cómo obtener la insignia de verificación?
            </h4>

            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-superficie-1 border border-line">
                <div className="w-6 h-6 rounded-full bg-verde-100 text-verde-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="font-semibold text-tinta-900 block">
                    Completar datos institucionales
                  </span>
                  <span className="text-tinta-600">
                    Asegúrate de registrar el nombre de tu organización, teléfono de contacto y ciudad o sede de rescate.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-superficie-1 border border-line">
                <div className="w-6 h-6 rounded-full bg-verde-100 text-verde-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="font-semibold text-tinta-900 block">
                    Enviar solicitud directa
                  </span>
                  <span className="text-tinta-600">
                    Presiona el botón de solicitud para que tu perfil aparezca en la bandeja de revisión del equipo de administración.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-superficie-1 border border-line">
                <div className="w-6 h-6 rounded-full bg-verde-100 text-verde-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="font-semibold text-tinta-900 block">
                    Dictamen del Administrador
                  </span>
                  <span className="text-tinta-600">
                    Un administrador validará tus credenciales y activará la verificación en el sistema. Recibirás un correo de confirmación.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-line bg-superficie-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs h-9 border-line"
          >
            Cerrar
          </Button>

          {!isVerified && isOwner && (
            pendingReview ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Solicitud en Revisión</span>
              </span>
            ) : (
              <Button
                type="button"
                onClick={handleRequestVerification}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-4 h-9 rounded-md bg-verde-700 hover:bg-verde-hover text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Enviando solicitud...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Solicitar Verificación Oficial</span>
                  </>
                )}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
