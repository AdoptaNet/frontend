import Link from "next/link";
import { Sparkles, Compass, HeartHandshake, ShieldCheck, User, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuestionnaireReminderCard } from "./QuestionnaireReminderCard";
import type { UserProfile } from "@/modules/users/models/user.types";

interface AdopterHomeViewProps {
  user: UserProfile | null;
}

export function AdopterHomeView({ user }: AdopterHomeViewProps) {
  const firstName = user?.fullName?.trim().split(" ")[0] || "Adoptante";

  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-8">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-tinta-900 tracking-tight">
          ¡Hola, {firstName}! 👋
        </h1>
        <p className="text-sm text-tinta-600 max-w-2xl">
          Bienvenido a tu panel en AdoptaNet. Desde aquí podrás descubrir mascotas compatibles y gestionar tus solicitudes.
        </p>
      </div>

      {/* Main Grid: Center / Left (2 cols on lg) + Sidebar (1 col on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Central / Left Area (In Construction) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-line shadow-xs rounded-xl text-center py-12 px-6 sm:px-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-verde-50 text-verde-700 flex items-center justify-center mb-5 ring-8 ring-verde-50/50">
              <Sparkles className="w-8 h-8" />
            </div>

            <CardHeader className="p-0">
              <span className="text-xs font-bold uppercase tracking-wider text-verde-700 bg-verde-50 border border-verde-200 px-3 py-1 rounded-full w-fit mx-auto mb-2">
                En construcción
              </span>
              <CardTitle className="text-2xl font-heading font-bold text-tinta-900 mt-2">
                Catálogo y recomendaciones con IA
              </CardTitle>
              <CardDescription className="text-sm text-tinta-600 max-w-lg mx-auto mt-2 leading-relaxed">
                Estamos afinando el motor inteligente de afinidad para presentarte perros y gatos rescatados que encajen perfectamente con tu rutina, vivienda y estilo de vida.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 pt-8">
              {/* Upcoming Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left">
                <div className="p-3 rounded-lg bg-superficie-2 border border-line">
                  <div className="flex items-center gap-2 text-verde-700 font-semibold text-xs mb-1">
                    <Compass className="w-3.5 h-3.5" />
                    Catálogo
                  </div>
                  <p className="text-[11px] text-tinta-600 leading-snug">
                    Fichas detalladas con temperamento, historia y salud.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-superficie-2 border border-line">
                  <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Afinidad IA
                  </div>
                  <p className="text-[11px] text-tinta-600 leading-snug">
                    Porcentaje de compatibilidad y motivos claros.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-superficie-2 border border-line">
                  <div className="flex items-center gap-2 text-verde-700 font-semibold text-xs mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Postulaciones
                  </div>
                  <p className="text-[11px] text-tinta-600 leading-snug">
                    Seguimiento transparente de tus solicitudes de adopción.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/profile">
                  <Button variant="outline" className="h-9 px-4 text-xs font-semibold text-tinta-900 border-line hover:bg-superficie-2 gap-2 cursor-pointer">
                    <User className="w-3.5 h-3.5 text-tinta-600" />
                    Ver mi perfil general
                  </Button>
                </Link>
                <Link href="/profile?tab=role-specific">
                  <Button variant="ghost" className="h-9 px-4 text-xs font-semibold text-verde-700 hover:text-verde-900 hover:bg-verde-50 gap-1.5 cursor-pointer">
                    <span>Configurar preferencias de adoptante</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lateral Column: Questionnaire Card & Tips Card */}
        <aside className="space-y-6">
          <QuestionnaireReminderCard user={user} />

          {/* Quick tips companion card */}
          <Card className="border-line bg-white shadow-xs rounded-xl p-5">
            <div className="flex items-center gap-2 text-verde-700 font-heading font-semibold text-sm mb-3">
              <HeartHandshake className="w-4 h-4" />
              <span>Adopción responsable</span>
            </div>
            <ul className="space-y-2.5 text-xs text-tinta-600">
              <li className="flex items-start gap-2">
                <span className="text-verde-700 font-bold">•</span>
                <span><strong>Tiempo de adaptación:</strong> Toda mascota necesita semanas para acostumbrarse a su nuevo hogar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verde-700 font-bold">•</span>
                <span><strong>Hogar seguro:</strong> Revisa mallas en ventanas, balcones y organiza un área de descanso tranquila.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-verde-700 font-bold">•</span>
                <span><strong>Compromiso para siempre:</strong> Una adopción dura toda la vida del animalito.</span>
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
