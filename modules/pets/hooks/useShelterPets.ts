"use client";

import { useState, useEffect, useCallback } from "react";
import { petsService } from "../services/pets.service";
import type { Pet, PetStatus } from "../models/pet.types";

export function useShelterPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PetStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await petsService.getMyPets({
        page,
        limit: 9,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: searchQuery.trim() || undefined,
      });

      setPets(res.items);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar las mascotas del albergue.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, searchQuery]);

  useEffect(() => {
    let ignore = false;

    petsService
      .getMyPets({
        page,
        limit: 9,
        status: statusFilter === "all" ? undefined : statusFilter,
        search: searchQuery.trim() || undefined,
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
              : "Error al cargar las mascotas del albergue.",
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
  }, [page, statusFilter, searchQuery]);

  const changePetStatus = async (petId: string, newStatus: PetStatus) => {
    // Actualización optimista en UI
    setPets((prev) =>
      prev.map((p) => (p.id === petId ? { ...p, status: newStatus } : p)),
    );

    try {
      await petsService.updatePetStatus(petId, { status: newStatus });
    } catch (err) {
      // Revertir en caso de fallo
      fetchPets();
      throw err;
    }
  };

  const deletePet = async (petId: string) => {
    // Actualización optimista en UI
    setPets((prev) => prev.filter((p) => p.id !== petId));
    setTotal((prev) => Math.max(0, prev - 1));

    try {
      await petsService.deletePet(petId);
    } catch (err) {
      fetchPets();
      throw err;
    }
  };

  return {
    pets,
    total,
    totalPages,
    page,
    statusFilter,
    searchQuery,
    isLoading,
    error,
    setPage,
    setStatusFilter: (st: PetStatus | "all") => {
      setStatusFilter(st);
      setPage(1);
    },
    setSearchQuery: (query: string) => {
      setSearchQuery(query);
      setPage(1);
    },
    changePetStatus,
    deletePet,
    refresh: fetchPets,
  };
}
