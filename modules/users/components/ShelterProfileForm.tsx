"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Users,
} from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type {
  ShelterProfile,
  UpdateShelterProfileDto,
} from "../models/shelter-profile.types";

const PERU_DEPARTMENTS = [
  "Lima",
  "Arequipa",
  "Cusco",
  "La Libertad",
  "Piura",
  "Lambayeque",
  "Áncash",
  "Junín",
  "Ica",
  "San Martín",
  "Cajamarca",
  "Loreto",
  "Ucayali",
  "Tacna",
  "Huánuco",
  "Ayacucho",
  "Puno",
  "Moquegua",
  "Tumbes",
  "Amazonas",
  "Apurímac",
  "Huancavelica",
  "Madre de Dios",
  "Pasco",
  "Callao",
];

interface ShelterProfileFormProps {
  profile: ShelterProfile | null | undefined;
  onSave: (dto: UpdateShelterProfileDto) => Promise<void>;
  isLoading?: boolean;
}

export function ShelterProfileForm({
  profile,
  onSave,
  isLoading = false,
}: ShelterProfileFormProps) {
  const [formData, setFormData] = useState<UpdateShelterProfileDto>({
    organizationName: profile?.organizationName || "",
    description: profile?.description || "",
    address: profile?.address || "",
    city: profile?.city || "",
    department: profile?.department || "Lima",
    phoneNumber: profile?.phoneNumber || "",
    contactEmail: profile?.contactEmail || "",
    rescueCapacity: profile?.rescueCapacity || 30,
    facebookUrl: profile?.facebookUrl || "",
    instagramUrl: profile?.instagramUrl || "",
    latitude: profile?.latitude ?? -12.0464,
    longitude: profile?.longitude ?? -77.0428,
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateField = <K extends keyof UpdateShelterProfileDto>(
    field: K,
    value: UpdateShelterProfileDto[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "");
    if (raw.startsWith("51") && raw.length > 9) {
      raw = raw.slice(2);
    }
    if (raw === "") {
      updateField("phoneNumber", "");
      return;
    }
    // Peruvian mobile numbers must start with 9
    if (!raw.startsWith("9")) {
      return;
    }
    // Maximum 9 digits
    updateField("phoneNumber", raw.slice(0, 9));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const isVerified = profile?.isVerified ?? false;

  return (
    <Card className="bg-white border-line shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-heading text-tinta-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-verde-700" />
              Datos Institucionales del Albergue
            </CardTitle>
            <CardDescription className="text-sm text-tinta-600 mt-1">
              Esta información es visible para los adoptantes y en las fichas de tus animales rescatados.
            </CardDescription>
          </div>

          <Badge
            variant={isVerified ? "disponible" : "reason"}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold self-start sm:self-auto"
          >
            {isVerified ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                Albergue Verificado
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                Verificación Pendiente
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <Separator className="bg-line" />

      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-6">
          {/* Nombre de la Organización */}
          <div className="space-y-1.5">
            <Label htmlFor="orgName" className="text-sm font-semibold text-tinta-900">
              Nombre de la organización o albergue
            </Label>
            <Input
              id="orgName"
              type="text"
              value={formData.organizationName || ""}
              onChange={(e) => updateField("organizationName", e.target.value)}
              placeholder="Ej. Asociación Protectora Huellitas Felices"
              required
              disabled={isLoading || isSaving}
              className="h-12 border-line focus-visible:ring-verde-500 text-sm"
            />
          </div>

          {/* Misión y Descripción */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-sm font-semibold text-tinta-900">
              Misión y descripción del refugio
            </Label>
            <textarea
              id="description"
              rows={3}
              value={formData.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe la labor que realizan, historia y enfoque de rescate..."
              disabled={isLoading || isSaving}
              className="w-full rounded-lg border border-line p-3 text-sm text-tinta-900 focus:outline-none focus:ring-2 focus:ring-anillo"
            />
          </div>

          {/* Ubicación: Dirección, Ciudad/Distrito, Departamento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-verde-700" />
                Dirección física
              </Label>
              <Input
                id="address"
                type="text"
                value={formData.address || ""}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Ej. Av. Las Palmeras 450"
                disabled={isLoading || isSaving}
                className="h-11 border-line text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-sm font-semibold text-tinta-900">
                Distrito o Ciudad
              </Label>
              <Input
                id="city"
                type="text"
                value={formData.city || ""}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Ej. Los Olivos"
                disabled={isLoading || isSaving}
                className="h-11 border-line text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="shelterDepartment" className="text-sm font-semibold text-tinta-900">
                Departamento
              </Label>
              <select
                id="shelterDepartment"
                value={formData.department || "Lima"}
                onChange={(e) => updateField("department", e.target.value)}
                className="w-full h-11 px-3 rounded-lg border border-line bg-white text-sm text-tinta-900 focus:outline-none focus:ring-2 focus:ring-anillo"
              >
                {PERU_DEPARTMENTS.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Separator className="bg-line" />

          {/* Contacto Público: Teléfono, Email, Capacidad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="shelterPhone" className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-verde-700" />
                  Teléfono / WhatsApp
                </Label>
                <span
                  className={`text-xs font-mono font-medium ${
                    formData.phoneNumber?.length === 9
                      ? "text-verde-700 font-bold"
                      : "text-tinta-400"
                  }`}
                >
                  {formData.phoneNumber?.length || 0}/9 dígitos
                </span>
              </div>
              <Input
                id="shelterPhone"
                type="tel"
                inputMode="numeric"
                maxLength={9}
                value={formData.phoneNumber || ""}
                onChange={handlePhoneChange}
                placeholder="912345678"
                disabled={isLoading || isSaving}
                className="h-11 border-line text-sm tracking-widest font-mono font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactEmail" className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-verde-700" />
                Correo de contacto público
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail || ""}
                onChange={(e) => updateField("contactEmail", e.target.value)}
                placeholder="adopciones@albergue.org"
                disabled={isLoading || isSaving}
                className="h-11 border-line text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rescueCapacity" className="text-sm font-semibold text-tinta-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-verde-700" />
                Capacidad estimada (animales)
              </Label>
              <Input
                id="rescueCapacity"
                type="number"
                min={1}
                max={500}
                value={formData.rescueCapacity ?? 30}
                onChange={(e) => updateField("rescueCapacity", parseInt(e.target.value, 10) || 0)}
                disabled={isLoading || isSaving}
                className="h-11 border-line text-sm"
              />
            </div>
          </div>

          <Separator className="bg-line" />

          {/* Redes Sociales */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-tinta-900">
              Presencia en Redes Sociales
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="facebookUrl" className="text-xs text-tinta-600 flex items-center gap-1.5">
                  <FacebookIcon className="w-4 h-4 text-[#1877F2]" />
                  Página de Facebook
                </Label>
                <Input
                  id="facebookUrl"
                  type="url"
                  value={formData.facebookUrl || ""}
                  onChange={(e) => updateField("facebookUrl", e.target.value)}
                  placeholder="https://facebook.com/tualbergue"
                  disabled={isLoading || isSaving}
                  className="h-11 border-line text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="instagramUrl" className="text-xs text-tinta-600 flex items-center gap-1.5">
                  <InstagramIcon className="w-4 h-4 text-[#E4405F]" />
                  Perfil de Instagram
                </Label>
                <Input
                  id="instagramUrl"
                  type="url"
                  value={formData.instagramUrl || ""}
                  onChange={(e) => updateField("instagramUrl", e.target.value)}
                  placeholder="https://instagram.com/tualbergue"
                  disabled={isLoading || isSaving}
                  className="h-11 border-line text-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>

        <Separator className="bg-line mt-4" />

        <CardFooter className="py-4 bg-superficie-2 flex justify-end">
          <Button
            type="submit"
            disabled={isLoading || isSaving}
            className="bg-verde-700 hover:bg-verde-hover text-white font-medium min-w-[180px]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar datos del albergue"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
