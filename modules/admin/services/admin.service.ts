import { httpClient } from '@/shared/services/http-client';
import { API_ROUTES } from '@/shared/config/api-routes';
import type {
  AdminMetricsResponse,
  AdminSheltersResponse,
  SystemHealthResponse,
} from '../models/admin.types';

export const adminService = {
  async getMetrics(): Promise<AdminMetricsResponse> {
    return httpClient.get<AdminMetricsResponse>(API_ROUTES.ADMIN.METRICS);
  },

  async getHealth(): Promise<SystemHealthResponse> {
    return httpClient.get<SystemHealthResponse>(API_ROUTES.ADMIN.HEALTH);
  },

  async getShelters(isVerified?: boolean): Promise<AdminSheltersResponse> {
    return httpClient.get<AdminSheltersResponse>(API_ROUTES.ADMIN.SHELTERS, {
      params:
        typeof isVerified === 'boolean'
          ? { verified: String(isVerified) }
          : undefined,
    });
  },

  async verifyShelter(
    shelterId: string,
    isVerified: boolean,
  ): Promise<{ id: string; isVerified: boolean }> {
    return httpClient.patch<{ id: string; isVerified: boolean }>(
      API_ROUTES.ADMIN.VERIFY_SHELTER(shelterId),
      { isVerified },
    );
  },
};
