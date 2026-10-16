import { httpClient } from '@/shared/services/http-client';
import { API_ROUTES } from '@/shared/config/api-routes';
import type {
  AdoptionRequest,
  CreateAdoptionRequestPayload,
  ReviewAdoptionRequestPayload,
  AdoptionsFilterParams,
  PaginatedAdoptionsResponse,
} from '../models/adoption.types';

export const adoptionsService = {
  async submitAdoption(payload: CreateAdoptionRequestPayload): Promise<AdoptionRequest> {
    return httpClient.post<AdoptionRequest>(API_ROUTES.ADOPTIONS.BASE, payload);
  },

  async getMyAdoptions(params?: AdoptionsFilterParams): Promise<PaginatedAdoptionsResponse> {
    return httpClient.get<PaginatedAdoptionsResponse>(API_ROUTES.ADOPTIONS.MY_REQUESTS, {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  async getShelterAdoptions(params?: AdoptionsFilterParams): Promise<PaginatedAdoptionsResponse> {
    return httpClient.get<PaginatedAdoptionsResponse>(API_ROUTES.ADOPTIONS.SHELTER, {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  async getAdoptionById(id: string): Promise<AdoptionRequest> {
    return httpClient.get<AdoptionRequest>(API_ROUTES.ADOPTIONS.BY_ID(id));
  },

  async cancelAdoption(id: string): Promise<AdoptionRequest> {
    return httpClient.patch<AdoptionRequest>(API_ROUTES.ADOPTIONS.CANCEL(id), {});
  },

  async reviewAdoption(
    id: string,
    payload: ReviewAdoptionRequestPayload,
  ): Promise<AdoptionRequest> {
    return httpClient.patch<AdoptionRequest>(API_ROUTES.ADOPTIONS.REVIEW(id), payload);
  },
};
