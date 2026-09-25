"use client";

import * as React from "react";
import { Heart, Home, CheckCircle2 } from "lucide-react";
import { cn } from "cn";
import type { RegisterRole } from "../models/auth.types";

interface RoleSelectorProps {
  value: RegisterRole;
  onChange: (role: RegisterRole) => void;
  className?: string;
}

export function RoleSelector({ value, onChange, className }: RoleSelectorProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-3.5 sm:grid-cols-2", className)}>
      {/* Adoptante Card */}
      <button
        type="button"
        onClick={() => onChange("adopter")}
        className={cn(
          "relative flex flex-col items-start rounded-xl border p-4.5 sm:p-5 text-left transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          value === "adopter"
            ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
            : "border-border bg-card hover:border-primary/40 hover:bg-secondary/40"
        )}
      >
        <div className="flex w-full items-center justify-between">
          <div
            className={cn(
              "flex size-9.5 items-center justify-center rounded-lg transition-colors",
              value === "adopter"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary text-muted-foreground"
            )}
          >
            <Heart className="size-5 fill-current" />
          </div>
          {value === "adopter" && (
            <CheckCircle2 className="size-5 text-primary" />
          )}
        </div>

        <span className="font-heading text-sm font-bold text-foreground mt-3.5">
          Quiero adoptar
        </span>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
          Busco a mi compañero ideal a través de recomendaciones basadas en compatibilidad.
        </p>
      </button>

      {/* Albergue Card */}
      <button
        type="button"
        onClick={() => onChange("shelter")}
        className={cn(
          "relative flex flex-col items-start rounded-xl border p-4.5 sm:p-5 text-left transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          value === "shelter"
            ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
            : "border-border bg-card hover:border-primary/40 hover:bg-secondary/40"
        )}
      >
        <div className="flex w-full items-center justify-between">
          <div
            className={cn(
              "flex size-9.5 items-center justify-center rounded-lg transition-colors",
              value === "shelter"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-secondary text-muted-foreground"
            )}
          >
            <Home className="size-5" />
          </div>
          {value === "shelter" && (
            <CheckCircle2 className="size-5 text-primary" />
          )}
        </div>

        <span className="font-heading text-sm font-bold text-foreground mt-3.5">
          Soy albergue / rescatista
        </span>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
          Publico animales rescatados, gestiono solicitudes y seguimiento ético posadopción.
        </p>
      </button>
    </div>
  );
}
