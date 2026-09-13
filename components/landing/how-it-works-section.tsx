import * as React from "react";
import { ClipboardCheck, GitCompare, CalendarCheck } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Tres pasos. Cero suposiciones.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Diseñado para que ni tú ni el animal se lleven sorpresas desagradables después de firmar.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="relative rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <ClipboardCheck className="size-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Paso 01
              </span>
              <h3 className="font-heading text-xl font-bold text-foreground mt-1 mb-3">
                El dato difícil primero
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No empezamos preguntando si quieres perro o gato de pelo largo. Preguntamos tus horas a solas, metros cuadrados y experiencia previa. Los datos que evitan devoluciones.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-1.5">
              <span className="rounded bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground">
                Horas solo
              </span>
              <span className="rounded bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground">
                Tipo vivienda
              </span>
              <span className="rounded bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground">
                Niños y mascotas
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs ring-1 ring-accent/30">
            <div>
              <div className="size-12 rounded-xl bg-accent/20 flex items-center justify-center text-amber-700 mb-6">
                <GitCompare className="size-6 text-amber-700" />
              </div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                Paso 02
              </span>
              <h3 className="font-heading text-xl font-bold text-foreground mt-1 mb-3">
                Razones, no porcentajes
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                El algoritmo analiza los perfiles y te muestra recomendaciones justificadas con oraciones concretas. Sabrás con exactitud por qué ese rescatado encaja en tu hogar.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex flex-col gap-1.5">
              <div className="rounded bg-[#FCEBC9] px-2.5 py-1 text-[11px] font-medium text-[#9A5D02] flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[#9A5D02]" />
                Tolera tus 6 horas a solas
              </div>
              <div className="rounded bg-[#FCEBC9] px-2.5 py-1 text-[11px] font-medium text-[#9A5D02] flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[#9A5D02]" />
                Sociable con gatos
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <CalendarCheck className="size-6 text-primary" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Paso 03
              </span>
              <h3 className="font-heading text-xl font-bold text-foreground mt-1 mb-3">
                Expediente y seguimiento
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Conectas con el albergue mediante chat directo, se genera la solicitud formal y se activan los recordatorios automáticos de control a los 30, 90 y 180 días.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Hitos de control:</span>
              <span className="font-mono text-[11px] text-primary font-semibold">30d · 90d · 180d</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
