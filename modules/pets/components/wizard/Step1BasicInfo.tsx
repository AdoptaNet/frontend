"use client";

import React, { useState } from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Dog, Cat, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PetPhotoUploader } from "../photo-uploader/PetPhotoUploader";
import { petsService } from "../../services/pets.service";
import type { AnalyzePetPhotosResponse } from "../../models/pet.types";
import {
  CompletePetFormData,
  getAgeCategoryLabel,
} from "../../models/pet-form.schemas";
import {
  normalizeSpecies,
  normalizeFur,
  normalizeSize,
  formatColorList,
} from "../../utils/pet-ai-normalizer";

interface Step1BasicInfoProps {
  form: UseFormReturn<CompletePetFormData>;
  disabled?: boolean;
  analysisResult?: AnalyzePetPhotosResponse | null;
  setAnalysisResult?: (res: AnalyzePetPhotosResponse | null) => void;
  isAnalyzing?: boolean;
  setIsAnalyzing?: (analyzing: boolean) => void;
}

const COLOR_OPTIONS = [
  { value: "negro", label: "Negro", swatch: "bg-zinc-900 border-zinc-700" },
  { value: "marron", label: "Marrón", swatch: "bg-amber-900 border-amber-950" },
  { value: "crema", label: "Crema", swatch: "bg-amber-100 border-amber-300" },
  { value: "gris", label: "Gris", swatch: "bg-gray-400 border-gray-500" },
  { value: "blanco", label: "Blanco", swatch: "bg-white border-gray-300" },
];

