"use client";

import React from "react";
import { Star, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { PetPhotoItem } from "../../models/pet.types";

interface PetPhotoThumbnailProps {
  photo: PetPhotoItem;
  index: number;
  total: number;
  onSetPrimary: (index: number) => void;
  onRemove: (index: number) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  onDragStart?: (index: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (index: number) => void;
  isDragging?: boolean;
  disabled?: boolean;
}

export function PetPhotoThumbnail({
  photo,
  index,
  total,
  onSetPrimary,
  onRemove,
  onMove,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging = false,
  disabled = false,
}: PetPhotoThumbnailProps) {
  return (
    <div
      draggable={!disabled}
      onDragStart={() => onDragStart?.(index)}
      onDragOver={(e) => onDragOver?.(e)}
      onDrop={() => onDrop?.(index)}
      className={`relative group rounded-xl overflow-hidden border-2 transition-all aspect-square bg-superficie-2 flex items-center justify-center select-none ${
        isDragging
          ? "border-verde-500 opacity-40 scale-95"
          : "border-line hover:border-verde-500 shadow-2xs cursor-grab active:cursor-grabbing"
      }`}
    >
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.url}
        alt={`Foto ${index + 1}`}
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* Primary Badge or Set Primary Action */}
      <div className="absolute top-2 left-2 z-10">
        {photo.isPrimary ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-ambar-500 text-white text-[11px] font-bold shadow-xs">
            <Star className="w-3 h-3 fill-current" />
            Portada
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onSetPrimary(index)}
            disabled={disabled}
            title="Marcar como foto de portada"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-black/60 hover:bg-ambar-500 text-white shadow-xs cursor-pointer focus:opacity-100"
          >
            <Star className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Delete button (Destroys from Cloudinary) */}
      <div className="absolute top-2 right-2 z-10">
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={disabled}
          title="Eliminar fotografía"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-black/60 hover:bg-coral-600 text-white shadow-xs cursor-pointer focus:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Reorder Controls Bar */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-auto bg-black/40 backdrop-blur-xs px-1.5 py-1 rounded-lg">
        <div className="flex items-center gap-0.5">
          {index > 0 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMove(index, index - 1);
              }}
              disabled={disabled}
              title="Mover hacia la izquierda"
              className="p-1 rounded hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="w-5" />
          )}

          {index < total - 1 ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMove(index, index + 1);
              }}
              disabled={disabled}
              title="Mover hacia la derecha"
              className="p-1 rounded hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="w-5" />
          )}
        </div>

        <span className="px-1 py-0.5 text-white text-[10px] font-bold">
          #{index + 1}
        </span>
      </div>
    </div>
  );
}
