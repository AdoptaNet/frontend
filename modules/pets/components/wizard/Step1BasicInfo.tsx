"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Dog, Cat, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PetPhotoUploader } from "../photo-uploader/PetPhotoUploader";
import {
  CompletePetFormData,
  getAgeCategoryLabel,
} from "../../models/pet-form.schemas";

interface Step1BasicInfoProps {
  form: UseFormReturn<CompletePetFormData>;
  disabled?: boolean;
}

export function Step1BasicInfo({ form, disabled }: Step1BasicInfoProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const ageMonths = watch("ageMonths");
  const ageInfo = getAgeCategoryLabel(Number(ageMonths) || 0);

  return (
    <div className="space-y-6">
      {/* Sección: Especie y Sexo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Selector de Especie */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-tinta-900">
            Especie <span className="text-coral-600">*</span>
          </Label>
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

      {/* Nombre y Raza */}
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

      {/* Edad en meses + Cálculo automático de categoría */}
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

      {/* Fotos */}
      <Controller
        name="photos"
        control={control}
        render={({ field }) => (
          <PetPhotoUploader
            photos={field.value || []}
            onChange={field.onChange}
            disabled={disabled}
            error={errors.photos?.message}
          />
        )}
      />
    </div>
  );
}
