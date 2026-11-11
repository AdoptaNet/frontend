import type { Pet } from "@/modules/pets/models/pet.types";

export interface ShelterProfile {
  id: string;
  userId: string;
  organizationName: string | null;
  address: string | null;
  city: string | null;
  department: string | null;
  phoneNumber: string | null;
  contactEmail: string | null;
  description: string | null;
  rescueCapacity: number | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  isVerified: boolean;
  verificationRequested?: boolean;
  verificationRequestedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UpdateShelterProfileDto = Partial<
  Omit<ShelterProfile, 'id' | 'userId' | 'isVerified' | 'verificationRequested' | 'verificationRequestedAt' | 'createdAt' | 'updatedAt'>
>;

export interface PublicShelter {
  id: string;
  userId: string;
  organizationName: string;
  description: string | null;
  address: string | null;
  city: string | null;
  department: string | null;
  phoneNumber: string | null;
  contactEmail: string | null;
  rescueCapacity: number | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  isVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
  availablePets: Pet[];
}

