import { httpClient } from "@/shared/services/http-client";
import { API_ROUTES } from "@/shared/config/api-routes";
import type {
  UserProfile,
  UpdateUserDto,
  ChangePasswordDto,
  ChangePasswordResponse,
} from "../models/user.types";
import type {
  AdopterProfile,
  UpdateAdopterProfileDto,
} from "../models/adopter-profile.types";
import type {
  ShelterProfile,
  UpdateShelterProfileDto,
} from "../models/shelter-profile.types";

export const usersService = {
  async getMyProfile(): Promise<UserProfile> {
    return httpClient.get<UserProfile>(API_ROUTES.USERS.ME);
  },

  async updateMe(dto: UpdateUserDto): Promise<UserProfile> {
    return httpClient.patch<UserProfile>(API_ROUTES.USERS.ME, dto);
  },

  async updateAvatar(file: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append("avatar", file);

    return httpClient.patch<UserProfile>(API_ROUTES.USERS.AVATAR, formData);
  },

  async removeAvatar(): Promise<UserProfile> {
    return httpClient.delete<UserProfile>(API_ROUTES.USERS.AVATAR);
  },

  async changePassword(
    dto: ChangePasswordDto,
  ): Promise<ChangePasswordResponse> {
    return httpClient.patch<ChangePasswordResponse>(
      API_ROUTES.USERS.PASSWORD,
      dto,
    );
  },

  async updateAdopterProfile(
    dto: UpdateAdopterProfileDto,
  ): Promise<AdopterProfile> {
    return httpClient.put<AdopterProfile>(
      API_ROUTES.USERS.ADOPTER_PROFILE,
      dto,
    );
  },

  async updateShelterProfile(
    dto: UpdateShelterProfileDto,
  ): Promise<ShelterProfile> {
    return httpClient.put<ShelterProfile>(
      API_ROUTES.USERS.SHELTER_PROFILE,
      dto,
    );
  },
};
