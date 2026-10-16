"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Zap, Volume2, Users, Clock, GraduationCap } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CompletePetFormData } from "../../models/pet-form.schemas";

interface Step3PersonalityProps {
  form: UseFormReturn<CompletePetFormData>;
  disabled?: boolean;
}

export function Step3Personality({ form, disabled }: Step3PersonalityProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const energyLevel = watch("energyLevel");
  const vocalizationLevel = watch("vocalizationLevel");

  return (
    <div className="space-y-6">
      {/* Nivel de Energía (1-5) */}
      <div className="space-y-2 p-4 rounded-xl bg-superficie-2 border border-line">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-ambar-600" />
            Nivel de energía
          </Label>
          <span className="text-xs font-bold text-verde-800 px-2 py-0.5 rounded bg-verde-100">
            Nivel {energyLevel || 3} de 5
          </span>
        </div>
        <p className="text-xs text-tinta-600">
          Indica qué tan activo es el animal (1 = Muy tranquilo y dormilón, 5 = Altamente activo).
        </p>
        <Controller
          name="energyLevel"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-5 gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  disabled={disabled}
                  onClick={() => field.onChange(lvl)}
                  className={`h-11 rounded-lg border-2 font-bold text-sm transition-all cursor-pointer flex items-center justify-center ${
                    field.value === lvl
                      ? "border-verde-700 bg-verde-700 text-white shadow-xs"
                      : "border-line bg-white hover:border-verde-500 text-tinta-700"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          )}
        />
        {errors.energyLevel && (
          <p className="text-xs text-coral-600">{errors.energyLevel.message}</p>
        )}
      </div>

      {/* Nivel de Vocalización (1-5) */}
      <div className="space-y-2 p-4 rounded-xl bg-superficie-2 border border-line">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-verde-700" />
            Nivel de vocalización (ladridos / maullidos)
          </Label>
          <span className="text-xs font-bold text-verde-800 px-2 py-0.5 rounded bg-verde-100">
            Nivel {vocalizationLevel || 2} de 5
          </span>
        </div>
        <p className="text-xs text-tinta-600">
          ¿Con qué frecuencia vocaliza? (1 = Muy silencioso, 5 = Muy ladrador/maullador).
        </p>
        <Controller
          name="vocalizationLevel"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-5 gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  disabled={disabled}
                  onClick={() => field.onChange(lvl)}
                  className={`h-11 rounded-lg border-2 font-bold text-sm transition-all cursor-pointer flex items-center justify-center ${
                    field.value === lvl
                      ? "border-verde-700 bg-verde-700 text-white shadow-xs"
                      : "border-line bg-white hover:border-verde-500 text-tinta-700"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          )}
        />
        {errors.vocalizationLevel && (
          <p className="text-xs text-coral-600">{errors.vocalizationLevel.message}</p>
        )}
      </div>

      {/* Convivencia y Tolerancia */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-verde-700" />
          <h4 className="text-sm font-semibold text-tinta-900">
            Tolerancia y convivencia evaluada
          </h4>
        </div>

        {/* Niños */}
        <div className="p-3.5 rounded-xl border border-line bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-tinta-900">¿Convive con niños?</span>
          </div>
          <Controller
            name="goodWithChildren"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: true, label: "Sí, tolera bien" },
                  { value: false, label: "No recomendado" },
                  { value: null, label: "En evaluación / No lo sé" },
                ].map((item) => (
                  <button
                    key={String(item.value)}
                    type="button"
                    disabled={disabled}
                    onClick={() => field.onChange(item.value)}
                    className={`p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      field.value === item.value
                        ? "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                        : "border-line bg-superficie-2 hover:border-verde-500 text-tinta-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Perros */}
        <div className="p-3.5 rounded-xl border border-line bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-tinta-900">¿Convive con otros perros?</span>
          </div>
          <Controller
            name="goodWithDogs"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: true, label: "Sí, sociable" },
                  { value: false, label: "No tolera perros" },
                  { value: null, label: "En evaluación / No lo sé" },
                ].map((item) => (
                  <button
                    key={String(item.value)}
                    type="button"
                    disabled={disabled}
                    onClick={() => field.onChange(item.value)}
                    className={`p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      field.value === item.value
                        ? "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                        : "border-line bg-superficie-2 hover:border-verde-500 text-tinta-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Gatos */}
        <div className="p-3.5 rounded-xl border border-line bg-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-tinta-900">¿Convive con gatos?</span>
          </div>
          <Controller
            name="goodWithCats"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: true, label: "Sí, respetuoso" },
                  { value: false, label: "No tolera gatos" },
                  { value: null, label: "En evaluación / No lo sé" },
                ].map((item) => (
                  <button
                    key={String(item.value)}
                    type="button"
                    disabled={disabled}
                    onClick={() => field.onChange(item.value)}
                    className={`p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      field.value === item.value
                        ? "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                        : "border-line bg-superficie-2 hover:border-verde-500 text-tinta-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>
      </div>

      {/* Adiestramiento y Horas de soledad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nivel de Adiestramiento */}
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-verde-700" />
            Nivel de adiestramiento
          </Label>
          <Controller
            name="trainingLevel"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "none", label: "Ninguno" },
                  { value: "basic", label: "Básico (obedece)" },
                  { value: "litterbox", label: "Uso de arenero" },
                  { value: "advanced", label: "Avanzado" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    disabled={disabled}
                    onClick={() => field.onChange(item.value)}
                    className={`p-2.5 rounded-lg border text-xs font-medium transition-all cursor-pointer text-center ${
                      field.value === item.value
                        ? "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                        : "border-line bg-white hover:border-verde-500 text-tinta-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Tolerancia de soledad */}
        <div className="space-y-1.5">
          <Label htmlFor="pet-solitude" className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-verde-700" />
            Horas de soledad toleradas
          </Label>
          <Input
            id="pet-solitude"
            type="number"
            min={0}
            max={24}
            step={1}
            placeholder="Ej. 6 (dejar vacío si no se sabe)"
            disabled={disabled}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", "."].includes(e.key)) {
                e.preventDefault();
              }
            }}
            {...register("timeAloneToleranceHours", {
              setValueAs: (v) =>
                v === "" || v === null || v === undefined || isNaN(Number(v))
                  ? null
                  : Number(v),
            })}
          />
          {errors.timeAloneToleranceHours && (
            <p className="text-xs text-coral-600">
              {errors.timeAloneToleranceHours.message}
            </p>
          )}
          <p className="text-xs text-tinta-500">
            Horas que puede quedarse solo en casa sin ansiedad por separación.
          </p>
        </div>
      </div>
    </div>
  );
}
