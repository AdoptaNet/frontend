"use client";

import { useRef } from "react";
import { Camera, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AvatarUploaderProps {
  avatarUrl?: string | null;
  fullName?: string | null;
  onUpload: (file: File) => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export function AvatarUploader({
  avatarUrl,
  fullName,
  onUpload,
  onRemove,
  disabled = false,
}: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name?: string | null): string => {
    if (!name) return "AN";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0][0] || "A").toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-line bg-verde-50 flex items-center justify-center text-verde-700 font-semibold text-2xl select-none shadow-sm transition-all duration-200">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={fullName || "Avatar"}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{getInitials(fullName)}</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Cambiar foto de perfil"
          className="absolute bottom-0 right-0 p-2 rounded-full bg-verde-700 hover:bg-verde-hover text-white shadow-md transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-anillo disabled:opacity-50 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5">
        <h4 className="text-base font-semibold text-tinta-900">
          Foto de perfil
        </h4>
        <p className="text-sm text-tinta-600 max-w-[260px]">
          JPG, PNG o WEBP. Máximo 5 MB. Se recomienda una imagen cuadrada.
        </p>

        <div className="flex items-center gap-2 mt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="h-9 px-3 text-xs"
          >
            Subir foto
          </Button>

          {avatarUrl && onRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              disabled={disabled}
              className="h-9 px-2 text-xs text-coral-600 hover:text-coral-600 hover:bg-coral-100"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Quitar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
