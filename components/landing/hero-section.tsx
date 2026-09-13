"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSimulator } from "./hero-simulator";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { scrollToSection } from "@/components/providers/smooth-scroll";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Background dot matrix subtle texture */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(#1D5147 0.75px, transparent 0.75px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 30%, #000 70%, transparent 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Left Column: Editorial Value Proposition */}
          <div className="flex flex-col items-start text-left">
            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[62px] lg:leading-[1.08]">
              Encuentra al animal que{" "}
              <span className="relative inline-block text-primary underline decoration-accent decoration-wavy decoration-2 md:decoration-4 underline-offset-8">
                encaja
              </span>{" "}
              contigo.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              El primer sistema que cruza tu estilo de vida real con cada rescatado y te explica con razones exactas por qué se adaptará a tu hogar.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <Link href="/registro" className="w-full sm:w-auto">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  <span>Conoce tu match</span>
                  <ArrowRight className="size-4.5" />
                </Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => scrollToSection("como-funciona")}
                className="w-full sm:w-auto cursor-pointer"
              >
                Cómo funciona
              </Button>
            </div>

            {/* Micro guarantees */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-primary" /> Sin costo para adoptantes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-primary" /> 100% albergues verificados
              </span>
            </div>

            {/* Metrics resting on separator rule */}
            <div className="mt-12 w-full pt-8 border-t border-border">
              <div className="grid grid-cols-3 gap-6 sm:gap-10">
                <div>
                  <div className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                    36
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground leading-tight">
                    Variables cruzadas de compatibilidad
                  </div>
                </div>
                <div>
                  <div className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                    3 hitos
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground leading-tight">
                    Seguimiento (30, 90 y 180 días)
                  </div>
                </div>
                <div>
                  <div className="font-heading text-2xl font-bold text-primary sm:text-3xl">
                    0%
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground leading-tight">
                    Scores vacíos: solo razones humanas
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The Live Interactive Simulator */}
          <div className="w-full">
            <HeroSimulator />
          </div>
        </div>
      </div>
    </section>
  );
}
