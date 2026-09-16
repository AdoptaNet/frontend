"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { petsService } from "../../services/pets.service";
import type { Pet } from "../../models/pet.types";
import {
  completePetFormSchema,
  CompletePetFormData,
} from "../../models/pet-form.schemas";
import { WizardStepTracker } from "./WizardStepTracker";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2HealthPhysical } from "./Step2HealthPhysical";
import { Step3Personality } from "./Step3Personality";
import { Step4StoryStatus } from "./Step4StoryStatus";
import { ApiError } from "@/shared/services/http-client";

interface PetFormWizardProps {
  initialPet?: Pet;
}

export function PetFormWizard({ initialPet }: PetFormWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditMode = !!initialPet;

  const form = useForm<CompletePetFormData>({
    resolver: zodResolver(completePetFormSchema),
    mode: "onTouched",
    defaultValues: initialPet
      ? {
          name: initialPet.name,
          species: initialPet.species,
          breed: initialPet.breed || "Mestizo",
          gender: initialPet.gender,
          ageMonths: initialPet.ageMonths,
          photos: initialPet.photos || [],
          size: initialPet.size,
          furLength: initialPet.furLength || "short",
          isSterilized: initialPet.isSterilized ?? false,
          isVaccinated: initialPet.isVaccinated ?? false,
          healthStatus: initialPet.healthStatus || "healthy",
          healthNotes: initialPet.healthNotes || "",
          energyLevel: initialPet.energyLevel || 3,
          vocalizationLevel: initialPet.vocalizationLevel || 2,
          goodWithChildren: initialPet.goodWithChildren ?? null,
          goodWithDogs: initialPet.goodWithDogs ?? null,
          goodWithCats: initialPet.goodWithCats ?? null,
          trainingLevel: initialPet.trainingLevel || "none",
          timeAloneToleranceHours: initialPet.timeAloneToleranceHours ?? null,
          shelterStayMonths: initialPet.shelterStayMonths || 0,
          description: initialPet.description,
          status: initialPet.status || "available",
        }
      : {
          name: "",
          species: "dog",
          breed: "Mestizo",
          gender: "male",
          ageMonths: 12,
          photos: [],
          size: "medium",
          furLength: "short",
          isSterilized: false,
          isVaccinated: false,
          healthStatus: "healthy",
          healthNotes: "",
          energyLevel: 3,
          vocalizationLevel: 2,
          goodWithChildren: null,
          goodWithDogs: null,
          goodWithCats: null,
          trainingLevel: "none",
          timeAloneToleranceHours: null,
          shelterStayMonths: 0,
          description: "",
          status: "available",
        },
  });

  const handleNextStep = async () => {
    setSubmitError(null);
    let stepFields: (keyof CompletePetFormData)[] = [];

    if (currentStep === 1) {
      stepFields = ["name", "species", "breed", "gender", "ageMonths", "photos"];
    } else if (currentStep === 2) {
      stepFields = ["size", "furLength", "isSterilized", "isVaccinated", "healthStatus"];
    } else if (currentStep === 3) {
      stepFields = ["energyLevel", "vocalizationLevel", "trainingLevel"];
    }

    const isStepValid = await form.trigger(stepFields);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setSubmitError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: CompletePetFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (isEditMode && initialPet?.id) {
        await petsService.updatePet(initialPet.id, data);
      } else {
        await petsService.createPet(data);
      }

      router.push("/pets");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setSubmitError(err.message);
      } else if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("Ocurrió un error inesperado al guardar la mascota.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: FieldErrors<CompletePetFormData>) => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return;

    const step1Keys = ["name", "species", "breed", "gender", "ageMonths", "photos"];
    const step2Keys = ["size", "furLength", "isSterilized", "isVaccinated", "healthStatus", "healthNotes"];
    const step3Keys = ["energyLevel", "vocalizationLevel", "goodWithChildren", "goodWithDogs", "goodWithCats", "trainingLevel", "timeAloneToleranceHours"];
    const step4Keys = ["shelterStayMonths", "description", "status"];

    if (errorKeys.some((k) => step1Keys.includes(k))) {
      setCurrentStep(1);
      setSubmitError("Por favor completa los campos obligatorios del Paso 1 (nombre, fotos, especie, sexo o edad).");
    } else if (errorKeys.some((k) => step2Keys.includes(k))) {
      setCurrentStep(2);
      setSubmitError("Por favor completa los campos obligatorios del Paso 2 (Salud y Físico).");
    } else if (errorKeys.some((k) => step3Keys.includes(k))) {
      setCurrentStep(3);
      setSubmitError("Por favor revisa los campos del Paso 3 (Personalidad y Convivencia).");
    } else if (errorKeys.some((k) => step4Keys.includes(k))) {
      setCurrentStep(4);
      setSubmitError("Por favor completa los campos obligatorios del Paso 4 (Historia y Estado).");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Top Back Navigation */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-tinta-600 hover:text-verde-700 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a Mis Mascotas
      </button>

      {/* Main Card */}
      <Card className="border-line bg-white shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-5 sm:p-7 border-b border-line bg-superficie-2/40">
          <CardTitle className="text-xl sm:text-2xl font-heading font-extrabold text-tinta-900">
            {isEditMode ? `Editar ficha: ${initialPet.name}` : "Registrar nueva mascota"}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-tinta-600 mt-1">
            Completa los datos de la ficha para publicar o actualizar a tu rescatado en AdoptaNet.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 sm:p-7">
          <WizardStepTracker
            currentStep={currentStep}
            onStepClick={(step) => setCurrentStep(step)}
          />

          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                currentStep < 4 &&
                (e.target as HTMLElement).tagName === "INPUT"
              ) {
                e.preventDefault();
                handleNextStep();
              }
            }}
            className="space-y-8"
          >
            {/* Step Views */}
            {currentStep === 1 && (
              <Step1BasicInfo form={form} disabled={isSubmitting} />
            )}
            {currentStep === 2 && (
              <Step2HealthPhysical form={form} disabled={isSubmitting} />
            )}
            {currentStep === 3 && (
              <Step3Personality form={form} disabled={isSubmitting} />
            )}
            {currentStep === 4 && (
              <Step4StoryStatus form={form} disabled={isSubmitting} />
            )}

            {/* Error Banner */}
            {submitError && (
              <div className="p-4 rounded-xl bg-coral-50 border border-coral-200 text-coral-800 text-xs sm:text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-coral-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">No se pudo guardar la mascota</p>
                  <p className="leading-relaxed">{submitError}</p>
                  {submitError.includes("perfil del albergue") && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/profile?tab=role-specific")}
                      className="mt-2 text-xs h-8 bg-white border-coral-300 hover:bg-coral-100/50"
                    >
                      Ir a completar datos del albergue
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-line">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  className="h-10 px-4 text-xs sm:text-sm font-semibold text-tinta-700 border-line hover:bg-superficie-2 gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Paso anterior
                </Button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                {currentStep < 4 ? (
                  <Button
                    key="btn-step-continue"
                    type="button"
                    onClick={handleNextStep}
                    className="h-10 px-5 text-xs sm:text-sm font-semibold bg-verde-700 hover:bg-verde-800 text-white gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    key="btn-step-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-6 text-xs sm:text-sm font-semibold bg-verde-700 hover:bg-verde-800 text-white gap-2 cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>{isEditMode ? "Publicar cambios" : "Publicar mascota"}</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
