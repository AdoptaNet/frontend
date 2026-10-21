"use client";

import React, { useRef, useState } from "react";
import { ImagePlus, AlertCircle } from "lucide-react";
import { petsService } from "../../services/pets.service";
import type { PetPhotoItem } from "../../models/pet.types";
import { PetPhotoThumbnail } from "./PetPhotoThumbnail";

interface PetPhotoUploaderProps {
  photos: PetPhotoItem[];
  onChange: (photos: PetPhotoItem[]) => void;
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
  error?: string;
  isAnalyzing?: boolean;
}

export function PetPhotoUploader({
  photos,
  onChange,
  onFilesSelected,
  disabled = false,
  error,
  isAnalyzing = false,
}: PetPhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (
      toIndex < 0 ||
      toIndex >= photos.length ||
      fromIndex === toIndex ||
      fromIndex < 0 ||
      fromIndex >= photos.length
    ) {
      return;
    }
    const updated = [...photos];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    const reordered = updated.map((p, idx) => ({
      ...p,
      order: idx,
    }));
    onChange(reordered);
  };

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const availableSlots = 6 - photos.length;
    if (availableSlots <= 0) {
      setUploadError("Ya has alcanzado el límite máximo de 6 fotos.");
      return;
    }

    const selectedFiles = Array.from(files).slice(0, availableSlots);
    onFilesSelected?.(selectedFiles);

    try {
      const newPhotos: PetPhotoItem[] = selectedFiles.map((file) => {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`"${file.name}" supera el límite de 5 MB.`);
        }
        const previewUrl = URL.createObjectURL(file);
        return {
          url: previewUrl,
          publicId: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          file,
          isPrimary: false,
        };
      });

      const updated = [...photos, ...newPhotos];
      // Si ninguna está marcada como portada, marcar la primera
      if (!updated.some((p) => p.isPrimary) && updated.length > 0) {
        updated[0].isPrimary = true;
      }

      const reordered = updated.map((p, idx) => ({
        ...p,
        order: idx,
      }));

      onChange(reordered);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al agregar una o más fotografías. Intenta de nuevo.";
      setUploadError(msg);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSetPrimary = (indexToPrimary: number) => {
    const updated = photos.map((p, idx) => ({
      ...p,
      isPrimary: idx === indexToPrimary,
      order: idx,
    }));
    onChange(updated);
  };

  const handleRemove = async (indexToRemove: number) => {
    const photoToRemove = photos[indexToRemove];
    const updated = photos.filter((_, idx) => idx !== indexToRemove);

    // Si la eliminada era la portada y quedan fotos, marcar la primera como portada
    if (photoToRemove.isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }

    const reordered = updated.map((p, idx) => ({
      ...p,
      order: idx,
    }));

    onChange(reordered);

    // Si era una foto local con ObjectURL, liberar memoria
    if (photoToRemove?.url?.startsWith("blob:")) {
      URL.revokeObjectURL(photoToRemove.url);
    }

    // Si ya estaba persistida en Cloudinary (modo edición), eliminarla en segundo plano
    if (photoToRemove?.publicId && !photoToRemove.publicId.startsWith("temp-")) {
      try {
        await petsService.deletePhoto(photoToRemove.publicId);
      } catch (err) {
        console.warn("No se pudo destruir la imagen en Cloudinary:", err);
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
            Fotografías de la mascota
            <span className="text-coral-600">*</span>
          </label>
          <p className="text-xs text-tinta-600">
            Mínimo 3 fotos, máximo 6. Selecciona la estrella para definir la foto
            de portada.
          </p>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-superficie-2 border border-line text-tinta-600">
          {photos.length} / 6 fotos
        </span>
      </div>

      {/* Grid of Thumbnails + Add Box - Responsive and Generous Size */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
        {photos.map((photo, index) => (
          <PetPhotoThumbnail
            key={photo.publicId || photo.url || index}
            photo={photo}
            index={index}
            total={photos.length}
            onSetPrimary={handleSetPrimary}
            onRemove={handleRemove}
            onMove={handleMove}
            onDragStart={(idx) => setDraggedIndex(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(targetIdx) => {
              if (draggedIndex !== null && draggedIndex !== targetIdx) {
                handleMove(draggedIndex, targetIdx);
              }
              setDraggedIndex(null);
            }}
            isDragging={draggedIndex === index}
            disabled={disabled || isAnalyzing}
          />
        ))}

        {/* Upload Button Box if < 6 photos */}
        {photos.length < 6 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isAnalyzing}
            className="aspect-square min-h-[140px] sm:min-h-[160px] rounded-xl border-2 border-dashed border-line hover:border-verde-600 hover:bg-verde-50/40 text-tinta-600 hover:text-verde-700 flex flex-col items-center justify-center gap-2 p-4 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group shadow-2xs hover:shadow-xs"
          >
            <div className="p-3 rounded-xl bg-superficie-2 group-hover:bg-verde-100 text-tinta-500 group-hover:text-verde-700 transition-colors shadow-2xs">
              <ImagePlus className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-center leading-tight">
              Agregar foto
            </span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
        disabled={disabled || isAnalyzing}
      />

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-coral-50 border border-coral-200 text-coral-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Form Validation Error Banner */}
      {error && !uploadError && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-coral-50 border border-coral-200 text-coral-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
