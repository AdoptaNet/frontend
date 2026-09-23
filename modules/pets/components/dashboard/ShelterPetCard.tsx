"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit3, Trash2, PawPrint, Zap, Volume2 } from "lucide-react";
import type { Pet, PetStatus } from "../../models/pet.types";
import { PetStatusSelect } from "./PetStatusSelect";
import { getAgeCategoryLabel } from "../../models/pet-form.schemas";

interface ShelterPetCardProps {
  pet: Pet;
  onChangeStatus: (petId: string, newStatus: PetStatus) => Promise<void>;
  onDeleteRequest: (pet: Pet) => void;
}

export function ShelterPetCard({
  pet,
  onChangeStatus,
  onDeleteRequest,
}: ShelterPetCardProps) {
  const primaryPhoto =
    pet.photos.find((p) => p.isPrimary) || pet.photos[0];

  const [activePhotoUrl, setActivePhotoUrl] = useState<string | null>(
    primaryPhoto?.url || null,
  );

  const ageInfo = getAgeCategoryLabel(pet.ageMonths);
  const years = Math.floor(pet.ageMonths / 12);
  const months = pet.ageMonths % 12;
  const ageString =
    years > 0
      ? `${years} ${years === 1 ? "año" : "años"}${months > 0 ? ` y ${months} m` : ""}`
      : `${months} ${months === 1 ? "mes" : "meses"}`;

  const sizeLabels: Record<string, string> = {
    small: "Pequeño",
    medium: "Mediano",
    large: "Grande",
  };

  return (
    <div className="group bg-white rounded-2xl border border-line shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      {/* Photo with Carousel preview */}
      <div className="relative aspect-4/3 w-full bg-superficie-2 overflow-hidden">
        {activePhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activePhotoUrl}
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-tinta-300 gap-2">
            <PawPrint className="w-10 h-10 stroke-1" />
            <span className="text-xs">Sin fotografía</span>
          </div>
        )}

        {/* Species & Gender Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
            {pet.species === "dog" ? "Perro 🐕" : "Gato 🐈"}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
            {pet.gender === "male" ? "Macho ♂" : "Hembra ♀"}
          </span>
        </div>

        {/* Status Dropdown (Top Right) */}
        <div className="absolute top-2.5 right-2.5">
          <PetStatusSelect
            currentStatus={pet.status}
            onChangeStatus={(st) => onChangeStatus(pet.id, st)}
          />
        </div>

        {/* Multiple Photos Indicator / Thumbnail Switcher */}
        {pet.photos.length > 1 && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 bg-black/30 backdrop-blur-xs py-1 px-2 rounded-full max-w-fit mx-auto">
            {pet.photos.map((ph, idx) => (
              <button
                key={ph.publicId || idx}
                type="button"
                onClick={() => setActivePhotoUrl(ph.url)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  activePhotoUrl === ph.url
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pet Info Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-heading font-extrabold text-lg text-tinta-900 group-hover:text-verde-700 transition-colors">
                {pet.name}
              </h3>
              <p className="text-xs text-tinta-500 font-medium">
                {pet.breed || "Mestizo"} · {ageString}
              </p>
            </div>

            <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold shrink-0 ${ageInfo.badgeColor}`}>
              {pet.size ? sizeLabels[pet.size] : "Mediano"}
            </span>
          </div>

          {/* Key Traits Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2.5 text-[11px] text-tinta-600">
            <span className="flex items-center gap-1 bg-superficie-2 border border-line px-2 py-0.5 rounded">
              <Zap className="w-3 h-3 text-ambar-600" />
              Energía: {pet.energyLevel}/5
            </span>
            <span className="flex items-center gap-1 bg-superficie-2 border border-line px-2 py-0.5 rounded">
              <Volume2 className="w-3 h-3 text-verde-700" />
              Voz: {pet.vocalizationLevel}/5
            </span>
            {pet.isSterilized && (
              <span className="bg-verde-50 text-verde-800 border border-verde-200 px-2 py-0.5 rounded font-medium">
                Esterilizado
              </span>
            )}
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
          <Link href={`/pets/${pet.id}/edit`} className="flex-1">
            <button
              type="button"
              className="w-full h-8 px-3 rounded-lg border border-line bg-white hover:bg-superficie-2 text-xs font-semibold text-tinta-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-tinta-500" />
              <span>Editar ficha</span>
            </button>
          </Link>

          <button
            type="button"
            onClick={() => onDeleteRequest(pet)}
            title="Eliminar mascota"
            className="w-8 h-8 rounded-lg border border-line hover:border-coral-300 hover:bg-coral-50 text-tinta-400 hover:text-coral-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
