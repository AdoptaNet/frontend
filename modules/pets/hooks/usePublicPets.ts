"use client";

import { useState, useEffect, useCallback } from "react";
import { petsService } from "../services/pets.service";
import type {
  Pet,
  PetSpecies,
  PetSize,
  PetAgeCategory,
  PetGender,
} from "../models/pet.types";

export interface PublicPetsFilters {
  species?: PetSpecies | "all";
  size?: PetSize | "all";
  ageCategory?: PetAgeCategory | "all";
  gender?: PetGender | "all";
  city?: string;
  department?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function usePublicPets(initialFilters?: Partial<PublicPetsFilters>) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(initialFilters?.page || 1);
  const [species, setSpecies] = useState<PetSpecies | "all">(
    initialFilters?.species || "all",
  );
  const [size, setSize] = useState<PetSize | "all">(
    initialFilters?.size || "all",
  );
  const [ageCategory, setAgeCategory] = useState<PetAgeCategory | "all">(
    initialFilters?.ageCategory || "all",
  );
  const [gender, setGender] = useState<PetGender | "all">(
    initialFilters?.gender || "all",
  );
  const [city, setCity] = useState(initialFilters?.city || "");
  const [search, setSearch] = useState(initialFilters?.search || "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await petsService.getPublicPets({
        page,
        limit: 12,
        species: species === "all" ? undefined : species,
        size: size === "all" ? undefined : size,
        ageCategory: ageCategory === "all" ? undefined : ageCategory,
        gender: gender === "all" ? undefined : gender,
        city: city.trim() || undefined,
        search: search.trim() || undefined,
      });

      setPets(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar el catálogo de mascotas.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, species, size, ageCategory, gender, city, search]);

  useEffect(() => {
    let ignore = false;

    petsService
      .getPublicPets({
        page,
        limit: 12,
        species: species === "all" ? undefined : species,
        size: size === "all" ? undefined : size,
        ageCategory: ageCategory === "all" ? undefined : ageCategory,
        gender: gender === "all" ? undefined : gender,
        city: city.trim() || undefined,
        search: search.trim() || undefined,
      })
      .then((res) => {
        if (!ignore) {
          setPets(res.items);
          setTotal(res.total);
          setTotalPages(res.totalPages);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Error al cargar el catálogo de mascotas.",
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [page, species, size, ageCategory, gender, city, search]);

  const resetFilters = () => {
    setSpecies("all");
    setSize("all");
    setAgeCategory("all");
    setGender("all");
    setCity("");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters =
    species !== "all" ||
    size !== "all" ||
    ageCategory !== "all" ||
    gender !== "all" ||
    city.trim() !== "" ||
    search.trim() !== "";

  return {
    pets,
    total,
    totalPages,
    page,
    species,
    size,
    ageCategory,
    gender,
    city,
    search,
    isLoading,
    error,
    hasActiveFilters,
    setPage,
    setSpecies: (val: PetSpecies | "all") => {
      setSpecies(val);
      setPage(1);
    },
    setSize: (val: PetSize | "all") => {
      setSize(val);
      setPage(1);
    },
    setAgeCategory: (val: PetAgeCategory | "all") => {
      setAgeCategory(val);
      setPage(1);
    },
    setGender: (val: PetGender | "all") => {
      setGender(val);
      setPage(1);
    },
    setCity: (val: string) => {
      setCity(val);
      setPage(1);
    },
    setSearch: (val: string) => {
      setSearch(val);
      setPage(1);
    },
    resetFilters,
    refetch: fetchPets,
  };
}
