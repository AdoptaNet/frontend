import { HeartHandshake } from "lucide-react";
import { Card } from "@/components/ui/card";
import { QuestionnaireReminderCard } from "./QuestionnaireReminderCard";
import { RecommendationsSection } from "@/modules/recommendations/components/RecommendationsSection";
import type { UserProfile } from "@/modules/users/models/user.types";

interface AdopterHomeViewProps {
  user: UserProfile | null;
}

export function AdopterHomeView({ user }: AdopterHomeViewProps) {
  const firstName = user?.fullName?.trim().split(" ")[0] || "Adoptante";

  return (
    <div className="w-full max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-8">
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
        {/* Central / Left Area: Personalized Recommendations with XAI */}
        <div className="lg:col-span-2 space-y-6">
          <RecommendationsSection
            initialSurveyCompleted={user?.adopterProfile?.isSurveyCompleted}
          />
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
