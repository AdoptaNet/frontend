'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  Heart,
  Loader2,
  AlertCircle,
  Eye,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useProfile } from '@/modules/users/hooks/useProfile';
import { adoptionsService } from '../services/adoptions.service';
import { AdoptionStatusBadge } from './AdoptionStatusBadge';
import { AdoptionApplicantDossierModal } from './AdoptionApplicantDossierModal';
import { ReviewAdoptionModal } from './ReviewAdoptionModal';
import { CancelAdoptionModal } from './CancelAdoptionModal';
import type {
  AdoptionRequest,
  AdoptionStatus,
} from '../models/adoption.types';
import { ADOPTION_REJECTION_REASONS } from '../models/adoption.types';

export function ApplicationsView() {
  const { user } = useAuthStore();
  const { role } = useProfile();
  const isShelter = role === 'shelter' || user?.role === 'shelter';

  const [adoptions, setAdoptions] = useState<AdoptionRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal states
  const [selectedDossierAdoption, setSelectedDossierAdoption] =
    useState<AdoptionRequest | null>(null);
  const [selectedReviewAdoption, setSelectedReviewAdoption] =
    useState<AdoptionRequest | null>(null);
  const [selectedCancelAdoption, setSelectedCancelAdoption] =
    useState<AdoptionRequest | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const filterParam: AdoptionStatus | undefined =
          statusFilter === 'all' ? undefined : (statusFilter as AdoptionStatus);

        const response = isShelter
          ? await adoptionsService.getShelterAdoptions({ status: filterParam })
          : await adoptionsService.getMyAdoptions({ status: filterParam });

        if (!isCancelled) {
          setAdoptions(response.items || []);
          setTotal(response.total || 0);
          setError(null);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const errorObj = err as { message?: string };
          setError(
            errorObj.message ||
              'No se pudieron cargar las solicitudes de adopción.',
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void Promise.resolve().then(load);

    return () => {
      isCancelled = true;
    };
  }, [isShelter, statusFilter, refreshKey]);

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const activeAdoptionsCount = adoptions.filter(
    (a) => a.status === 'pending' || a.status === 'under_review',
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-tinta-900 tracking-tight">
            {isShelter ? 'Bandeja de Solicitudes Recibidas' : 'Mis Postulaciones de Adopción'}
          </h1>
          <p className="text-xs sm:text-sm text-tinta-600 mt-1">
            {isShelter
              ? 'Examina expedientes de compatibilidad, lee cartas de motivación y resuelve adopciones de tus rescatados.'
              : 'Haz seguimiento al estado de tus solicitudes y revisa el dictamen de los albergues custodios.'}
          </p>
        </div>

        {!isShelter && (
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-xl border border-line bg-superficie-1 text-xs text-tinta-700">
              <span className="text-tinta-500 mr-1.5">Postulaciones activas:</span>
              <strong className="text-tinta-900 font-bold">{activeAdoptionsCount} / 3 máx.</strong>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            statusFilter === 'all'
              ? 'bg-verde-700 text-white shadow-xs'
              : 'bg-superficie-1 text-tinta-700 hover:bg-superficie-2 border border-line'
          }`}
        >
          Todas ({total})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            statusFilter === 'pending'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-superficie-1 text-tinta-700 hover:bg-superficie-2 border border-line'
          }`}
        >
          Pendientes
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('under_review')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            statusFilter === 'under_review'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-superficie-1 text-tinta-700 hover:bg-superficie-2 border border-line'
          }`}
        >
          En Evaluación
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('approved')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            statusFilter === 'approved'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-superficie-1 text-tinta-700 hover:bg-superficie-2 border border-line'
          }`}
        >
          Aprobadas
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('rejected')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            statusFilter === 'rejected'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-superficie-1 text-tinta-700 hover:bg-superficie-2 border border-line'
          }`}
        >
          No Aceptadas
        </button>
        {!isShelter && (
          <button
            type="button"
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
              statusFilter === 'cancelled'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-superficie-1 text-tinta-700 hover:bg-superficie-2 border border-line'
            }`}
          >
            Canceladas
          </button>
        )}
      </div>

      {/* Main List Area */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-verde-700" />
          <p className="text-xs sm:text-sm text-tinta-600">Cargando solicitudes...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-coral-50 border border-coral-200 rounded-2xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-coral-600 mx-auto" />
          <p className="text-xs sm:text-sm text-coral-900 font-medium">{error}</p>
          <Button
            type="button"
            variant="outline"
            onClick={fetchAdoptions}
            className="h-8 text-xs border-coral-300 text-coral-800 hover:bg-coral-100"
          >
            Reintentar
          </Button>
        </div>
      ) : adoptions.length === 0 ? (
        <div className="py-20 px-4 text-center border-2 border-dashed border-line rounded-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-superficie-2 text-tinta-500 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-tinta-900 font-heading">
              {isShelter
                ? 'No se encontraron solicitudes'
                : 'Aún no tienes solicitudes en esta categoría'}
            </h3>
            <p className="text-xs text-tinta-600 max-w-md mx-auto">
              {isShelter
                ? 'Cuando los adoptantes postulen a tus mascotas disponibles, aparecerán en esta bandeja con su expediente de compatibilidad.'
                : 'Explora nuestro catálogo de animales rescatados y encuentra a tu compañero ideal.'}
            </p>
          </div>
          {!isShelter && (
            <Link
              href="/pets"
              className={buttonVariants({
                className: 'h-9 px-4 text-xs font-semibold bg-verde-700 hover:bg-verde-800 text-white',
              })}
            >
              Explorar Catálogo de Mascotas
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {adoptions.map((adoption) => {
            const rejectionReasonInfo = ADOPTION_REJECTION_REASONS.find(
              (r) => r.value === adoption.rejectionReason,
            );

            return (
              <div
                key={adoption.id}
                className="p-5 bg-white rounded-2xl border border-line shadow-xs hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {adoption.pet?.primaryPhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={adoption.pet.primaryPhotoUrl}
                        alt={adoption.pet.name}
                        className="w-14 h-14 rounded-xl object-cover border border-line shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-verde-50 border border-verde-200 flex items-center justify-center text-verde-700 shrink-0">
                        <Heart className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/pets/${adoption.petId}`}
                          className="text-base font-bold text-tinta-900 font-heading hover:text-verde-700 transition-colors"
                        >
                          {adoption.pet?.name || 'Mascota'}
                        </Link>
                        <AdoptionStatusBadge status={adoption.status} />
                      </div>
                      <p className="text-xs text-tinta-600 mt-0.5">
                        {isShelter ? (
                          <>
                            Postulante: <strong className="text-tinta-800">{adoption.adopter?.fullName || 'Adoptante'}</strong> ({adoption.adopter?.email})
                          </>
                        ) : (
                          <>
                            {adoption.pet?.species === 'dog' ? 'Perro' : 'Gato'} {adoption.pet?.breed ? `• ${adoption.pet.breed}` : ''}
                          </>
                        )}
                        <span className="text-tinta-400 mx-1.5">•</span>
                        Enviada el{' '}
                        {new Date(adoption.createdAt).toLocaleDateString('es-PE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Top Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDossierAdoption(adoption)}
                      className="h-8 px-3 text-xs border-line text-tinta-700 hover:bg-superficie-2 gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver Expediente</span>
                    </Button>

                    {isShelter && (adoption.status === 'pending' || adoption.status === 'under_review') && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => setSelectedReviewAdoption(adoption)}
                        className="h-8 px-3.5 text-xs font-semibold bg-verde-700 hover:bg-verde-800 text-white cursor-pointer shadow-xs"
                      >
                        Dictaminar
                      </Button>
                    )}

                    {!isShelter && (adoption.status === 'pending' || adoption.status === 'under_review') && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCancelAdoption(adoption)}
                        className="h-8 px-2.5 text-xs border-line text-rose-700 hover:bg-rose-50 hover:border-rose-200 cursor-pointer"
                      >
                        Desistir
                      </Button>
                    )}
                  </div>
                </div>

                {/* Motivation Letter Preview */}
                <div className="p-3 bg-superficie-1 rounded-xl border border-line/60 text-xs text-tinta-700">
                  <span className="font-semibold text-tinta-900 block mb-1">Carta de Motivación:</span>
                  <p className="line-clamp-2 italic">&ldquo;{adoption.motivationLetter}&rdquo;</p>
                </div>

                {/* Resolution Callout if Resolved */}
                {adoption.status === 'rejected' && (
                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-xs space-y-1 text-rose-900">
                    <div className="flex items-center gap-1.5 font-semibold text-rose-950">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Postulación no aceptada</span>
                    </div>
                    {rejectionReasonInfo && (
                      <p className="text-[11px] text-rose-800">
                        <strong>Motivo:</strong> {rejectionReasonInfo.label} — {rejectionReasonInfo.description}
                      </p>
                    )}
                    {adoption.rejectionNotes && (
                      <p className="text-[11px] text-rose-800 italic">
                        <strong>Comentarios:</strong> &ldquo;{adoption.rejectionNotes}&rdquo;
                      </p>
                    )}
                  </div>
                )}

                {adoption.status === 'approved' && (
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-1 text-emerald-900">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-950">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>¡Adopción aprobada!</span>
                    </div>
                    {adoption.reviewNotes && (
                      <p className="text-[11px] text-emerald-800">
                        <strong>Instrucciones del albergue:</strong> &ldquo;{adoption.reviewNotes}&rdquo;
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AdoptionApplicantDossierModal
        isOpen={!!selectedDossierAdoption}
        onClose={() => setSelectedDossierAdoption(null)}
        adoption={selectedDossierAdoption}
        isShelterView={isShelter}
        onOpenReview={(adoption) => setSelectedReviewAdoption(adoption)}
      />

      <ReviewAdoptionModal
        isOpen={!!selectedReviewAdoption}
        onClose={() => setSelectedReviewAdoption(null)}
        adoption={selectedReviewAdoption}
        onSuccess={handleRefresh}
      />

      <CancelAdoptionModal
        isOpen={!!selectedCancelAdoption}
        onClose={() => setSelectedCancelAdoption(null)}
        adoption={selectedCancelAdoption}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
