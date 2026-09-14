"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, ShieldAlert, CheckCircle2, Loader2, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SecurityFormProps {
  onChangePassword: (data: { currentPassword?: string; newPassword?: string }) => Promise<boolean>;
  isLoading?: boolean;
}

export function SecurityForm({ onChangePassword, isLoading = false }: SecurityFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!currentPassword) {
      setValidationError("Debes ingresar tu contraseña actual.");
      return;
    }

    if (newPassword.length < 8) {
      setValidationError("La nueva contraseña debe tener como mínimo 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Las contraseñas no coinciden.");
      return;
    }

    setIsSaving(true);
    try {
      const success = await onChangePassword({ currentPassword, newPassword });
      if (success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const isLongEnough = newPassword.length >= 8;
  const hasLettersAndNumbers = /[A-Za-z]/.test(newPassword) && /\d/.test(newPassword);

  return (
    <Card className="bg-white border-line shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-heading text-tinta-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-verde-700" />
          Seguridad y Contraseña
        </CardTitle>
        <CardDescription className="text-sm text-tinta-600 mt-1">
          Administra la clave de acceso para iniciar sesión en AdoptaNet.
        </CardDescription>
      </CardHeader>

      <Separator className="bg-line" />

      {/* Notice for Google Auth */}
      <div className="mx-6 mt-6 p-4 rounded-lg bg-verde-50 border-l-4 border-verde-700 flex items-start gap-3">
        <Info className="w-5 h-5 text-verde-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-tinta-900 leading-relaxed">
          <span className="font-semibold text-verde-700">Autenticación externa: </span>
          Si te registraste con tu cuenta de Google, puedes iniciar sesión directamente con un clic sin necesidad de crear o cambiar una contraseña aquí.
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-5">
          {validationError && (
            <div className="p-3.5 rounded-lg bg-coral-100 border-l-4 border-coral-600 text-coral-600 text-xs sm:text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Contraseña Actual */}
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword" className="text-sm font-medium text-tinta-900">
              Contraseña actual
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingresa tu contraseña actual"
                required
                disabled={isLoading || isSaving}
                className="h-12 pr-10 border-line focus-visible:ring-verde-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tinta-400 hover:text-tinta-600 p-1 cursor-pointer"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
            {/* Nueva Contraseña */}
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-sm font-medium text-tinta-900">
                Nueva contraseña
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                  disabled={isLoading || isSaving}
                  className="h-12 pr-10 border-line focus-visible:ring-verde-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tinta-400 hover:text-tinta-600 p-1 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-tinta-900">
                Confirmar nueva contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  required
                  disabled={isLoading || isSaving}
                  className="h-12 pr-10 border-line focus-visible:ring-verde-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-tinta-400 hover:text-tinta-600 p-1 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Requisitos visuales */}
          <div className="p-3 bg-superficie-2 border border-line rounded-lg text-xs space-y-1.5">
            <span className="font-semibold text-tinta-600 block mb-1">
              Requisitos mínimos de seguridad:
            </span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-3.5 h-3.5 ${isLongEnough ? "text-verde-700" : "text-tinta-400"}`} />
              <span className={isLongEnough ? "text-verde-700 font-medium" : "text-tinta-600"}>
                Al menos 8 caracteres de longitud
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-3.5 h-3.5 ${hasLettersAndNumbers ? "text-verde-700" : "text-tinta-400"}`} />
              <span className={hasLettersAndNumbers ? "text-verde-700 font-medium" : "text-tinta-600"}>
                Contiene combinación de letras y números
              </span>
            </div>
          </div>
        </CardContent>

        <Separator className="bg-line mt-4" />

        <CardFooter className="py-4 bg-superficie-2 flex justify-end">
          <Button
            type="submit"
            disabled={isLoading || isSaving || !currentPassword || !newPassword || !confirmPassword}
            className="bg-verde-700 hover:bg-verde-hover text-white font-medium min-w-[180px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Actualizar contraseña"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
