import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  Home,
  Heart,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/modules/users/models/user.types";

interface QuestionnaireReminderCardProps {
  user: UserProfile | null;
}

const HOUSING_LABELS: Record<string, string> = {
  apartment: "Departamento",
  house_no_yard: "Casa sin patio",
  house_with_yard: "Casa con jardín/patio",
  quinta: "Quinta",
};

const SPECIES_LABELS: Record<string, string> = {
  dog: "Perros",
  cat: "Gatos",
  any: "Perros y gatos",
};

export function QuestionnaireReminderCard({ user }: QuestionnaireReminderCardProps) {
  const profile = user?.adopterProfile;
  const isCompleted = Boolean(profile?.housingType);

  if (isCompleted) {
    const housingText = profile?.housingType ? HOUSING_LABELS[profile.housingType] || profile.housingType : null;
    const speciesText = profile?.preferredSpecies ? SPECIES_LABELS[profile.preferredSpecies] || profile.preferredSpecies : null;

    return (
      <Card className="border-line bg-white shadow-xs rounded-xl overflow-hidden">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-verde-50 border border-verde-200 text-verde-700 text-xs font-semibold w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Perfil de adopción listo</span>
          </div>
          <CardTitle className="text-lg font-heading font-bold text-tinta-900 mt-2.5">
            Preferencias activadas
          </CardTitle>
          <p className="text-xs text-tinta-600 mt-1 leading-relaxed">
            Tu perfil está calibrado para recibir recomendaciones afines en cuanto el catálogo esté disponible.
          </p>
        </CardHeader>

        <CardContent className="p-5 pt-1 space-y-4">
          <div className="p-3 bg-superficie-2 border border-line rounded-lg space-y-2 text-xs">
            {housingText && (
              <div className="flex items-center justify-between text-tinta-600">
                <span className="flex items-center gap-1.5 text-tinta-400">
                  <Home className="w-3.5 h-3.5 text-verde-700" />
                  Vivienda:
                </span>
                <span className="font-semibold text-tinta-900">{housingText}</span>
              </div>
            )}
            {speciesText && (
              <div className="flex items-center justify-between text-tinta-600">
                <span className="flex items-center gap-1.5 text-tinta-400">
                  <Heart className="w-3.5 h-3.5 text-verde-700" />
                  Preferencia:
                </span>
                <span className="font-semibold text-tinta-900">{speciesText}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-tinta-600">
              <span className="flex items-center gap-1.5 text-tinta-400">
                <Clock className="w-3.5 h-3.5 text-verde-700" />
                Estado:
              </span>
              <span className="font-semibold text-verde-700">Listo para match con IA</span>
            </div>
          </div>

          <Link href="/profile?tab=role-specific" className="block">
            <Button
              variant="outline"
              className="w-full h-10 border-line text-tinta-900 hover:bg-superficie-2 text-xs sm:text-sm font-semibold gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-tinta-600" />
              Ver o editar preferencias
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Not completed state
  return (
    <Card className="border-amber-200/90 bg-gradient-to-b from-amber-50/70 via-white to-white shadow-xs rounded-xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold w-fit">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Cuestionario pendiente</span>
        </div>
        <CardTitle className="text-lg font-heading font-bold text-tinta-900 mt-2.5">
          Activa tus recomendaciones
        </CardTitle>
        <p className="text-xs text-tinta-600 mt-1 leading-relaxed">
          Cuéntanos sobre tu tipo de vivienda, horarios y preferencias para que nuestro algoritmo te sugiera el compañero ideal.
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-1 space-y-4">
        <ul className="space-y-2 text-xs text-tinta-600">
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">✓</span>
            <span>Match inteligente con mascotas afines a tu rutina</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-600 font-bold">✓</span>
            <span>Agiliza tus solicitudes frente a los albergues</span>
          </li>
        </ul>

        <Link href="/profile?tab=role-specific" className="block">
          <Button
            className="w-full h-10 bg-amber-500 hover:bg-amber-600 text-verde-900 font-bold text-xs sm:text-sm gap-2 shadow-xs cursor-pointer"
          >
            <span>Completar cuestionario</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <p className="text-[11px] text-tinta-400 text-center">
          Toma aproximadamente 3 minutos y puedes editarlo cuando quieras.
        </p>
      </CardContent>
    </Card>
  );
}
