"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Building2,
  PawPrint,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Heart,
  Share2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usersService } from "@/modules/users/services/users.service";
import type { PublicShelter } from "@/modules/users/models/shelter-profile.types";
import type { Pet } from "@/modules/pets/models/pet.types";
import { PublicPetCard } from "@/modules/pets/components/catalog/PublicPetCard";
import { InteractiveLocationMap } from "@/shared/components/map/InteractiveLocationMap";
import { useAuthStore } from "@/modules/auth/store/auth.store";

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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.044-1.01-.069-.242-.073-.557-.19-1.02-.387-1.979-.844-3.256-2.846-3.355-2.979-.098-.133-.805-1.071-.805-2.044 0-.974.51-1.452.69-1.65.181-.198.396-.247.528-.247.133 0 .265.001.382.007.123.006.288-.047.45.344.167.404.57 1.39.62 1.49.05.101.083.219.016.353-.067.133-.101.218-.201.336-.1.117-.21.262-.3.352-.1.098-.204.205-.088.404.116.198.515.85 1.103 1.374.757.674 1.395.882 1.593.981.199.1.315.083.43-.05.117-.133.5-.584.633-.784.133-.199.265-.166.45-.099.184.066 1.168.552 1.367.652.199.1.332.149.381.233.05.083.05.482-.094.887z" />
      <path d="M12 2c5.514 0 10 4.486 10 10 0 1.764-.462 3.42-1.268 4.872l1.268 4.628-4.734-1.242c-1.408.76-3.008 1.19-4.704 1.19-5.514 0-10-4.486-10-10 0-5.514 4.486-10 10-10zm0 1.8c-4.521 0-8.2 3.679-8.2 8.2 0 1.547.433 2.997 1.185 4.238l.192.316-.787 2.879 2.946-.773.307.182c1.206.717 2.607 1.114 4.095 1.114 4.521 0 8.2-3.679 8.2-8.2 0-4.521-3.679-8.2-8.2-8.2z" />
    </svg>
  );
}

