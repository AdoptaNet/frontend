import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PawPrint } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[#0E2C25] py-20 text-white md:py-28">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 size-96 rounded-full bg-[#1D5147]/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-[#F0A202]/20 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-xs mb-8 border border-white/15">
          <PawPrint className="size-7 fill-current text-accent" />
        </div>

        <h2 className="mx-auto max-w-3xl font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
          Cada animal merece un hogar que entienda su historia.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base text-[#BFDCD4] sm:text-lg leading-relaxed">
          Reemplacemos la improvisación de las redes sociales por compatibilidad real, respeto al rescatista y compromiso de por vida.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/registro" className="w-full sm:w-auto">
            <Button
              variant="accent"
              size="lg"
              className="w-full sm:w-auto"
            >
              <span>Buscar mi compañero</span>
              <ArrowRight className="size-4.5" />
            </Button>
          </Link>
          <Link href="/registro/rol" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white"
            >
              Registrar mi albergue
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-xs text-[#BFDCD4]/70">
          Plataforma libre de costo para albergues y adoptantes en todo el Perú.
        </p>
      </div>
    </section>
  );
}
