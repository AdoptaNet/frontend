"use client";

import { useState } from "react";
import { User as UserIcon, Mail, Calendar, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/shared/utils/date";
import type { UserProfile } from "../models/user.types";
import { AvatarUploader } from "./AvatarUploader";

interface PersonalDataFormProps {
  user: UserProfile;
  onUpdatePersonalData: (data: { fullName?: string }) => Promise<void>;
  onUploadAvatar: (file: File) => Promise<void>;
  onRemoveAvatar: () => void;
  isLoading?: boolean;
}

export function PersonalDataForm({
  user,
  onUpdatePersonalData,
  onUploadAvatar,
  onRemoveAvatar,
  isLoading = false,
}: PersonalDataFormProps) {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [isSaving, setIsSaving] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [bottomFeedback, setBottomFeedback] = useState<{
    type: "success" | "error" | null;
    message: string | null;
  }>({ type: null, message: null });

  const handleNameChange = (val: string) => {
    setFullName(val);
    if (nameError) setNameError(null);
    if (bottomFeedback.type === "error") setBottomFeedback({ type: null, message: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBottomFeedback({ type: null, message: null });

    const trimmed = fullName.trim();
    if (trimmed.length < 3) {
      setNameError("El nombre completo debe tener al menos 3 caracteres.");
      setBottomFeedback({
        type: "error",
        message: "Por favor ingresa un nombre válido de al menos 3 caracteres.",
      });
      return;
    }

    setIsSaving(true);
    try {
      await onUpdatePersonalData({ fullName: trimmed });
      setBottomFeedback({
        type: "success",
        message: "¡Datos personales actualizados correctamente!",
      });
      setTimeout(() => {
        setBottomFeedback((prev) => (prev.type === "success" ? { type: null, message: null } : prev));
      }, 5000);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Error al actualizar datos personales";
      setBottomFeedback({
        type: "error",
        message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isRoleAdopter = user.role === "adopter";

  return (
    <Card className="bg-white border-line shadow-sm py-0 gap-0">
      <CardHeader className="p-4 sm:p-6 pb-2.5 sm:pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-xl font-heading text-tinta-900">
              Datos Personales
            </CardTitle>
            <CardDescription className="text-sm text-tinta-600 mt-0.5">
              Información visible de tu cuenta y datos de contacto directo.
            </CardDescription>
          </div>
          <Badge
            variant={isRoleAdopter ? "disponible" : "default"}
            className="self-start sm:self-auto uppercase tracking-wide text-[11px] px-3 py-1 font-semibold"
          >
            {isRoleAdopter ? "Adoptante" : "Albergue / Rescatista"}
          </Badge>
        </div>
      </CardHeader>

      <Separator className="bg-line" />

      <form onSubmit={handleSubmit}>
        <CardContent className="p-4 sm:p-6 pt-3 sm:pt-4 space-y-6">
          {/* Avatar Section */}
          <AvatarUploader
            avatarUrl={user.avatarUrl}
            fullName={user.fullName}
            onUpload={onUploadAvatar}
            onRemove={onRemoveAvatar}
            disabled={isLoading || isSaving}
          />

          <Separator className="bg-line" />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nombre Completo */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-tinta-900 flex items-center gap-1.5">
                <UserIcon className="w-4 h-4 text-verde-700" />
                Nombre completo <span className="text-rojo-600 font-bold">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ej. Franco Morales"
                disabled={isLoading || isSaving}
                className={`h-12 border-line focus-visible:ring-verde-500 text-sm ${
                  nameError ? "border-rojo-500 focus-visible:ring-rojo-500 bg-red-50/20" : ""
                }`}
              />
              {nameError && (
                <p className="text-xs text-rojo-600 font-medium flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{nameError}</span>
                </p>
              )}
            </div>

            {/* Correo Electrónico (Deshabilitado con nota) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-tinta-900 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-verde-700" />
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="h-12 border-line bg-atenuado text-tinta-600 cursor-not-allowed text-sm"
              />
              <p className="text-xs text-tinta-400">
                El correo está vinculado a tu cuenta y no puede modificarse directamente.
              </p>
            </div>
          </div>

          {/* Fecha de Registro */}
          <div className="flex items-center gap-2 pt-2 text-xs text-tinta-600">
            <Calendar className="w-4 h-4 text-tinta-400" />
            <span>
              Miembro desde: <strong className="text-tinta-900 font-medium">{formatDate(user.createdAt)}</strong>
            </span>
          </div>
        </CardContent>

        <Separator className="bg-line mt-4" />

        <CardFooter className="py-4 bg-superficie-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex-1">
            {bottomFeedback.message && (
              <div
                className={`p-3 rounded-lg border text-xs sm:text-sm font-medium flex items-center gap-2 ${
                  bottomFeedback.type === "success"
                    ? "bg-verde-50 border-verde-200 text-verde-800"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {bottomFeedback.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-verde-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{bottomFeedback.message}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || isSaving || fullName.trim() === (user.fullName || "")}
            className="bg-verde-700 hover:bg-verde-hover text-white font-medium min-w-[160px] cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
