"use client";

import { useState, useCallback } from "react";
import type { UserProfile, UserRole } from "../models/user.types";
import type { UpdateAdopterProfileDto } from "../models/adopter-profile.types";
import type { UpdateShelterProfileDto } from "../models/shelter-profile.types";
import { mockAdopterUser, mockIncompleteAdopterUser, mockShelterUser } from "../mocks/mock-users";

export interface FeedbackState {
  type: "success" | "error" | "info" | null;
  message: string | null;
}

export function useProfile() {
  const [activeRole, setActiveRole] = useState<UserRole>("adopter");
  const [adopterStatus, setAdopterStatus] = useState<"completed" | "incomplete">("completed");
  const [adopterData, setAdopterData] = useState<UserProfile>(mockAdopterUser);
  const [shelterData, setShelterData] = useState<UserProfile>(mockShelterUser);
  const [feedback, setFeedback] = useState<FeedbackState>({ type: null, message: null });
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = activeRole === "adopter" ? adopterData : shelterData;

  const showFeedback = useCallback((type: FeedbackState["type"], message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((prev) => (prev.message === message ? { type: null, message: null } : prev));
    }, 4000);
  }, []);

  const setMockRole = useCallback((role: UserRole) => {
    setActiveRole(role);
    showFeedback("info", `Cambiado a vista de prueba: ${role === "adopter" ? "Adoptante" : "Albergue"}`);
  }, [showFeedback]);

  const setAdopterStatusMode = useCallback((status: "completed" | "incomplete") => {
    setAdopterStatus(status);
    if (status === "incomplete") {
      setAdopterData(mockIncompleteAdopterUser);
      showFeedback("info", "Modo simulación: Adoptante nuevo (cuestionario pendiente)");
    } else {
      setAdopterData(mockAdopterUser);
      showFeedback("info", "Modo simulación: Adoptante existente (cuestionario completado)");
    }
  }, [showFeedback]);


  const updatePersonalData = useCallback(async (data: { fullName?: string }) => {
    setIsLoading(true);
    try {
      // Simulate network latency
      await new Promise((res) => setTimeout(res, 400));
      if (activeRole === "adopter") {
        setAdopterData((prev) => ({
          ...prev,
          fullName: data.fullName ?? prev.fullName,
        }));
      } else {
        setShelterData((prev) => ({
          ...prev,
          fullName: data.fullName ?? prev.fullName,
        }));
      }
      showFeedback("success", "Datos personales actualizados correctamente");
    } finally {
      setIsLoading(false);
    }
  }, [activeRole, showFeedback]);

  const updateAvatar = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 300));
      const objectUrl = URL.createObjectURL(file);
      if (activeRole === "adopter") {
        setAdopterData((prev) => ({ ...prev, avatarUrl: objectUrl }));
      } else {
        setShelterData((prev) => ({ ...prev, avatarUrl: objectUrl }));
      }
      showFeedback("success", "Foto de perfil actualizada (vista previa local)");
    } finally {
      setIsLoading(false);
    }
  }, [activeRole, showFeedback]);

  const removeAvatar = useCallback(() => {
    if (activeRole === "adopter") {
      setAdopterData((prev) => ({ ...prev, avatarUrl: null }));
    } else {
      setShelterData((prev) => ({ ...prev, avatarUrl: null }));
    }
    showFeedback("info", "Foto de perfil eliminada");
  }, [activeRole, showFeedback]);

  const changePassword = useCallback(async (data: { currentPassword?: string; newPassword?: string }) => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      if (!data.newPassword || data.newPassword.length < 8) {
        showFeedback("error", "La nueva contraseña debe tener al menos 8 caracteres");
        return false;
      }
      showFeedback("success", "Contraseña actualizada con éxito");
      return true;
    } finally {
      setIsLoading(false);
    }
  }, [showFeedback]);

  const updateAdopterProfile = useCallback(async (dto: UpdateAdopterProfileDto) => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      setAdopterData((prev) => {
        const base = prev.adopterProfile ?? {
          id: "adp_new_" + Date.now(),
          userId: prev.id,
          createdAt: new Date().toISOString(),
        };
        return {
          ...prev,
          adopterProfile: {
            ...base,
            ...dto,
            updatedAt: new Date().toISOString(),
          } as import("../models/adopter-profile.types").AdopterProfile,
        };
      });
      setAdopterStatus("completed");
      showFeedback("success", "¡Excelente! Tus preferencias de adopción fueron guardadas con éxito.");
    } finally {
      setIsLoading(false);
    }
  }, [showFeedback]);

  const updateShelterProfile = useCallback(async (dto: UpdateShelterProfileDto) => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      setShelterData((prev) => ({
        ...prev,
        shelterProfile: prev.shelterProfile
          ? { ...prev.shelterProfile, ...dto, updatedAt: new Date().toISOString() }
          : null,
      }));
      showFeedback("success", "Información del albergue guardada correctamente");
    } finally {
      setIsLoading(false);
    }
  }, [showFeedback]);

  return {
    user: currentUser,
    role: activeRole,
    adopterStatus,
    setAdopterStatusMode,
    isLoading,
    feedback,
    setMockRole,
    updatePersonalData,
    updateAvatar,
    removeAvatar,
    changePassword,
    updateAdopterProfile,
    updateShelterProfile,
  };
}

