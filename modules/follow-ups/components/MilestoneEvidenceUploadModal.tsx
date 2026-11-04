'use client';

import React, { useState } from 'react';
import { X, UploadCloud, Trash2, Loader2, Image as ImageIcon, CheckCircle } from 'lucide-react';
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
  onSuccess: () => void;
}

export function MilestoneEvidenceUploadModal({
  isOpen,
  onClose,
  recordId,
  milestone,
  petName,
  onSuccess,
}: Props) {
  const [adaptationNotes, setAdaptationNotes] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const modalRef = React.useRef<HTMLDivElement>(null);
  useModal({ isOpen, onClose, preventClose: isSubmitting || isUploadingPhoto, modalRef });

  if (!isOpen || !milestone) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhoto(true);
    setErrorMessage(null);

    try {
      const uploadPromises = Array.from(files).map((file) =>
        followUpService.uploadPhoto(file),
      );
      const results = await Promise.all(uploadPromises);
      const newUrls = results
        .map((r) => r.url || r.secureUrl)
        .filter((url): url is string => Boolean(url));
      setPhotoUrls((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Error al subir una o más fotografías. Intenta nuevamente.',
      );
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adaptationNotes.trim()) {
      setErrorMessage('Por favor ingresa un reporte o notas sobre la adaptación.');
      return;
    }
    if (photoUrls.length === 0) {
      setErrorMessage('Debes adjuntar al menos 1 fotografía actual de la mascota.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await followUpService.submitMilestoneEvidence(recordId, milestone.id, {
        adaptationNotes,
        evidences: photoUrls.map((url) => ({
          evidenceType: 'pet_photo',
          mediaUrl: url,
          photoUrl: url,
        })),
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(
        formatFollowUpErrorMessage(
          err,
          'No fue posible enviar las evidencias. Por favor verifica las imágenes e intenta de nuevo.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMilestoneLabel = () => {
    switch (milestone.milestoneType) {
      case '30_days':
        return '30 Días (Primer Mes)';
      case '90_days':
        return '90 Días (Tres Meses)';
      case '180_days':
        return '180 Días (Seis Meses - Graduación)';
      default:
        return 'Hito de Seguimiento';
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
              Reporte de Seguimiento: {getMilestoneLabel()}
            </h3>
            <p className="text-xs text-stone-500">
              Mascota: <strong className="text-stone-700 font-semibold">{petName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting || isUploadingPhoto}
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

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Fotografías Actuales de {petName} *
            </label>
            <p className="text-xs text-stone-500 mb-2">
              Sube fotos claras donde se aprecie a la mascota en su nuevo hogar, conviviendo o descansando.
            </p>

            <div className="grid grid-cols-3 gap-2.5 mb-3">
              {photoUrls.map((url, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-stone-200 aspect-square bg-stone-100">
                  <img src={url} alt={`Evidencia ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-lg aspect-square cursor-pointer bg-stone-50 hover:bg-amber-50/30 transition-all p-2 text-center">
                {isUploadingPhoto ? (
                  <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-stone-400 group-hover:text-amber-600 mb-1" />
                    <span className="text-[11px] font-medium text-stone-600">Subir foto</span>
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploadingPhoto || isSubmitting}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Notas de Adaptación y Bienestar *
            </label>
            <textarea
              rows={4}
              value={adaptationNotes}
              onChange={(e) => setAdaptationNotes(e.target.value)}
              placeholder="Cuéntanos cómo se ha sentido: ¿Ha comido bien? ¿Cómo duerme? ¿Ha ido al veterinario para sus vacunas o desparasitación? ¿Cómo interactúa con su entorno?"
              className="w-full text-sm rounded-xl border border-stone-300 p-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || isUploadingPhoto}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isUploadingPhoto || photoUrls.length === 0 || !adaptationNotes.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Enviar Reporte para Revisión
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
