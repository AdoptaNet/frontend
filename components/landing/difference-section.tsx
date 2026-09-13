import * as React from "react";
import { XCircle, CheckCircle2 } from "lucide-react";

export function DifferenceSection() {
  return (
    <section id="diferencia" className="border-t border-border bg-secondary/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explicar, no puntuar.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Las aplicaciones convencionales presumen algoritmos con números opacos. Adoptanet rechaza los porcentajes vacíos por una razón ética y práctica:
          </p>
        </div>

        {/* Side-by-side comparison matrix */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Traditional Bad Approach */}
          <div className="rounded-2xl border border-destructive/20 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-destructive uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="size-4 text-destructive" />
                  El enfoque de porcentaje abstracto
                </span>
                <span className="text-xs text-muted-foreground font-mono">Tradicional</span>
              </div>

              {/* Visual Demo of Generic Score */}
              <div className="my-6 rounded-xl bg-destructive/5 p-4 border border-destructive/15 flex items-center gap-4">
                <div className="size-16 rounded-full border-4 border-destructive/40 flex items-center justify-center font-heading font-extrabold text-xl text-destructive">
                  94%
                </div>
                <div>
                  <div className="font-heading font-bold text-foreground">
                    &ldquo;Compatibilidad estimada&rdquo;
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    ¿Qué significa ese 94%? Nadie lo sabe.
                  </div>
                </div>
              </div>

              <h4 className="font-heading text-lg font-bold text-foreground mb-2">
                ¿Por qué falla en la vida real?
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Un porcentaje abstracto no te avisa si el perro ladra cuando se queda solo, si salta muros de dos metros o si tiene fobia a los niños. Un 94% puede esconder un factor crítico que termine en devolución dolorosa.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/80 text-xs text-muted-foreground italic">
              Sin justificación, no hay decisión responsable ni auditoría para el rescatista.
            </div>
          </div>

          {/* Adoptanet's Genuine Explainable Approach */}
          <div className="rounded-2xl border-2 border-primary/40 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-primary" />
                  El enfoque de Adoptanet
                </span>
                <span className="text-xs text-primary font-semibold">Algoritmo propio</span>
              </div>

              {/* Visual Demo of Explainable Reasons */}
              <div className="my-6 rounded-xl bg-[#EDF5F2] p-4 border border-[#BFDCD4] flex flex-col gap-2">
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">
                  Razones concretas de convivencia:
                </div>
                <div className="rounded-md bg-[#FCEBC9] px-2.5 py-1.5 text-xs text-[#9A5D02] border border-[#F0A202]/30 font-medium flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#9A5D02]" />
                  <span>Tolera hasta 6 horas a solas sin ansiedad por separación</span>
                </div>
                <div className="rounded-md bg-[#FCEBC9] px-2.5 py-1.5 text-xs text-[#9A5D02] border border-[#F0A202]/30 font-medium flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#9A5D02]" />
                  <span>Apto para departamento sin patio: nivel de energía moderado</span>
                </div>
                <div className="rounded-md bg-[#FCEBC9] px-2.5 py-1.5 text-xs text-[#9A5D02] border border-[#F0A202]/30 font-medium flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#9A5D02]" />
                  <span>Evaluación conductual positiva con otros perros</span>
                </div>
              </div>

              <h4 className="font-heading text-lg font-bold text-foreground mb-2">
                Trazabilidad transparente
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cada razón corresponde al cruce exacto entre las variables de tu rutina diaria y la ficha conductual registrada por el albergue. Ambas partes entienden los motivos y asumen compromisos informados.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/80 text-xs text-primary font-medium">
              ✓ Criterio auditable antes de la firma, durante la entrega y en el seguimiento.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
