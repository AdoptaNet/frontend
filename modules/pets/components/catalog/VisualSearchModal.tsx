"use client";

import React, { useRef, useState } from "react";
import {
  Camera,
  UploadCloud,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/shared/hooks/useModal";
import { petsService } from "../../services/pets.service";
import type { SimilarPetResponse, PetSpecies } from "../../models/pet.types";

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchResults: (results: SimilarPetResponse[], photoUrl: string) => void;
}

export function VisualSearchModal({
  isOpen,
  onClose,
  onSearchResults,
}: VisualSearchModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [speciesFilter, setSpeciesFilter] = useState<PetSpecies | "all">("all");
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useModal({
    isOpen,
    onClose: () => {
      if (!isSearching) {
        handleReset();
        onClose();
      }
    },
    preventClose: isSearching,
    modalRef,
  });

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
    setSpeciesFilter("all");
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setErrorMessage(null);

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("La fotografía no debe superar los 5 MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSearch = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsSearching(true);
    setErrorMessage(null);

    try {
      const results = await petsService.searchSimilarPets(selectedFile, {
        species: speciesFilter === "all" ? undefined : speciesFilter,
        limit: 16,
      });

      const currentPreview = previewUrl;
      handleReset();
      onSearchResults(results, currentPreview);
      onClose();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "No se pudo realizar la búsqueda visual. Intenta con otra imagen.";
      setErrorMessage(msg);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="visual-search-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-line overflow-hidden focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-line bg-superficie-2/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-verde-100 text-verde-700 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3
                id="visual-search-title"
                className="text-base font-bold text-tinta-900 font-heading"
              >
                Buscar por foto
              </h3>
              <p className="text-xs text-tinta-500">
                Encuentra mascotas por parecido físico y color
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSearching}
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="w-8 h-8 rounded-lg text-tinta-400 hover:text-tinta-700 hover:bg-superficie-2 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {!previewUrl ? (
            /* Dropzone */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-verde-600 bg-verde-50/70 scale-[0.99]"
                  : "border-line bg-superficie-2/40 hover:border-verde-500 hover:bg-verde-50/30"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-line text-verde-700 flex items-center justify-center shadow-2xs">
                <UploadCloud className="w-6 h-6 stroke-[1.75]" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-tinta-900">
                  Arrastra una fotografía aquí o haz clic para subirla
                </p>
                <p className="text-xs text-tinta-500">
                  Formatos admitidos: JPG, PNG, WebP (máx. 5 MB)
                </p>
              </div>
            </div>
          ) : (
            /* Selected Image Preview */
            <div className="space-y-4">
              <div className="relative aspect-video max-h-56 w-full rounded-xl overflow-hidden border border-line bg-superficie-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Foto de referencia"
                  className="w-full h-full object-contain bg-zinc-950/5"
                />
                <button
                  type="button"
                  disabled={isSearching}
                  onClick={handleReset}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-tinta-700 flex items-center justify-center shadow-md text-xs cursor-pointer transition-all"
                  title="Cambiar fotografía"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Optional Species Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-tinta-800">
                  Filtrar por especie (opcional):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "all", label: "Todos" },
                    { id: "dog", label: "Perros 🐶" },
                    { id: "cat", label: "Gatos 🐱" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      disabled={isSearching}
                      onClick={() => setSpeciesFilter(s.id as PetSpecies | "all")}
                      className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                        speciesFilter === s.id
                          ? "border-verde-700 bg-verde-50 text-verde-900 shadow-2xs"
                          : "border-line bg-white hover:border-verde-400 text-tinta-600"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          {/* Error Banner */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-coral-50 border border-coral-200 text-coral-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-coral-600" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 p-4 border-t border-line bg-superficie-2/30">
          <Button
            type="button"
            variant="outline"
            disabled={isSearching}
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="text-xs h-9 cursor-pointer"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            disabled={!selectedFile || isSearching}
            onClick={handleSearch}
            className="h-9 px-4 text-xs font-semibold bg-verde-700 hover:bg-verde-800 text-white gap-2 cursor-pointer shadow-2xs"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Buscando mascotas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Buscar parecidos</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
