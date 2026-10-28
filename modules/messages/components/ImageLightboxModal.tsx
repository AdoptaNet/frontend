'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImageLightboxModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export function ImageLightboxModal({
  imageUrl,
  onClose,
}: ImageLightboxModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (imageUrl) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar visor de imagen"
          className="absolute -top-10 right-0 p-1.5 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Evidencia adjunta ampliada"
          className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
        />
      </div>
    </div>
  );
}