export function Step1BasicInfo({
  form,
  disabled,
  analysisResult: externalAnalysisResult,
  setAnalysisResult: externalSetAnalysisResult,
  isAnalyzing: externalIsAnalyzing,
  setIsAnalyzing: externalSetIsAnalyzing,
}: Step1BasicInfoProps) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const [internalAnalysisResult, setInternalAnalysisResult] =
    useState<AnalyzePetPhotosResponse | null>(null);
  const [internalIsAnalyzing, setInternalIsAnalyzing] = useState(false);
  const [analysisSuccess, setAnalysisSuccess] = useState(false);
  const [rawFiles, setRawFiles] = useState<File[]>([]);

  const analysisResult =
    externalAnalysisResult !== undefined ? externalAnalysisResult : internalAnalysisResult;
  const setAnalysisResult = externalSetAnalysisResult || setInternalAnalysisResult;
  const isAnalyzing =
    externalIsAnalyzing !== undefined ? externalIsAnalyzing : internalIsAnalyzing;
  const setIsAnalyzing = externalSetIsAnalyzing || setInternalIsAnalyzing;

  const ageMonths = watch("ageMonths");
  const photos = watch("photos") || [];
  const ageInfo = getAgeCategoryLabel(Number(ageMonths) || 0);

  const handlePhotosSelected = (files: File[]) => {
    setRawFiles((prev) => [...prev, ...files]);
    setAnalysisSuccess(false);
  };

  const handleAnalyzeWithAI = async () => {
    setIsAnalyzing(true);
    setAnalysisSuccess(false);

    try {
      let filesToAnalyze = photos.map((p) => p.file).filter(Boolean) as File[];

      if (filesToAnalyze.length === 0 && rawFiles.length > 0) {
        filesToAnalyze = rawFiles;
      }

      // Si no tenemos los objetos File en memoria (ej. foto existente en Cloudinary), descargamos la foto principal
      if (filesToAnalyze.length === 0 && photos.length > 0) {
        const primary = photos.find((p) => p.isPrimary) || photos[0];
        if (primary?.url) {
          const res = await fetch(primary.url);
          const blob = await res.blob();
          filesToAnalyze = [
            new File([blob], "pet-photo.jpg", {
              type: blob.type || "image/jpeg",
            }),
          ];
        }
      }

      if (filesToAnalyze.length === 0) {
        return;
      }

      const res = await petsService.analyzePhotos(filesToAnalyze);
      setAnalysisResult(res);

      // Asignar especie normalizada
      const detectedSpecies = normalizeSpecies(res.species?.value);
      if (detectedSpecies) {
        setValue("species", detectedSpecies, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      // Asignar colores sugeridos
      if (Array.isArray(res.colors?.value) && res.colors.value.length > 0) {
        setValue("colors", res.colors.value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      // Asignar tipo de pelaje
      const detectedFur = normalizeFur(res.fur?.value);
      if (detectedFur) {
        setValue("furLength", detectedFur, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      // Asignar tamaño sugerido
      const detectedSize = normalizeSize(res.size?.value);
      if (detectedSize) {
        setValue("size", detectedSize, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      // Guardar embedding visual si fue generado
      if (res.embedding && Array.isArray(res.embedding)) {
        setValue("visualEmbedding", res.embedding);
      }

      setAnalysisSuccess(true);
    } catch (err: unknown) {
      console.warn("No se pudo completar el autocompletado con IA:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. SECCIÓN: FOTOGRAFÍAS DE LA MASCOTA */}
      <div className="p-4 sm:p-5 rounded-2xl bg-superficie-2/50 border border-line space-y-3">
        <div className="space-y-0.5">
          <h3 className="text-sm sm:text-base font-bold text-tinta-900">
            1. Fotografías de la mascota
          </h3>
          <p className="text-xs text-tinta-500">
            Sube entre 3 y 6 fotografías de la mascota.
          </p>
        </div>

        {/* Uploader de Fotos */}
        <Controller
          name="photos"
          control={control}
          render={({ field }) => (
            <PetPhotoUploader
              photos={field.value || []}
              onChange={field.onChange}
              onFilesSelected={handlePhotosSelected}
              disabled={disabled}
              isAnalyzing={isAnalyzing}
              error={errors.photos?.message}
            />
          )}
        />

        {/* Asistente Inteligente de Reconocimiento de Fotos */}
        {photos.length > 0 && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-verde-50 via-emerald-50/40 to-teal-50 border border-verde-200 shadow-2xs space-y-3 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-verde-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-verde-950 font-heading">
                      Extraer características con Inteligencia Artificial
                    </span>
                    <span className="text-[10px] font-semibold bg-verde-100 text-verde-800 border border-verde-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-verde-600" />
                      Ahorra tiempo
                    </span>
                  </div>
                  <p className="text-xs text-tinta-600 leading-relaxed max-w-xl">
                    Nuestra IA analiza las fotos que subiste para identificar y extraer automáticamente la especie, colores, tipo de pelaje y tamaño aproximado.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={disabled || isAnalyzing}
                onClick={handleAnalyzeWithAI}
                className="relative inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-verde-800 hover:bg-verde-700 active:scale-[0.98] transition-all cursor-pointer shadow-xs animate-[ai-button-breathing_2.6s_ease-in-out_infinite] disabled:opacity-60 disabled:cursor-not-allowed disabled:animate-none shrink-0"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Extrayendo características...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>Extraer características con IA</span>
                  </>
                )}
              </button>
            </div>

            {analysisSuccess && !isAnalyzing && (
              <div className="p-4 rounded-xl bg-white/95 border border-emerald-300 text-xs text-verde-950 shadow-xs space-y-2.5 animate-in slide-in-from-top-1 duration-200">
                <div className="flex items-center gap-2 font-bold text-verde-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Características extraídas con éxito!</span>
                </div>
                <p className="text-xs text-tinta-600 leading-relaxed">
                  Nuestra visión computacional detectó los rasgos fisionómicos en las fotos y los completó en la ficha con distintivo <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded-full"><Sparkles className="w-2.5 h-2.5 text-amber-500" /> IA</span>:
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  {analysisResult?.species?.value && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 font-semibold text-emerald-900 text-[11px]">
                      <span>Especie:</span>
                      <strong>{analysisResult.species.value === "dog" ? "Perro 🐶" : "Gato 🐱"}</strong>
                    </span>
                  )}
                  {Array.isArray(analysisResult?.colors?.value) && analysisResult.colors.value.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 font-semibold text-emerald-900 text-[11px]">
                      <span>Colores:</span>
                      <strong>{formatColorList(analysisResult.colors.value)}</strong>
                    </span>
                  )}
                  {analysisResult?.size?.value && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 font-semibold text-emerald-900 text-[11px]">
                      <span>Tamaño:</span>
                      <strong>
                        {analysisResult.size.value === "small"
                          ? "Pequeño"
                          : analysisResult.size.value === "large"
                            ? "Grande"
                            : "Mediano"}
                      </strong>
                    </span>
                  )}
                  {analysisResult?.fur?.value && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 font-semibold text-emerald-900 text-[11px]">
                      <span>Pelaje:</span>
                      <strong>
                        {analysisResult.fur.value === "short"
                          ? "Corto"
                          : analysisResult.fur.value === "long"
                            ? "Largo"
                            : "Sin pelo"}
                      </strong>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. SECCIÓN: ESPECIE Y SEXO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Selector de Especie */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold text-tinta-900">
              Especie <span className="text-coral-600">*</span>
            </Label>
            {analysisResult?.species?.autocompleted && (
              <span className="text-[11px] font-semibold text-verde-700 bg-verde-50 border border-verde-200 px-2 py-0.5 rounded-full">
                Sugerido por IA
              </span>
            )}
          </div>
          <Controller
            name="species"
            control={control}
            render={({ field }) => {
              const aiSpecies = normalizeSpecies(analysisResult?.species?.value);
              const isDogAi = !!(analysisResult?.species?.autocompleted && aiSpecies === "dog");
              const isCatAi = !!(analysisResult?.species?.autocompleted && aiSpecies === "cat");

              return (
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => field.onChange("dog")}
                    className={`relative flex items-center justify-center gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      field.value === "dog"
                        ? isDogAi
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-2xs animate-[ai-pulse-halo_2.8s_ease-in-out_infinite]"
                          : "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                        : isDogAi
                          ? "border-emerald-300/80 bg-emerald-50/20 text-tinta-700 hover:border-emerald-400 animate-[ai-pulse-halo_3.2s_ease-in-out_infinite]"
                          : "border-line bg-white hover:border-verde-500 text-tinta-600"
                    }`}
                  >
                    <Dog
                      className={`w-5 h-5 shrink-0 ${
                        field.value === "dog"
                          ? isDogAi
                            ? "text-emerald-700"
                            : "text-verde-700"
                          : isDogAi
                            ? "text-emerald-600"
                            : "text-tinta-400"
                      }`}
                    />
                    <span>Perro</span>
                    {isDogAi && (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded-full shadow-2xs pointer-events-none">
                        <Sparkles className="w-2.5 h-2.5 text-amber-500" /> IA
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => field.onChange("cat")}
                    className={`relative flex items-center justify-center gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      field.value === "cat"
                        ? isCatAi
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-2xs animate-[ai-pulse-halo_2.8s_ease-in-out_infinite]"
                          : "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                        : isCatAi
                          ? "border-emerald-300/80 bg-emerald-50/20 text-tinta-700 hover:border-emerald-400 animate-[ai-pulse-halo_3.2s_ease-in-out_infinite]"
                          : "border-line bg-white hover:border-verde-500 text-tinta-600"
                    }`}
                  >
                    <Cat
                      className={`w-5 h-5 shrink-0 ${
                        field.value === "cat"
                          ? isCatAi
                            ? "text-emerald-700"
                            : "text-verde-700"
                          : isCatAi
                            ? "text-emerald-600"
                            : "text-tinta-400"
                      }`}
                    />
                    <span>Gato</span>
                    {isCatAi && (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded-full shadow-2xs pointer-events-none">
                        <Sparkles className="w-2.5 h-2.5 text-amber-500" /> IA
                      </span>
                    )}
                  </button>
                </div>
              );
            }}
          />
          {errors.species && (
            <p className="text-xs text-coral-600">{errors.species.message}</p>
          )}
        </div>

        {/* Selector de Sexo */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-tinta-900">
            Sexo <span className="text-coral-600">*</span>
          </Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => field.onChange("male")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    field.value === "male"
                      ? "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                      : "border-line bg-white hover:border-verde-500 text-tinta-600"
                  }`}
                >
                  <span>Macho ♂</span>
                </button>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => field.onChange("female")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    field.value === "female"
                      ? "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                      : "border-line bg-white hover:border-verde-500 text-tinta-600"
                  }`}
                >
                  <span>Hembra ♀</span>
                </button>
              </div>
            )}
          />
          {errors.gender && (
            <p className="text-xs text-coral-600">{errors.gender.message}</p>
          )}
        </div>
      </div>

      {/* 3. SECCIÓN: COLORES */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
            Colores identificados
            <span className="text-xs font-normal text-tinta-500">
              (selecciona hasta 3)
            </span>
          </Label>
          {analysisResult?.colors?.autocompleted && (
            <span className="text-[11px] font-semibold text-verde-700 bg-verde-50 border border-verde-200 px-2 py-0.5 rounded-full">
              Sugerido por IA
            </span>
          )}
        </div>
        <Controller
          name="colors"
          control={control}
          render={({ field }) => {
            const currentColors = field.value || [];
            const toggleColor = (colorVal: string) => {
              if (currentColors.includes(colorVal)) {
                field.onChange(currentColors.filter((c) => c !== colorVal));
              } else {
                if (currentColors.length >= 3) return;
                field.onChange([...currentColors, colorVal]);
              }
            };

            const aiColors = Array.isArray(analysisResult?.colors?.value)
              ? analysisResult.colors.value
              : [];
            const isColorsAutocompleted = !!analysisResult?.colors?.autocompleted;

            return (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {COLOR_OPTIONS.map((opt) => {
                  const isSelected = currentColors.includes(opt.value);
                  const isAiColor = isColorsAutocompleted && aiColors.includes(opt.value);

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleColor(opt.value)}
                      className={`relative flex items-center gap-2 p-2.5 pr-8 rounded-xl border-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? isAiColor
                            ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-2xs animate-[ai-pulse-halo_2.8s_ease-in-out_infinite]"
                            : "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                          : isAiColor
                            ? "border-emerald-300/80 bg-emerald-50/20 hover:border-emerald-400 text-tinta-700 animate-[ai-pulse-halo_3.2s_ease-in-out_infinite]"
                            : "border-line bg-white hover:border-verde-400 text-tinta-600"
                      } ${!isSelected && currentColors.length >= 3 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full shrink-0 border ${opt.swatch}`}
                      />
                      <span className="text-xs sm:text-sm truncate">{opt.label}</span>
                      {isAiColor && (
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 text-[9px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1 py-0.5 rounded shadow-2xs pointer-events-none">
                          <Sparkles className="w-2 h-2 text-amber-500" /> IA
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          }}
        />
        {errors.colors && (
          <p className="text-xs text-coral-600">{errors.colors.message}</p>
        )}
      </div>

      {/* 4. SECCIÓN: NOMBRE Y RAZA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="pet-name" className="text-sm font-semibold text-tinta-900">
            Nombre de la mascota <span className="text-coral-600">*</span>
          </Label>
          <Input
            id="pet-name"
            placeholder="Ej. Firulais, Luna, Rocky"
            disabled={disabled}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-coral-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pet-breed" className="text-sm font-semibold text-tinta-900">
            Raza
          </Label>
          <Input
            id="pet-breed"
            placeholder="Mestizo, Criollo, etc."
            disabled={disabled}
            {...register("breed")}
          />
          {errors.breed && (
            <p className="text-xs text-coral-600">{errors.breed.message}</p>
          )}
        </div>
      </div>

      {/* 5. SECCIÓN: EDAD (Años y Meses sincronizados) */}
      <div className="p-4 rounded-xl bg-superficie-2 border border-line space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-tinta-900">
            Edad de la mascota <span className="text-coral-600">*</span>
          </Label>
          <span className="text-xs text-tinta-600 font-medium">
            {typeof ageMonths === "number" && !isNaN(ageMonths)
              ? `Total: ${ageMonths} ${ageMonths === 1 ? "mes" : "meses"}`
              : "Ingresa años o meses"}
          </span>
        </div>

        <input type="hidden" {...register("ageMonths", { valueAsNumber: true })} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          {/* Años */}
          <div className="space-y-1.5">
            <label htmlFor="pet-age-years" className="text-xs font-semibold text-tinta-700">
              Años
            </label>
            <Input
              id="pet-age-years"
              type="number"
              min={0}
              step={1}
              placeholder="0"
              disabled={disabled}
              value={typeof ageMonths === "number" && !isNaN(ageMonths) ? Math.floor(ageMonths / 12) : ""}
              onChange={(e) => {
                const rawYears = e.target.value;
                const years = rawYears === "" ? 0 : parseInt(rawYears, 10) || 0;
                const currentMonths = typeof ageMonths === "number" && !isNaN(ageMonths) ? ageMonths % 12 : 0;
                if (rawYears === "" && currentMonths === 0) {
                  setValue("ageMonths", undefined as unknown as number, { shouldValidate: true, shouldDirty: true });
                } else {
                  setValue("ageMonths", Math.max(0, years * 12 + currentMonths), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </div>

          {/* Meses */}
          <div className="space-y-1.5">
            <label htmlFor="pet-age-months-input" className="text-xs font-semibold text-tinta-700">
              Meses
            </label>
            <Input
              id="pet-age-months-input"
              type="number"
              min={0}
              max={11}
              step={1}
              placeholder="0"
              disabled={disabled}
              value={typeof ageMonths === "number" && !isNaN(ageMonths) ? ageMonths % 12 : ""}
              onChange={(e) => {
                const rawMonths = e.target.value;
                const months = rawMonths === "" ? 0 : parseInt(rawMonths, 10) || 0;
                const currentYears = typeof ageMonths === "number" && !isNaN(ageMonths) ? Math.floor(ageMonths / 12) : 0;
                if (rawMonths === "" && currentYears === 0) {
                  setValue("ageMonths", undefined as unknown as number, { shouldValidate: true, shouldDirty: true });
                } else {
                  setValue("ageMonths", Math.max(0, currentYears * 12 + months), {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              }}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </div>

          {/* Categoría de Edad calculada */}
          <div className="space-y-1.5 pb-1">
            <span className="text-xs font-semibold text-tinta-700 block">
              Etapa de vida
            </span>
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-semibold ${ageInfo.badgeColor}`}
              >
                {ageInfo.label}
              </span>
            </div>
          </div>
        </div>

        {errors.ageMonths && (
          <p className="text-xs text-coral-600">
            {errors.ageMonths.message}
          </p>
        )}
      </div>
    </div>
  );
}
