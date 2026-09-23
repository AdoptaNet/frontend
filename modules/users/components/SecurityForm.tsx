"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
  CheckCircle2,
  Loader2,
  Info,
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authService } from "@/modules/auth/services/auth.service";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import type { UserProfile } from "../models/user.types";

interface SecurityFormProps {
  user?: UserProfile | null;
  onChangePassword: (data: {
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<boolean>;
  isLoading?: boolean;
}

export function SecurityForm({
  user,
  onChangePassword,
  isLoading = false,
}: SecurityFormProps) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const hasPassword = user?.hasPassword !== false;
  const isShelter = user?.role === "shelter";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Modal de baja de cuenta (Ley N° 29733)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (hasPassword && !currentPassword) {
      setValidationError("Debes ingresar tu contraseña actual.");
      return;
    }

    if (newPassword.length < 8) {
      setValidationError(
        "La nueva contraseña debe tener como mínimo 8 caracteres."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Las contraseñas no coinciden.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = hasPassword
        ? { currentPassword, newPassword }
        : { newPassword };

      const success = await onChangePassword(payload);
      if (success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);

    if (hasPassword && !deletePassword) {
      setDeleteError("Debes ingresar tu contraseña para confirmar la baja.");
      return;
    }

    if (!hasPassword && deleteConfirmText.trim().toUpperCase() !== "ELIMINAR") {
      setDeleteError('Escribe la palabra "ELIMINAR" para confirmar la baja.');
      return;
    }

    setIsDeleting(true);
    try {
      await authService.deleteAccount(
        hasPassword ? { password: deletePassword } : undefined
      );

      // Cierre de sesión y redirección tras anonimización
      logout();
      router.push("/login?accountDeleted=true");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo procesar la baja de cuenta. Intenta nuevamente.";
      setDeleteError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const isLongEnough = newPassword.length >= 8;

  return (
    <div className="space-y-6">
      {/* Tarjeta de Gestión de Contraseña */}
      <Card className="bg-white border-line shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-heading text-tinta-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-verde-700" />
            {hasPassword
              ? "Seguridad y Contraseña"
              : "Definir Contraseña de Acceso"}
          </CardTitle>
          <CardDescription className="text-sm text-tinta-600 mt-1">
            {hasPassword
              ? "Administra la clave de acceso para iniciar sesión en AdoptaNet."
              : "Define una contraseña para poder iniciar sesión con correo y clave además de Google."}
          </CardDescription>
        </CardHeader>

        <Separator className="bg-line" />

        {/* Noticia para usuarios de Google */}
        {!hasPassword ? (
          <div className="mx-6 mt-6 p-4 rounded-lg bg-verde-50 border-l-4 border-verde-700 flex items-start gap-3">
            <Info className="w-5 h-5 text-verde-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-tinta-900 leading-relaxed">
              <span className="font-semibold text-verde-700">
                Cuenta de Google activa:{" "}
              </span>
              Tu cuenta se autentica a través de Google. Puedes crear una
              contraseña local aquí para disponer de ambos métodos de acceso. No
              se requiere contraseña previa.
            </div>
          </div>
        ) : (
          <div className="mx-6 mt-6 p-4 rounded-lg bg-superficie-2 border border-line flex items-start gap-3">
            <Info className="w-5 h-5 text-tinta-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-tinta-700 leading-relaxed">
              Por tu seguridad, al cambiar tu contraseña se revocarán todas las
              demás sesiones activas en otros navegadores o dispositivos.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 space-y-5">
            {validationError && (
              <div className="p-3.5 rounded-lg bg-coral-100 border-l-4 border-coral-600 text-coral-600 text-xs sm:text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Contraseña Actual (solo si el usuario tiene contraseña) */}
            {hasPassword && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="currentPassword"
                  className="text-sm font-medium text-tinta-900"
                >
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
                    {showCurrent ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              {/* Nueva Contraseña */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-tinta-900"
                >
                  {hasPassword ? "Nueva contraseña" : "Crear contraseña"}
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
                    {showNew ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmar Nueva Contraseña */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-tinta-900"
                >
                  Confirmar {hasPassword ? "nueva contraseña" : "contraseña"}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    required
                    disabled={isLoading || isSaving}
                    className="h-12 pr-10 border-line focus-visible:ring-verde-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tinta-400 hover:text-tinta-600 p-1 cursor-pointer"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Requisitos visuales */}
            <div className="p-3 bg-superficie-2 border border-line rounded-lg text-xs space-y-1.5">
              <span className="font-semibold text-tinta-600 block mb-1">
                Requisito del sistema:
              </span>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    isLongEnough ? "text-verde-700" : "text-tinta-400"
                  }`}
                />
                <span
                  className={
                    isLongEnough
                      ? "text-verde-700 font-medium"
                      : "text-tinta-600"
                  }
                >
                  Al menos 8 caracteres de longitud
                </span>
              </div>
            </div>
          </CardContent>

          <Separator className="bg-line mt-4" />

          <CardFooter className="py-4 bg-superficie-2 flex justify-end">
            <Button
              type="submit"
              disabled={
                isLoading ||
                isSaving ||
                (hasPassword && !currentPassword) ||
                !newPassword ||
                !confirmPassword
              }
              className="bg-verde-700 hover:bg-verde-hover text-white font-medium min-w-[180px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : hasPassword ? (
                "Actualizar contraseña"
              ) : (
                "Guardar contraseña"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Zona de Peligro: Baja de Cuenta (Ley N° 29733) */}
      <Card className="bg-white border-coral-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-heading text-coral-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-coral-600" />
            Zona de Peligro: Baja Definitiva de Cuenta
          </CardTitle>
          <CardDescription className="text-sm text-tinta-600 mt-1">
            Ejercicio de derecho de supresión y anonimización de datos personales
            (Ley N° 29733 de Protección de Datos Personales de la República del
            Perú).
          </CardDescription>
        </CardHeader>

        <Separator className="bg-coral-100" />

        <CardContent className="pt-6 space-y-4">
          <p className="text-sm text-tinta-700 leading-relaxed">
            Al dar de baja tu cuenta en AdoptaNet:
          </p>
          <ul className="text-xs sm:text-sm text-tinta-600 space-y-2 list-disc pl-5">
            <li>
              Tu correo electrónico y nombre completo serán anonimizados de forma
              permanente e irreversible.
            </li>
            <li>
              Tu avatar e información de inicio de sesión serán eliminados.
            </li>
            <li>
              Tus solicitudes y registros históricos serán desvinculados para
              proteger tu privacidad.
            </li>
            <li>
              No podrás volver a acceder ni recuperar esta cuenta una vez
              completado el proceso.
            </li>
          </ul>

          {isShelter && (
            <div className="p-3.5 rounded-lg bg-amber-50 border-l-4 border-amber-500 text-amber-900 text-xs sm:text-sm flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                <strong>Restricción para albergues:</strong> Si tienes mascotas
                publicadas en estado <em>Disponible</em> o <em>En proceso</em>,
                el sistema bloqueará la baja de la cuenta hasta que las mascotas
                hayan sido adoptadas o transferidas.
              </span>
            </div>
          )}
        </CardContent>

        <Separator className="bg-coral-100" />

        <CardFooter className="py-4 bg-coral-50/50 flex justify-between items-center">
          <span className="text-xs text-coral-700">
            Esta acción es irreversible y permanente.
          </span>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              setDeleteError(null);
              setDeletePassword("");
              setDeleteConfirmText("");
              setIsDeleteModalOpen(true);
            }}
            className="bg-coral-600 hover:bg-coral-700 text-white font-medium flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Dar de baja mi cuenta
          </Button>
        </CardFooter>
      </Card>

      {/* Modal accesible de confirmación de baja */}
      {isDeleteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-coral-200 space-y-5 relative">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
              className="absolute right-4 top-4 text-tinta-400 hover:text-tinta-700 p-1 rounded-lg hover:bg-superficie-2 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-coral-600">
              <div className="w-10 h-10 rounded-full bg-coral-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-coral-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-tinta-900 font-heading">
                  ¿Confirmas la baja definitiva?
                </h3>
                <p className="text-xs text-coral-600 font-medium">
                  Ley N° 29733 de Protección de Datos Personales
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-tinta-700 leading-relaxed">
              Esta acción desactivará tu cuenta y anonimizará de forma permanente
              todos tus datos personales. <strong>No habrá forma de recuperar el acceso.</strong>
            </p>

            {deleteError && (
              <div className="p-3 rounded-lg bg-coral-100 border-l-4 border-coral-600 text-coral-700 text-xs sm:text-sm flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{deleteError}</span>
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              {hasPassword ? (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="deletePassword"
                    className="text-xs sm:text-sm font-medium text-tinta-900"
                  >
                    Ingresa tu contraseña para confirmar tu identidad:
                  </Label>
                  <div className="relative">
                    <Input
                      id="deletePassword"
                      type={showDeletePassword ? "text" : "password"}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Tu contraseña actual"
                      required
                      disabled={isDeleting}
                      className="h-11 pr-10 border-line focus-visible:ring-coral-500 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowDeletePassword(!showDeletePassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-tinta-400 hover:text-tinta-600 p-1 cursor-pointer"
                    >
                      {showDeletePassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="deleteConfirmText"
                    className="text-xs sm:text-sm font-medium text-tinta-900"
                  >
                    Tu cuenta usa Google. Para confirmar, escribe{" "}
                    <span className="font-bold text-coral-600">ELIMINAR</span>:
                  </Label>
                  <Input
                    id="deleteConfirmText"
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="ELIMINAR"
                    required
                    disabled={isDeleting}
                    className="h-11 border-line focus-visible:ring-coral-500 text-sm font-mono uppercase"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isDeleting}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="border-line text-tinta-700 hover:bg-superficie-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isDeleting ||
                    (hasPassword && !deletePassword) ||
                    (!hasPassword &&
                      deleteConfirmText.trim().toUpperCase() !== "ELIMINAR")
                  }
                  className="bg-coral-600 hover:bg-coral-700 text-white font-medium min-w-[140px]"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Anonimizando...
                    </>
                  ) : (
                    "Confirmar baja"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
