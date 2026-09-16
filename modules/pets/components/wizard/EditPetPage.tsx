"use client";

import React from "react";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePetDetail } from "../../hooks/usePetDetail";
import { PetFormWizard } from "./PetFormWizard";

interface EditPetPageProps {
  petId: string;
}

export function EditPetPage({ petId }: EditPetPageProps) {
  const { pet, isLoading, error } = usePetDetail(petId);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-tinta-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-verde-700" />
        <span className="text-xs sm:text-sm font-medium">
          Cargando ficha de la mascota...
        </span>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-coral-50 border border-coral-200 text-coral-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-tinta-900 font-heading">
          No se pudo encontrar la mascota
        </h3>
        <p className="text-xs sm:text-sm text-tinta-600 leading-relaxed">
          {error || "La mascota solicitada no existe o no tienes permisos para editarla."}
        </p>
        <Link href="/pets">
          <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Mis Mascotas</span>
          </Button>
        </Link>
      </div>
    );
  }

  return <PetFormWizard initialPet={pet} />;
}
