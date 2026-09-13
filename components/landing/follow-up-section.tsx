import * as React from "react";
import { Camera, Stethoscope, Award } from "lucide-react";

export function FollowUpSection() {
  const milestones = [
    {
      day: "Día 30",
      title: "Adaptación y rutina",
      description:
        "Primer reporte fotográfico. Se evalúa el acoplamiento a las horas a solas, la alimentación y el descanso sin signos de estrés o ansiedad.",
      icon: Camera,
      badge: "Hito 1",
    },
    {
      day: "Día 90",
      title: "Salud y consolidación",
      description:
        "Verificación de vacunas al día, peso saludable y socialización en paseos. El albergue revisa el avance y atiende consultas de manejo.",
      icon: Stethoscope,
      badge: "Hito 2",
    },
    {
      day: "Día 180",
      title: "Hogar permanente",
      description:
        "Evaluación de cierre de expediente. Confirmación de bienestar integral y consolidación definitiva de la mascota como miembro de la familia.",
      icon: Award,
      badge: "Hito 3",
    },
  ];

  return (
    <section className="border-t border-border bg-card py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            La adopción no termina cuando se cierra la puerta.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            El 64% de las devoluciones ocurren por falta de acompañamiento en los primeros meses. Adoptanet automatiza el seguimiento para proteger al rescatado sin sobrecargar al albergue.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 relative">
          {milestones.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.day}
                className="relative rounded-2xl border border-border bg-background p-6 sm:p-8 flex flex-col justify-between shadow-xs transition-transform duration-200 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="size-6" />
                    </div>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-primary">
                      {m.day}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                    {m.badge}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-foreground mt-1 mb-3">
                    {m.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Evidencia fotográfica</span>
                  <span className="font-semibold text-primary">Registro digital</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
