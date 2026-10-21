"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  PawPrint,
  Users,
  Heart,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  PlusCircle,
  ExternalLink,
  Sparkles,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { UserProfile } from "@/modules/users/models/user.types";
import { petsService } from "@/modules/pets/services/pets.service";
import { adoptionsService } from "@/modules/adoptions/services/adoptions.service";
import type { AdoptionRequest } from "@/modules/adoptions/models/adoption.types";
import { AdoptionStatusBadge } from "@/modules/adoptions/components/AdoptionStatusBadge";
import { VerificationInfoModal } from "@/modules/users/components/VerificationInfoModal";

interface ShelterHomeViewProps {
  user: UserProfile | null;
}

export function ShelterHomeView({ user }: ShelterHomeViewProps) {
  const profile = user?.shelterProfile;
  const shelterName = profile?.organizationName || user?.fullName || "Albergue";
  const isVerified = Boolean(profile?.isVerified);

  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [totalPets, setTotalPets] = useState<number | null>(null);
  const [availablePets, setAvailablePets] = useState<number | null>(null);
  const [inProcessPets, setInProcessPets] = useState<number | null>(null);
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState<number | null>(null);
  const [recentApplications, setRecentApplications] = useState<AdoptionRequest[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadDashboardData() {
      try {
        const [allPetsRes, availPetsRes, inProcPetsRes, adoptionsRes] = await Promise.allSettled([
          petsService.getMyPets({ limit: 1 }),
          petsService.getMyPets({ limit: 1, status: "available" }),
          petsService.getMyPets({ limit: 1, status: "in_process" }),
          adoptionsService.getShelterAdoptions({ limit: 5 }),
        ]);

        if (isCancelled) return;

        if (allPetsRes.status === "fulfilled") {
          setTotalPets(allPetsRes.value.total);
        }
        if (availPetsRes.status === "fulfilled") {
          setAvailablePets(availPetsRes.value.total);
        }
        if (inProcPetsRes.status === "fulfilled") {
          setInProcessPets(inProcPetsRes.value.total);
        }
        if (adoptionsRes.status === "fulfilled") {
          const items = adoptionsRes.value.items || [];
          setRecentApplications(items);
          const pending = items.filter((a) => a.status === "pending").length;
          setPendingApplicationsCount(pending);
        }
      } catch {
        // Non-blocking dashboard loading
      } finally {
        if (!isCancelled) {
          setIsLoadingData(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-150">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-tinta-900 tracking-tight">
              ¡Hola, {shelterName}! 🐾
            </h1>
            <Tooltip>
              <TooltipTrigger>
                <span className="inline-flex cursor-help">
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verificado por AdoptaNet
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Pendiente de verificación
                    </span>
                  )}
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs p-3">
                {isVerified
                  ? "Tu albergue cuenta con acreditación oficial de AdoptaNet. Tus animales publicados lucen el distintivo de confianza."
                  : "La acreditación oficial es evaluada administrativamente. Haz clic en 'Solicitar verificación' para ver los requisitos."}
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-xs sm:text-sm text-tinta-600 max-w-2xl">
            Panel de control operativo: administra tus animales rescatados y evalúa postulaciones de adopción responsable.
          </p>
        </div>

        {!isVerified && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsVerificationModalOpen(true)}
            className="self-start sm:self-auto h-9 px-3.5 rounded-xl border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-amber-900 text-xs font-semibold gap-1.5 cursor-pointer shadow-2xs shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Solicitar Verificación Oficial</span>
          </Button>
        )}
      </div>

      {/* Top Metrics Cards (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Mascotas */}
        <Link href="/pets" className="block group">
          <Card className="p-4 sm:p-5 border-line bg-white shadow-2xs hover:shadow-md hover:border-verde-500/50 transition-all rounded-2xl h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-tinta-600">Total rescatados</span>
              <div className="w-8 h-8 rounded-xl bg-verde-50 text-verde-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <PawPrint className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-tinta-900">
                {isLoadingData ? "..." : (totalPets ?? 0)}
              </div>
              <p className="text-[11px] text-tinta-500 mt-0.5">En registro institucional</p>
            </div>
          </Card>
        </Link>

        {/* Disponibles */}
        <Link href="/pets" className="block group">
          <Card className="p-4 sm:p-5 border-line bg-white shadow-2xs hover:shadow-md hover:border-verde-500/50 transition-all rounded-2xl h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-tinta-600">Disponibles</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Heart className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-800">
                {isLoadingData ? "..." : (availablePets ?? 0)}
              </div>
              <p className="text-[11px] text-tinta-500 mt-0.5">Listos para adopción</p>
            </div>
          </Card>
        </Link>

        {/* En proceso */}
        <Link href="/pets" className="block group">
          <Card className="p-4 sm:p-5 border-line bg-white shadow-2xs hover:shadow-md hover:border-verde-500/50 transition-all rounded-2xl h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-tinta-600">En proceso</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-blue-800">
                {isLoadingData ? "..." : (inProcessPets ?? 0)}
              </div>
              <p className="text-[11px] text-tinta-500 mt-0.5">Evaluaciones activas</p>
            </div>
          </Card>
        </Link>

        {/* Postulaciones */}
        <Link href="/applications" className="block group">
          <Card className="p-4 sm:p-5 border-line bg-white shadow-2xs hover:shadow-md hover:border-verde-500/50 transition-all rounded-2xl h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-tinta-600">Postulaciones</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-amber-800">
                {isLoadingData ? "..." : (pendingApplicationsCount ?? 0)}
              </div>
              <p className="text-[11px] text-tinta-500 mt-0.5">Por evaluar en bandeja</p>
            </div>
          </Card>
        </Link>
      </div>

      {/* Main Grid: Left / Center (2 cols) + Lateral Column (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left 2 Cols: Quick Actions & Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner de Acciones Rápidas */}
          <Card className="border-verde-200 bg-gradient-to-r from-verde-50 via-verde-50/60 to-white shadow-xs rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-verde-700 text-white text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3 text-verde-200" />
                  <span>Gestión Institucional</span>
                </div>
                <h3 className="text-base sm:text-lg font-heading font-bold text-tinta-900">
                  ¿Tienes un nuevo rescatado listo para adopción?
                </h3>
                <p className="text-xs text-tinta-600 max-w-md">
                  Publica su ficha con fotos. Nuestra IA extraerá automáticamente especie, pelaje y colores a partir de las fotos.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 flex-wrap sm:flex-nowrap">
                <Link href="/pets/new" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-9.5 px-4 text-xs font-semibold bg-verde-700 hover:bg-verde-900 text-white gap-2 cursor-pointer shadow-xs">
                    <PlusCircle className="w-4 h-4" />
                    <span>Publicar mascota</span>
                  </Button>
                </Link>
                <Link href="/applications" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto h-9.5 px-3.5 text-xs font-semibold border-verde-300 bg-white hover:bg-verde-50 text-verde-800 cursor-pointer shadow-2xs">
                    <span>Ver solicitudes</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Lista de Solicitudes Recientes */}
          <Card className="border-line bg-white shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="p-5 border-b border-line bg-superficie-2/40 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-heading font-bold text-tinta-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-verde-700" />
                  <span>Postulaciones recientes de adoptantes</span>
                </CardTitle>
                <CardDescription className="text-xs text-tinta-500 mt-0.5">
                  Adoptantes interesados en tus rescatados
                </CardDescription>
              </div>

              <Link
                href="/applications"
                className="text-xs font-semibold text-verde-700 hover:text-verde-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-0">
              {isLoadingData ? (
                <div className="p-8 text-center text-xs text-tinta-500 space-y-2">
                  <p>Cargando postulaciones recientes...</p>
                </div>
              ) : recentApplications.length === 0 ? (
                <div className="p-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-superficie-2 text-tinta-400 flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-tinta-900">
                      No tienes solicitudes de adopción pendientes
                    </p>
                    <p className="text-xs text-tinta-500 max-w-sm mx-auto">
                      Cuando un adoptante postule por alguna de tus mascotas en adopción, aparecerá aquí para que puedas evaluar su perfil.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-line">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-superficie-2/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {app.pet?.primaryPhotoUrl ? (
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-line shrink-0 bg-superficie-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={app.pet.primaryPhotoUrl}
                              alt={app.pet.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-superficie-2 border border-line flex items-center justify-center text-tinta-400 shrink-0">
                            <PawPrint className="w-5 h-5" />
                          </div>
                        )}

                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-tinta-900">
                            {app.adopter?.fullName || "Postulante interesado"}
                          </p>
                          <p className="text-xs text-tinta-600">
                            Postula por: <strong className="text-tinta-900">{app.pet?.name || "Mascota"}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
                        <AdoptionStatusBadge status={app.status} />
                        <Link href="/applications">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-semibold border-line hover:border-verde-300 text-tinta-800 hover:text-verde-800 cursor-pointer shadow-2xs"
                          >
                            <span>Evaluar</span>
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Institutional Card & Verification Box */}
        <aside className="space-y-6">
          {/* Institutional Info Card */}
          <Card className="border-line bg-white shadow-xs rounded-2xl overflow-hidden">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-verde-50 border border-verde-200 text-verde-700 text-xs font-semibold w-fit">
                <Building2 className="w-3.5 h-3.5" />
                <span>{isVerified ? "Albergue Verificado" : "Albergue Registrado"}</span>
              </div>
              <CardTitle className="text-lg font-heading font-bold text-tinta-900 mt-2">
                {profile?.organizationName || "Organización"}
              </CardTitle>
              <p className="text-xs text-tinta-600 leading-relaxed">
                Información de contacto visible en las fichas públicas de tus animales.
              </p>
            </CardHeader>

            <CardContent className="p-5 pt-1 space-y-4">
              <div className="p-3 bg-superficie-2 border border-line rounded-xl space-y-2 text-xs">
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

              <div className="space-y-2 pt-1">
                <Link href="/profile?tab=role-specific" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-9 border-line text-tinta-900 hover:bg-superficie-2 text-xs font-semibold gap-2 cursor-pointer shadow-2xs"
                  >
                    <Building2 className="w-3.5 h-3.5 text-tinta-600" />
                    <span>Editar datos institucionales</span>
                  </Button>
                </Link>

                {user?.id && (
                  <Link href={`/shelters/${user.id}`} target="_blank" className="block">
                    <Button
                      variant="outline"
                      className="w-full h-9 border-line text-tinta-700 hover:bg-superficie-2 text-xs font-semibold gap-2 cursor-pointer shadow-2xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-verde-700" />
                      <span>Ver mi ficha pública</span>
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Verification Callout Box (if not verified) */}
          {!isVerified && (
            <Card className="border-amber-200 bg-amber-50/50 shadow-xs rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-900">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                <h4 className="font-heading font-bold text-sm">
                  Insignia Oficial de Verificación
                </h4>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Los albergues verificados obtienen la insignia verde de confianza en sus animales y mayor visibilidad en el catálogo comunitario.
              </p>
              <Button
                type="button"
                onClick={() => setIsVerificationModalOpen(true)}
                className="w-full h-9 bg-amber-500 hover:bg-amber-600 text-verde-900 text-xs font-bold gap-1.5 cursor-pointer shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>¿Cómo verificarse?</span>
              </Button>
            </Card>
          )}
        </aside>
      </div>

      {/* Verification Modal */}
      <VerificationInfoModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        organizationName={shelterName}
        isVerified={isVerified}
      />
    </div>
  );
}
