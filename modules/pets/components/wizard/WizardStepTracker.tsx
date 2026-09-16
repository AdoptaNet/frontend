"use client";

import React from "react";
import { Check } from "lucide-react";

interface WizardStepTrackerProps {
  currentStep: number;
  totalSteps?: number;
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { step: 1, label: "Identidad y Fotos" },
  { step: 2, label: "Rasgos y Salud" },
  { step: 3, label: "Personalidad" },
  { step: 4, label: "Historia y Estado" },
];

export function WizardStepTracker({
  currentStep,
  onStepClick,
}: WizardStepTrackerProps) {
  return (
    <div className="w-full">
      {/* Mobile Step Header */}
      <div className="sm:hidden flex items-center justify-between pb-3 border-b border-line mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-verde-700">
            Paso {currentStep} de 4
          </span>
          <h3 className="text-base font-bold text-tinta-900">
            {STEPS[currentStep - 1]?.label}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-verde-50 border border-verde-200 text-verde-800 flex items-center justify-center font-extrabold text-sm">
          {currentStep}/4
        </div>
      </div>

      {/* Desktop Step Stepper */}
      <div className="hidden sm:grid grid-cols-4 gap-2 mb-6">
        {STEPS.map((s) => {
          const isPassed = s.step < currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <button
              key={s.step}
              type="button"
              disabled={!isPassed}
              onClick={() => isPassed && onStepClick?.(s.step)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                isCurrent
                  ? "border-verde-700 bg-verde-50/80 shadow-2xs"
                  : isPassed
                    ? "border-line bg-white hover:border-verde-500 cursor-pointer"
                    : "border-line/60 bg-superficie-2/50 opacity-60 cursor-not-allowed"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isPassed
                    ? "bg-verde-700 text-white"
                    : isCurrent
                      ? "bg-verde-700 text-white ring-4 ring-verde-100"
                      : "bg-superficie-2 border border-line text-tinta-400"
                }`}
              >
                {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
              </div>
              <div className="truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-tinta-400">
                  Paso {s.step}
                </span>
                <span
                  className={`text-xs font-semibold truncate block ${
                    isCurrent ? "text-verde-900 font-bold" : "text-tinta-700"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
