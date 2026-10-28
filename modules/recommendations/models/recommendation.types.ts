import type { Pet } from "@/modules/pets/models/pet.types";

export interface ReasonBadge {
  badge: string;
  icon?: string;
}

export interface RecommendedPetItem {
  position: number;
  score: number;
  reasonBadges: ReasonBadge[];
  isFallback: boolean;
  pet: Pet;
}

export interface PersonalizedRecommendationsResponse {
  isSurveyCompleted: boolean;
  recommendations: RecommendedPetItem[];
  executionTimeMs: number;
}

export interface QueryRecommendationsParams {
  species?: "dog" | "cat" | "";
  size?: "small" | "medium" | "large" | "";
  limit?: number;
}

export type RecommendationInteractionType = "impression" | "click" | "apply";

export interface RecordInteractionDto {
  petId: string;
  interactionType: RecommendationInteractionType;
  position: number;
}
