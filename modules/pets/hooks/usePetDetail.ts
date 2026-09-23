"use client";

import { useState, useEffect } from "react";
import { petsService } from "../services/pets.service";
import type { Pet } from "../models/pet.types";

export function usePetDetail(petId: string) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!petId) return;

    let isMounted = true;

    petsService
      .getPetById(petId)
      .then((res) => {
        if (isMounted) {
          setPet(res);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar la información de la mascota.",
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [petId]);

  return { pet, isLoading, error };
}
