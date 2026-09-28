'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Heart,
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  Loader2,
  X,
  Info,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adoptionsService } from '../services/adoptions.service';

interface ApplyAdoptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: {
    id: string;
    name: string;
    species: string;
    breed?: string | null;
    primaryPhotoUrl?: string | null;
    status: string;
  };
  onSuccess?: () => void;
}

export function ApplyAdoptionModal({
  isOpen,
  onClose,
  pet,
  onSuccess,
}: ApplyAdoptionModalProps) {
  const router = useRouter();
  const [motivationLetter, setMotivationLetter] = useState('');
  const [pledgeAccepted, setPledgeAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const minChars = 30;
  const currentLength = motivationLetter.trim().length;
  const isLetterValid = currentLength >= minChars;
  const canSubmit = isLetterValid && pledgeAccepted && !isSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await adoptionsService.submitAdoption({
        petId: pet.id,
        motivationLetter: motivationLetter.trim(),
        responsibilityPledge: pledgeAccepted,
      });

      setIsSubmittedSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const backendMessage =
        errorObj.response?.data?.message ||
        errorObj.message ||
        'No fue posible enviar la solicitud. Por favor intenta nuevamente.';
      setErrorMessage(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={isSubmitting ? undefined : onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-line shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-superficie-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-verde-50 border border-verde-200 text-verde-700 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-tinta-900 font-heading">
                Postular a Adopción
              </h2>
              <p className="text-xs text-tinta-600">
                Solicitud formal para <strong>{pet.name}</strong>
              </p>
            </div>
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

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
          {isSubmittedSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-tinta-900 font-heading">
                  ¡Postulación enviada exitosamente!
                </h3>
                <p className="text-xs sm:text-sm text-tinta-600 max-w-sm mx-auto leading-relaxed">
                  Tu solicitud y tu expediente de compatibilidad congelado han sido enviados al albergue de <strong>{pet.name}</strong>. Te notificaremos por correo cuando haya novedades.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:w-auto h-9 text-xs border-line text-tinta-700 hover:bg-superficie-2"
                >
                  Seguir explorando
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push('/applications');
                  }}
                  className="w-full sm:w-auto h-9 text-xs bg-verde-700 hover:bg-verde-800 text-white font-semibold"
                >
                  Ver mis solicitudes
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Pet Quick Mini Card */}
              <div className="flex items-center gap-3 p-3 bg-superficie-1 rounded-xl border border-line">
                {pet.primaryPhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={pet.primaryPhotoUrl}
                    alt={pet.name}
                    className="w-14 h-14 rounded-lg object-cover border border-line shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-verde-50 border border-verde-200 flex items-center justify-center text-verde-700 shrink-0">
                    <Heart className="w-6 h-6" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-tinta-900 truncate font-heading">
                    {pet.name}
                  </h4>
                  <p className="text-xs text-tinta-600 capitalize">
                    {pet.species === 'dog' ? 'Perro' : pet.species === 'cat' ? 'Gato' : pet.species} {pet.breed ? `• ${pet.breed}` : ''}
                  </p>
                  <p className="text-[11px] text-verde-700 font-medium mt-0.5">
                    Disponible para adopción responsable
                  </p>
                </div>
              </div>

              {/* Snapshot Notice (US-15 Escenario 1) */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-semibold text-amber-950">
                  <Info className="w-4 h-4 shrink-0 text-amber-700" />
                  <span>Copia inmutable de compatibilidad (Snapshot)</span>
                </div>
                <p className="text-amber-800 leading-relaxed text-[11px]">
                  Al enviar la postulación, se adjuntará una fotografía fija de tus 33 respuestas actuales (tipo de vivienda, integrantes del hogar, presupuesto y rutina).
                </p>
                <div className="pt-0.5">
                  <Link
                    href="/profile?tab=role-specific"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 underline hover:text-amber-950"
                  >
                    <span>¿Cambiaron tus condiciones? Revisa tu perfil aquí</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Motivation Letter Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="motivationLetter"
                    className="text-xs font-bold text-tinta-900"
                  >
                    Carta de Motivación <span className="text-coral-600">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-medium ${
                      isLetterValid ? 'text-verde-700' : 'text-tinta-500'
                    }`}
                  >
                    {currentLength}/{minChars} caracteres mín.
                  </span>
                </div>
                <textarea
                  id="motivationLetter"
                  rows={4}
                  value={motivationLetter}
                  onChange={(e) => setMotivationLetter(e.target.value)}
                  placeholder={`Explica por qué deseas adoptar a ${pet.name}, tu experiencia previa con mascotas y la rutina que le brindarás...`}
                  className={`w-full p-3 text-xs sm:text-sm rounded-xl border transition-colors outline-none resize-none ${
                    motivationLetter.length > 0 && !isLetterValid
                      ? 'border-amber-400 bg-amber-50/20 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                      : 'border-line bg-white focus:border-verde-600 focus:ring-1 focus:ring-verde-600'
                  }`}
                  disabled={isSubmitting}
                />
                {motivationLetter.length > 0 && !isLetterValid && (
                  <p className="text-[11px] text-amber-700">
                    Faltan {minChars - currentLength} caracteres para el mínimo requerido.
                  </p>
                )}
              </div>

              {/* Responsibility Pledge Checkbox */}
              <div className="p-3 bg-superficie-1 rounded-xl border border-line space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pledgeAccepted}
                    onChange={(e) => setPledgeAccepted(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-line text-verde-700 focus:ring-verde-600 cursor-pointer"
                    disabled={isSubmitting}
                  />
                  <span className="text-xs text-tinta-800 leading-snug">
                    <strong className="text-tinta-900 font-semibold">Compromiso de tenencia responsable:</strong> Me comprometo formalmente al cuidado integral, salud veterinaria, alimentación adecuada y protección de <strong>{pet.name}</strong> por el resto de su vida.
                  </span>
                </label>
              </div>

              {/* Concurrency Rule Note */}
              <p className="text-[11px] text-center text-tinta-500">
                Puedes tener un máximo de 3 solicitudes simultáneas en evaluación.
              </p>

              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-3 bg-coral-50 border border-coral-200 rounded-xl flex items-start gap-2 text-coral-800 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-coral-600 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
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
                  disabled={!canSubmit}
                  className="h-9 px-5 text-xs font-semibold bg-verde-700 hover:bg-verde-800 text-white gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck2 className="w-4 h-4" />
                      <span>Confirmar y Postular</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