export default function PublicShelterPage() {
  const params = useParams();
  const shelterId = params.id as string;
  const { user: currentUser } = useAuthStore();

  const [shelter, setShelter] = useState<PublicShelter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, startVerifyTransition] = useTransition();
  const [copiedLink, setCopiedLink] = useState(false);

  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    if (!shelterId) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    usersService
      .getPublicShelter(shelterId)
      .then((data) => {
        if (isMounted) setShelter(data);
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar la ficha del albergue.",
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [shelterId]);

  const handleToggleVerification = () => {
    if (!shelter) return;
    const newStatus = !shelter.isVerified;

    startVerifyTransition(async () => {
      try {
        await usersService.verifyShelter(shelter.id, newStatus);
        setShelter((prev) => (prev ? { ...prev, isVerified: newStatus } : prev));
      } catch (err) {
        alert(
          err instanceof Error
            ? err.message
            : "Error al actualizar la verificación del albergue.",
        );
      }
    });
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch {
        // clipboard fallback
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-superficie-1 flex flex-col items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-verde-700 animate-spin mb-4" />
        <p className="text-sm font-medium text-tinta-600">
          Cargando ficha oficial del albergue...
        </p>
      </div>
    );
  }

  if (error || !shelter) {
    return (
      <div className="min-h-screen bg-superficie-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-line p-8 text-center shadow-xs">
          <AlertCircle className="w-12 h-12 text-rojo-500 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-tinta-900 mb-2">
            Albergue no encontrado
          </h2>
          <p className="text-sm text-tinta-600 mb-6">
            {error || "El albergue que buscas no existe o ha sido deshabilitado."}
          </p>
          <Link
            href="/pets"
            className={buttonVariants({
              className: "bg-verde-700 hover:bg-verde-hover text-white",
            })}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ver mascotas en adopción
          </Link>
        </div>
      </div>
    );
  }

  const cleanPhone = shelter.phoneNumber?.replace(/\D/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/51${cleanPhone.startsWith("51") ? cleanPhone.slice(2) : cleanPhone}?text=${encodeURIComponent(
        `¡Hola ${shelter.organizationName}! Me pongo en contacto desde AdoptaNet porque deseo información sobre adopciones.`,
      )}`
    : null;

  return (
    <div className="min-h-screen bg-superficie-1 pb-16">
      {/* Top Navbar Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-line shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/pets"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-tinta-600 hover:text-verde-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al catálogo</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-xs h-9 gap-1.5 border-line"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? "¡Enlace copiado!" : "Compartir"}</span>
            </Button>

            {isAdmin && (
              <Button
                variant={shelter.isVerified ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleVerification}
                disabled={isVerifying}
                className="text-xs h-9 gap-1.5"
              >
                {isVerifying ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                <span>
                  {shelter.isVerified
                    ? "Revocar Verificación"
                    : "Verificar Albergue (Admin)"}
                </span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* Shelter Hero Card */}
        <section className="bg-white rounded-3xl border border-line p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Logo / Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-superficie-2 border border-line flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              {shelter.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shelter.avatarUrl}
                  alt={shelter.organizationName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-12 h-12 text-verde-700/60" />
              )}
            </div>

            {/* Info details */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-tinta-900 tracking-tight">
                  {shelter.organizationName}
                </h1>

                {/* CA-08.4: Badge oficial de albergue verificado */}
                {shelter.isVerified && (
                  <Badge
                    variant="disponible"
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-800 border-emerald-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Albergue Verificado por AdoptaNet
                  </Badge>
                )}
              </div>

              {/* Ubicación y Registro */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-tinta-600">
                {(shelter.city || shelter.department) && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-verde-700" />
                    <span>
                      {[shelter.city, shelter.department].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}

                {shelter.address && (
                  <span className="text-tinta-400">· {shelter.address}</span>
                )}

                {shelter.rescueCapacity && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-verde-700" />
                    <span>Capacidad: ~{shelter.rescueCapacity} rescatados</span>
                  </div>
                )}
              </div>

              {/* Descripción */}
              {shelter.description && (
                <p className="text-sm text-tinta-700 leading-relaxed max-w-3xl pt-1">
                  {shelter.description}
                </p>
              )}

              {/* Botones de Contacto Directo (CA-08.5) y Redes Sociales */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3">
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({
                      className:
                        "bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium text-xs sm:text-sm h-10 shadow-xs",
                    })}
                  >
                    <WhatsAppIcon className="w-4 h-4 mr-2" />
                    Contactar por WhatsApp
                  </a>
                )}

                {shelter.contactEmail && (
                  <a
                    href={`mailto:${shelter.contactEmail}`}
                    className={buttonVariants({
                      variant: "outline",
                      className:
                        "border-line hover:bg-superficie-2 text-tinta-800 text-xs sm:text-sm h-10",
                    })}
                  >
                    <Mail className="w-4 h-4 mr-2 text-verde-700" />
                    Enviar correo
                  </a>
                )}

                {shelter.facebookUrl && (
                  <a
                    href={shelter.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Página de Facebook"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "icon",
                      className: "h-10 w-10 text-[#1877F2] hover:bg-blue-50",
                    })}
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                )}

                {shelter.instagramUrl && (
                  <a
                    href={shelter.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Perfil de Instagram"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "icon",
                      className: "h-10 w-10 text-[#E4405F] hover:bg-pink-50",
                    })}
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Mapa Geográfico */}
        {shelter.latitude && shelter.longitude && (
          <section className="bg-white rounded-2xl border border-line p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-semibold text-base text-tinta-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-verde-700" />
                Ubicación del albergue
              </h3>
              <span className="text-xs text-tinta-500 font-medium">
                {shelter.city}{shelter.department && shelter.department !== shelter.city ? `, ${shelter.department}` : ""}
              </span>
            </div>

            <InteractiveLocationMap
              latitude={shelter.latitude}
              longitude={shelter.longitude}
              readOnly={true}
              shelterName={shelter.organizationName}
              className="h-80 sm:h-[400px]"
            />
          </section>
        )}

        {/* CA-08.3: Catálogo Dinámico de Mascotas Disponibles */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-line">
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-tinta-900 flex items-center gap-2">
                <PawPrint className="w-6 h-6 text-verde-700" />
                Mascotas en Adopción
              </h2>
              <p className="text-xs sm:text-sm text-tinta-600">
                Animalitos rescatados actualmente al cuidado de{" "}
                {shelter.organizationName} esperando un hogar responsable.
              </p>
            </div>
            <span className="text-xs font-semibold text-verde-700 bg-verde-100 px-3 py-1 rounded-full self-start sm:self-auto">
              {shelter.availablePets.length}{" "}
              {shelter.availablePets.length === 1
                ? "mascota disponible"
                : "mascotas disponibles"}
            </span>
          </div>

          {shelter.availablePets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-line p-12 text-center shadow-xs">
              <Heart className="w-12 h-12 text-tinta-300 mx-auto mb-3" />
              <h3 className="font-heading font-semibold text-base text-tinta-800">
                Sin mascotas disponibles en este momento
              </h3>
              <p className="text-xs sm:text-sm text-tinta-500 mt-1 max-w-md mx-auto">
                Actualmente todos los rescatados de este albergue están en proceso
                de adopción o han encontrado un hogar. Puedes revisar el catálogo
                general para encontrar más amigos peludos.
              </p>
              <Link
                href="/pets"
                className={buttonVariants({
                  className:
                    "mt-5 bg-verde-700 hover:bg-verde-hover text-white text-xs sm:text-sm",
                })}
              >
                Explorar catálogo general
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {shelter.availablePets.map((pet) => (
                <PublicPetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
