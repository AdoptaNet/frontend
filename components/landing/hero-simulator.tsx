"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { MapPin, ShieldCheck, Sparkles } from "lucide-react";

interface PetProfile {
  name: string;
  age: string;
  breed: string;
  location: string;
  traits: string[];
  reasons: string[];
  imageSrc: string;
}

export function HeroSimulator() {
  const [housing, setHousing] = React.useState<"depa" | "casa">("depa");
  const [hoursAlone, setHoursAlone] = React.useState<"4h" | "8h">("4h");
  const [otherPets, setOtherPets] = React.useState<"gato" | "ninguno">("gato");

  // Dynamic profile calculation based on selections
  const currentProfile: PetProfile = React.useMemo(() => {
    if (housing === "depa" && hoursAlone === "4h" && otherPets === "gato") {
      return {
        name: "Ramón",
        age: "2 años",
        breed: "Mestizo mediano",
        location: "Barranco, Lima",
        traits: ["Esterilizado", "Vacunado", "Sociable"],
        reasons: [
          "Tolera departamento sin estrés por espacio",
          "Rutina ideal para ausencias cortas (4 a 6 h)",
          "Habituado a convivir con felinos en hogar temporal",
        ],
        imageSrc:
          "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
      };
    } else if (housing === "casa" && hoursAlone === "8h") {
      return {
        name: "Canela",
        age: "3 años",
        breed: "Mestiza activa",
        location: "Chorrillos, Lima",
        traits: ["Esterilizada", "Vacunada", "Guardián sereno"],
        reasons: [
          "Aprovecha patio cercado para gastar energía diaria",
          "Alta independencia: tolera 8 h a solas con calma",
          otherPets === "gato"
            ? "Sociable y curiosa con otros animales"
            : "Enfocada y calmada en hogar sin otras mascotas",
        ],
        imageSrc:
          "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
      };
    } else if (hoursAlone === "8h" && housing === "depa") {
      return {
        name: "Milo",
        age: "4 años",
        breed: "Mestizo tranquilo",
        location: "Surquillo, Lima",
        traits: ["Esterilizado", "Microchip", "Poco ladrador"],
        reasons: [
          "Baja vocalización: no genera ruido durante la jornada laboral",
          "Acostumbrado a paseos fijos de mañana y noche",
          otherPets === "gato"
            ? "Ignora a felinos y respeta espacios compartidos"
            : "Adaptado a descansar mientras estás en el trabajo",
        ],
        imageSrc:
          "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80",
      };
    } else {
      return {
        name: "Luna",
        age: "1 año y medio",
        breed: "Mestiza juguetona",
        location: "Miraflores, Lima",
        traits: ["Esterilizada", "Vacunada", "Cariñosa"],
        reasons: [
          "Ideal para tu disponibilidad de acompañarla (4 h fuera)",
          housing === "casa"
            ? "Disfruta de espacios abiertos para juego"
            : "Se adapta a departamento con paseos diarios",
          otherPets === "gato"
            ? "Evaluada conductualmente con gatos: respetuosa"
            : "Vínculo afectivo fuerte con personas",
        ],
        imageSrc:
          "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80",
      };
    }
  }, [housing, hoursAlone, otherPets]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    setTilt({ x: mouseY * -14 + 6, y: mouseX * 16 - 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 6, y: -8 });
  };

  const [tilt, setTilt] = React.useState({ x: 6, y: -8 });

  return (
    <div
      className="relative mx-auto w-full max-w-md lg:max-w-none [perspective:1200px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D ambient shadow on background surface */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-16 bg-[#0E2C25]/20 blur-2xl rounded-full pointer-events-none" />


      {/* 3D Rotated Card Envelope */}
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          rotateZ: -1.5,
        }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 22,
          mass: 0.6,
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative rounded-3xl border border-border/80 bg-white/95 p-3.5 shadow-[0_24px_50px_-12px_rgba(14,44,37,0.22),0_10px_20px_-5px_rgba(20,32,28,0.08)] backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_32px_65px_-15px_rgba(14,44,37,0.28)]"
      >
        {/* Interactive Controls Bar with 3D Pop */}
        <div
          style={{ transform: "translateZ(18px)" }}
          className="mb-3 rounded-2xl bg-secondary/80 p-3.5 border border-border/60 shadow-xs"
        >
          <div className="mb-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-accent" />
              Simulador de vida real
            </span>
            <span className="text-[11px] font-medium text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border">
              Prueba tu rutina
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {/* Control 1: Housing */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground font-medium">Vivienda</span>
              <div className="flex rounded-md bg-background p-0.5 border border-border">
                <button
                  type="button"
                  onClick={() => setHousing("depa")}
                  className={`flex-1 rounded py-1 text-[11px] font-medium transition-colors ${
                    housing === "depa"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Depa
                </button>
                <button
                  type="button"
                  onClick={() => setHousing("casa")}
                  className={`flex-1 rounded py-1 text-[11px] font-medium transition-colors ${
                    housing === "casa"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Casa
                </button>
              </div>
            </div>

            {/* Control 2: Solitude */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground font-medium">Horas solo</span>
              <div className="flex rounded-md bg-background p-0.5 border border-border">
                <button
                  type="button"
                  onClick={() => setHoursAlone("4h")}
                  className={`flex-1 rounded py-1 text-[11px] font-medium transition-colors ${
                    hoursAlone === "4h"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  4 horas
                </button>
                <button
                  type="button"
                  onClick={() => setHoursAlone("8h")}
                  className={`flex-1 rounded py-1 text-[11px] font-medium transition-colors ${
                    hoursAlone === "8h"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  8 horas
                </button>
              </div>
            </div>

            {/* Control 3: Other pets */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground font-medium">Compañía</span>
              <div className="flex rounded-md bg-background p-0.5 border border-border">
                <button
                  type="button"
                  onClick={() => setOtherPets("gato")}
                  className={`flex-1 rounded py-1 text-[11px] font-medium transition-colors ${
                    otherPets === "gato"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Gato
                </button>
                <button
                  type="button"
                  onClick={() => setOtherPets("ninguno")}
                  className={`flex-1 rounded py-1 text-[11px] font-medium transition-colors ${
                    otherPets === "ninguno"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Solo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Match Result Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-xs"
            style={{ transform: "translateZ(26px)" }}
          >
            {/* Header: Photo, Name, Badge */}
            <div className="flex gap-3.5 items-start">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-secondary">
                {/* Real-world pet photography with fallback styling */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentProfile.imageSrc}
                  alt={currentProfile.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-heading text-lg font-bold text-foreground truncate">
                    {currentProfile.name}
                  </h3>
                  <Badge variant="disponible">Disponible</Badge>
                </div>

                <p className="text-xs text-muted-foreground mt-0.5">
                  {currentProfile.breed} · {currentProfile.age}
                </p>

                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="size-3 shrink-0 text-primary" />
                  <span className="truncate">{currentProfile.location}</span>
                </div>
              </div>
            </div>

            {/* Health & Verification Pills */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {currentProfile.traits.map((trait) => (
                <span
                  key={trait}
                  className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                >
                  <ShieldCheck className="size-3 text-primary" />
                  {trait}
                </span>
              ))}
            </div>

            <hr className="my-3 border-border" />

            {/* The Core Product Value: "Te conviene porque..." */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Te conviene porque…
                </span>
                <span className="text-[10px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  Afinidad demostrada
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                {currentProfile.reasons.map((reason) => (
                  <div
                    key={reason}
                    className="flex items-start gap-2 rounded-lg bg-[#FCEBC9]/70 px-2.5 py-1.5 text-xs text-[#9A5D02] border border-[#F0A202]/25"
                  >
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#9A5D02]" />
                    <span className="font-medium leading-tight">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Micro footer hint */}
        <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
          Sin porcentajes ficticios. Explicaciones auditables que albergues y adoptantes entienden.
        </p>
      </motion.div>
    </div>
  );
}
