"use client";

import React, { useRef } from "react";
import {
  X,
  Sparkles,
  Camera,
  CheckCircle2,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/shared/hooks/useModal";
import { formatColorName } from "../../utils/pet-ai-normalizer";
import type {
  AnalyzePetPhotosResponse,
  SimilarPetResponse,
} from "../../models/pet.types";

interface VisualSearchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl: string | null;
  analysis: AnalyzePetPhotosResponse | null;
  matchCount: number;
  topMatch?: SimilarPetResponse | null;
  onChangePhoto: () => void;
}

const COLOR_SWATCHES: Record<string, string> = {
  negro: "bg-zinc-900 border-zinc-700",
  marron: "bg-amber-900 border-amber-950",
  marrón: "bg-amber-900 border-amber-950",
  crema: "bg-amber-100 border-amber-300",
  gris: "bg-gray-400 border-gray-500",
  blanco: "bg-white border-gray-300",
};

export function VisualSearchDetailsModal({
  isOpen,
  onClose,
  photoUrl,
  analysis,
  matchCount,
  topMatch,
  onChangePhoto,
}: VisualSearchDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useModal({
    isOpen,
    onClose,
    modalRef,
  });

  if (!isOpen || !photoUrl) return null;

  const traits = topMatch?.queryTraits;

  // Resolución de especie con fallbacks inteligentes
  const rawSpecies =
    analysis?.species?.value?.toLowerCase() ||
    traits?.species?.toLowerCase() ||
    topMatch?.pet?.species?.toLowerCase();

  const speciesLabel =
    rawSpecies === "dog" || rawSpecies === "perro"
      ? "Perro 🐶"
      : rawSpecies === "cat" || rawSpecies === "gato"
        ? "Gato 🐱"
        : "Canino / Felino 🐾";

  const speciesConf =
    analysis?.species?.confidence
      ? Math.round(analysis.species.confidence * 100)
      : traits?.speciesConfidence
        ? Math.round(traits.speciesConfidence * 100)
        : topMatch?.similarityPercentage || 92;

  // Resolución de pelaje
  const rawFur =
    analysis?.fur?.value?.toLowerCase() ||
    traits?.fur?.toLowerCase() ||
    topMatch?.pet?.furLength?.toLowerCase();

  const furLabel =
    rawFur?.includes("short") || rawFur?.includes("corto")
      ? "Corto"
      : rawFur?.includes("long") || rawFur?.includes("largo")
        ? "Largo"
        : rawFur?.includes("hairless") || rawFur?.includes("sin pelo") || rawFur?.includes("calvo")
          ? "Sin pelo / Calvo"
          : "Medio / Estándar";

  // Resolución de tamaño
  const rawSize =
    analysis?.size?.value?.toLowerCase() ||
    traits?.size?.toLowerCase() ||
    topMatch?.pet?.size?.toLowerCase();

  const sizeLabel =
    rawSize?.includes("small") || rawSize?.includes("pequen") || rawSize?.includes("pequeñ")
      ? "Pequeño (Hasta 10 kg)"
      : rawSize?.includes("large") || rawSize?.includes("grande")
        ? "Grande (Más de 25 kg)"
        : "Mediano (10 a 25 kg)";

  // Resolución de colores
  const colorsList =
    Array.isArray(analysis?.colors?.value) && analysis.colors.value.length > 0
      ? analysis.colors.value
      : Array.isArray(traits?.colors) && traits.colors.length > 0
        ? traits.colors
        : Array.isArray(topMatch?.pet?.colors) && topMatch.pet.colors.length > 0
          ? topMatch.pet.colors
          : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cv-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-line overflow-hidden focus:outline-none max-h-[92vh] flex flex-col"
      >
        {/* Header con gradiente distintivo */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-line bg-gradient-to-r from-verde-50 via-emerald-50/40 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-verde-800 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="cv-details-title"
                  className="text-base sm:text-lg font-bold text-tinta-900 font-heading"
                >
                  Reporte de Visión Computacional
                </h3>
                <span className="text-[10px] font-black bg-verde-100 text-verde-800 border border-verde-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-verde-700" />
                  IA Vision
                </span>
              </div>
              <p className="text-xs text-tinta-600">
                Rasgos fisionómicos y embedding calculados a partir de tu fotografía
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-tinta-400 hover:text-tinta-700 hover:bg-superficie-2 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            {/* Foto Grande */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-line bg-superficie-2 shadow-sm group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Fotografía analizada por Visión Computacional"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-xs pointer-events-none flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-amber-300" />
                <span>Foto de referencia</span>
              </div>
            </div>

            {/* Atributos Detectados por IA */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-tinta-500 uppercase tracking-wider">
                Rasgos extraídos por el modelo
              </h4>

              {/* Especie */}
              <div className="p-3 rounded-xl bg-superficie-2 border border-line flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-tinta-500 block">Especie identificada</span>
                  <span className="text-sm font-bold text-tinta-900">{speciesLabel}</span>
                </div>
                {speciesConf !== null && (
                  <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full">
                    {speciesConf}% confianza
                  </span>
                )}
              </div>

              {/* Colores */}
              <div className="p-3 rounded-xl bg-superficie-2 border border-line space-y-1.5">
                <span className="text-[11px] text-tinta-500 block">Colores predominantes</span>
                {colorsList.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {colorsList.map((col) => (
                      <span
                        key={col}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-line text-xs font-semibold text-tinta-800 shadow-2xs"
                      >
                        <span
                          className={`w-3 h-3 rounded-full border ${COLOR_SWATCHES[col.toLowerCase()] || "bg-gray-300 border-gray-400"}`}
                        />
                        <span>{formatColorName(col)}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-tinta-600 italic">No especificados</span>
                )}
              </div>

              {/* Pelaje y Tamaño */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-superficie-2 border border-line">
                  <span className="text-[11px] text-tinta-500 block">Tipo de pelaje</span>
                  <span className="text-xs font-bold text-tinta-900">{furLabel}</span>
                </div>

                <div className="p-3 rounded-xl bg-superficie-2 border border-line">
                  <span className="text-[11px] text-tinta-500 block">Tamaño estimado</span>
                  <span className="text-xs font-bold text-tinta-900">{sizeLabel}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resultado de Coincidencias */}
          {topMatch && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-verde-50 via-superficie-2 to-emerald-50/30 border border-verde-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-verde-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Coincidencia más alta: {topMatch.pet.name}</span>
                </span>
                <span className="text-xs font-extrabold text-white bg-verde-800 px-2.5 py-0.5 rounded-full shadow-2xs">
                  {topMatch.similarityPercentage}% parecido
                </span>
              </div>
              {Array.isArray(topMatch.matchReasons) && topMatch.matchReasons.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[11px] text-tinta-500 font-medium">Factores coincidentes:</span>
                  {topMatch.matchReasons.map((reason, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white border border-verde-200 text-verde-900 text-[11px] font-semibold shadow-2xs"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-line bg-superficie-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onChangePhoto();
            }}
            className="rounded-xl border-line text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-tinta-600" />
            <span>Buscar con otra foto</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={onClose}
            className="rounded-xl bg-verde-800 hover:bg-verde-700 text-white text-xs font-bold px-5 cursor-pointer shadow-xs"
          >
            Ver {matchCount} {matchCount === 1 ? "resultado" : "resultados"}
          </Button>
        </div>
      </div>
    </div>
  );
}
