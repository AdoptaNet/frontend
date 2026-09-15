import { Suspense } from "react";
import { ProfilePage } from "@/modules/users/components/ProfilePage";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Mi Perfil — AdoptaNet",
  description: "Administra tu perfil, preferencias de adopción y seguridad de tu cuenta.",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-5xl mx-auto py-24 px-4 sm:px-6 flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-verde-700" />
          <p className="text-sm font-medium text-tinta-600">Cargando perfil...</p>
        </div>
      }
    >
      <ProfilePage />
    </Suspense>
  );
}
