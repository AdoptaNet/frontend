"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, PawPrint, ShieldCheck, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Pet } from "../../models/pet.types";

interface PublicPetCardProps {
  pet: Pet;
}

export function PublicPetCard({ pet }: PublicPetCardProps) {
  const photos = pet.photos && pet.photos.length > 0 ? pet.photos : [];
  const primaryIndex = photos.findIndex((p) => p.isPrimary);
  const [activePhotoIndex, setActivePhotoIndex] = useState(
    primaryIndex >= 0 ? primaryIndex : 0,
  );
  const currentPhoto = photos[activePhotoIndex] || pet.photos?.[0];

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const years = Math.floor(pet.ageMonths / 12);
  const months = pet.ageMonths % 12;
  const ageText =
    years > 0
      ? `${years} ${years === 1 ? "año" : "años"}${
          months > 0 ? ` y ${months} m.` : ""
        }`
      : `${months} ${months === 1 ? "mes" : "meses"}`;

  const sizeLabels: Record<string, string> = {
    small: "Pequeño",
    medium: "Mediano",
    large: "Grande",
  };

  return (
    <Link
      href={`/pets/${pet.id}`}
      className="group bg-white rounded-2xl border border-line shadow-2xs hover:shadow-md hover:border-verde-500/50 transition-all duration-200 overflow-hidden flex flex-col justify-between select-none"
    >
      <div>
        {/* Cover Photo - Vertical aspect ratio (4:5) with lateral buttons */}
        <div className="relative aspect-[4/5] w-full bg-superficie-2 overflow-hidden">
          {currentPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentPhoto.url}
              alt={pet.name}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-tinta-300">
              <PawPrint className="w-12 h-12 stroke-1" />
            </div>
          )}

          {/* Species Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-20">
            <span className="bg-white/90 backdrop-blur-xs text-tinta-800 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-2xs">
              {pet.species === "dog" ? "🐶 Perro" : "🐱 Gato"}
            </span>
          </div>

          {/* Status Badge */}
          <div className="absolute top-2.5 right-2.5 z-20">
            <Badge variant="disponible" className="text-[11px] shadow-2xs">
              Disponible
            </Badge>
          </div>

          {/* Lateral navigation buttons (if > 1 photo) */}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-tinta-800 flex items-center justify-center shadow-md transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 z-20 cursor-pointer hover:scale-110 active:scale-95"
                title="Foto anterior"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-tinta-800 flex items-center justify-center shadow-md transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 z-20 cursor-pointer hover:scale-110 active:scale-95"
                title="Foto siguiente"
                aria-label="Foto siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Bottom Carousel Dots */}
              <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1 z-20 pointer-events-none">
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs py-1 px-2 rounded-full">
                  {photos.map((_, idx) => (
                    <span
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        activePhotoIndex === idx
                          ? "bg-white scale-125"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content Info */}
        <div className="p-4 space-y-2">
          {/* Pet Name & Breed */}
          <div>
            <h3 className="font-heading font-extrabold text-lg text-tinta-900 group-hover:text-verde-700 transition-colors line-clamp-1">
              {pet.name}
            </h3>
            <p className="text-xs text-tinta-500 font-medium">
              {pet.breed || "Mestizo"} · {ageText}
            </p>
          </div>

          {/* Quick Attributes */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-medium text-tinta-700 bg-superficie-2 px-2 py-0.5 rounded-md">
              {sizeLabels[pet.size] || pet.size}
            </span>
            <span className="text-[11px] font-medium text-tinta-700 bg-superficie-2 px-2 py-0.5 rounded-md">
              {pet.gender === "male" ? "Macho" : "Hembra"}
            </span>
            {pet.isSterilized && (
              <span className="text-[11px] font-medium text-verde-800 bg-verde-50 px-2 py-0.5 rounded-md">
                Esterilizado/a
              </span>
            )}
          </div>

          {/* Shelter & Location Info */}
          <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs text-tinta-600">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-tinta-400 shrink-0" />
              <span className="truncate">
                {pet.shelter?.city || "Perú"}
                {pet.shelter?.department && pet.shelter.department !== pet.shelter.city
                  ? `, ${pet.shelter.department}`
                  : ""}
              </span>
            </div>

            {/* Verified Shelter Badge */}
            {pet.shelter?.isVerified && (
              <span
                title="Albergue Verificado"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-verde-700 bg-verde-50 border border-verde-200/60 px-1.5 py-0.5 rounded-md shrink-0"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-verde-700" />
                <span>Verificado</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-4 pb-4 pt-1">
        <div className="w-full h-9 rounded-xl bg-superficie-2 group-hover:bg-verde-100 group-hover:text-verde-800 text-tinta-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
          <span>Ver ficha técnica</span>
        </div>
      </div>
    </Link>
  );
}
