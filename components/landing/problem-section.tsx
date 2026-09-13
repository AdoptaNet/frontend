import * as React from "react";
import { AlertTriangle } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="relative border-y border-border bg-card/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl">
          <span className="text-xs font-semibold text-destructive uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <AlertTriangle className="size-4 text-destructive" />
            La realidad de la adopción en el Perú
          </span>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Adoptar por redes sociales está condenado al fracaso.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Hoy la adopción se gestiona entre fotos de WhatsApp y muros de Facebook. Esa falta de criterio genera tres problemas críticos:
          </p>
        </div>

        {/* Asymmetric Numbered List */}
        <div className="mt-14 flex flex-col divide-y divide-border">
          {/* Item 01 */}
          <div className="grid grid-cols-1 gap-6 py-10 md:grid-cols-[140px_1fr_1.3fr] md:gap-10 items-start">
            <div className="font-heading text-5xl font-extrabold text-primary/20 md:text-6xl">
              01
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                El caos de WhatsApp y la información fragmentada
              </h3>
              <p className="mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Sobrecarga operativa
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Los albergues pierden horas respondiendo los mismos mensajes una y otra vez. Las fotos se pierden en chats, no hay fichas clínicas consolidadas y el rescatista evalúa por intuición rápida ante la desesperación por dar en adopción.
            </p>
          </div>

          {/* Item 02 */}
          <div className="grid grid-cols-1 gap-6 py-10 md:grid-cols-[140px_1fr_1.3fr] md:gap-10 items-start">
            <div className="font-heading text-5xl font-extrabold text-primary/20 md:text-6xl">
              02
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                La incompatibilidad invisible entre adoptante y mascota
              </h3>
              <p className="mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                El sesgo de la foto
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Adoptar por una foto tierna sin conocer la energía del animal, su tolerancia a la soledad o su relación con otros perros conduce al choque de expectativas. Un perro de alta energía en un departamento de 50 m² termina generando estrés familiar.
            </p>
          </div>

          {/* Item 03 */}
          <div className="grid grid-cols-1 gap-6 py-10 md:grid-cols-[140px_1fr_1.3fr] md:gap-10 items-start">
            <div className="font-heading text-5xl font-extrabold text-destructive/30 md:text-6xl">
              03
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                El abandono silencioso y la ausencia de seguimiento
              </h3>
              <p className="mt-2 text-xs font-semibold text-destructive uppercase tracking-wider">
                64% de devoluciones
              </p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La mayoría de devoluciones ocurren dentro de los primeros 90 días por motivos que eran 100% prevenibles antes de entregar al animal. Al no existir un expediente formal ni alertas de control, muchos animales terminan nuevamente en la calle.
            </p>
          </div>
        </div>

        {/* Rescuer Testimonial Quote */}
        <div className="mt-12 rounded-2xl border border-border bg-secondary/60 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="size-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-bold text-lg">
              ML
            </div>
            <div className="flex-1">
              <blockquote className="text-sm sm:text-base font-medium text-foreground italic leading-snug">
                «Pasamos más de 12 horas semanales respondiendo mensajes de personas que se enamoran de una foto pero que pasan 10 horas fuera de casa. Necesitábamos un sistema que haga el filtro difícil antes de escribirnos.»
              </blockquote>
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">María Luisa C.</span> · Rescatista independiente, Chorrillos
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
