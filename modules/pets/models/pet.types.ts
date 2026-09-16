export type PetSpecies = "dog" | "cat";
export type PetGender = "male" | "female";
export type PetSize = "small" | "medium" | "large";
export type PetAgeCategory = "puppy" | "young" | "adult" | "senior";
export type PetFurLength = "short" | "long" | "hairless";
export type PetHealthStatus = "healthy" | "chronic_condition" | "disability";
export type PetTrainingLevel = "none" | "basic" | "litterbox" | "advanced";
export type PetStatus = "draft" | "available" | "in_process" | "adopted" | "hidden";

export interface PetPhotoItem {
  id?: string;
  url: string;
  publicId: string;
  isPrimary: boolean;
  order?: number;
}

export interface PetShelter {
  id: string;
  organizationName: string | null;
  city: string | null;
  department: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
}

export interface Pet {
  id: string;
  shelterId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  gender: PetGender;
  ageMonths: number;
  ageCategory: PetAgeCategory;
  size: PetSize;
  furLength: PetFurLength;
  isSterilized: boolean;
  isVaccinated: boolean;
  healthStatus: PetHealthStatus;
  healthNotes: string | null;
  energyLevel: number;
  goodWithChildren: boolean | null;
  goodWithDogs: boolean | null;
  goodWithCats: boolean | null;
  vocalizationLevel: number;
  trainingLevel: PetTrainingLevel;
  timeAloneToleranceHours: number | null;
  shelterStayMonths: number;
  description: string;
  status: PetStatus;
  photos: PetPhotoItem[];
  shelter?: PetShelter;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetDto {
  name: string;
  species: PetSpecies;
  breed?: string;
  gender: PetGender;
  ageMonths: number;
  ageCategory?: PetAgeCategory;
  size: PetSize;
  furLength?: PetFurLength;
  isSterilized?: boolean;
  isVaccinated?: boolean;
  healthStatus?: PetHealthStatus;
  healthNotes?: string | null;
  energyLevel: number;
  goodWithChildren?: boolean | null;
  goodWithDogs?: boolean | null;
  goodWithCats?: boolean | null;
  vocalizationLevel: number;
  trainingLevel?: PetTrainingLevel;
  timeAloneToleranceHours?: number | null;
  shelterStayMonths?: number;
  description: string;
  status?: PetStatus;
  photos: PetPhotoItem[];
}

export type UpdatePetDto = Partial<CreatePetDto>;

export interface UpdatePetStatusDto {
  status: PetStatus;
}

export interface QueryShelterPetsParams {
  status?: PetStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedPetsResponse {
  items: Pet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UploadMediaResponse {
  url: string;
  publicId: string;
  format?: string;
  bytes?: number;
}
