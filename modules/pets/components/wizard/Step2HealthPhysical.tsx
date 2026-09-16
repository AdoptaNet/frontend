"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CompletePetFormData } from "../../models/pet-form.schemas";

interface Step2HealthPhysicalProps {
  form: UseFormReturn<CompletePetFormData>;
  disabled?: boolean;
}

export function Step2HealthPhysical({ form, disabled }: Step2HealthPhysicalProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6">
      {/* Tamaño */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-tinta-900">
          Tamaño aproximado <span className="text-coral-600">*</span>
        </Label>
        <Controller
          name="size"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "small", label: "Pequeño", desc: "Hasta 10 kg" },
                { value: "medium", label: "Mediano", desc: "10 a 25 kg" },
                { value: "large", label: "Grande", desc: "Más de 25 kg" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => field.onChange(item.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer text-center ${
                    field.value === item.value
                      ? "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                      : "border-line bg-white hover:border-verde-500 text-tinta-600"
                  }`}
                >
                  <span className="text-sm">{item.label}</span>
                  <span className="text-[11px] text-tinta-400">{item.desc}</span>
                </button>
              ))}
            </div>
          )}
        />
        {errors.size && (
          <p className="text-xs text-coral-600">{errors.size.message}</p>
        )}
      </div>

      {/* Longitud del pelaje */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-tinta-900">
          Longitud del pelaje
        </Label>
        <Controller
          name="furLength"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "short", label: "Corto" },
                { value: "long", label: "Largo" },
                { value: "hairless", label: "Sin pelo / Calvo" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => field.onChange(item.value)}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer text-center text-sm ${
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

      {/* Vacunación y Esterilización */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="isSterilized"
          control={control}
          render={({ field }) => (
            <button
              type="button"
              disabled={disabled}
              onClick={() => field.onChange(!field.value)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                field.value
                  ? "border-verde-700 bg-verde-50/70 shadow-2xs"
                  : "border-line bg-white hover:border-verde-500"
              }`}
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  field.value
                    ? "bg-verde-700 border-verde-700 text-white"
                    : "border-tinta-300 bg-white"
                }`}
              >
                {field.value && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-sm font-semibold text-tinta-900 block">
                  Esterilizado / Castrado
                </span>
                <span className="text-xs text-tinta-500">
                  Cuenta con constancia quirúrgica
                </span>
              </div>
            </button>
          )}
        />

        <Controller
          name="isVaccinated"
          control={control}
          render={({ field }) => (
            <button
              type="button"
              disabled={disabled}
              onClick={() => field.onChange(!field.value)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                field.value
                  ? "border-verde-700 bg-verde-50/70 shadow-2xs"
                  : "border-line bg-white hover:border-verde-500"
              }`}
            >
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                  field.value
                    ? "bg-verde-700 border-verde-700 text-white"
                    : "border-tinta-300 bg-white"
                }`}
              >
                {field.value && <CheckCircle2 className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-sm font-semibold text-tinta-900 block">
                  Vacunas al día
                </span>
                <span className="text-xs text-tinta-500">
                  Posee carnet o vacunas esenciales
                </span>
              </div>
            </button>
          )}
        />
      </div>

      {/* Estado de Salud */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-tinta-900">
          Estado de salud general
        </Label>
        <Controller
          name="healthStatus"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  value: "healthy",
                  label: "Completamente Sano",
                  icon: ShieldCheck,
                },
                {
                  value: "chronic_condition",
                  label: "Condición Crónica",
                  icon: AlertCircle,
                },
                {
                  value: "disability",
                  label: "Discapacidad",
                  icon: AlertCircle,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.value}
                    type="button"
                    disabled={disabled}
                    onClick={() => field.onChange(item.value)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all cursor-pointer text-left ${
                      field.value === item.value
                        ? "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                        : "border-line bg-white hover:border-verde-500 text-tinta-600"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-verde-700 shrink-0" />
                    <span className="text-xs sm:text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      {/* Notas Médicas (Visible siempre o si no es sano) */}
      <div className="space-y-1.5">
        <Label htmlFor="health-notes" className="text-sm font-semibold text-tinta-900">
          Notas médicas y observaciones (opcional)
        </Label>
        <Input
          id="health-notes"
          placeholder="Ej. Alergia a pollo, usa gotas oftálmicas diarias, etc."
          disabled={disabled}
          {...register("healthNotes")}
        />
        <p className="text-xs text-tinta-500">
          Información relevante para que los adoptantes sepan qué cuidados especiales requiere.
        </p>
      </div>
    </div>
  );
}
