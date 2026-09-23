"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { BookOpen, Globe, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CompletePetFormData } from "../../models/pet-form.schemas";

interface Step4StoryStatusProps {
  form: UseFormReturn<CompletePetFormData>;
  disabled?: boolean;
}

export function Step4StoryStatus({ form, disabled }: Step4StoryStatusProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const description = watch("description") || "";

  return (
    <div className="space-y-6">
      {/* Tiempo en el albergue */}
      <div className="space-y-1.5">
        <Label htmlFor="shelter-stay" className="text-sm font-semibold text-tinta-900">
          Tiempo en el albergue (en meses)
        </Label>
        <Input
          id="shelter-stay"
          type="number"
          min={0}
          step={1}
          placeholder="0 si recién fue rescatado"
          disabled={disabled}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-", "."].includes(e.key)) {
              e.preventDefault();
            }
          }}
          {...register("shelterStayMonths", {
            setValueAs: (v) =>
              v === "" || v === null || v === undefined || isNaN(Number(v))
                ? 0
                : Number(v),
          })}
        />
        {errors.shelterStayMonths && (
          <p className="text-xs text-coral-600">{errors.shelterStayMonths.message}</p>
        )}
        <p className="text-xs text-tinta-500">
          Permite al sistema priorizar la visibilidad de animales con mayor permanencia en refugio.
        </p>
      </div>

      {/* Biografía / Historia */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="pet-desc" className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-verde-700" />
            Historia y descripción de la mascota <span className="text-coral-600">*</span>
          </Label>
          <span className="text-xs text-tinta-500">
            {description.length} caracteres (mínimo 15)
          </span>
        </div>
        <textarea
          id="pet-desc"
          rows={5}
          placeholder="Cuéntanos cómo fue rescatado, su carácter en el día a día, si es cariñoso, tímido al principio o le gusta jugar. Esta información es analizada por nuestro modelo de Inteligencia Artificial para recomendarlo con adoptantes compatibles."
          disabled={disabled}
          className="w-full p-3.5 rounded-xl border border-line bg-white text-sm text-tinta-900 placeholder:text-tinta-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anillo disabled:opacity-50 resize-y"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-coral-600">{errors.description.message}</p>
        )}
      </div>

      {/* Estado de Publicación */}
      <div className="space-y-2.5">
        <Label className="text-sm font-semibold text-tinta-900">
          Estado inicial de publicación <span className="text-coral-600">*</span>
        </Label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={disabled}
                onClick={() => field.onChange("available")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left flex items-start gap-3 ${
                  field.value === "available"
                    ? "border-verde-700 bg-verde-50/70 text-verde-900 shadow-2xs"
                    : "border-line bg-white hover:border-verde-500 text-tinta-600"
                }`}
              >
                <Globe className="w-5 h-5 text-verde-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-bold text-tinta-900 block">
                    Disponible inmediatamente
                  </span>
                  <span className="text-xs text-tinta-500 leading-snug block mt-0.5">
                    Se publicará en el catálogo público y podrá recibir postulaciones de adopción.
                  </span>
                </div>
              </button>

              <button
                type="button"
                disabled={disabled}
                onClick={() => field.onChange("draft")}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left flex items-start gap-3 ${
                  field.value === "draft"
                    ? "border-verde-700 bg-verde-50/70 text-verde-900 shadow-2xs"
                    : "border-line bg-white hover:border-verde-500 text-tinta-600"
                }`}
              >
                <Lock className="w-5 h-5 text-tinta-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-bold text-tinta-900 block">
                    Guardar como borrador
                  </span>
                  <span className="text-xs text-tinta-500 leading-snug block mt-0.5">
                    Permanecerá privado en tu panel. Podrás completarlo o publicarlo cuando desees.
                  </span>
                </div>
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}
