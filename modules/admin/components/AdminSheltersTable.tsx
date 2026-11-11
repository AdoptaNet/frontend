"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Search,
  Clock,
  ExternalLink,
} from "lucide-react";
import { adminService } from "../services/admin.service";
import type { AdminShelterItem } from "../models/admin.types";
import { AdminInfoTooltip } from "./AdminInfoTooltip";

interface AdminSheltersTableProps {
  shelters: AdminShelterItem[];
  onShelterUpdated: () => void;
}

export function AdminSheltersTable({ shelters, onShelterUpdated }: AdminSheltersTableProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "verified" | "unverified">("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const pendingCount = shelters.filter((s) => s.verificationRequested && !s.isVerified).length;
  const verifiedCount = shelters.filter((s) => s.isVerified).length;

  const handleToggleVerification = async (shelter: AdminShelterItem) => {
    try {
      setUpdatingId(shelter.id);
      await adminService.verifyShelter(shelter.id, !shelter.isVerified);
      onShelterUpdated();
    } catch (error) {
      console.error("Error al actualizar estado de verificación del albergue:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredShelters = shelters.filter((s) => {
    if (filter === "pending" && (!s.verificationRequested || s.isVerified)) return false;
    if (filter === "verified" && !s.isVerified) return false;
    if (filter === "unverified" && s.isVerified) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.shelterName.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.city && s.city.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-line shadow-xs overflow-hidden">
      {/* Header y Filtros */}
      <div className="p-5 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-base text-tinta-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            Gestión y Verificación de Albergues
          </h3>
          <p className="text-xs text-tinta-500 mt-0.5">
            Acreditación formal para albergues registrados (insignia de confianza comunitaria).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-tinta-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar albergue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-line bg-neutral-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-verde-600 text-tinta-900 w-44 sm:w-56"
            />
          </div>

          <div className="flex rounded-lg border border-line p-0.5 bg-neutral-50 text-xs">
            <button
              onClick={() => setFilter("pending")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                filter === "pending"
                  ? "bg-white text-amber-800 shadow-2xs font-bold"
                  : "text-tinta-500 hover:text-tinta-700"
              }`}
            >
              <span>Pendientes</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 text-amber-900 font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilter("verified")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filter === "verified" ? "bg-white text-emerald-700 shadow-2xs font-bold" : "text-tinta-500 hover:text-tinta-700"
              }`}
            >
              Verificados ({verifiedCount})
            </button>
            <button
              onClick={() => setFilter("unverified")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filter === "unverified" ? "bg-white text-tinta-900 shadow-2xs font-bold" : "text-tinta-500 hover:text-tinta-700"
              }`}
            >
              Sin Acreditar
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filter === "all" ? "bg-white text-tinta-900 shadow-2xs font-bold" : "text-tinta-500 hover:text-tinta-700"
              }`}
            >
              Todos ({shelters.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de Albergues */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/70 border-b border-line text-[11px] font-semibold text-tinta-500 uppercase tracking-wider">
              <th className="py-3 px-5">Albergue</th>
              <th className="py-3 px-4">Contacto</th>
              <th className="py-3 px-4">Ubicación</th>
              <th className="py-3 px-4 text-center">Mascotas</th>
              <th className="py-3 px-4">
                <span className="inline-flex items-center gap-1">
                  <span>Estado Acreditación</span>
                  <AdminInfoTooltip content="La insignia 'Verificado' se visualiza en todas las fichas de mascotas del albergue para transmitir confianza y respaldo formal." />
                </span>
              </th>
              <th className="py-3 px-5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-xs">
            {filteredShelters.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-tinta-400">
                  No se encontraron albergues registrados con los criterios seleccionados.
                </td>
              </tr>
            ) : (
              filteredShelters.map((shelter) => (
                <tr key={shelter.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-tinta-900">
                    <Link
                      href={`/shelters/${shelter.userId || shelter.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-tinta-900 hover:text-verde-700 transition-colors"
                      title="Abrir perfil público del albergue en una nueva pestaña para revisar"
                    >
                      <span className="group-hover:underline underline-offset-2">
                        {shelter.shelterName}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-tinta-400 group-hover:text-verde-600 shrink-0 transition-colors" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-tinta-600">
                    <div>{shelter.email}</div>
                    {shelter.phone && <div className="text-[11px] text-tinta-400">{shelter.phone}</div>}
                  </td>
                  <td className="py-3.5 px-4 text-tinta-600">
                    {shelter.city || shelter.address || "No especificada"}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-tinta-800 bg-neutral-100 px-2 py-0.5 rounded-full">
                      {shelter.petCount}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {shelter.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verificado
                      </span>
                    ) : shelter.verificationRequested ? (
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                          Solicitud Pendiente
                        </span>
                        {shelter.verificationRequestedAt && (
                          <div className="text-[10px] text-amber-800 font-medium">
                            {new Date(shelter.verificationRequestedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Sin Acreditar
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-2 justify-end">
                      <Link
                        href={`/shelters/${shelter.userId || shelter.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-tinta-700 bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
                        title="Revisar ficha pública en nueva pestaña"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Revisar</span>
                      </Link>
                      <button
                        onClick={() => handleToggleVerification(shelter)}
                        disabled={updatingId === shelter.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 ${
                          shelter.isVerified
                            ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs font-bold"
                        }`}
                      >
                        {shelter.isVerified ? (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Revocar</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{shelter.verificationRequested ? "Aprobar Verificación" : "Verificar"}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
