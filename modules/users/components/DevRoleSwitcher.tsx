"use client";

import { SlidersHorizontal, HeartHandshake, ShieldCheck } from "lucide-react";
import type { UserRole } from "../models/user.types";

interface DevRoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function DevRoleSwitcher({ currentRole, onRoleChange }: DevRoleSwitcherProps) {
  return (
    <div className="w-full bg-verde-50 border border-verde-200 rounded-xl p-3.5 sm:p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
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
            Alterna el rol activo para previsualizar los formularios correspondientes:
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-line shrink-0">
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
    </div>
  );
}
