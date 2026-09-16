import { httpClient } from "@/shared/services/http-client";
import { API_ROUTES } from "@/shared/config/api-routes";
import type {
  Pet,
  CreatePetDto,
  UpdatePetDto,
  UpdatePetStatusDto,
  QueryShelterPetsParams,
  PaginatedPetsResponse,
  UploadMediaResponse,
} from "../models/pet.types";

export const petsService = {
  async getMyPets(
    params?: QueryShelterPetsParams,
  ): Promise<PaginatedPetsResponse> {
    return httpClient.get<PaginatedPetsResponse>(API_ROUTES.PETS.MY_PETS, {
      params: params as Record<string, string | number | boolean | undefined>,
    });
  },

  async getPetById(id: string): Promise<Pet> {
    return httpClient.get<Pet>(API_ROUTES.PETS.BY_ID(id));
  },

  async createPet(dto: CreatePetDto): Promise<Pet> {
    return httpClient.post<Pet>(API_ROUTES.PETS.BASE, dto);
  },

  async updatePet(id: string, dto: UpdatePetDto): Promise<Pet> {
    return httpClient.patch<Pet>(API_ROUTES.PETS.BY_ID(id), dto);
  },

  async updatePetStatus(
    id: string,
    dto: UpdatePetStatusDto,
  ): Promise<Pet> {
    return httpClient.patch<Pet>(API_ROUTES.PETS.STATUS(id), dto);
  },

  async deletePet(id: string): Promise<void> {
    return httpClient.delete<void>(API_ROUTES.PETS.BY_ID(id));
  },

  async uploadPhoto(file: File): Promise<UploadMediaResponse> {
    const formData = new FormData();
    formData.append("file", file);
    return httpClient.post<UploadMediaResponse>(API_ROUTES.MEDIA.UPLOAD, formData);
  },

  async deletePhoto(publicId: string): Promise<{ success: boolean }> {
    return httpClient.delete<{ success: boolean }>(API_ROUTES.MEDIA.DELETE, {
      params: { publicId },
    });
  },
};
