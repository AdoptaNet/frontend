"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Heart,
  MapPin,
  PawPrint,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Zap,
  Volume2,
  Building2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Info,
  Phone,
  Edit,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { usePetDetail } from "../../hooks/usePetDetail";
import { useProfile } from "@/modules/users/hooks/useProfile";
import { useAuthStore } from "@/modules/auth/store/auth.store";

interface PetDetailPageProps {
  petId: string;
}

export function PetDetailPage({ petId }: PetDetailPageProps) {
  const router = useRouter();
  const { pet, isLoading, error } = usePetDetail(petId);
  const { user } = useAuthStore();
  const { user: profileUser, role } = useProfile();
  const adopterProfile = profileUser?.adopterProfile;

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showShelterNoticeModal, setShowShelterNoticeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-24 px-4 sm:px-6 flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-verde-700" />
        <p className="text-sm font-medium text-tinta-600">
          Cargando ficha de la mascota...
        </p>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-coral-50 border border-coral-200 text-coral-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-heading font-extrabold text-tinta-900">
          Mascota no encontrada
        </h2>
        <p className="text-xs sm:text-sm text-tinta-600 max-w-md mx-auto">
          {error || "La mascota que buscas no existe o ha sido dada de baja."}
        </p>
        <Link
          href="/pets"
          className={buttonVariants({
            className: "bg-verde-700 hover:bg-verde-800 text-white text-xs",
          })}
        >
          Explorar otras mascotas disponibles
        </Link>
      </div>
    );
  }

  const photos = pet.photos || [];
  const activePhoto = photos[activePhotoIndex] || photos[0];

  const years = Math.floor(pet.ageMonths / 12);
  const months = pet.ageMonths % 12;
  const ageFormatted =
    years > 0
      ? `${years} ${years === 1 ? "año" : "años"}${
          months > 0 ? ` y ${months} ${months === 1 ? "mes" : "meses"}` : ""
        }`
      : `${months} ${months === 1 ? "mes" : "meses"}`;

  const ageStageLabels: Record<string, string> = {
    puppy: "Cachorro / Gatito",
    young: "Joven",
    adult: "Adulto",
    senior: "Senior",
  };

  const sizeLabels: Record<string, string> = {
    small: "Pequeño",
    medium: "Mediano",
    large: "Grande",
  };

  const furLabels: Record<string, string> = {
    short: "Pelaje corto",
    long: "Pelaje largo",
    hairless: "Sin pelaje",
  };

  const trainingLabels: Record<string, string> = {
    none: "Sin adiestramiento formal",
    basic: "Comandos básicos aprendidos",
    litterbox: "Uso correcto de arenero",
    advanced: "Adiestramiento avanzado",
  };

  const isOwner = user?.id === pet.shelterId;
  const isShelterUser = role === "shelter";

  const handleApplyClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (isShelterUser) {
      setShowShelterNoticeModal(true);
      return;
    }

    // US-06 CA-06.4: Gate de Machine Learning
    if (!adopterProfile?.isSurveyCompleted) {
      setShowSurveyModal(true);
      return;
    }

    // Redirige al flujo de postulación formal (Épica 5 / US-15)
    router.push(`/pets/${pet.id}/apply`);
  };

  const nextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/pets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-tinta-600 hover:text-verde-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al catálogo</span>
        </Link>

        {isOwner && (
          <Link
            href={`/pets/${pet.id}/edit`}
            className={buttonVariants({
              variant: "outline",
              className:
                "h-8 px-3 text-xs font-semibold border-line text-tinta-700 hover:bg-superficie-2 gap-1.5",
            })}
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Editar ficha técnica</span>
          </Link>
        )}
      </div>

      {/* Main Grid: Gallery + Essential Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Multimedia Gallery Carousel (3 to 6 photos) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Hero Image Container */}
          <div className="relative aspect-4/3 w-full bg-superficie-2 rounded-2xl overflow-hidden border border-line shadow-xs flex items-center justify-center">
            {activePhoto ? (
              <>
                {/* Ambient blur layer for zero crop distortion */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePhoto.url}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePhoto.url}
                  alt={`${pet.name} foto ${activePhotoIndex + 1}`}
                  className="relative z-10 max-h-full max-w-full object-contain transition-all duration-300"
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-tinta-300">
                <PawPrint className="w-16 h-16 stroke-1" />
              </div>
            )}

            {/* Overlays: Species & Status (High z-index to stay above any image orientation) */}
            <div className="absolute top-3 left-3 flex items-center gap-2 z-30 pointer-events-none">
              <span className="bg-white/95 backdrop-blur-xs text-tinta-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-2xs">
                {pet.species === "dog" ? "🐶 Perro" : "🐱 Gato"}
              </span>
              <Badge variant="disponible" className="shadow-2xs text-xs">
                Disponible
              </Badge>
            </div>

            {/* Navigation Arrows (if > 1 photo) - z-30 to always receive clicks over horizontal/vertical images */}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-tinta-800 flex items-center justify-center shadow-md transition-all cursor-pointer z-30 hover:scale-105 active:scale-95"
                  title="Foto anterior"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-tinta-800 flex items-center justify-center shadow-md transition-all cursor-pointer z-30 hover:scale-105 active:scale-95"
                  title="Foto siguiente"
                  aria-label="Foto siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Photo Count Counter */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md z-30 pointer-events-none">
                  {activePhotoIndex + 1} / {photos.length} fotos
                </div>
              </>
            )}
          </div>

          {/* Thumbnails Row */}
          {photos.length > 1 && (
            <div className="grid grid-cols-6 gap-2">
              {photos.map((photo, idx) => (
                <button
                  key={photo.publicId || photo.url || idx}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activePhotoIndex === idx
                      ? "border-verde-600 ring-2 ring-verde-500/20 scale-102"
                      : "border-line opacity-75 hover:opacity-100 hover:border-verde-400"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Technical Summary & Postulación CTA */}
        <div className="lg:col-span-5 space-y-6">
          {/* Title & Demographics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-tinta-900 tracking-tight">
                {pet.name}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-verde-50 text-verde-800 border border-verde-200">
                {ageStageLabels[pet.ageCategory] || pet.ageCategory}
              </span>
            </div>
            <p className="text-sm font-medium text-tinta-600">
              {pet.breed || "Mestizo"} · {ageFormatted} · {pet.gender === "male" ? "Macho" : "Hembra"}
            </p>
          </div>

          {/* Quick Demographics Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-superficie-2 border border-line text-center space-y-0.5">
              <span className="text-[11px] font-medium text-tinta-500 block">Tamaño</span>
              <span className="text-xs font-bold text-tinta-900">
                {sizeLabels[pet.size] || pet.size}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-superficie-2 border border-line text-center space-y-0.5">
              <span className="text-[11px] font-medium text-tinta-500 block">Sexo</span>
              <span className="text-xs font-bold text-tinta-900">
                {pet.gender === "male" ? "Macho" : "Hembra"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-superficie-2 border border-line text-center space-y-0.5">
              <span className="text-[11px] font-medium text-tinta-500 block">Pelaje</span>
              <span className="text-xs font-bold text-tinta-900 truncate block">
                {furLabels[pet.furLength] || "Corto"}
              </span>
            </div>
          </div>

          {/* Shelter Card Preview */}
          <div className="p-4 rounded-2xl bg-white border border-line shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-verde-100 text-verde-800 flex items-center justify-center shrink-0 font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-tinta-900 line-clamp-1">
                    {pet.shelter?.organizationName || "Albergue Responsable"}
                  </h4>
                  <p className="text-xs text-tinta-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-tinta-400" />
                    <span>
                      {pet.shelter?.city || "Perú"}
                      {pet.shelter?.department && pet.shelter.department !== pet.shelter.city
                        ? `, ${pet.shelter.department}`
                        : ""}
                    </span>
                  </p>
                </div>
              </div>

              {pet.shelter?.isVerified && (
                <span
                  title="Albergue Verificado"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-verde-700 bg-verde-50 border border-verde-200 px-2 py-0.5 rounded-full shrink-0"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-verde-700" />
                  <span>Verificado</span>
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs">
              <span className="text-tinta-500">Custodio legal de la mascota</span>
              <Link
                href={`/shelters/${pet.shelterId}`}
                className="text-verde-700 hover:text-verde-800 font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>Ver albergue</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Action CTA: Postular a Adopción */}
          <div className="space-y-2 pt-2">
            <Button
              type="button"
              onClick={handleApplyClick}
              className="w-full h-12 bg-verde-700 hover:bg-verde-800 text-white font-bold text-sm sm:text-base gap-2 rounded-xl shadow-sm cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-current" />
              <span>Postular a Adopción</span>
            </Button>
            <p className="text-[11px] text-center text-tinta-500">
              El proceso incluye evaluación de compatibilidad de hogar y seguimiento responsable.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Sheet: Health, Behavioral, Compatibility & Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Ficha Médica y Sanitaria */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-line shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-line">
            <div className="p-1.5 rounded-lg bg-verde-100 text-verde-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-tinta-900">
              Ficha Médica y Cuidados
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-superficie-2 border border-line space-y-1">
              <span className="text-[11px] font-medium text-tinta-500">Esterilización</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {pet.isSterilized ? (
                  <span className="text-verde-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-verde-600" /> Esterilizado/a
                  </span>
                ) : (
                  <span className="text-ambar-700 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-ambar-600" /> Pendiente
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-superficie-2 border border-line space-y-1">
              <span className="text-[11px] font-medium text-tinta-500">Vacunación</span>
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                {pet.isVaccinated ? (
                  <span className="text-verde-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-verde-600" /> Al día
                  </span>
                ) : (
                  <span className="text-ambar-700 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-ambar-600" /> Incompleta
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Estado de Salud General */}
          <div className="space-y-1 pt-1">
            <span className="text-xs font-semibold text-tinta-700">Estado de salud general</span>
            <div className="text-xs text-tinta-800 font-medium">
              {pet.healthStatus === "healthy" && "Completamente sano/a y con chequeo veterinario al día."}
              {pet.healthStatus === "chronic_condition" && "Requiere atención o tratamiento por condición médica crónica controlada."}
              {pet.healthStatus === "disability" && "Cuenta con una discapacidad física o sensorial que no limita su calidad de vida."}
            </div>
          </div>

          {/* Notas Médicas si existen */}
          {pet.healthNotes && (
            <div className="p-3 rounded-xl bg-ambar-50/60 border border-ambar-200 text-xs text-ambar-900 space-y-1">
              <span className="font-semibold flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-ambar-700" /> Notas veterinarias
              </span>
              <p className="leading-relaxed">{pet.healthNotes}</p>
            </div>
          )}
        </div>

        {/* Ficha Conductual y Convivencia */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-line shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-line">
            <div className="p-1.5 rounded-lg bg-verde-100 text-verde-800">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-extrabold text-base text-tinta-900">
              Personalidad y Convivencia
            </h3>
          </div>

          {/* Niveles Visuales 1-5 */}
          <div className="space-y-3">
            {/* Energía */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-tinta-800 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-ambar-500" /> Nivel de energía
                </span>
                <span className="font-bold text-verde-800">
                  {pet.energyLevel} / 5
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 h-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div
                    key={lvl}
                    className={`rounded-full transition-all ${
                      lvl <= pet.energyLevel
                        ? "bg-verde-600"
                        : "bg-superficie-2 border border-line"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Vocalización */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-tinta-800 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-verde-700" /> Vocalización / Ruido
                </span>
                <span className="font-bold text-verde-800">
                  {pet.vocalizationLevel} / 5
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 h-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div
                    key={lvl}
                    className={`rounded-full transition-all ${
                      lvl <= pet.vocalizationLevel
                        ? "bg-verde-600"
                        : "bg-superficie-2 border border-line"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tolerancia y Sociabilidad (CA-11.3: Neutral Badges "En evaluación conductual") */}
          <div className="pt-2 space-y-2">
            <span className="text-xs font-semibold text-tinta-700 block">
              Compatibilidad social evaluada
            </span>

            <div className="flex flex-wrap gap-2">
              {/* Niños */}
              {pet.goodWithChildren === true ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-verde-50 text-verde-800 border border-verde-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-verde-600" />
                  <span>Apto para convivir con niños</span>
                </span>
              ) : pet.goodWithChildren === false ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-coral-50 text-coral-800 border border-coral-200">
                  <AlertCircle className="w-3.5 h-3.5 text-coral-600" />
                  <span>No recomendado con niños</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-superficie-2 text-tinta-600 border border-line">
                  <HelpCircle className="w-3.5 h-3.5 text-tinta-400" />
                  <span>Convivencia con niños: En evaluación conductual</span>
                </span>
              )}

              {/* Perros */}
              {pet.goodWithDogs === true ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-verde-50 text-verde-800 border border-verde-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-verde-600" />
                  <span>Sociable con otros perros</span>
                </span>
              ) : pet.goodWithDogs === false ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-coral-50 text-coral-800 border border-coral-200">
                  <AlertCircle className="w-3.5 h-3.5 text-coral-600" />
                  <span>No tolera otros perros</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-superficie-2 text-tinta-600 border border-line">
                  <HelpCircle className="w-3.5 h-3.5 text-tinta-400" />
                  <span>Convivencia con perros: En evaluación conductual</span>
                </span>
              )}

              {/* Gatos */}
              {pet.goodWithCats === true ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-verde-50 text-verde-800 border border-verde-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-verde-600" />
                  <span>Sociable con gatos</span>
                </span>
              ) : pet.goodWithCats === false ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-coral-50 text-coral-800 border border-coral-200">
                  <AlertCircle className="w-3.5 h-3.5 text-coral-600" />
                  <span>No tolera gatos</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-superficie-2 text-tinta-600 border border-line">
                  <HelpCircle className="w-3.5 h-3.5 text-tinta-400" />
                  <span>Convivencia con gatos: En evaluación conductual</span>
                </span>
              )}
            </div>
          </div>

          {/* Rutina y Adiestramiento */}
          <div className="pt-2 border-t border-line/60 grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-tinta-500 font-medium">Adiestramiento</span>
              <p className="font-semibold text-tinta-800">
                {trainingLabels[pet.trainingLevel] || "Básico"}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-tinta-500 font-medium">Horas a solas</span>
              <p className="font-semibold text-tinta-800">
                {pet.timeAloneToleranceHours !== null && pet.timeAloneToleranceHours !== undefined
                  ? `Tolera hasta ${pet.timeAloneToleranceHours} horas`
                  : "En evaluación"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story / Biography Section */}
      <div className="p-5 sm:p-7 bg-white rounded-2xl border border-line shadow-xs space-y-3">
        <h3 className="font-heading font-extrabold text-lg text-tinta-900">
          Conoce la historia de {pet.name}
        </h3>
        <p className="text-xs sm:text-sm text-tinta-700 leading-relaxed whitespace-pre-line">
          {pet.description}
        </p>

        {pet.shelterStayMonths > 0 && (
          <p className="text-xs text-tinta-500 pt-2 border-t border-line/60 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-tinta-400" />
            <span>
              Lleva {pet.shelterStayMonths}{" "}
              {pet.shelterStayMonths === 1 ? "mes" : "meses"} bajo cuidado en el albergue esperando un hogar definitivo.
            </span>
          </p>
        )}
      </div>

      {/* Detailed Shelter Contact Block (CA-11.4) */}
      <div className="p-6 bg-superficie-2/70 rounded-2xl border border-line space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-verde-700 text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base text-tinta-900">
                  {pet.shelter?.organizationName || "Albergue Responsable"}
                </h3>
                {pet.shelter?.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-verde-700 bg-verde-100 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-verde-700" />
                    <span>Verificado</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-tinta-600 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-tinta-400" />
                <span>
                  {pet.shelter?.city || "Perú"}
                  {pet.shelter?.department && pet.shelter.department !== pet.shelter.city
                    ? `, ${pet.shelter.department}`
                    : ""}
                </span>
                {pet.shelter?.phoneNumber && (
                  <>
                    <span>·</span>
                    <Phone className="w-3.5 h-3.5 text-tinta-400" />
                    <span>{pet.shelter.phoneNumber}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/shelters/${pet.shelterId}`}
              className={buttonVariants({
                variant: "outline",
                className:
                  "h-10 text-xs sm:text-sm font-semibold border-line bg-white hover:bg-superficie-2 text-tinta-800 gap-1.5 shadow-2xs",
              })}
            >
              <span>Ver ficha y otras mascotas</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Button
              type="button"
              onClick={handleApplyClick}
              className="h-10 bg-verde-700 hover:bg-verde-800 text-white font-semibold text-xs sm:text-sm gap-2 shadow-xs cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Postular</span>
            </Button>
          </div>
        </div>
      </div>

      {/* ---------- MODAL 1: GATE DE ML (US-06 CA-06.4) ---------- */}
      {showSurveyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setShowSurveyModal(false)} />
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl border border-line shadow-xl z-10 space-y-4 animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-verde-50 border border-verde-200 text-verde-700 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-tinta-900 font-heading">
                Perfil de compatibilidad pendiente
              </h3>
              <p className="text-xs sm:text-sm text-tinta-600 leading-relaxed">
                Para postular a esta mascota, primero debes completar tu perfil de
                compatibilidad (te tomará ~3 minutos). Esto permitirá al albergue conocer
                las condiciones de tu hogar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSurveyModal(false)}
                className="w-full sm:w-auto h-9 px-4 text-xs font-semibold text-tinta-700 border-line hover:bg-superficie-2 cursor-pointer"
              >
                Quizás más tarde
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowSurveyModal(false);
                  router.push("/profile?tab=role-specific");
                }}
                className="w-full sm:w-auto h-9 px-4 text-xs font-semibold bg-verde-700 hover:bg-verde-800 text-white gap-1.5 cursor-pointer shadow-xs"
              >
                Completar cuestionario ahora
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- MODAL 2: AVISO PARA ALBERGUES ---------- */}
      {showShelterNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setShowShelterNoticeModal(false)} />
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl border border-line shadow-xl z-10 space-y-4 animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-ambar-50 border border-ambar-200 text-ambar-700 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-tinta-900 font-heading">
                Acción no disponible para albergues
              </h3>
              <p className="text-xs sm:text-sm text-tinta-600 leading-relaxed">
                Tu cuenta está registrada con rol de albergue. La postulación a adopciones
                está reservada para cuentas de adoptantes particulares.
              </p>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                onClick={() => setShowShelterNoticeModal(false)}
                className="h-9 px-5 text-xs font-semibold bg-verde-700 hover:bg-verde-800 text-white cursor-pointer shadow-xs"
              >
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- MODAL 3: AVISO PARA VISITANTES NO AUTENTICADOS ---------- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setShowAuthModal(false)} />
          <div className="relative w-full max-w-md p-6 bg-white rounded-2xl border border-line shadow-xl z-10 space-y-4 animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-verde-50 border border-verde-200 text-verde-700 flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 fill-current" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-tinta-900 font-heading">
                Inicia sesión para postular
              </h3>
              <p className="text-xs sm:text-sm text-tinta-600 leading-relaxed">
                Para postular a la adopción de <strong>{pet.name}</strong>, inicia sesión
                con tu cuenta de adoptante o crea una cuenta gratuita en pocos pasos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAuthModal(false)}
                className="w-full sm:w-auto h-9 px-4 text-xs font-semibold text-tinta-700 border-line hover:bg-superficie-2 cursor-pointer"
              >
                Seguir explorando
              </Button>
              <Link
                href={`/login?redirect=/pets/${pet.id}`}
                className={buttonVariants({
                  className:
                    "w-full sm:w-auto h-9 px-4 text-xs font-semibold bg-verde-700 hover:bg-verde-800 text-white shadow-xs",
                })}
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
