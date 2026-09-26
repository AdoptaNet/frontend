"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/modules/users/hooks/useProfile";
import { ShelterPetsDashboard } from "./dashboard/ShelterPetsDashboard";
import { PublicPetsCatalog } from "./catalog/PublicPetsCatalog";

export function PetsPage() {
  const { role, isInitialLoading } = useProfile();

  if (isInitialLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-24 px-4 sm:px-6 flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-verde-700" />
        <p className="text-sm font-medium text-tinta-600">
          Cargando catálogo...
        </p>
      </div>
    );
  }

  if (role === "shelter") {
    return <ShelterPetsDashboard />;
  }

  return <PublicPetsCatalog />;
}
