"use client";

import * as React from "react";
import Link from "next/link";
import { PawPrint } from "lucide-react";
import { scrollToSection } from "@/components/providers/smooth-scroll";

export function Footer() {
  const handleNav = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(id);
  };

  return (
    <footer className="border-t border-border bg-[#FAF9F6] text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Product context */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <PawPrint className="size-4.5 fill-current" />
              </div>
              <span className="font-heading text-lg font-bold text-foreground">
                Adoptanet
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sistema de recomendación híbrido para optimizar la adopción de animales callejeros en el Perú.
            </p>
            <p className="text-[11px] font-medium text-foreground">
              Plataforma digital de bienestar animal · Lima, Perú
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Plataforma
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={handleNav("como-funciona")}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Cómo funciona
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleNav("diferencia")}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Explicar, no puntuar
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleNav("albergues")}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Para albergues
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleNav("faq")}
                  className="hover:text-foreground transition-colors cursor-pointer text-left"
                >
                  Preguntas frecuentes
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Albergues */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Para Rescatistas
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link href="/registro/rol" className="hover:text-foreground transition-colors">
                  Registrar mi albergue
                </Link>
              </li>
              <li>
                <Link href="/ingresar" className="hover:text-foreground transition-colors">
                  Panel de gestión
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground/80">
                  Seguimiento (30, 90, 180 d)
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/80">
                  Ficha médica estandarizada
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Responsabilidad */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Compromiso
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <span className="hover:text-foreground cursor-pointer transition-colors">
                  Tenencia responsable (Ley 30407)
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer transition-colors">
                  Protección de datos del adoptante
                </span>
              </li>
              <li>
                <span className="hover:text-foreground cursor-pointer transition-colors">
                  Términos de adopción informada
                </span>
              </li>
              <li>
                <span className="text-primary font-medium">
                  Perú · Adopciones transparentes
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col items-center justify-between gap-4 sm:flex-row text-xs">
          <p>© 2026 Adoptanet. Todos los derechos reservados.</p>
          <p className="text-muted-foreground">
            Conectando rescatados con hogares conscientes en todo el Perú.
          </p>
        </div>
      </div>
    </footer>
  );
}
