export type FollowUpProcessStatus =
  | 'in_progress'
  | 'completed'
  | 'returned'
  | 'revoked';

export type MilestoneType = '30_days' | '90_days' | '180_days';

export type MilestoneStatus =
  | 'pending'
  | 'submitted'
  | 'approved'
  | 'completed'
  | 'rejected'
  | 'action_required'
  | 'overdue';

export type PetReturnReason =
  | 'severe_allergy'
  | 'behavioral_issue'
  | 'behavioral_challenges'
  | 'landlord_issue'
  | 'housing_restriction'
  | 'unforeseen_emergency'
  | 'financial_hardship'
  | 'personal_emergency'
  | 'other';

export const PET_RETURN_REASONS: { value: PetReturnReason; label: string; description: string }[] = [
  {
    value: 'severe_allergy',
    label: 'Alergia severa sobrevenida',
    description: 'Alergia médica comprobada e incapacitante en un conviviente.',
  },
  {
    value: 'behavioral_issue',
    label: 'Desafíos conductuales no superados',
    description: 'Problemas de agresividad o adaptación no solventados tras acompañamiento.',
  },
  {
    value: 'landlord_issue',
    label: 'Cambio habitacional o restricción de vivienda',
    description: 'Mudanza sobrevenida con prohibición estricta de mascotas por el arrendador.',
  },
  {
    value: 'unforeseen_emergency',
    label: 'Emergencia de salud o fuerza mayor',
    description: 'Enfermedad grave o situación sobrevenida que impide el cuidado digno del animal.',
  },
  {
    value: 'other',
    label: 'Otra causa de fuerza mayor',
    description: 'Situación imprevista que requiere la recolocación formal del animal.',
  },
];

export const PET_RETURN_STATUS_LABELS: Record<string, string> = {
  requested: 'Solicitud en Evaluación',
  under_coordination: 'En Coordinación Logística',
  returned: 'Retorno Completado',
  rejected: 'Solicitud Desestimada',
  cancelled: 'Cancelado',
};

export function getPetReturnStatusLabel(status?: string | null): string {
  if (!status) return 'En Trámite';
  return PET_RETURN_STATUS_LABELS[status] || status;
}

export const PET_RETURN_REASON_LABELS: Record<string, string> = {
  severe_allergy: 'Alergia severa sobrevenida',
  behavioral_issue: 'Desafíos conductuales no superados',
  behavioral_challenges: 'Desafíos conductuales no superados',
  landlord_issue: 'Restricción de vivienda o arrendador',
  housing_restriction: 'Restricción de vivienda o arrendador',
  unforeseen_emergency: 'Emergencia de salud o fuerza mayor',
  financial_hardship: 'Emergencia o dificultad de fuerza mayor',
  personal_emergency: 'Emergencia de salud o fuerza mayor',
  other: 'Otra causa justificada',
};

export function getPetReturnReasonLabel(reason?: string | null): string {
  if (!reason) return 'Causa de fuerza mayor';
  return PET_RETURN_REASON_LABELS[reason] || reason;
}

export function parseReturnExplanationAndPhone(explanation?: string | null, fallbackPhone?: string | null): {
  cleanExplanation: string;
  phone: string | null;
} {
  if (!explanation) {
    return { cleanExplanation: '', phone: fallbackPhone || null };
  }

  const phoneMatch = explanation.match(/\[(?:Contacto|Teléfono) de emergencia:\s*([^\]]+)\]/i);
  const phone = phoneMatch ? phoneMatch[1].trim() : (fallbackPhone || null);
  const cleanExplanation = phoneMatch ? explanation.replace(phoneMatch[0], '').trim() : explanation.trim();

  return { cleanExplanation, phone };
}

export type PetReturnStatus =
  | 'requested'
  | 'under_coordination'
  | 'returned'
  | 'rejected'
  | 'cancelled';

export interface FollowUpEvidenceItem {
  id: string;
  mediaUrl?: string;
  photoUrl?: string;
  evidenceType?: string;
  caption?: string | null;
  notes?: string | null;
  uploadedAt?: string;
  createdAt?: string;
}

export interface FollowUpMilestoneItem {
  id: string;
  milestoneType: MilestoneType;
  daysTarget: number;
  dueDate: string;
  status: MilestoneStatus;
  adaptationNotes?: string | null;
  submittedAt?: string | null;
  shelterFeedback?: string | null;
  reviewedAt?: string | null;
  reviewedById?: string | null;
  reminderSentAt?: string | null;
  overdueNotifiedAt?: string | null;
  evidences: FollowUpEvidenceItem[];
}

export interface PetReturnItem {
  id: string;
  followUpRecordId: string;
  petId: string;
  adopterId: string;
  shelterId: string;
  status: PetReturnStatus;
  reason: PetReturnReason;
  explanation: string;
  emergencyContactPhone?: string | null;
  requestedAt: string;
  coordinationNotes?: string | null;
  scheduledReturnDate?: string | null;
  completedAt?: string | null;
  shelterObservations?: string | null;
}

export interface FollowUpPetSummary {
  id: string;
  name: string;
  species: string;
  breed?: string | null;
  primaryPhotoUrl?: string | null;
}

export interface FollowUpPartySummary {
  id: string;
  fullName?: string;
  name?: string;
  email: string;
  phone?: string | null;
}

export interface FollowUpRecordItem {
  id: string;
  adoptionId: string;
  petId: string;
  pet: FollowUpPetSummary;
  adopterId: string;
  adopter: FollowUpPartySummary;
  shelterId: string;
  shelter: FollowUpPartySummary;
  status: FollowUpProcessStatus;
  startDate: string;
  completionDate?: string | null;
  certificateCode?: string | null;
  notes?: string | null;
  milestones: FollowUpMilestoneItem[];
  activeReturn?: PetReturnItem | null;
  returns: PetReturnItem[];
}

export interface SubmitMilestonePayload {
  adaptationNotes: string;
  healthStatusReported?: string;
  evidences: {
    evidenceType?: string;
    mediaUrl: string;
    photoUrl?: string;
    notes?: string;
    caption?: string;
  }[];
}

export interface ReviewMilestonePayload {
  decision: 'approved' | 'action_required';
  reviewNotes?: string;
  status?: 'approved' | 'rejected' | 'action_required' | 'completed';
  shelterFeedback?: string;
}

export interface RequestPetReturnPayload {
  reason: PetReturnReason;
  explanation: string;
  emergencyContactPhone?: string;
}

export interface CoordinatePetReturnPayload {
  scheduledReturnDate: string;
  coordinationNotes?: string;
}

export interface CompletePetReturnPayload {
  decision: 'accept' | 'reject';
  shelterObservations?: string;
}

export interface SimulateMilestoneTimePayload {
  daysOffset: number;
}
