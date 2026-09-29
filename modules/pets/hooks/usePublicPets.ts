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
  const [limit, setLimit] = useState(initialFilters?.limit || 12);
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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch a specific page, optionally appending
  const fetchPage = useCallback(
    async (targetPage: number, append = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const res = await petsService.getPublicPets({
          page: targetPage,
          limit,
          species: species === "all" ? undefined : species,
          size: size === "all" ? undefined : size,
          ageCategory: ageCategory === "all" ? undefined : ageCategory,
          gender: gender === "all" ? undefined : gender,
          city: city.trim() || undefined,
          search: search.trim() || undefined,
        });

        if (append) {
          setPets((prev) => [...prev, ...res.items]);
        } else {
          setPets(res.items);
        }
        setTotal(res.total);
        setTotalPages(res.totalPages);
        setPage(targetPage);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Error al cargar el catálogo de mascotas.",
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [limit, species, size, ageCategory, gender, city, search],
  );

  // Initial and on-filter-change fetch (always resets to page 1)
  useEffect(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  // Load next page and append (Infinite scroll / Load more)
  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || page >= totalPages) return;
    await fetchPage(page + 1, true);
  }, [fetchPage, isLoading, isLoadingMore, page, totalPages]);

  // Change page replacing content (classic pagination)
  const goToPage = useCallback(
    async (newPage: number) => {
      if (newPage < 1 || newPage > totalPages || newPage === page) return;
      await fetchPage(newPage, false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchPage, page, totalPages],
  );

  const resetFilters = useCallback(() => {
    setSpecies("all");
    setSize("all");
    setAgeCategory("all");
    setGender("all");
    setCity("");
    setSearch("");
  }, []);

  const hasActiveFilters =
    species !== "all" ||
    size !== "all" ||
    ageCategory !== "all" ||
    gender !== "all" ||
    city.trim() !== "" ||
    search.trim() !== "";

  const hasMore = pets.length < total && page < totalPages;

  return {
    pets,
    total,
    totalPages,
    page,
    limit,
    species,
    size,
    ageCategory,
    gender,
    city,
    search,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    hasActiveFilters,
    setPage: goToPage,
    loadMore,
    setLimit,
    setSpecies: (val: PetSpecies | "all") => setSpecies(val),
    setSize: (val: PetSize | "all") => setSize(val),
    setAgeCategory: (val: PetAgeCategory | "all") => setAgeCategory(val),
    setGender: (val: PetGender | "all") => setGender(val),
    setCity: (val: string) => setCity(val),
    setSearch: (val: string) => setSearch(val),
    resetFilters,
    refetch: () => fetchPage(page, false),
  };
}
