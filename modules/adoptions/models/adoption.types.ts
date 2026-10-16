export type AdoptionStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'cancelled';

export type AdoptionRejectionReason =
  | 'incompatible_housing'
  | 'unsuitable_schedule'
  | 'financial_incompatibility'
  | 'other_applicant_chosen'
  | 'incomplete_profile'
  | 'other';

export const ADOPTION_STATUS_LABELS: Record<AdoptionStatus, string> = {
  pending: 'Pendiente de Revisión',
  under_review: 'En Evaluación',
  approved: 'Aprobada',
  rejected: 'No Aceptada',
  cancelled: 'Cancelada',
};

export const ADOPTION_REJECTION_REASONS: {
  value: AdoptionRejectionReason;
  label: string;
  description: string;
}[] = [
  {
    value: 'incompatible_housing',
    label: 'Vivienda no compatible',
    description: 'El espacio, cerco, permisos de arrendador o seguridad no se ajustan a la mascota.',
  },
  {
    value: 'unsuitable_schedule',
    label: 'Rutina u horarios no adecuados',
    description: 'La mascota pasaría demasiado tiempo a solas o requiere más actividad diaria.',
  },
  {
    value: 'financial_incompatibility',
    label: 'Presupuesto insuficiente',
    description: 'Los costos estimados de alimentación y atención veterinaria superan lo previsto.',
  },
  {
    value: 'other_applicant_chosen',
    label: 'Otro adoptante seleccionado',
    description: 'Se ha formalizado la adopción con otro postulante que inició el proceso.',
  },
  {
    value: 'incomplete_profile',
    label: 'Información incompleta',
    description: 'No se cuenta con suficiente información para evaluar la postulación.',
  },
  {
    value: 'other',
    label: 'Otras consideraciones',
    description: 'Motivo particular explicado detalladamente en los comentarios.',
  },
];

export interface AdopterSnapshot {
  demographics?: {
    ageRange?: string | null;
    occupation?: string | null;
    city?: string | null;
    district?: string | null;
  };
  housing?: {
    housingType?: string | null;
    hasYard?: boolean | null;
    yardFenced?: boolean | null;
    ownsHome?: boolean | null;
    landlordAllowsPets?: boolean | null;
    hasBalconyProtection?: boolean | null;
  };
  household?: {
    adultsCount?: number | null;
    childrenCount?: number | null;
    hasOtherPets?: boolean | null;
    otherPetsDetails?: string | null;
    allMembersAgree?: boolean | null;
  };
  routine?: {
    hoursAlonePerDay?: number | null;
    exerciseTimeMinutes?: number | null;
    budgetMonthlyPen?: number | null;
    petCareTravel?: string | null;
    experienceLevel?: string | null;
  };
  preferences?: {
    preferredSpecies?: string | null;
    preferredSize?: string[] | null;
    preferredEnergy?: string[] | null;
    preferredAge?: string[] | null;
    preferredSex?: string | null;
  };
  snapshotTimestamp: string;
  rawCompatibilityData?: Record<string, unknown>;
}

export interface AdoptionPetSummary {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  size: string;
  ageMonths: number;
  primaryPhotoUrl?: string | null;
  status: string;
}

export interface AdoptionUserSummary {
  id: string;
  fullName?: string | null;
  email: string;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
}

export interface AdoptionRequest {
  id: string;
  petId: string;
  adopterId: string;
  shelterId: string;
  status: AdoptionStatus;
  motivationLetter: string;
  responsibilityPledge: boolean;
  adopterSnapshot: AdopterSnapshot;
  rejectionReason?: AdoptionRejectionReason | null;
  rejectionNotes?: string | null;
  reviewNotes?: string | null;
  pet?: AdoptionPetSummary;
  adopter?: AdoptionUserSummary;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdoptionRequestPayload {
  petId: string;
  motivationLetter: string;
  responsibilityPledge: boolean;
}

export interface ReviewAdoptionRequestPayload {
  status: AdoptionStatus;
  rejectionReason?: AdoptionRejectionReason;
  rejectionNotes?: string;
  reviewNotes?: string;
}

export interface AdoptionsFilterParams {
  status?: AdoptionStatus;
  petId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAdoptionsResponse {
  items: AdoptionRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
