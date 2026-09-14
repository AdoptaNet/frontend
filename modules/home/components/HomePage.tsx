"use client";

import { Loader2, AlertCircle } from "lucide-react";
import { useProfile } from "@/modules/users/hooks/useProfile";
import { AdopterHomeView } from "./AdopterHomeView";
import { ShelterHomeView } from "./ShelterHomeView";

export function HomePage() {
  const { user, role, isInitialLoading } = useProfile();

  if (isInitialLoading && !user) {
    return (
      <div className="w-full max-w-5xl mx-auto py-24 px-4 sm:px-6 flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-verde-700" />
        <p className="text-sm font-medium text-tinta-600">Cargando panel...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full max-w-5xl mx-auto py-24 px-4 sm:px-6 text-center">
        <AlertCircle className="w-10 h-10 text-coral-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-tinta-900">No se pudo cargar la información del usuario</h2>
        <p className="text-sm text-tinta-600 mt-1">Por favor verifica tu sesión e intenta recargar la página.</p>
      </div>
    );
  }

  if (role === "shelter") {
    return <ShelterHomeView user={user} />;
  }

  return <AdopterHomeView user={user} />;
}
