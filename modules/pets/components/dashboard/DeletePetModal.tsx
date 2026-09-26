"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, Loader2, AlertCircle, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pet } from "../../models/pet.types";

interface DeletePetModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (petId: string) => Promise<void>;
  onPause?: (petId: string) => Promise<void>;
}

export function DeletePetModal({
  pet,
  isOpen,
  onClose,
  onConfirm,
  onPause,
}: DeletePetModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !pet) return null;

  const isBlocked = pet.status === "in_process" || pet.status === "adopted";

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await onConfirm(pet.id);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar la mascota. Por favor verifica su estado.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePause = async () => {
    if (!onPause) return;
    setIsPausing(true);
    setErrorMessage(null);
    try {
      await onPause(pet.id);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el estado a pausado.",
      );
    } finally {
      setIsPausing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => !isDeleting && !isPausing && onClose()}
      />
      <div className="relative w-full max-w-md p-6 bg-white rounded-2xl border border-line shadow-xl z-10 space-y-4 animate-in zoom-in-95 duration-150">
        {isBlocked ? (
          <>
            <div className="w-12 h-12 rounded-full bg-ambar-50 border border-ambar-200 text-ambar-700 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-tinta-900 font-heading">
                Eliminación restringida por trazabilidad
              </h3>
              <p className="text-xs sm:text-sm text-tinta-600 leading-relaxed">
                <strong>{pet.name}</strong> se encuentra en estado{" "}
                <span className="font-semibold text-tinta-800">
                  {pet.status === "in_process" ? "En proceso" : "Adoptado"}
                </span>
                . Por resguardo de trazabilidad legal y auditoría histórica de adopciones,
                no es posible eliminar esta ficha del sistema.
              </p>
              <div className="p-3 rounded-xl bg-superficie-2 border border-line text-xs text-tinta-600 text-left">
                💡 <strong>Recomendación:</strong> Puedes cambiar su estado a{" "}
                <span className="font-semibold text-tinta-800">Oculto (Pausado)</span>{" "}
                para retirarla del catálogo público sin perder su historial legal.
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-coral-50 border border-coral-200 text-coral-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPausing}
                className="w-full sm:w-auto h-9 px-4 text-xs font-semibold text-tinta-700 border-line hover:bg-superficie-2 cursor-pointer"
              >
                Cerrar
              </Button>
              {onPause && (
                <Button
                  type="button"
                  onClick={handlePause}
                  disabled={isPausing}
                  className="w-full sm:w-auto h-9 px-4 text-xs font-semibold bg-verde-700 hover:bg-verde-800 text-white gap-1.5 cursor-pointer shadow-xs"
                >
                  {isPausing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Cambiando a oculto...</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Cambiar a oculto</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-coral-50 border border-coral-200 text-coral-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-tinta-900 font-heading">
                ¿Eliminar ficha de {pet.name}?
              </h3>
              <p className="text-xs sm:text-sm text-tinta-600 leading-relaxed">
                Esta mascota ya no aparecerá en las búsquedas públicas ni en tu panel activo.
                Se aplicará una baja lógica conservando la integridad de datos.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-coral-50 border border-coral-200 text-coral-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isDeleting}
                className="h-9 px-4 text-xs font-semibold text-tinta-700 border-line hover:bg-superficie-2 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-9 px-4 text-xs font-semibold bg-coral-600 hover:bg-coral-700 text-white gap-1.5 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <span>Sí, eliminar</span>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
