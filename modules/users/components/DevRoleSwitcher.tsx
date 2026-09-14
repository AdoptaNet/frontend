"use client";

import { SlidersHorizontal, HeartHandshake, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import type { UserRole } from "../models/user.types";

interface DevRoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  adopterStatus?: "completed" | "incomplete";
  onAdopterStatusChange?: (status: "completed" | "incomplete") => void;
}

export function DevRoleSwitcher({
  currentRole,
  onRoleChange,
  adopterStatus = "completed",
  onAdopterStatusChange,
}: DevRoleSwitcherProps) {
  return (
    <div className="w-full bg-verde-50 border border-verde-200 rounded-xl p-3.5 sm:p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-verde-700 text-white flex items-center justify-center shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-verde-700 bg-verde-200/60 px-2 py-0.5 rounded">
              Modo UI / Mock
            </span>
            <span className="text-xs text-tinta-600 hidden sm:inline">
              (Simulación sin backend)
            </span>
          </div>
          <p className="text-xs text-tinta-600 mt-0.5">
            Alterna el rol activo y el estado del cuestionario para previsualizar ambos flujos:
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
        {/* Selector de Rol */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-line shrink-0 shadow-2xs">
          <button
            type="button"
            onClick={() => onRoleChange("adopter")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentRole === "adopter"
                ? "bg-verde-700 text-white shadow-xs"
                : "text-tinta-600 hover:text-tinta-900 hover:bg-atenuado"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            Adoptante
          </button>

          <button
            type="button"
            onClick={() => onRoleChange("shelter")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentRole === "shelter"
                ? "bg-verde-700 text-white shadow-xs"
                : "text-tinta-600 hover:text-tinta-900 hover:bg-atenuado"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Albergue
          </button>
        </div>

        {/* Sub-toggle: Estado del Cuestionario si es Adoptante */}
        {currentRole === "adopter" && onAdopterStatusChange && (
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-line shrink-0 shadow-2xs">
            <span className="text-[11px] font-semibold text-tinta-400 pl-1.5 pr-0.5 hidden sm:inline">
              Cuestionario:
            </span>
            <button
              type="button"
              onClick={() => onAdopterStatusChange("completed")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                adopterStatus === "completed"
                  ? "bg-verde-700 text-white shadow-xs"
                  : "text-tinta-600 hover:text-tinta-900 hover:bg-atenuado"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Completo
            </button>
            <button
              type="button"
              onClick={() => onAdopterStatusChange("incomplete")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                adopterStatus === "incomplete"
                  ? "bg-ambar-500 text-verde-900 font-bold shadow-xs"
                  : "text-tinta-600 hover:text-tinta-900 hover:bg-atenuado"
              }`}
            >
              <Clock className="w-3 h-3" />
              Pendiente (Nuevo)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
