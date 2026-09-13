"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  HeartHandshake,
  ShieldCheck,
  CalendarDays,
  Inbox,
  FileSpreadsheet,
  BellRing,
  CheckCircle2,
} from "lucide-react";

export function DualTabsSection() {
  return (
    <section id="albergues" className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pensado tanto para la familia como para el albergue
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Diseñado para conectar ambas realidades con respeto, claridad y cero fricción burocrática.
          </p>
        </div>

        {/* Tabs Component */}
        <div className="mx-auto max-w-5xl">
          <Tabs defaultValue="adoptantes" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="h-11 rounded-xl bg-secondary p-1 border border-border">
                <TabsTrigger
                  value="adoptantes"
                  className="rounded-lg px-6 py-2 text-xs sm:text-sm font-semibold transition-all data-active:bg-primary data-active:text-white"
                >
                  Para Adoptantes
                </TabsTrigger>
                <TabsTrigger
                  value="albergues"
                  className="rounded-lg px-6 py-2 text-xs sm:text-sm font-semibold transition-all data-active:bg-primary data-active:text-white"
                >
                  Para Albergues y Rescatistas
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Adoptantes Content */}
            <TabsContent value="adoptantes" className="mt-2">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <HeartHandshake className="size-5" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      Sin juzgarte por tu rutina
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Si trabajas 8 horas fuera o vives en departamento pequeño, no te descartamos: te recomendamos al animal cuyo temperamento encaja naturalmente con ese ritmo.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-border/80 flex items-center gap-1.5 text-xs text-primary font-medium">
                    <CheckCircle2 className="size-3.5" /> Emparejamiento por estilo de vida
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <ShieldCheck className="size-5" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      Ficha médica verificada
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Conoce con total claridad el estado de vacunación, desparasitación, esterilización y cualquier tratamiento médico previo del rescatado antes de solicitarlo.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-border/80 flex items-center gap-1.5 text-xs text-primary font-medium">
                    <CheckCircle2 className="size-3.5" /> Total transparencia sanitaria
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <CalendarDays className="size-5" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      Apoyo durante la adaptación
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      La plataforma te acompaña en los primeros meses con recordatorios para el registro fotográfico y contacto directo con el rescatista si surgen dudas conductuales.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-border/80 flex items-center gap-1.5 text-xs text-primary font-medium">
                    <CheckCircle2 className="size-3.5" /> Seguimiento sin invasión
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Albergues Content */}
            <TabsContent value="albergues" className="mt-2">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="size-10 rounded-lg bg-[#F0A202]/15 flex items-center justify-center text-amber-700 mb-4">
                      <Inbox className="size-5" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      Filtrado previo automático
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Reduce el 70% del tiempo perdido en responder mensajes repetitivos. Solo recibes solicitudes estructuradas de adoptantes que cumplen los requisitos para esa mascota en específico.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-border/80 flex items-center gap-1.5 text-xs text-amber-800 font-medium">
                    <CheckCircle2 className="size-3.5 text-amber-700" /> Cero spam de WhatsApp
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="size-10 rounded-lg bg-[#F0A202]/15 flex items-center justify-center text-amber-700 mb-4">
                      <FileSpreadsheet className="size-5" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      Expediente digital del rescatado
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Centraliza fotos de alta resolución, historial de vacunas, estado de esterilización y notas de comportamiento en una sola ficha compartible.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-border/80 flex items-center gap-1.5 text-xs text-amber-800 font-medium">
                    <CheckCircle2 className="size-3.5 text-amber-700" /> Trazabilidad completa
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="size-10 rounded-lg bg-[#F0A202]/15 flex items-center justify-center text-amber-700 mb-4">
                      <BellRing className="size-5" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      Seguimiento automatizado
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      El sistema envía recordatorios al adoptante para subir evidencias fotográficas a los 30, 90 y 180 días. Tú solo revisas la alerta en tu panel sin perseguir a nadie.
                    </p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-border/80 flex items-center gap-1.5 text-xs text-amber-800 font-medium">
                    <CheckCircle2 className="size-3.5 text-amber-700" /> Control post-adopción real
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
