import { httpClient } from "@/shared/services/http-client";
import { API_ROUTES } from "@/shared/config/api-routes";
import type {
  PersonalizedRecommendationsResponse,
  QueryRecommendationsParams,
  RecordInteractionDto,
} from "../models/recommendation.types";

export const recommendationsService = {
  async getRecommendations(
    params?: QueryRecommendationsParams,
  ): Promise<PersonalizedRecommendationsResponse> {
    const cleanParams: Record<string, string | number | undefined> = {};
    if (params?.species) cleanParams.species = params.species;
    if (params?.size) cleanParams.size = params.size;
    if (params?.limit) cleanParams.limit = params.limit;

    return httpClient.get<PersonalizedRecommendationsResponse>(
      API_ROUTES.RECOMMENDATIONS.BASE,
      { params: cleanParams },
    );
  },

  async recordInteraction(
    dto: RecordInteractionDto,
  ): Promise<{ success: boolean }> {
    try {
      return await httpClient.post<{ success: boolean }>(
        API_ROUTES.RECOMMENDATIONS.INTERACTIONS,
        dto,
      );
    } catch {
      // Telemetry should fail silently without interrupting user flow
      return { success: false };
    }
  },
};
