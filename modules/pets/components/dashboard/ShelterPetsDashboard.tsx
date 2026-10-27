"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  PawPrint,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  FolderHeart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShelterPets } from "../../hooks/useShelterPets";
import { useProfile } from "@/modules/users/hooks/useProfile";
import type { Pet, PetStatus } from "../../models/pet.types";
import { ShelterPetCard } from "./ShelterPetCard";
import { DeletePetModal } from "./DeletePetModal";

const TABS: { id: PetStatus | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "available", label: "Disponibles" },
  { id: "in_process", label: "En proceso" },
  { id: "adopted", label: "Adoptados" },
  { id: "draft", label: "Borradores" },
  { id: "hidden", label: "Pausados" },
];

export function ShelterPetsDashboard() {
  const {
    pets,
    total,
    totalPages,
    page,
    statusFilter,
    searchQuery,
    isLoading,
    error,
    setPage,
    setStatusFilter,
    setSearchQuery,
    changePetStatus,
    deletePet,
  } = useShelterPets();

  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);

  const { user: profileUser, isInitialLoading: isProfileLoading } = useProfile();
  const shelterProfile = profileUser?.shelterProfile;

  const missingFields: string[] = [];
  if (!isProfileLoading && profileUser) {
    if (!shelterProfile?.organizationName?.trim()) {
      missingFields.push("Nombre de la organización");
    }
    if (!shelterProfile?.phoneNumber?.trim()) {
      missingFields.push("Teléfono móvil de contacto");
    }
    if (!shelterProfile?.city?.trim()) {
      missingFields.push("Distrito");
    }
  }

  const isProfileIncomplete = missingFields.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-verde-100 text-verde-800">
              <PawPrint className="w-5 h-5 fill-current" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-tinta-900 tracking-tight">
              Mis Mascotas
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-tinta-600 mt-1 max-w-xl">
            Gestiona las fichas de adopción, actualiza el estado de tus rescatados y publica nuevos animales en la plataforma.
          </p>
        </div>

        <Link href="/pets/new">
          <Button className="h-10 px-4 bg-verde-700 hover:bg-verde-800 text-white font-semibold text-xs sm:text-sm gap-2 shadow-xs cursor-pointer w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            <span>Registrar mascota</span>
          </Button>
        </Link>
      </div>

      {/* Banner de perfil incompleto */}
      {isProfileIncomplete && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in-0 duration-200">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5 md:mt-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-950 font-heading">
                Perfil de albergue pendiente de completar
              </h3>
              <p className="text-xs text-amber-900 leading-relaxed">
                Para poder publicar animales en adopción, es indispensable que configures en tu perfil institucional:{" "}
                <strong className="text-amber-950 underline decoration-amber-400 decoration-2">
                  {missingFields.join(", ")}
                </strong>.
              </p>
            </div>
          </div>

          <Link href="/profile?tab=role-specific" className="shrink-0 w-full md:w-auto">
            <Button
              size="sm"
              className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs h-9 px-4 gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Completar perfil de albergue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Control Bar: Search and Status Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {TABS.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-verde-700 text-white shadow-2xs"
                    : "bg-white border border-line text-tinta-600 hover:text-tinta-900 hover:bg-superficie-2"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-tinta-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre..."
            className="pl-9 h-9 text-xs bg-white"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-coral-50 border border-coral-200 text-coral-800 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-coral-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid / States */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-tinta-500 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-verde-700" />
          <span className="text-xs sm:text-sm font-medium">
            Cargando mascotas...
          </span>
        </div>
      ) : pets.length === 0 ? (
        <div className="py-16 sm:py-20 bg-white rounded-2xl border border-line shadow-xs text-center px-6 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-verde-50 border border-verde-200 text-verde-700 flex items-center justify-center mb-4">
            <FolderHeart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-tinta-900 font-heading">
            {searchQuery || statusFilter !== "all"
              ? "No se encontraron mascotas con estos filtros"
              : "Aún no tienes mascotas registradas"}
          </h3>
          <p className="text-xs sm:text-sm text-tinta-600 max-w-md mt-1 mb-6 leading-relaxed">
            {searchQuery || statusFilter !== "all"
              ? "Prueba cambiando el estado seleccionado o limpiando el texto del buscador."
              : "Comienza a publicar los animales que tienes en adopción para que las personas puedan postular."}
          </p>
          {searchQuery || statusFilter !== "all" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter("all");
                setSearchQuery("");
              }}
              className="text-xs h-9 cursor-pointer"
            >
              Restablecer filtros
            </Button>
          ) : (
            <Link href="/pets/new">
              <Button className="h-10 px-5 bg-verde-700 hover:bg-verde-800 text-white font-semibold text-xs sm:text-sm gap-2 cursor-pointer shadow-xs">
                <Plus className="w-4 h-4" />
                <span>Registrar primera mascota</span>
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {pets.map((pet) => (
              <ShelterPetCard
                key={pet.id}
                pet={pet}
                onChangeStatus={changePetStatus}
                onDeleteRequest={(p) => setPetToDelete(p)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-line text-xs">
              <span className="text-tinta-500 font-medium">
                Mostrando {pets.length} de {total} mascotas
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-lg border border-line bg-white hover:bg-superficie-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2.5 font-bold text-tinta-800">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-lg border border-line bg-white hover:bg-superficie-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Página siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeletePetModal
        pet={petToDelete}
        isOpen={!!petToDelete}
        onClose={() => setPetToDelete(null)}
        onConfirm={deletePet}
        onPause={(petId) => changePetStatus(petId, "hidden")}
      />
    </div>
  );
}
