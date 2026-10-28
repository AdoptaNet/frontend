"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Filter,
  ArrowRight,
  ClipboardList,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  RecommendedPetItem,
  PersonalizedRecommendationsResponse,
} from "../models/recommendation.types";
import { recommendationsService } from "../services/recommendations.service";
import { RecommendedPetCard } from "./RecommendedPetCard";

interface RecommendationsSectionProps {
  initialSurveyCompleted?: boolean;
}

export function RecommendationsSection({
  initialSurveyCompleted,
}: RecommendationsSectionProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PersonalizedRecommendationsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Secondary Filters (US-14 Escenario 3)
  const [speciesFilter, setSpeciesFilter] = useState<"dog" | "cat" | "">("");
  const [sizeFilter, setSizeFilter] = useState<"small" | "medium" | "large" | "">("");

  const recordedImpressions = useRef<Set<string>>(new Set());

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await recommendationsService.getRecommendations({
        species: speciesFilter,
        size: sizeFilter,
        limit: 12,
      });
      setData(res);

      // Telemetry: Record impressions for loaded pets (US-16)
      if (res.recommendations && res.recommendations.length > 0) {
        res.recommendations.forEach((rec) => {
          if (!recordedImpressions.current.has(rec.pet.id)) {
            recordedImpressions.current.add(rec.pet.id);
            recommendationsService.recordInteraction({
              petId: rec.pet.id,
              interactionType: "impression",
              position: rec.position,
            });
          }
        });
      }
    } catch (err: unknown) {
      console.error("Error al cargar recomendaciones:", err);
      setError("No pudimos cargar tus recomendaciones personalizadas en este momento.");
    } finally {
      setLoading(false);
    }
  }, [speciesFilter, sizeFilter]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const getFilterDescription = () => {
    const parts: string[] = [];
    if (speciesFilter === "dog") parts.push("perros");
    else if (speciesFilter === "cat") parts.push("gatos");

    if (sizeFilter === "small") parts.push("tamaño pequeño");
    else if (sizeFilter === "medium") parts.push("tamaño mediano");
    else if (sizeFilter === "large") parts.push("tamaño grande");

    if (parts.length === 0) return "los filtros seleccionados";
    return parts.join(" de ");
  };

  // Si aún no completó la encuesta (US-14 Escenario 4)
  if (!loading && data && !data.isSurveyCompleted) {
    return (
      <div className="bg-white rounded-2xl border border-line shadow-xs p-6 sm:p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 ring-6 ring-amber-50/50">
          <ClipboardList className="w-7 h-7" />
        </div>
        <Badge variant="outline" className="text-amber-800 border-amber-300 bg-amber-50/80 mb-2">
          Personalización disponible
        </Badge>
        <h3 className="text-xl font-heading font-bold text-tinta-900 mt-1">
          Descubre mascotas ideales para tu hogar
        </h3>
        <p className="text-sm text-tinta-600 max-w-lg mx-auto mt-2 leading-relaxed">
          Completa tu cuestionario de estilo de vida y vivienda (toma menos de 2 minutos). Nuestro modelo de inteligencia artificial analizará el catálogo para sugerirte rescatados altamente compatibles.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/profile?tab=role-specific">
            <Button className="h-10 px-5 bg-verde-700 hover:bg-verde-800 text-white font-semibold gap-2 shadow-xs cursor-pointer">
              <span>Completar cuestionario</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/pets">
            <Button variant="outline" className="h-10 px-4 text-tinta-800 border-line hover:bg-superficie-2 cursor-pointer">
              Explorar catálogo general
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-line">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-tinta-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-verde-600 fill-verde-100" />
              <span>Para Ti</span>
            </h2>
            <Badge className="bg-verde-50 text-verde-800 border border-verde-200 text-xs font-semibold px-2 py-0.5">
              Recomendado por IA
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-tinta-600">
            Mascotas recomendadas según tu rutina, espacio de convivencia y experiencia.
          </p>
        </div>

        {/* Secondary Filter Chips (US-14 Escenario 3) */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Species filters */}
          <div className="inline-flex items-center bg-superficie-2 border border-line rounded-lg p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setSpeciesFilter("")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                speciesFilter === ""
                  ? "bg-white text-verde-800 font-bold shadow-2xs"
                  : "text-tinta-600 hover:text-tinta-900"
              }`}
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setSpeciesFilter("dog")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                speciesFilter === "dog"
                  ? "bg-white text-verde-800 font-bold shadow-2xs"
                  : "text-tinta-600 hover:text-tinta-900"
              }`}
            >
              🐶 Perros
            </button>
            <button
              type="button"
              onClick={() => setSpeciesFilter("cat")}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                speciesFilter === "cat"
                  ? "bg-white text-verde-800 font-bold shadow-2xs"
                  : "text-tinta-600 hover:text-tinta-900"
              }`}
            >
              🐱 Gatos
            </button>
          </div>

          {/* Size filter dropdown or select */}
          <select
            value={sizeFilter}
            onChange={(e) =>
              setSizeFilter(e.target.value as "small" | "medium" | "large" | "")
            }
            aria-label="Filtrar por tamaño"
            className="text-xs bg-white border border-line rounded-lg px-2.5 py-1.5 text-tinta-700 font-medium hover:border-verde-500 focus:outline-none focus:ring-2 focus:ring-verde-500 cursor-pointer"
          >
            <option value="">Cualquier tamaño</option>
            <option value="small">Pequeño</option>
            <option value="medium">Mediano</option>
            <option value="large">Grande</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-line p-3 space-y-3"
            >
              <Skeleton className="aspect-[4/5] w-full rounded-xl" />
              <div className="space-y-2 pt-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-1.5 pt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-red-700 font-semibold text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchRecommendations()}
            className="text-xs border-red-300 text-red-800 hover:bg-red-100 gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reintentar
          </Button>
        </div>
      )}

      {/* Recommendations Cards Grid */}
      {!loading && !error && data && data.recommendations.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.recommendations.map((item) => (
            <RecommendedPetCard key={item.pet.id} item={item} />
          ))}
        </div>
      )}

      {/* Filtered Empty State */}
      {!loading && !error && data && data.recommendations.length === 0 && (
        <div className="bg-white border border-line rounded-2xl p-8 sm:p-10 text-center shadow-xs space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-superficie-2 text-tinta-500 flex items-center justify-center">
            <Filter className="w-6 h-6 text-tinta-400" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-heading font-bold text-base sm:text-lg text-tinta-900">
              No hay recomendaciones con estos filtros
            </h3>
            <p className="text-xs sm:text-sm text-tinta-600 leading-relaxed">
              No encontramos mascotas recomendadas que coincidan con{" "}
              <strong className="text-tinta-900 font-semibold">
                {getFilterDescription()}
              </strong>
              . Prueba restableciendo los filtros o explorando el catálogo general de rescates.
            </p>
          </div>

          <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSpeciesFilter("");
                setSizeFilter("");
              }}
              className="text-xs border-line text-tinta-800 hover:bg-superficie-2 gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restablecer filtros
            </Button>
            <Link href="/pets">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-verde-700 hover:text-verde-800 hover:bg-verde-50 gap-1.5 cursor-pointer font-semibold"
              >
                <span>Explorar todo el catálogo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
