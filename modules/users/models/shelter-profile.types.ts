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
  createdAt: string;
  updatedAt: string;
}

export type UpdateShelterProfileDto = Partial<
  Omit<ShelterProfile, 'id' | 'userId' | 'isVerified' | 'createdAt' | 'updatedAt'>
>;
