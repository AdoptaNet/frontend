"use client";

import React, { useState } from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Dog, Cat, Sparkles, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PetPhotoUploader } from "../photo-uploader/PetPhotoUploader";
import { petsService } from "../../services/pets.service";
import type {
  AnalyzePetPhotosResponse,
} from "../../models/pet.types";
import {
  CompletePetFormData,
  getAgeCategoryLabel,
} from "../../models/pet-form.schemas";

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
  { value: "crema", label: "Crema / Beige", swatch: "bg-amber-100 border-amber-300" },
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
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const analysisResult = externalAnalysisResult !== undefined ? externalAnalysisResult : internalAnalysisResult;
  const setAnalysisResult = externalSetAnalysisResult || setInternalAnalysisResult;
  const isAnalyzing = externalIsAnalyzing !== undefined ? externalIsAnalyzing : internalIsAnalyzing;
  const setIsAnalyzing = externalSetIsAnalyzing || setInternalIsAnalyzing;

  const ageMonths = watch("ageMonths");
  const ageInfo = getAgeCategoryLabel(Number(ageMonths) || 0);

  const handlePhotosSelected = async (files: File[]) => {
    if (!files || files.length === 0) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await petsService.analyzePhotos(files);
      setAnalysisResult(res);

      // Pre-rellenado inteligente de campos detectados por el modelo de visión DINOv2
      if (res.species?.autocompleted && res.species?.value) {
        setValue("species", res.species.value as "dog" | "cat", {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      if (
        res.colors?.autocompleted &&
        Array.isArray(res.colors?.value) &&
        res.colors.value.length > 0
      ) {
        setValue("colors", res.colors.value, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      if (res.fur?.autocompleted && res.fur?.value) {
        setValue("furLength", res.fur.value as "short" | "long" | "hairless", {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      if (res.size?.autocompleted && res.size?.value) {
        setValue("size", res.size.value as "small" | "medium" | "large", {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      if (res.embedding && Array.isArray(res.embedding)) {
        setValue("visualEmbedding", res.embedding);
      }
    } catch (err: unknown) {
      console.warn("No se pudo autocompletar con IA:", err);
      setAnalysisError(
        "No se pudo completar el análisis IA de las fotos automáticamente. Puedes ingresar los datos manualmente.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-7">
      {/* 1. SECCIÓN PRINCIPAL: FOTO PRIMERO */}
      <div className="p-4 sm:p-5 rounded-2xl bg-superficie-2/50 border border-line space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-tinta-900 flex items-center gap-2">
              <span>1. Fotografías de la Mascota</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-verde-100/80 text-verde-800 border border-verde-200 shadow-2xs">
                <Sparkles className="w-3 h-3 text-verde-700" />
                Foto Primero ✨
              </span>
            </h3>
            <p className="text-xs text-tinta-600 leading-relaxed">
              Sube entre 3 y 6 fotos de tu rescatado. Nuestra IA (DINOv2) analizará las imágenes para predecir automáticamente su especie, colores, tipo de pelaje y contextura física.
            </p>
          </div>
        </div>

        {/* Componente Uploader con soporte de análisis inmediato */}
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

        {/* Estado animado: Analizando con IA */}
        {isAnalyzing && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-verde-50 via-superficie-2 to-verde-50 border border-verde-300 animate-pulse flex items-center gap-3 shadow-2xs">
            <div className="p-2 rounded-lg bg-verde-100 text-verde-700">
              <RefreshCw className="w-4 h-4 animate-spin text-verde-700" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-bold text-verde-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-verde-700 animate-spin" />
                Analizando fotos con IA (DINOv2)...
              </p>
              <p className="text-[11px] text-verde-700">
                Calculando vector de similitud visual y prediciendo especie, pelaje, tamaño y colores...
              </p>
            </div>
          </div>
        )}

        {/* Estado de éxito: IA Autocompletó los campos */}
        {analysisResult && !isAnalyzing && (
          <div className="p-3.5 rounded-xl bg-verde-50/90 border border-verde-200 text-verde-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5 text-verde-800">
                <CheckCircle2 className="w-4 h-4 text-verde-600" />
                ¡Análisis completado en {analysisResult.inferenceTimeMs} ms!
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-verde-700 bg-white border border-verde-200 px-2 py-0.5 rounded-full shadow-2xs">
                Sugerencias aplicadas
              </span>
            </div>
            <p className="text-xs text-verde-700 leading-relaxed">
              Hemos autocompletado los campos sugeridos por la IA. Puedes revisarlos o modificarlos libremente antes de guardar.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {analysisResult.species.autocompleted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-verde-200 text-verde-800 shadow-2xs">
                  ✨ Especie: {analysisResult.species.label} ({Math.round(analysisResult.species.confidence * 100)}%)
                </span>
              )}
              {analysisResult.colors.autocompleted && analysisResult.colors.label && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-verde-200 text-verde-800 shadow-2xs">
                  ✨ Colores: {analysisResult.colors.label.join(", ")}
                </span>
              )}
              {analysisResult.fur.autocompleted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-verde-200 text-verde-800 shadow-2xs">
                  ✨ Pelaje: {analysisResult.fur.label}
                </span>
              )}
              {analysisResult.size.autocompleted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-verde-200 text-verde-800 shadow-2xs">
                  ✨ Tamaño: {analysisResult.size.label}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Error en el análisis IA */}
        {analysisError && !isAnalyzing && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{analysisError}</span>
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
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-verde-700 bg-verde-50 border border-verde-200 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-verde-600" />
                Sugerido por IA ({Math.round(analysisResult.species.confidence * 100)}%)
              </span>
            )}
          </div>
          <Controller
            name="species"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => field.onChange("dog")}
                  className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    field.value === "dog"
                      ? "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                      : "border-line bg-white hover:border-verde-500 text-tinta-600"
                  }`}
                >
                  <Dog className="w-5 h-5 text-verde-700" />
                  <span>Perro</span>
                </button>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => field.onChange("cat")}
                  className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    field.value === "cat"
                      ? "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                      : "border-line bg-white hover:border-verde-500 text-tinta-600"
                  }`}
                >
                  <Cat className="w-5 h-5 text-verde-700" />
                  <span>Gato</span>
                </button>
              </div>
            )}
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

      {/* 3. SECCIÓN: COLORES IDENTIFICADOS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
            Colores identificados
            <span className="text-xs font-normal text-tinta-500">
              (selecciona hasta 3)
            </span>
          </Label>
          {analysisResult?.colors?.autocompleted && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-verde-700 bg-verde-50 border border-verde-200 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-verde-600" />
              Sugerido por IA ({Math.round(analysisResult.colors.confidence * 100)}%)
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

            return (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {COLOR_OPTIONS.map((opt) => {
                  const isSelected = currentColors.includes(opt.value);
                  const isSuggested =
                    analysisResult?.colors?.value?.includes(opt.value);

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggleColor(opt.value)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                          : "border-line bg-white hover:border-verde-400 text-tinta-600"
                      } ${!isSelected && currentColors.length >= 3 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full shrink-0 border ${opt.swatch}`}
                      />
                      <span className="text-xs sm:text-sm truncate">{opt.label}</span>
                      {isSuggested && (
                        <Sparkles className="w-3 h-3 text-verde-600 ml-auto shrink-0" />
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

      {/* 5. SECCIÓN: EDAD EN MESES + CÁLCULO DE CATEGORÍA ETARIA */}
      <div className="p-4 rounded-xl bg-superficie-2 border border-line space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="space-y-1.5">
            <Label htmlFor="pet-age-months" className="text-sm font-semibold text-tinta-900">
              Edad en meses <span className="text-coral-600">*</span>
            </Label>
            <Input
              id="pet-age-months"
              type="number"
              min={0}
              step={1}
              placeholder="Ej. 12 para 1 año, 24 para 2 años"
              disabled={disabled}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              {...register("ageMonths", {
                setValueAs: (v) =>
                  v === "" || v === null || v === undefined || isNaN(Number(v))
                    ? undefined
                    : Number(v),
              })}
            />
            {errors.ageMonths && (
              <p className="text-xs text-coral-600">
                {errors.ageMonths.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-medium text-tinta-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-ambar-600" />
              Categoría etaria calculada:
            </span>
            <div
              className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-bold ${ageInfo.badgeColor}`}
            >
              {ageInfo.label}
            </div>
            <p className="text-[11px] text-tinta-400">
              El recomendador de adoptantes usa esta clasificación etaria para matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
