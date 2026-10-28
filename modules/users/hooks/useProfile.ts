"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import type { UserProfile, UserRole } from "../models/user.types";
import type { UpdateAdopterProfileDto } from "../models/adopter-profile.types";
import type { UpdateShelterProfileDto } from "../models/shelter-profile.types";
import { usersService } from "../services/users.service";

export interface FeedbackState {
  type: "success" | "error" | "info" | null;
  message: string | null;
}

export function useProfile() {
  const {
    user: authUser,
    setUser: setAuthUser,
    isAuthenticated,
    isHydrated,
  } = useAuthStore();
  const [user, setUser] = useState<UserProfile | null>(() =>
    authUser ? (authUser as unknown as UserProfile) : null,
  );
  const [internalLoading, setInternalLoading] = useState(() => !authUser);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({
    type: null,
    message: null,
  });

  // Mantener sincronizado el estado si authUser se rehidrata posteriormente
  useEffect(() => {
    if (!user && authUser) {
      setUser(authUser as unknown as UserProfile);
      setInternalLoading(false);
    }
  }, [authUser, user]);

  const isInitialLoading =
    isHydrated && !isAuthenticated ? false : internalLoading;

  const showFeedback = useCallback(
    (type: FeedbackState["type"], message: string) => {
      setFeedback({ type, message });
      setTimeout(() => {
        setFeedback((prev) =>
          prev.message === message ? { type: null, message: null } : prev,
        );
      }, 4500);
    },
    [],
  );

  const refetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setInternalLoading(false);
      return;
    }
    setInternalLoading(true);
    try {
      const data = await usersService.getMyProfile();
      setUser(data);
      setAuthUser({
        id: data.id,
        email: data.email,
        fullName: data.fullName,
        avatarUrl: data.avatarUrl,
        role: data.role,
        roleSelected: data.roleSelected,
        hasPassword: data.hasPassword,
        isEmailVerified: data.isEmailVerified,
        createdAt: data.createdAt,
        adopterProfile: data.adopterProfile,
        shelterProfile: data.shelterProfile,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al cargar la información del perfil";
      showFeedback("error", message);
    } finally {
      setInternalLoading(false);
    }
  }, [isAuthenticated, setAuthUser, showFeedback]);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;

    let isCancelled = false;

    usersService
      .getMyProfile()
      .then((data) => {
        if (!isCancelled) {
          setUser(data);
          setAuthUser({
            id: data.id,
            email: data.email,
            fullName: data.fullName,
            avatarUrl: data.avatarUrl,
            role: data.role,
            roleSelected: data.roleSelected,
            hasPassword: data.hasPassword,
            isEmailVerified: data.isEmailVerified,
            createdAt: data.createdAt,
            adopterProfile: data.adopterProfile,
            shelterProfile: data.shelterProfile,
          });
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "Error al cargar la información del perfil";
          showFeedback("error", message);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setInternalLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated, isHydrated, setAuthUser, showFeedback]);

  const updatePersonalData = useCallback(
    async (data: { fullName?: string }) => {
      setIsSaving(true);
      try {
        const updated = await usersService.updateMe(data);
        setUser((prev) =>
          prev ? { ...prev, fullName: updated.fullName } : updated,
        );
        if (authUser) {
          setAuthUser({
            ...authUser,
            fullName: updated.fullName,
            avatarUrl: updated.avatarUrl ?? authUser.avatarUrl,
          });
        }
        showFeedback("success", "Datos personales actualizados correctamente");
        return;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Error al actualizar datos personales";
        showFeedback("error", message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [authUser, setAuthUser, showFeedback],
  );

  const updateAvatar = useCallback(
    async (file: File) => {
      setIsSaving(true);
      try {
        const updated = await usersService.updateAvatar(file);
        setUser((prev) =>
          prev ? { ...prev, avatarUrl: updated.avatarUrl } : updated,
        );
        if (authUser) {
          setAuthUser({
            ...authUser,
            avatarUrl: updated.avatarUrl,
          });
        }
        showFeedback("success", "Foto de perfil actualizada exitosamente");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error al subir foto de perfil";
        showFeedback("error", message);
      } finally {
        setIsSaving(false);
      }
    },
    [authUser, setAuthUser, showFeedback],
  );

  const removeAvatar = useCallback(async () => {
    setIsSaving(true);
    try {
      await usersService.removeAvatar();
      setUser((prev) => (prev ? { ...prev, avatarUrl: null } : prev));
      if (authUser) {
        setAuthUser({ ...authUser, avatarUrl: null });
      }
      showFeedback("info", "Foto de perfil eliminada");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al eliminar foto de perfil";
      showFeedback("error", message);
    } finally {
      setIsSaving(false);
    }
  }, [authUser, setAuthUser, showFeedback]);

  const changePassword = useCallback(
    async (data: { currentPassword?: string; newPassword?: string }) => {
      setIsSaving(true);
      try {
        const response = await usersService.changePassword({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });
        showFeedback(
          "success",
          response.message || "Contraseña actualizada exitosamente",
        );
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Error al actualizar contraseña";
        showFeedback("error", message);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [showFeedback],
  );

  const updateAdopterProfile = useCallback(
    async (dto: UpdateAdopterProfileDto) => {
      setIsSaving(true);
      try {
        const updatedProfile = await usersService.updateAdopterProfile(dto);
        setUser((prev) =>
          prev ? { ...prev, adopterProfile: updatedProfile } : prev,
        );
        if (authUser) {
          setAuthUser({
            ...authUser,
            adopterProfile: updatedProfile,
          });
        }
        return;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Error al guardar preferencias de adopción";
        showFeedback("error", message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [authUser, setAuthUser, showFeedback],
  );

  const updateShelterProfile = useCallback(
    async (dto: UpdateShelterProfileDto) => {
      setIsSaving(true);
      try {
        const updatedProfile = await usersService.updateShelterProfile(dto);
        setUser((prev) =>
          prev ? { ...prev, shelterProfile: updatedProfile } : prev,
        );
        if (authUser) {
          setAuthUser({
            ...authUser,
            shelterProfile: updatedProfile,
          });
        }
        showFeedback(
          "success",
          "Información del albergue guardada exitosamente",
        );
        return;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Error al guardar información del albergue";
        showFeedback("error", message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [authUser, setAuthUser, showFeedback],
  );

  const activeRole: UserRole = user?.role ?? authUser?.role ?? "adopter";

  return {
    user,
    role: activeRole,
    isInitialLoading,
    isSaving,
    feedback,
    refetchProfile,
    updatePersonalData,
    updateAvatar,
    removeAvatar,
    changePassword,
    updateAdopterProfile,
    updateShelterProfile,
  };
}
