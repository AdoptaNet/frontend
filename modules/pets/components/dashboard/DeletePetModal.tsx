"use client";

import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Pet } from "../../models/pet.types";

interface DeletePetModalProps {
  pet: Pet | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (petId: string) => Promise<void>;
}

export function DeletePetModal({
  pet,
  isOpen,
  onClose,
  onConfirm,
}: DeletePetModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !pet) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(pet.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={() => !isDeleting && onClose()}
      />
      <div className="relative w-full max-w-md p-6 bg-white rounded-2xl border border-line shadow-xl z-10 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-coral-50 border border-coral-200 text-coral-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1.5">
          <h3 className="text-lg font-bold text-tinta-900 font-heading">
            ¿Eliminar ficha de {pet.name}?
          </h3>
          <p className="text-xs sm:text-sm text-tinta-600 leading-relaxed">
            Esta mascota ya no aparecerá en las búsquedas públicas ni en tu panel activo.
            Puedes volver a registrarla en cualquier momento.
          </p>
        </div>

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
      </div>
    </div>
  );
}
