"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePublicPets } from "../../hooks/usePublicPets";
import { PublicPetCard } from "./PublicPetCard";
import type {
  PetSpecies,
  PetSize,
  PetAgeCategory,
  PetGender,
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
    city,
    search,
    isLoading,
    error,
    hasActiveFilters,
    setPage,
    setSpecies,
    setSize,
    setAgeCategory,
    setGender,
    setCity,
    setSearch,
    resetFilters,
  } = usePublicPets();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(search);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
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
                onClick={() => setSpecies(tab.id as PetSpecies | "all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  species === tab.id
                    ? "bg-white text-verde-800 shadow-2xs"
                    : "text-tinta-600 hover:text-tinta-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar & Advanced Toggle */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
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

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`h-10 px-3.5 rounded-xl border-line text-xs font-semibold gap-1.5 cursor-pointer ${
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
          <div className="pt-3 border-t border-line/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 animate-in fade-in duration-150">
            {/* Tamaño */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-tinta-700">
                Tamaño corporal
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as PetSize | "all")}
                className="w-full h-9 rounded-xl border border-line bg-white px-2.5 text-xs text-tinta-800 focus:outline-none focus:ring-1 focus:ring-verde-500"
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
                className="w-full h-9 rounded-xl border border-line bg-white px-2.5 text-xs text-tinta-800 focus:outline-none focus:ring-1 focus:ring-verde-500"
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
                className="w-full h-9 rounded-xl border border-line bg-white px-2.5 text-xs text-tinta-800 focus:outline-none focus:ring-1 focus:ring-verde-500"
              >
                <option value="all">Cualquier sexo</option>
                <option value="male">Macho</option>
                <option value="female">Hembra</option>
              </select>
            </div>

            {/* Ciudad */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-tinta-700">
                Ciudad o Departamento
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-tinta-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Ej. Lima, Arequipa..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="pl-8 h-9 text-xs bg-white border-line rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-tinta-500 font-medium">
              Mostrando resultados filtrados
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 font-semibold text-verde-700 hover:text-verde-800 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar filtros</span>
            </button>
          </div>
        )}
      </div>

      {/* Results Count & Ordering Label */}
      <div className="flex items-center justify-between text-xs text-tinta-600 px-1">
        <span>
          {isLoading ? (
            "Buscando mascotas disponibles..."
          ) : (
            <>
              Mostrando <strong className="text-tinta-900">{pets.length}</strong> de{" "}
              <strong className="text-tinta-900">{total}</strong> mascotas disponibles
            </>
          )}
        </span>
        <span className="text-tinta-400 hidden sm:inline">
          Ordenadas por fecha reciente
        </span>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
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
        <>
          {/* Pet Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {pets.map((pet) => (
              <PublicPetCard key={pet.id} pet={pet} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-line">
              <span className="text-xs text-tinta-600 font-medium">
                Página {page} de {totalPages}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="h-9 px-3 rounded-xl border border-line bg-white hover:bg-superficie-2 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-tinta-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="h-9 px-3 rounded-xl border border-line bg-white hover:bg-superficie-2 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-tinta-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
