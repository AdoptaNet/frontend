"use client";

import React, { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import type { PetStatus } from "../../models/pet.types";

interface PetStatusSelectProps {
  currentStatus: PetStatus;
  onChangeStatus: (newStatus: PetStatus) => Promise<void>;
  disabled?: boolean;
}

const STATUS_CONFIG: Record<
  PetStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  available: {
    label: "Disponible",
    bg: "bg-verde-50 border-verde-200",
    text: "text-verde-700",
    dot: "bg-verde-500",
  },
  in_process: {
    label: "En proceso",
    bg: "bg-ambar-50 border-ambar-200",
    text: "text-ambar-700",
    dot: "bg-ambar-500",
  },
  adopted: {
    label: "Adoptado",
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  draft: {
    label: "Borrador",
    bg: "bg-gray-100 border-gray-200",
    text: "text-gray-700",
    dot: "bg-gray-400",
  },
  hidden: {
    label: "Pausada",
    bg: "bg-stone-100 border-stone-200",
    text: "text-stone-700",
    dot: "bg-stone-400",
  },
};

export function PetStatusSelect({
  currentStatus,
  onChangeStatus,
  disabled = false,
}: PetStatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const current = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.available;

  const handleSelect = async (newStatus: PetStatus) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      await onChangeStatus(newStatus);
    } finally {
      setIsUpdating(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => !disabled && !isUpdating && setIsOpen(!isOpen)}
        disabled={disabled || isUpdating}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${current.bg} ${current.text} hover:opacity-90 disabled:opacity-60`}
      >
        {isUpdating ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <span className={`w-2 h-2 rounded-full ${current.dot}`} />
        )}
        <span>{current.label}</span>
        <ChevronDown className="w-3 h-3 opacity-70 ml-0.5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-1 w-36 rounded-xl bg-white border border-line shadow-lg z-30 py-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
            {(Object.keys(STATUS_CONFIG) as PetStatus[]).map((st) => {
              const cfg = STATUS_CONFIG[st];
              const isSelected = st === currentStatus;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleSelect(st)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-verde-50 text-verde-800 font-bold"
                      : "text-tinta-700 hover:bg-superficie-2"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
