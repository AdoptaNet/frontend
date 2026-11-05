'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ClipboardCheck,
  Search,
  Filter,
  Clock,
  Award,
  RotateCcw,
  AlertCircle,
  Loader2,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { followUpService } from '@/modules/follow-ups/services/follow-up.service';
import type {
  FollowUpRecordItem,
  FollowUpMilestoneItem,
  FollowUpProcessStatus,
} from '@/modules/follow-ups/models/follow-up.types';
import { FollowUpRecordCard } from '@/modules/follow-ups/components/FollowUpRecordCard';
import { MilestoneEvidenceUploadModal } from '@/modules/follow-ups/components/MilestoneEvidenceUploadModal';
import { MilestoneReviewModal } from '@/modules/follow-ups/components/MilestoneReviewModal';
import { PetReturnModal } from '@/modules/follow-ups/components/PetReturnModal';
import { ShelterReturnCoordinationModal } from '@/modules/follow-ups/components/ShelterReturnCoordinationModal';
import { DemoTimeTravelToolbar } from '@/modules/follow-ups/components/DemoTimeTravelToolbar';

export default function FollowUpPage() {
  const { user, isAuthenticated, isHydrated } = useAuthStore();

  const [records, setRecords] = useState<FollowUpRecordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | FollowUpProcessStatus>('all');

  // Modal states
  const [uploadModalState, setUploadModalState] = useState<{
    isOpen: boolean;
    recordId: string;
    milestone: FollowUpMilestoneItem | null;
    petName: string;
  }>({
    isOpen: false,
    recordId: '',
    milestone: null,
    petName: '',
  });

  const [reviewModalState, setReviewModalState] = useState<{
    isOpen: boolean;
    recordId: string;
    milestone: FollowUpMilestoneItem | null;
    petName: string;
    adopterName: string;
  }>({
    isOpen: false,
    recordId: '',
    milestone: null,
    petName: '',
    adopterName: '',
  });

  const [returnModalState, setReturnModalState] = useState<{
    isOpen: boolean;
    record: FollowUpRecordItem | null;
  }>({
    isOpen: false,
    record: null,
  });

  const [coordinateReturnModalState, setCoordinateReturnModalState] = useState<{
    isOpen: boolean;
    record: FollowUpRecordItem | null;
  }>({
    isOpen: false,
    record: null,
  });

  const fetchRecords = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await followUpService.getFollowUps();
      setRecords(data || []);
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.message || err?.message || 'Error al cargar los expedientes de seguimiento.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      fetchRecords();
    } else if (isHydrated && !isAuthenticated) {
      setIsLoading(false);
    }
  }, [isHydrated, isAuthenticated]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        r.pet.name.toLowerCase().includes(q) ||
        r.adopter.fullName?.toLowerCase().includes(q) ||
        r.shelter.name?.toLowerCase().includes(q) ||
        r.certificateCode?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [records, statusFilter, searchQuery]);

  // Metrics
  const inProgressCount = records.filter((r) => r.status === 'in_progress').length;
  const completedCount = records.filter((r) => r.status === 'completed').length;
  const returnedCount = records.filter((r) => r.status === 'returned' || !!r.activeReturn).length;
  const pendingReviewCount = records.reduce((acc, r) => {
    return acc + r.milestones.filter((m) => m.status === 'submitted').length;
  }, 0);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <ClipboardCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-2">
          Seguimiento Post-Adopción
        </h2>
        <p className="text-stone-600 mb-6">
          Inicia sesión para consultar el estado de adaptación de tus mascotas adoptadas, subir evidencias a los 30, 90 y 180 días o gestionar retornos responsables.
        </p>
        <Link href="/login?redirect=/follow-up">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            Iniciar Sesión
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight font-heading">
                Seguimiento de Mascotas Adoptadas
              </h1>
              <p className="text-xs text-stone-500">
                Acompañamos la adaptación y bienestar de cada animal en su nuevo hogar con chequeos periódicos a los 30, 90 y 180 días.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Time Travel Toolbar (Evaluator mode) */}
      <DemoTimeTravelToolbar
        records={records}
        onActionComplete={fetchRecords}
      />

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-stone-900">{inProgressCount}</span>
            <span className="text-xs text-stone-500 block">En Seguimiento</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-stone-900">{pendingReviewCount}</span>
            <span className="text-xs text-stone-500 block">Evidencias por Revisar</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-stone-900">{completedCount}</span>
            <span className="text-xs text-stone-500 block">Graduados (180d)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-bold text-stone-900">{returnedCount}</span>
            <span className="text-xs text-stone-500 block">Retornos Registrados</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              statusFilter === 'all'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todos ({records.length})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              statusFilter === 'in_progress'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            En Progreso ({inProgressCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              statusFilter === 'completed'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Graduados ({completedCount})
          </button>
          <button
            onClick={() => setStatusFilter('returned')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              statusFilter === 'returned'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Retornos ({returnedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por mascota, adoptante..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 text-amber-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Cargando expedientes de seguimiento...</p>
        </div>
      ) : errorMessage ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800 mb-1">
            No se encontraron expedientes de seguimiento
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {records.length === 0
              ? 'Cuando se formalice y apruebe una solicitud de adopción, se generará automáticamente el expediente con sus hitos a 30, 90 y 180 días.'
              : 'No hay expedientes que coincidan con los filtros seleccionados.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRecords.map((record) => (
            <FollowUpRecordCard
              key={record.id}
              record={record}
              currentUserId={user?.id}
              currentUserRole={user?.role}
              onOpenUploadEvidence={(recordId, milestone) => {
                setUploadModalState({
                  isOpen: true,
                  recordId,
                  milestone,
                  petName: record.pet.name,
                });
              }}
              onOpenReviewMilestone={(recordId, milestone) => {
                setReviewModalState({
                  isOpen: true,
                  recordId,
                  milestone,
                  petName: record.pet.name,
                  adopterName: record.adopter.fullName || record.adopter.email,
                });
              }}
              onOpenRequestReturn={(rec) => {
                setReturnModalState({
                  isOpen: true,
                  record: rec,
                });
              }}
              onOpenCoordinateReturn={(rec) => {
                setCoordinateReturnModalState({
                  isOpen: true,
                  record: rec,
                });
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <MilestoneEvidenceUploadModal
        isOpen={uploadModalState.isOpen}
        onClose={() => setUploadModalState((prev) => ({ ...prev, isOpen: false }))}
        recordId={uploadModalState.recordId}
        milestone={uploadModalState.milestone}
        petName={uploadModalState.petName}
        onSuccess={fetchRecords}
      />

      <MilestoneReviewModal
        isOpen={reviewModalState.isOpen}
        onClose={() => setReviewModalState((prev) => ({ ...prev, isOpen: false }))}
        recordId={reviewModalState.recordId}
        milestone={reviewModalState.milestone}
        petName={reviewModalState.petName}
        adopterName={reviewModalState.adopterName}
        onSuccess={fetchRecords}
      />

      {returnModalState.record && (
        <PetReturnModal
          isOpen={returnModalState.isOpen}
          onClose={() => setReturnModalState({ isOpen: false, record: null })}
          recordId={returnModalState.record.id}
          petName={returnModalState.record.pet.name}
          shelterName={returnModalState.record.shelter.name || 'Albergue'}
          onSuccess={fetchRecords}
        />
      )}

      {coordinateReturnModalState.record && (
        <ShelterReturnCoordinationModal
          isOpen={coordinateReturnModalState.isOpen}
          onClose={() => setCoordinateReturnModalState({ isOpen: false, record: null })}
          petReturn={coordinateReturnModalState.record.activeReturn || null}
          petName={coordinateReturnModalState.record.pet.name}
          adopterName={coordinateReturnModalState.record.adopter.fullName || 'Adoptante'}
          onSuccess={fetchRecords}
        />
      )}
    </div>
  );
}
