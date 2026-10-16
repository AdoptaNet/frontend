'use client';

import React from 'react';
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Mail,
  ExternalLink,
  X,
  FileText,
  MapPin,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useModal } from '@/shared/hooks/useModal';

interface VerificationInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationName?: string | null;
  isVerified?: boolean;
}

export function VerificationInfoModal({
  isOpen,
  onClose,
  organizationName,
  isVerified = false,
}: VerificationInfoModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  useModal({ isOpen, onClose, modalRef });

  if (!isOpen) return null;

  const displayName = organizationName?.trim() || 'tu albergue';

  const mailtoSubject = encodeURIComponent(
    `Solicitud de Verificación Oficial - ${displayName}`,
  );
  const mailtoBody = encodeURIComponent(
    `Estimado equipo de administración de AdoptaNet,\n\nSolicitamos la acreditación oficial y distintivo de verificación para:\n- Nombre del albergue: ${displayName}\n- Enlace a redes sociales o web: \n- Documento de identidad / RUC (opcional): \n- Breve resumen de nuestra labor de rescate: \n\nAdjuntamos evidencias fotográficas o información adicional para su revisión.\n\nAtentamente,`,
  );
  const mailtoLink = `mailto:soporte@adopta.pe?subject=${mailtoSubject}&body=${mailtoBody}`;

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
                  : 'Acreditación Oficial de Albergues'}
              </h3>
              <p className="text-xs text-tinta-600">
                {isVerified
                  ? 'Tu organización cuenta con respaldo oficial'
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
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>¿Por qué no hay un botón de auto-verificación?</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-800">
                Para prevenir criaderos ilegales, estafas y resguardar la seguridad de los animales,
                la verificación <strong>no es automática ni de libre auto-asignación</strong>. Es un dictamen
                administrativo otorgado exclusivamente por el equipo de AdoptaNet tras corroborar la
                autenticidad de cada refugio o rescatista.
              </p>
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
                    Asegúrate de registrar tu teléfono de contacto, ciudad, departamento y ubicar el pin de tu sede en el mapa interactivo.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-superficie-1 border border-line">
                <div className="w-6 h-6 rounded-full bg-verde-100 text-verde-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="font-semibold text-tinta-900 block">
                    Enviar solicitud formal
                  </span>
                  <span className="text-tinta-600">
                    Escríbenos a <strong className="text-tinta-900">soporte@adopta.pe</strong> enviando comprobantes o enlaces a redes sociales activas donde se evidencia tu labor de rescate.
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

          {!isVerified && (
            <a
              href={mailtoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-md bg-verde-700 hover:bg-verde-hover text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Solicitar Acreditación</span>
              <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
