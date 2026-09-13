"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = [
    {
      question: "¿Cuánto cuesta adoptar a través de Adoptanet?",
      answer:
        "Adoptanet es 100% gratuita tanto para adoptantes como para albergues y rescatistas independientes. Los únicos gastos asociados son los costos médicos directos del albergue si aplican (como vacunas o esterilización ya realizadas al costo de la posta o clínica veterinaria colaboradora).",
    },
    {
      question: "¿Qué requisitos necesito para postular a una adopción?",
      answer:
        "Ser mayor de edad, residir en el Perú, completar el cuestionario de vida real con datos verídicos (tipo de vivienda, miembros del hogar, rutina) y firmar digitalmente el compromiso de tenencia responsable y seguimiento.",
    },
    {
      question: "¿Puedo adoptar si vivo en departamento y trabajo fuera de casa?",
      answer:
        "Sí, totalmente. Adoptanet no descarta por vivir en departamento ni por trabajar 8 horas. Lo que hace el sistema es emparejarte exclusivamente con animales cuyo nivel de energía, tolerancia a la soledad y tamaño calzan armónicamente con ese estilo de vida.",
    },
    {
      question: "¿Qué sucede si la mascota no logra adaptarse a mi hogar?",
      answer:
        "El periodo de adaptación incluye comunicación directa con el rescatista para resolver inquietudes de comportamiento. Si por una causa de fuerza mayor la convivencia no es viable, el protocolo de Adoptanet estipula la reubicación coordinada con el albergue original, evitando en todo momento el abandono.",
    },
    {
      question: "¿Cómo funciona el seguimiento post-adopción?",
      answer:
        "Recibirás recordatorios automatizados a los 30, 90 y 180 días para subir una fotografía y responder 3 preguntas breves sobre la alimentación y salud del rescatado. Todo se hace desde tu perfil web en menos de dos minutos.",
    },
  ];

  return (
    <section id="faq" className="border-t border-border bg-background py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Todo lo que necesitas saber antes de dar el paso
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Claridad total para que adoptes con seguridad y confianza.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
          <Accordion defaultValue={["item-0"]} className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-border py-2 last:border-b-0"
              >
                <AccordionTrigger className="font-heading text-base font-bold text-foreground text-left hover:text-primary hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-1 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
