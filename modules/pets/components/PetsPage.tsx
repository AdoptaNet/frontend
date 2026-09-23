"use client";

import React from "react";
import { Loader2, Search } from "lucide-react";
import { useProfile } from "@/modules/users/hooks/useProfile";
import { PlaceholderPage } from "@/shared/components/PlaceholderPage";
import { ShelterPetsDashboard } from "./dashboard/ShelterPetsDashboard";

export function PetsPage() {
  const { role, isInitialLoading } = useProfile();

  if (isInitialLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-24 px-4 sm:px-6 flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-verde-700" />
        <p className="text-sm font-medium text-tinta-600">
          Cargando información...
        </p>
      </div>
    );
  }

  if (role === "shelter") {
    return <ShelterPetsDashboard />;
  }

  return (
    <PlaceholderPage
      title="Catálogo de Mascotas"
      description="Explora perros y gatos disponibles para adopción en diferentes albergues del Perú con filtros avanzados por tamaño, edad y compatibilidad."
      icon={<Search className="w-8 h-8" />}
    />
  );
}
