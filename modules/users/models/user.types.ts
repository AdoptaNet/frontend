import type { UserRole } from "@/modules/auth/models/auth.types";
import type { AdopterProfile } from "./adopter-profile.types";
import type { ShelterProfile } from "./shelter-profile.types";

export type { UserRole };

export interface UserProfile extends Omit<import("@/modules/auth/models/auth.types").User, "adopterProfile" | "shelterProfile"> {
  adopterProfile?: AdopterProfile | null;
  shelterProfile?: ShelterProfile | null;
}

export interface UpdateUserDto {
  fullName?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  currentPassword?: string;
  newPassword?: string;
}

export interface ChangePasswordResponse {
  message: string;
}
