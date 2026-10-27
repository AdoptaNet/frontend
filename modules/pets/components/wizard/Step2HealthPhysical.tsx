"use client";

import React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Syringe,
  Check,
  Sparkles,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { CompletePetFormData } from "../../models/pet-form.schemas";
import type { AnalyzePetPhotosResponse } from "../../models/pet.types";
import {
  normalizeSize,
  normalizeFur,
} from "../../utils/pet-ai-normalizer";

interface Step2HealthPhysicalProps {
  form: UseFormReturn<CompletePetFormData>;
  disabled?: boolean;
  analysisResult?: AnalyzePetPhotosResponse | null;
}

export function Step2HealthPhysical({
  form,
  disabled,
  analysisResult,
}: Step2HealthPhysicalProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = form;

  const isVaccinated = watch("isVaccinated");
  const currentSpecies = watch("species");
  const rawVaccines = watch("vaccinesApplied");

  // Normalizar lista de vacunas: asegurar al menos una fila editable
  const vaccineList: string[] = React.useMemo(() => {
    if (Array.isArray(rawVaccines) && rawVaccines.length > 0) {
      return rawVaccines;
    }
    if (typeof rawVaccines === "string" && rawVaccines.trim().length > 0) {
      return rawVaccines.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [""];
  }, [rawVaccines]);

  const handleUpdateVaccine = (index: number, value: string) => {
    const updated = [...vaccineList];
    updated[index] = value;
    form.setValue("vaccinesApplied", updated, { shouldDirty: true });
  };

  const handleAddVaccine = (initialValue = "") => {
    const updated = [...vaccineList, initialValue];
    form.setValue("vaccinesApplied", updated, { shouldDirty: true });
  };

  const handleRemoveVaccine = (index: number) => {
    const updated = vaccineList.filter((_, i) => i !== index);
    form.setValue("vaccinesApplied", updated.length > 0 ? updated : [""], {
      shouldDirty: true,
    });
  };

  const quickSuggestions =
    currentSpecies === "cat"
      ? [
          "Triple Felina (FVRCP)",
          "Antirrábica",
          "Leucemia Felina (FeLV)",
          "PIF",
        ]
      : [
          "Quíntuple",
          "Antirrábica",
          "Parvovirus",
          "Séxtuple / Puppy",
          "KC (Tos de perreras)",
        ];

  const handleQuickAdd = (vaccineName: string) => {
    const emptyIndex = vaccineList.findIndex((v) => !v.trim());
    if (emptyIndex !== -1) {
      handleUpdateVaccine(emptyIndex, vaccineName);
    } else if (
      !vaccineList.some(
        (v) => v.toLowerCase().trim() === vaccineName.toLowerCase().trim(),
      )
    ) {
      handleAddVaccine(vaccineName);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tamaño */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-tinta-900">
            Tamaño aproximado <span className="text-coral-600">*</span>
          </Label>
          {analysisResult?.size?.autocompleted && (
            <span className="text-[11px] font-semibold text-verde-700 bg-verde-50 border border-verde-200 px-2 py-0.5 rounded-full">
              Sugerido por IA
            </span>
          )}
        </div>
        <Controller
          name="size"
          control={control}
          render={({ field }) => {
            const aiSize = normalizeSize(analysisResult?.size?.value);
            const isSizeAutocompleted = !!analysisResult?.size?.autocompleted;

            return (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "small", label: "Pequeño", desc: "Hasta 10 kg" },
                  { value: "medium", label: "Mediano", desc: "10 a 25 kg" },
                  { value: "large", label: "Grande", desc: "Más de 25 kg" },
                ].map((item) => {
                  const isSelected = field.value === item.value;
                  const isAiSuggested = isSizeAutocompleted && aiSize === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => field.onChange(item.value)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer text-center ${
                        isSelected
                          ? isAiSuggested
                            ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-2xs animate-[ai-pulse-halo_2.8s_ease-in-out_infinite]"
                            : "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                          : isAiSuggested
                            ? "border-emerald-300/80 bg-emerald-50/20 hover:border-emerald-400 text-tinta-700 animate-[ai-pulse-halo_3.2s_ease-in-out_infinite]"
                            : "border-line bg-white hover:border-verde-500 text-tinta-600"
                      }`}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-[11px] text-tinta-400">{item.desc}</span>
                      {isAiSuggested && (
                        <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded-full shadow-2xs pointer-events-none">
                          <Sparkles className="w-2.5 h-2.5 text-amber-500" /> IA
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          }}
        />
        {errors.size && (
          <p className="text-xs text-coral-600">{errors.size.message}</p>
        )}
      </div>

      {/* Longitud del pelaje */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-tinta-900">
            Longitud del pelaje
          </Label>
          {analysisResult?.fur?.autocompleted && (
            <span className="text-[11px] font-semibold text-verde-700 bg-verde-50 border border-verde-200 px-2 py-0.5 rounded-full">
              Sugerido por IA
            </span>
          )}
        </div>
        <Controller
          name="furLength"
          control={control}
          render={({ field }) => {
            const aiFur = normalizeFur(analysisResult?.fur?.value);
            const isFurAutocompleted = !!analysisResult?.fur?.autocompleted;

            return (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "short", label: "Corto" },
                  { value: "long", label: "Largo" },
                  { value: "hairless", label: "Sin pelo / Calvo" },
                ].map((item) => {
                  const isSelected = field.value === item.value;
                  const isAiSuggested = isFurAutocompleted && aiFur === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => field.onChange(item.value)}
                      className={`relative flex items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer text-center text-sm ${
                        isSelected
                          ? isAiSuggested
                            ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-2xs animate-[ai-pulse-halo_2.8s_ease-in-out_infinite]"
                            : "border-verde-700 bg-verde-50/70 text-verde-900 font-semibold shadow-2xs"
                          : isAiSuggested
                            ? "border-emerald-300/80 bg-emerald-50/20 hover:border-emerald-400 text-tinta-700 animate-[ai-pulse-halo_3.2s_ease-in-out_infinite]"
                            : "border-line bg-white hover:border-verde-500 text-tinta-600"
                      }`}
                    >
                      <span className="font-medium">{item.label}</span>
                      {isAiSuggested && (
                        <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded-full shadow-2xs pointer-events-none">
                          <Sparkles className="w-2.5 h-2.5 text-amber-500" /> IA
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          }}
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

      {/* Detalle de vacunas si está marcado como vacunado */}
      {isVaccinated && (
        <div className="space-y-3.5 p-4 bg-verde-50/40 rounded-2xl border border-verde-200 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <Label className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
                <Syringe className="w-4 h-4 text-verde-700" />
                Vacunas aplicadas
              </Label>
              <p className="text-xs text-tinta-500">
                Agrega un campo por cada vacuna o dosis administrada a la mascota.
              </p>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleAddVaccine("")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-verde-100 text-verde-900 border border-verde-300 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-verde-700" />
              <span>Agregar otra vacuna</span>
            </button>
          </div>

          {/* Lista dinámica de inputs de vacunas */}
          <div className="space-y-2">
            {vaccineList.map((vac, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder={`Vacuna #${idx + 1} (ej. ${quickSuggestions[idx % quickSuggestions.length] || "Antirrábica"})`}
                    value={vac}
                    disabled={disabled}
                    onChange={(e) => handleUpdateVaccine(idx, e.target.value)}
                    className="h-10 text-xs sm:text-sm bg-white border-line rounded-xl"
                  />
                </div>
                {vaccineList.length > 1 && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => handleRemoveVaccine(idx)}
                    className="p-2 text-tinta-400 hover:text-coral-600 rounded-lg hover:bg-coral-50 transition-colors cursor-pointer"
                    title="Eliminar esta vacuna"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Sugerencias rápidas según especie */}
          <div className="space-y-1.5 pt-1.5 border-t border-verde-200/60">
            <span className="text-[11px] font-semibold text-verde-800 block">
              Sugerencias frecuentes (haz clic para agregar rápido):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickSuggestions.map((sug) => {
                const isSelected = vaccineList.some(
                  (v) => v.toLowerCase().trim() === sug.toLowerCase().trim(),
                );
                return (
                  <button
                    key={sug}
                    type="button"
                    disabled={disabled || isSelected}
                    onClick={() => handleQuickAdd(sug)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      isSelected
                        ? "bg-verde-700 text-white cursor-default opacity-80"
                        : "bg-white hover:bg-verde-100 text-verde-900 border border-verde-200 cursor-pointer shadow-2xs"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Plus className="w-3 h-3 text-verde-600" />
                    )}
                    <span>{sug}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
