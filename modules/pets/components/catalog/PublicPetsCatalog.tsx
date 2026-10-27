"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  PawPrint,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
  MapPin,
  X,
  ArrowDown,
  Camera,
  Eye,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePublicPets } from "../../hooks/usePublicPets";
import { PublicPetCard } from "./PublicPetCard";
import { VisualSearchModal } from "./VisualSearchModal";
import { VisualSearchDetailsModal } from "./VisualSearchDetailsModal";
import { formatColorList } from "../../utils/pet-ai-normalizer";
import {
  PERU_DEPARTMENTS,
  getDistrictsByDepartment,
} from "@/shared/constants/peru-locations";
import type {
  PetSpecies,
  PetSize,
  PetAgeCategory,
  PetGender,
  SimilarPetResponse,
  AnalyzePetPhotosResponse,
} from "../../models/pet.types";

export function PublicPetsCatalog() {
  const {
    pets,
    total,
    totalPages,
    page,
    species,
    size,
    ageCategory,
    gender,
    feeType,
    isSterilized,
    department,
    city,
    search,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    hasActiveFilters,
    setPage,
    loadMore,
    setSpecies,
    setSize,
    setAgeCategory,
    setGender,
    setFeeType,
    setIsSterilized,
    setDepartment,
    setCity,
    setSearch,
    resetFilters,
  } = usePublicPets();

  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSurveyBanner, setShowSurveyBanner] = useState(
    searchParams.get("survey") === "completed"
  );

  const handleDismissSurveyBanner = () => {
    setShowSurveyBanner(false);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("survey");
    router.replace(params.toString() ? `/pets?${params.toString()}` : "/pets");
  };

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(search);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [visualSearchResults, setVisualSearchResults] = useState<SimilarPetResponse[] | null>(null);
  const [visualSearchPhotoUrl, setVisualSearchPhotoUrl] = useState<string | null>(null);
  const [visualSearchAnalysis, setVisualSearchAnalysis] = useState<AnalyzePetPhotosResponse | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleSearchResults = (
    results: SimilarPetResponse[],
    photoUrl: string,
    analysis?: AnalyzePetPhotosResponse | null,
  ) => {
    if (visualSearchPhotoUrl && visualSearchPhotoUrl !== photoUrl) {
      URL.revokeObjectURL(visualSearchPhotoUrl);
    }
    setVisualSearchResults(results);
    setVisualSearchPhotoUrl(photoUrl);
    setVisualSearchAnalysis(analysis || null);
  };

  const handleClearVisualSearch = () => {
    if (visualSearchPhotoUrl) {
      URL.revokeObjectURL(visualSearchPhotoUrl);
    }
    setVisualSearchResults(null);
    setVisualSearchPhotoUrl(null);
    setVisualSearchAnalysis(null);
    setIsDetailsModalOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (visualSearchResults !== null) {
      handleClearVisualSearch();
    }
    setSearch(searchInput);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Banner de Celebración de Cuestionario de Compatibilidad */}
      {showSurveyBanner && (
        <div className="bg-gradient-to-r from-emerald-600 via-verde-700 to-teal-800 text-white p-4 sm:p-5 rounded-2xl shadow-md flex items-center justify-between gap-4 animate-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                  ¡Perfil de compatibilidad completado con éxito! 🎉
                </h4>
                <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded-full text-white">
                  Postulaciones desbloqueadas
                </span>
              </div>
              <p className="text-xs text-white/90 leading-relaxed max-w-3xl">
                Tus respuestas de vivienda, rutina y estilo de vida están registradas. Ya puedes enviar solicitudes de adopción con un solo clic a cualquier mascota de la plataforma.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismissSurveyBanner}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-verde-50 border border-verde-200 text-verde-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-verde-600" />
          <span>Catálogo Comunitario de Adopción</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-tinta-900 tracking-tight">
          Encuentra a tu nuevo compañero
        </h1>
        <p className="text-xs sm:text-sm text-tinta-600 leading-relaxed">
          Explora mascotas en adopción responsable rescatadas por albergues y
          asociaciones formales en todo el Perú.
        </p>
      </div>

      {/* Main Filter Control Card */}
      <div className="bg-white rounded-2xl border border-line p-4 sm:p-5 shadow-xs space-y-4">
        {/* Top row: Species switcher + Search bar + Filter toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Species Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-superficie-2 rounded-xl border border-line self-start">
            {[
              { id: "all", label: "Todos los animales" },
              { id: "dog", label: "Perros 🐶" },
              { id: "cat", label: "Gatos 🐱" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (visualSearchResults !== null) {
                    handleClearVisualSearch();
                  }
                  setSpecies(tab.id as PetSpecies | "all");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  species === tab.id && visualSearchResults === null
                    ? "bg-white text-verde-800 shadow-2xs"
                    : "text-tinta-600 hover:text-tinta-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 text-tinta-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-8 h-10 text-xs sm:text-sm bg-superficie-2/50 border-line rounded-xl"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-tinta-400 hover:text-tinta-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            <button
              type="button"
              onClick={() => setIsVisualSearchOpen(true)}
              className="relative inline-flex items-center justify-center gap-1.5 h-10 px-3 sm:px-3.5 rounded-xl font-bold text-xs text-white bg-verde-800 hover:bg-verde-700 active:scale-[0.98] transition-all cursor-pointer shadow-xs animate-[ai-button-breathing_2.6s_ease-in-out_infinite] shrink-0"
              title="Buscar mascotas parecidas a una foto usando Inteligencia Artificial"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span className="tracking-tight">
                <span className="sm:hidden">Buscar con IA</span>
                <span className="hidden sm:inline">Buscar por foto con IA</span>
              </span>
            </button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`h-10 px-3 sm:px-3.5 rounded-xl border-line text-xs font-semibold gap-1.5 cursor-pointer ${
                showAdvancedFilters || hasActiveFilters
                  ? "bg-verde-50 border-verde-300 text-verde-800"
                  : "bg-white text-tinta-700 hover:bg-superficie-2"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filtros</span>
            </Button>
          </div>
        </div>

        {/* Expandable Advanced Filters Row */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-line/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 animate-in fade-in duration-150">
            {/* Tamaño */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-tinta-700">
                Tamaño corporal
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as PetSize | "all")}
                className="w-full h-9 rounded-xl border border-line bg-white px-2.5 text-xs text-tinta-800 focus:outline-none focus:ring-1 focus:ring-verde-500 cursor-pointer"
              >
                <option value="all">Todos los tamaños</option>
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
              </select>
            </div>

            {/* Rango de Edad */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-tinta-700">
                Etapa de vida
              </label>
              <select
                value={ageCategory}
                onChange={(e) =>
                  setAgeCategory(e.target.value as PetAgeCategory | "all")
                }
                className="w-full h-9 rounded-xl border border-line bg-white px-2.5 text-xs text-tinta-800 focus:outline-none focus:ring-1 focus:ring-verde-500 cursor-pointer"
              >
                <option value="all">Todas las edades</option>
                <option value="puppy">Cachorros / Gatitos (&lt; 1 año)</option>
                <option value="young">Jóvenes (1 a 2 años)</option>
                <option value="adult">Adultos (3 a 7 años)</option>
                <option value="senior">Senior (8+ años)</option>
              </select>
            </div>

            {/* Sexo */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-tinta-700">
                Sexo
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as PetGender | "all")}
                className="w-full h-9 rounded-xl border border-line bg-white px-2.5 text-xs text-tinta-800 focus:outline-none focus:ring-1 focus:ring-verde-500 cursor-pointer"
              >
                <option value="all">Cualquier sexo</option>
                <option value="male">Macho</option>
                <option value="female">Hembra</option>
              </select>
            </div>

            {/* Aporte */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-tinta-700">
                Aporte
              </label>
              <select
                value={feeType}
                onChange={(e) =>
                  setFeeType(e.target.value as "all" | "free" | "with_fee")
                }
                className="w-full h-9 rounded-xl border border-line bg-white px-2.5 text-xs text-tinta-800 focus:outline-none focus:ring-1 focus:ring-verde-500 cursor-pointer"
              >
                <option value="all">Todos</option>
                <option value="free">Adopción gratuita</option>
                <option value="with_fee">Con aporte</option>
              </select>
            </div>

            {/* Esterilización */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-tinta-700">
                Esterilización
              </label>
              <select
                value={isSterilized === "all" ? "all" : isSterilized ? "true" : "false"}
                onChange={(e) => {
                  const val = e.target.value;
                  setIsSterilized(val === "all" ? "all" : val === "true");
                }}
                className="w-full h-9 rounded-xl border border-line bg-white px-2.5 text-xs text-tinta-800 focus:outline-none focus:ring-1 focus:ring-verde-500 cursor-pointer"
              >
                <option value="all">Todos los estados</option>
                <option value="true">Solo esterilizados/as</option>
              </select>
            </div>

            {/* Departamento */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-tinta-700 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-verde-700" />
                Departamento
              </label>
              <select
                value={department}
                onChange={(e) => {
                  const newDept = e.target.value;
                  setDepartment(newDept);
                  setCity("");
                }}
                className="w-full h-9 rounded-xl border border-line bg-white px-2.5 text-xs text-tinta-800 focus:outline-none focus:ring-1 focus:ring-verde-500 cursor-pointer"
              >
                <option value="">Todo el Perú</option>
                {PERU_DEPARTMENTS.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>

            {/* Distrito Dependiente */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-tinta-700">
                Distrito
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!department}
                className={`w-full h-9 rounded-xl border border-line bg-white px-2.5 text-xs text-tinta-800 focus:outline-none focus:ring-1 focus:ring-verde-500 cursor-pointer ${
                  !department ? "opacity-60 bg-superficie-2 cursor-not-allowed" : ""
                }`}
              >
                <option value="">
                  {department ? "Todos los distritos" : "Elige región primero"}
                </option>
                {department &&
                  getDistrictsByDepartment(department).map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between pt-1 gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-tinta-500 font-medium mr-0.5">
                Filtros activos:
              </span>
              {feeType !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-verde-50 text-verde-800 border border-verde-200 text-[11px] font-medium">
                  🪙 {feeType === "free" ? "Adopción gratuita" : "Con aporte"}
                  <button
                    type="button"
                    onClick={() => setFeeType("all")}
                    className="hover:text-coral-600 font-bold ml-0.5 cursor-pointer"
                    title="Quitar filtro de aporte"
                  >
                    ×
                  </button>
                </span>
              )}
              {isSterilized !== "all" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-verde-50 text-verde-800 border border-verde-200 text-[11px] font-medium">
                  ✂️ {isSterilized ? "Esterilizado/a" : "Sin esterilizar"}
                  <button
                    type="button"
                    onClick={() => setIsSterilized("all")}
                    className="hover:text-coral-600 font-bold ml-0.5 cursor-pointer"
                    title="Quitar filtro de esterilización"
                  >
                    ×
                  </button>
                </span>
              )}
              {department && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-verde-50 text-verde-800 border border-verde-200 text-[11px] font-medium">
                  📍 {department}
                  <button
                    type="button"
                    onClick={() => {
                      setDepartment("");
                      setCity("");
                    }}
                    className="hover:text-coral-600 font-bold ml-0.5 cursor-pointer"
                    title="Quitar filtro de región"
                  >
                    ×
                  </button>
                </span>
              )}
              {city && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-verde-50 text-verde-800 border border-verde-200 text-[11px] font-medium">
                  🏘️ {city}
                  <button
                    type="button"
                    onClick={() => setCity("")}
                    className="hover:text-coral-600 font-bold ml-0.5 cursor-pointer"
                    title="Quitar filtro de distrito"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 font-semibold text-verde-700 hover:text-verde-800 hover:underline cursor-pointer ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          </div>
        )}
      </div>

      {/* Visual Search Active Banner */}
      {visualSearchResults !== null && (
        <div className="bg-gradient-to-r from-verde-50 via-verde-50/70 to-white border border-verde-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5 w-full md:w-auto">
            {visualSearchPhotoUrl && (
              <button
                type="button"
                onClick={() => setIsDetailsModalOpen(true)}
                className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0 bg-white cursor-pointer group focus:outline-none focus:ring-2 focus:ring-verde-600 transition-all hover:shadow-lg active:scale-95"
                title="Haz clic para ver la fotografía y el reporte del modelo de IA"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={visualSearchPhotoUrl}
                  alt="Foto buscada"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-verde-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 p-1">
                  <Maximize2 className="w-5 h-5 text-amber-300 drop-shadow-sm" />
                  <span className="text-[10px] font-black text-center leading-tight">
                    Ver análisis
                  </span>
                </div>
              </button>
            )}

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-verde-900 text-white text-xs font-bold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>Búsqueda Inteligente por Foto</span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-tinta-900 font-heading">
                {visualSearchResults.length > 0
                  ? `Encontramos ${visualSearchResults.length} mascotas parecidas`
                  : "No encontramos mascotas parecidas a esta fotografía"}
              </h3>
              <p className="text-xs text-tinta-600 leading-relaxed max-w-xl">
                Identificadas y ordenadas por IA según similitud en rostro, color y pelaje.
              </p>

              {/* Badges de rasgos extraídos por el modelo CV */}
              {(() => {
                const topItem =
                  visualSearchResults && visualSearchResults.length > 0
                    ? visualSearchResults[0]
                    : null;
                const traits = topItem?.queryTraits;

                const rawSpecies =
                  visualSearchAnalysis?.species?.value?.toLowerCase() ||
                  traits?.species?.toLowerCase() ||
                  topItem?.pet?.species?.toLowerCase();
                const displaySpecies =
                  rawSpecies === "dog" || rawSpecies === "perro"
                    ? "🐶 Perro"
                    : rawSpecies === "cat" || rawSpecies === "gato"
                      ? "🐱 Gato"
                      : null;

                const displayColors =
                  Array.isArray(visualSearchAnalysis?.colors?.value) &&
                  visualSearchAnalysis.colors.value.length > 0
                    ? visualSearchAnalysis.colors.value
                    : Array.isArray(traits?.colors) && traits.colors.length > 0
                      ? traits.colors
                      : Array.isArray(topItem?.pet?.colors) &&
                          topItem.pet.colors.length > 0
                        ? topItem.pet.colors
                        : [];

                const rawFur =
                  visualSearchAnalysis?.fur?.value?.toLowerCase() ||
                  traits?.fur?.toLowerCase() ||
                  topItem?.pet?.furLength?.toLowerCase();
                const displayFur =
                  rawFur?.includes("short") || rawFur?.includes("corto")
                    ? "Pelaje corto"
                    : rawFur?.includes("long") || rawFur?.includes("largo")
                      ? "Pelaje largo"
                      : rawFur?.includes("hairless") ||
                          rawFur?.includes("sin pelo")
                        ? "Sin pelo"
                        : null;

                return (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {displaySpecies && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-verde-200 text-verde-900 text-xs font-semibold shadow-2xs">
                        <span>{displaySpecies}</span>
                      </span>
                    )}
                    {displayColors.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-verde-200 text-verde-900 text-xs font-semibold shadow-2xs">
                        <span>🎨 {formatColorList(displayColors.slice(0, 3))}</span>
                      </span>
                    )}
                    {displayFur && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-verde-200 text-verde-900 text-xs font-semibold shadow-2xs">
                        <span>✂️ {displayFur}</span>
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsDetailsModalOpen(true)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-verde-800 hover:text-verde-950 underline underline-offset-2 ml-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-verde-700" />
                      <span>Ver análisis de IA completo</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>

          <div className="flex sm:flex-row md:flex-col lg:flex-row items-center gap-2 w-full md:w-auto shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsVisualSearchOpen(true)}
              className="flex-1 sm:flex-none h-9 px-3.5 rounded-xl border-verde-300 bg-white hover:bg-verde-50 text-verde-800 text-xs font-semibold gap-1.5 cursor-pointer shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-verde-700" />
              <span>Cambiar foto</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleClearVisualSearch}
              className="flex-1 sm:flex-none h-9 px-3.5 rounded-xl bg-verde-700 hover:bg-verde-800 text-white text-xs font-semibold gap-1.5 cursor-pointer shadow-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Ver catálogo completo</span>
            </Button>
          </div>
        </div>
      )}

      {/* Results Count & Ordering Label */}
      <div className="flex items-center justify-between text-xs text-tinta-600 px-1">
        <span>
          {visualSearchResults !== null ? (
            <>
              Mostrando <strong className="text-tinta-900">{visualSearchResults.length}</strong> resultados por coincidencia
            </>
          ) : isLoading ? (
            "Buscando mascotas disponibles..."
          ) : (
            <>
              Mostrando <strong className="text-tinta-900">{pets.length}</strong> de{" "}
              <strong className="text-tinta-900">{total}</strong> mascotas disponibles
            </>
          )}
        </span>
        <span className="text-tinta-400 hidden sm:inline">
          {visualSearchResults !== null
            ? "Ordenadas por porcentaje de coincidencia"
            : "Ordenadas por fecha reciente"}
        </span>
      </div>

      {/* Main Content Area */}
      {visualSearchResults !== null ? (
        visualSearchResults.length === 0 ? (
          <div className="bg-white rounded-2xl border border-line p-12 text-center shadow-xs space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-superficie-2 text-verde-700 flex items-center justify-center mx-auto">
              <Camera className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-extrabold text-lg text-tinta-900">
                No encontramos mascotas similares
              </h3>
              <p className="text-xs sm:text-sm text-tinta-600 leading-relaxed">
                No se encontraron mascotas en adopción con rasgos físicos cercanos a la imagen. Puedes intentar con otra foto con mejor iluminación o explorar el catálogo.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsVisualSearchOpen(true)}
                className="h-9 px-4 text-xs font-semibold border-verde-300 text-verde-800 hover:bg-verde-50 gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Intentar con otra foto</span>
              </Button>
              <Button
                type="button"
                onClick={handleClearVisualSearch}
                className="h-9 px-4 text-xs font-semibold bg-verde-700 hover:bg-verde-800 text-white gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Ver catálogo completo</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {visualSearchResults.map((item) => (
                <PublicPetCard
                  key={item.pet.id}
                  pet={item.pet}
                  similarityPercentage={item.similarityPercentage}
                  matchReasons={item.matchReasons}
                />
              ))}
            </div>

            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClearVisualSearch}
                className="h-9 px-5 rounded-xl border border-line hover:border-verde-400 bg-white text-xs font-semibold text-tinta-700 hover:text-verde-800 cursor-pointer shadow-2xs"
              >
                <span>Volver al catálogo completo de adopciones</span>
              </Button>
            </div>
          </div>
        )
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-line overflow-hidden p-0 animate-pulse space-y-3"
            >
              <div className="aspect-[4/5] bg-superficie-2 w-full" />
              <div className="p-4 space-y-2">
                <div className="h-5 bg-superficie-2 rounded-md w-3/4" />
                <div className="h-3.5 bg-superficie-2 rounded-md w-1/2" />
                <div className="h-8 bg-superficie-2 rounded-xl w-full mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-2xl bg-coral-50 border border-coral-200 text-coral-800 text-center space-y-2">
          <p className="font-semibold text-sm">{error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="text-xs bg-white border-coral-300"
          >
            Reintentar
          </Button>
        </div>
      ) : pets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-line p-12 text-center shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-superficie-2 text-tinta-400 flex items-center justify-center mx-auto">
            <PawPrint className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-extrabold text-lg text-tinta-900">
              No encontramos mascotas con esos filtros
            </h3>
            <p className="text-xs sm:text-sm text-tinta-600 leading-relaxed">
              Prueba cambiando la especie, ampliando el rango de edad o limpiando
              los filtros de búsqueda para ver más animalitos rescatados.
            </p>
          </div>
          {hasActiveFilters && (
            <Button
              type="button"
              onClick={resetFilters}
              className="h-9 px-4 text-xs font-semibold bg-verde-700 hover:bg-verde-800 text-white gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ver todas las mascotas disponibles</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pet Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {pets.map((pet) => (
              <PublicPetCard key={pet.id} pet={pet} />
            ))}
          </div>

          {/* Load More Button (Progressive list expansion) */}
          {hasMore && (
            <div className="flex flex-col items-center justify-center pt-2 pb-2">
              <Button
                type="button"
                variant="outline"
                disabled={isLoadingMore}
                onClick={loadMore}
                className="h-10 px-6 rounded-xl border border-verde-200 bg-verde-50/70 hover:bg-verde-100 text-verde-800 text-xs sm:text-sm font-semibold gap-2 shadow-2xs transition-all cursor-pointer"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-verde-700" />
                    <span>Cargando más mascotas...</span>
                  </>
                ) : (
                  <>
                    <ArrowDown className="w-4 h-4 text-verde-700" />
                    <span>
                      Cargar más mascotas ({total - pets.length} restantes)
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-line">
              <span className="text-xs text-tinta-600 font-medium order-2 sm:order-1">
                Mostrando {pets.length} de {total} mascotas (Página {page} de {totalPages})
              </span>

              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="h-8 px-2.5 rounded-lg border border-line bg-white hover:bg-superficie-2 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-tinta-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                {getPageNumbers().map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setPage(pNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      pNum === page
                        ? "bg-verde-700 text-white shadow-2xs font-bold"
                        : "border border-line bg-white text-tinta-700 hover:bg-superficie-2 hover:text-tinta-900"
                    }`}
                  >
                    {pNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="h-8 px-2.5 rounded-lg border border-line bg-white hover:bg-superficie-2 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-tinta-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  aria-label="Página siguiente"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visual Search Upload Modal */}
      <VisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
        onSearchResults={handleSearchResults}
      />

      {/* Visual Search Computer Vision Report Modal */}
      <VisualSearchDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        photoUrl={visualSearchPhotoUrl}
        analysis={visualSearchAnalysis}
        matchCount={visualSearchResults ? visualSearchResults.length : 0}
        topMatch={
          visualSearchResults && visualSearchResults.length > 0
            ? visualSearchResults[0]
            : null
        }
        onChangePhoto={() => {
          setIsDetailsModalOpen(false);
          setIsVisualSearchOpen(true);
        }}
      />
    </div>
  );
}
