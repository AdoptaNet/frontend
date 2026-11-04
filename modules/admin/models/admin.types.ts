export type ServiceHealthStatus = 'healthy' | 'degraded' | 'down';

export interface ServiceHealthDetail {
  status: ServiceHealthStatus;
  latencyMs: number;
  message?: string;
  metadata?: Record<string, any>;
}

export interface SystemHealthResponse {
  status: ServiceHealthStatus;
  services: {
    database: ServiceHealthDetail;
    realtime: ServiceHealthDetail;
    mlService: ServiceHealthDetail;
  };
  timestamp: string;
}

export interface PetDistributionMetrics {
  total: number;
  available: number;
  inProcess: number;
  adopted: number;
  adoptionRate: number;
}

export interface AdoptionRequestMetrics {
  total: number;
  submitted: number;
  inReview: number;
  approved: number;
  rejected: number;
  cancelled: number;
  approvalRate: number;
}

export interface FollowUpSummaryMetrics {
  active: number;
  completed180d: number;
  returnsCount: number;
  returnRate: number;
}

export interface ShelterSummaryMetrics {
  total: number;
  verified: number;
  unverified: number;
  verificationRate: number;
}

export interface MlInteractionMetrics {
  totalImpressions: number;
  totalClicks: number;
  totalApplies: number;
  ctr: number;
  conversionRate: number;
  clickToApplyRate: number;
}

export interface MlResilienceMetrics {
  totalCached: number;
  hybridCount: number;
  fallbackCount: number;
  hybridRatio: number;
  fallbackRatio: number;
}

export interface AdminMetricsResponse {
  operational: {
    pets: PetDistributionMetrics;
    adoptions: AdoptionRequestMetrics;
    followUps: FollowUpSummaryMetrics;
    shelters: ShelterSummaryMetrics;
  };
  mlTelemetry: {
    interactions: MlInteractionMetrics;
    resilience: MlResilienceMetrics;
  };
  timestamp: string;
}

export interface AdminShelterItem {
  id: string;
  userId: string;
  shelterName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  isVerified: boolean;
  petCount: number;
  createdAt: string;
}

export interface AdminSheltersResponse {
  shelters: AdminShelterItem[];
  total: number;
}
