import Link from "next/link";
import { Building2, ShieldCheck, PawPrint, Users, HeartHandshake, ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/modules/users/models/user.types";

interface ShelterHomeViewProps {
  user: UserProfile | null;
}

export function ShelterHomeView({ user }: ShelterHomeViewProps) {
  const profile = user?.shelterProfile;
  const shelterName = profile?.organizationName || user?.fullName || "Albergue";
  const isVerified = Boolean(profile?.isVerified);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-8">
      {/* Welcome Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-tinta-900 tracking-tight">
            ¡Hola, {shelterName}! 🐾
          </h1>
          {isVerified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-verde-50 border border-verde-200 text-verde-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verificado
            </span>
          )}
        </div>
        <p className="text-sm text-tinta-600 max-w-2xl">
          Panel de administración institucional y gestión de animales rescatados en AdoptaNet.
        </p>
      </div>

      {/* Main Grid: Left / Center (2 cols) + Lateral Column (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Central / Left Area (In Construction) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-line shadow-xs rounded-xl text-center py-12 px-6 sm:px-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-verde-50 text-verde-700 flex items-center justify-center mb-5 ring-8 ring-verde-50/50">
              <Building2 className="w-8 h-8" />
            </div>

            <CardHeader className="p-0">
              <span className="text-xs font-bold uppercase tracking-wider text-verde-700 bg-verde-50 border border-verde-200 px-3 py-1 rounded-full w-fit mx-auto mb-2">
                En construcción
              </span>
              <CardTitle className="text-2xl font-heading font-bold text-tinta-900 mt-2">
                Panel de gestión y administración de rescates
              </CardTitle>
              <CardDescription className="text-sm text-tinta-600 max-w-lg mx-auto mt-2 leading-relaxed">
                Estamos desarrollando las herramientas para que puedas publicar a tus rescatados, recibir postulaciones de adoptantes y gestionar los seguimientos de forma ágil y centralizada.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 pt-8">
              {/* Upcoming Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left">
                <div className="p-3 rounded-lg bg-superficie-2 border border-line">
                  <div className="flex items-center gap-2 text-verde-700 font-semibold text-xs mb-1">
                    <PawPrint className="w-3.5 h-3.5" />
                    Publicación
                  </div>
                  <p className="text-[11px] text-tinta-600 leading-snug">
                    Fichas completas de perros y gatos listos para adopción.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-superficie-2 border border-line">
                  <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs mb-1">
                    <Users className="w-3.5 h-3.5" />
                    Postulaciones
                  </div>
                  <p className="text-[11px] text-tinta-600 leading-snug">
                    Evaluación de adoptantes con cálculo de afinidad.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-superficie-2 border border-line">
                  <div className="flex items-center gap-2 text-verde-700 font-semibold text-xs mb-1">
                    <HeartHandshake className="w-3.5 h-3.5" />
                    Seguimiento
                  </div>
                  <p className="text-[11px] text-tinta-600 leading-snug">
                    Control de entregas y visitas de control post-adopción.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/profile?tab=role-specific">
                  <Button className="h-9 px-4 text-xs font-semibold bg-verde-700 hover:bg-verde-900 text-white gap-2 cursor-pointer">
                    <Building2 className="w-3.5 h-3.5" />
                    Completar datos institucionales
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="h-9 px-4 text-xs font-semibold text-tinta-900 border-line hover:bg-superficie-2 gap-1.5 cursor-pointer">
                    <span>Configuración de cuenta</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lateral Column: Shelter Info & Verification Status */}
        <aside className="space-y-6">
          <Card className="border-line bg-white shadow-xs rounded-xl overflow-hidden">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-verde-50 border border-verde-200 text-verde-700 text-xs font-semibold w-fit">
                <Building2 className="w-3.5 h-3.5" />
                <span>{isVerified ? "Albergue verificado" : "Albergue registrado"}</span>
              </div>
              <CardTitle className="text-lg font-heading font-bold text-tinta-900 mt-2.5">
                {profile?.organizationName || "Organización"}
              </CardTitle>
              <p className="text-xs text-tinta-600 mt-1 leading-relaxed">
                Mantén tus datos de contacto e información institucional actualizados para facilitar la comunicación.
              </p>
            </CardHeader>

            <CardContent className="p-5 pt-1 space-y-4">
              <div className="p-3 bg-superficie-2 border border-line rounded-lg space-y-2 text-xs">
                <div className="flex items-center justify-between text-tinta-600">
                  <span className="flex items-center gap-1.5 text-tinta-400">
                    <MapPin className="w-3.5 h-3.5 text-verde-700" />
                    Ubicación:
                  </span>
                  <span className="font-semibold text-tinta-900 truncate max-w-[150px]">
                    {profile?.city ? `${profile.city}, ${profile.department || ""}` : (profile?.department || "No registrada")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-tinta-600">
                  <span className="flex items-center gap-1.5 text-tinta-400">
                    <Phone className="w-3.5 h-3.5 text-verde-700" />
                    Teléfono:
                  </span>
                  <span className="font-semibold text-tinta-900">
                    {profile?.phoneNumber || "No registrado"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-tinta-600">
                  <span className="flex items-center gap-1.5 text-tinta-400">
                    <Mail className="w-3.5 h-3.5 text-verde-700" />
                    Email:
                  </span>
                  <span className="font-semibold text-tinta-900 truncate max-w-[150px]">
                    {profile?.contactEmail || user?.email}
                  </span>
                </div>
              </div>

              <Link href="/profile?tab=role-specific" className="block">
                <Button
                  variant="outline"
                  className="w-full h-10 border-line text-tinta-900 hover:bg-superficie-2 text-xs sm:text-sm font-semibold gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-tinta-600" />
                  Editar ficha institucional
                </Button>
              </Link>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
