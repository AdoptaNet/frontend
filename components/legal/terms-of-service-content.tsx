"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Scale,
  ShieldAlert,
  HeartHandshake,
  PawPrint,
  Clock,
  ArrowLeft,
  ChevronRight,
  AlertTriangle,
  UserCheck,
  Building2,
  CalendarCheck,
  Gavel,
  Mail,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  { id: "aceptacion", title: "1. Aceptación y ámbito de aplicación" },
  { id: "naturaleza", title: "2. Naturaleza de Adoptanet y recomendación con IA" },
  { id: "prohibicion-comercio", title: "3. Prohibición estricta de comercio o venta" },
  { id: "ley-30407", title: "4. Marco legal de bienestar animal (Ley N° 30407)" },
  { id: "cuentas-google", title: "5. Cuentas de usuario y acceso con Google" },
  { id: "obligaciones-adoptante", title: "6. Obligaciones y deberes del adoptante" },
  { id: "obligaciones-albergues", title: "7. Obligaciones de albergues y rescatistas" },
  { id: "seguimiento", title: "8. Protocolo de seguimiento post-adopción" },
  { id: "propiedad-intelectual", title: "9. Propiedad intelectual y uso adecuado" },
  { id: "responsabilidad", title: "10. Limitación de responsabilidad" },
  { id: "sanciones", title: "11. Suspensión, bajas y denuncias" },
  { id: "jurisdiccion", title: "12. Ley aplicable y jurisdicción" },
  { id: "contacto", title: "13. Contacto y modificaciones" },
];

export function TermsOfServiceContent() {
  const [activeSection, setActiveSection] = React.useState<string>("aceptacion");

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full py-10 md:py-16">
      {/* Header section */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="size-3.5" />
            Inicio
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <span className="text-foreground font-medium">Legal</span>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <span className="text-foreground font-semibold">Condiciones del Servicio</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <Badge variant="reason" className="gap-1.5 py-1 px-3">
            <PawPrint className="size-3.5" />
            Tenencia Responsable · Ley N° 30407 (Perú)
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="size-3.5" />
            Última actualización: 15 de septiembre de 2026
          </span>
        </div>

        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Condiciones del Servicio
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-3xl">
          Bienvenido a <strong>Adoptanet</strong>. Estas Condiciones del Servicio rigen el acceso y uso de nuestra plataforma digital en el Perú. Al utilizar nuestro sitio, registrarte o ingresar mediante <strong>Google OAuth</strong>, asumes el compromiso ineludible de actuar con respeto absoluto hacia el bienestar animal y la normativa legal vigente.
        </p>

        {/* Warning Callout: Zero Commercialization */}
        <div className="mt-8 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <ShieldAlert className="size-5" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-foreground font-heading">
                Prohibición Total de Lucro o Venta de Animales
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Adoptanet es una plataforma de bienestar animal <strong>estrictamente sin fines de lucro</strong>. Queda terminantemente prohibida la compra, venta, renta o explotación comercial de animales de compañía. Cualquier intento de comercialización ilícita será causal de expulsión inmediata y denuncia penal bajo la <strong>Ley N° 30407</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sticky Sidebar + Content */}
      <div className="mx-auto mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Table of Contents - Desktop sticky */}
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <FileText className="size-4 text-primary" />
                <span className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                  Índice de términos
                </span>
              </div>
              <nav className="space-y-1">
                {SECTIONS.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollTo(section.id)}
                      className={`w-full text-left rounded-lg px-2.5 py-2 text-xs transition-colors cursor-pointer flex items-center justify-between ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <span className="truncate">{section.title}</span>
                      {isActive && <span className="size-1.5 rounded-full bg-primary shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-[11px] text-muted-foreground mb-3">
                  ¿Consultas sobre nuestros términos?
                </p>
                <a
                  href="mailto:legal@adoptanet.pe"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <Mail className="size-3.5" />
                  legal@adoptanet.pe
                </a>
              </div>
            </div>
          </aside>

          {/* Terms Body */}
          <main className="lg:col-span-8 space-y-12 text-sm leading-relaxed text-foreground/90">
            {/* 1. Aceptación */}
            <section id="aceptacion" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  1
                </span>
                Aceptación y ámbito de aplicación
              </h2>
              <p>
                Al acceder, navegar o utilizar cualquier funcionalidad de <strong>Adoptanet</strong> (incluyendo el registro de cuenta, postulación a adopciones, publicación de fichas de animales o inicio de sesión mediante credenciales tradicionales o de <strong>Google OAuth</strong>), manifiestas haber leído, entendido y aceptado vincularte legalmente a estos Términos y Condiciones.
              </p>
              <p className="text-xs text-muted-foreground">
                Si no estás de acuerdo con cualquiera de las cláusulas aquí estipuladas, deberás abstenerte de hacer uso de la plataforma.
              </p>
            </section>

            {/* 2. Naturaleza de Adoptanet */}
            <section id="naturaleza" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  2
                </span>
                Naturaleza de la plataforma y sistema de recomendación
              </h2>
              <p>
                Adoptanet es una solución de base tecnológica cuyo fin es conectar a personas con voluntad de adopción responsable con albergues y rescatistas independientes en el territorio peruano.
              </p>
              <div className="rounded-xl border border-border bg-card p-4 text-xs space-y-2">
                <p>
                  <strong>Enfoque en Inteligencia Artificial Explicable:</strong> Nuestro sistema de recomendación evalúa factores objetivos del estilo de vida del adoptante (disponibilidad horaria, espacio en vivienda, experiencia previa) y las necesidades específicas del animal (nivel de energía, sociabilidad, tolerancia con otros animales) con el único objetivo de fomentar emparejamientos duraderos y prevenir el abandono.
                </p>
                <p>
                  <strong>Carácter orientativo de las sugerencias:</strong> El algoritmo proporciona razones y sugerencias de compatibilidad, pero la decisión final de otorgar en adopción a un animal corresponde exclusivamente al albergue o rescatista custodio tras su evaluación personalizada.
                </p>
              </div>
            </section>

            {/* 3. Prohibición estricta de comercio */}
            <section id="prohibicion-comercio" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  3
                </span>
                Prohibición estricta de venta, comercio o lucro con animales
              </h2>
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-2">
                <p className="font-semibold text-destructive text-sm flex items-center gap-2">
                  <AlertTriangle className="size-4" />
                  Tolerancia Cero con la Comercialización
                </p>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  Está terminantemente prohibido utilizar Adoptanet para la venta, permuta, subasta, compra o reproducción con fines lucrativos de animales domésticos.
                </p>
                <p className="text-xs text-muted-foreground">
                  <strong>Reintegros médicos excepcionales:</strong> Los albergues o rescatistas únicamente podrán solicitar de mutuo acuerdo con el adoptante la cobertura de gastos veterinarios esenciales previos debidamente sustentados (vacunas antirrábica/quíntuple, desparasitación certificada o costo de esterilización clínica). Dichos reintegros nunca podrán constituir una ganancia comercial ni condicionar de forma extorsiva la entrega.
                </p>
              </div>
            </section>

            {/* 4. Ley 30407 */}
            <section id="ley-30407" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  4
                </span>
                Marco legal de bienestar animal en el Perú (Ley N° 30407)
              </h2>
              <p>
                Todo usuario que formalice una adopción a través de Adoptanet asume el deber jurídico y moral de <strong>Tenencia Responsable</strong> tipificado en la <strong>Ley N° 30407 (Ley de Protección y Bienestar Animal del Perú)</strong>, comprometiéndose expresamente a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-xs text-muted-foreground pl-1">
                <li>Suministrar alimentación adecuada, agua limpia permanente, abrigo salubre y paseos compatibles con su condición física y psicológica.</li>
                <li><strong>Prohibición absoluta de maltrato o abandono:</strong> Queda terminantemente prohibido el abandono en la vía pública, agresiones físicas, encadenamiento permanente, confinamiento en azoteas sin techo adecuado o mutilaciones estéticas.</li>
                <li><strong>Obligación de esterilización:</strong> Si el animal no fue esterilizado previamente por razones de corta edad al momento de la entrega, el adoptante se obliga a esterilizarlo oportunamente en un plazo no mayor al acordado con el albergue.</li>
                <li><strong>Atención veterinaria oportuna:</strong> Cumplir rigurosamente con el calendario anual de vacunación y desparasitación, así como acudir a asistencia médica calificada ante signos de enfermedad.</li>
              </ul>
            </section>

            {/* 5. Cuentas Google */}
            <section id="cuentas-google" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  5
                </span>
                Cuentas de usuario y acceso mediante Google OAuth
              </h2>
              <p>
                Para postular a una adopción o registrar animales, es necesario crear una cuenta mediante correo electrónico y contraseña o a través del inicio de sesión federado de <strong>Google OAuth</strong>.
              </p>
              <div className="rounded-xl border border-border bg-card p-4 text-xs space-y-2">
                <p>
                  <strong>Autenticidad de los datos:</strong> Al iniciar sesión con Google, el usuario certifica que la cuenta le pertenece legítimamente y que los datos provistos reflejan su identidad real.
                </p>
                <p>
                  <strong>Seguridad de credenciales:</strong> Cada usuario es custodio único de su sesión y debe notificar inmediatamente a Adoptanet ante cualquier acceso indebido o sospechoso.
                </p>
                <p>
                  <strong>Tratamiento de datos de Google:</strong> El manejo de los datos provistos mediante Google se rige de manera obligatoria por nuestra{" "}
                  <Link href="/privacy" className="text-primary font-semibold underline">
                    Política de Privacidad
                  </Link>{" "}
                  y por la Google API Services User Data Policy.
                </p>
              </div>
            </section>

            {/* 6. Obligaciones del adoptante */}
            <section id="obligaciones-adoptante" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  6
                </span>
                Obligaciones y deberes del adoptante
              </h2>
              <p>El adoptante se compromete a:</p>
              <ul className="list-disc list-inside space-y-2 text-xs text-muted-foreground pl-1">
                <li>Responder el Cuestionario de Compatibilidad con total honestidad sobre las condiciones de su vivienda y estilo de vida.</li>
                <li>Facilitar las coordinaciones razonables de verificación domiciliaria o entrevista que requiera el albergue.</li>
                <li>Firmar el acta o contrato de adopción formal que suscribe con el albergue/rescatista custodio.</li>
                <li><strong>Prohibición de cesión inconsulta a terceros:</strong> En caso fortuito de que el adoptante no pueda continuar a cargo del animal, deberá devolverlo de inmediato al albergue de origen, quedando prohibida su reubicación o entrega sin autorización previa.</li>
              </ul>
            </section>

            {/* 7. Obligaciones de albergues */}
            <section id="obligaciones-albergues" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  7
                </span>
                Obligaciones de albergues y rescatistas
              </h2>
              <p>Las organizaciones y personas que publican animales en custodia garantizan que:</p>
              <ul className="list-disc list-inside space-y-2 text-xs text-muted-foreground pl-1">
                <li>Ostentan la posesión o custodia legal del animal rescatado.</li>
                <li>La información médica (estado de esterilización, vacunas, enfermedades crónicas o conductuales) es veraz, oportuna y no oculta patologías preexistentes.</li>
                <li>Tratan los datos de los solicitantes con estricta reserva de conformidad con la <strong>Ley N° 29733</strong>, utilizándolos única y exclusivamente para evaluar la postulación de adopción.</li>
              </ul>
            </section>

            {/* 8. Seguimiento post-adopción */}
            <section id="seguimiento" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  8
                </span>
                Protocolo obligatorio de seguimiento post-adopción
              </h2>
              <p>
                Con el propósito de asegurar el éxito de la integración del rescatado y prevenir re-abandonos, Adoptanet integra un sistema de seguimiento en tres hitos cronológicos:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3.5 space-y-1 text-center">
                  <span className="font-bold text-primary block text-sm">Hito 1 · 30 días</span>
                  <p className="text-muted-foreground">Evaluación de adaptación inicial, alimentación y dinámica en el hogar.</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3.5 space-y-1 text-center">
                  <span className="font-bold text-primary block text-sm">Hito 2 · 90 días</span>
                  <p className="text-muted-foreground">Comprobación de calendario veterinario, estado físico y convivencia.</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3.5 space-y-1 text-center">
                  <span className="font-bold text-primary block text-sm">Hito 3 · 180 días</span>
                  <p className="text-muted-foreground">Cierre de seguimiento formal, verificación de esterilización y bienestar consolidado.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                El adoptante asume la obligación de responder los reportes fotográficos y descriptivos solicitados en cada periodo. El incumplimiento reiterado podrá derivar en visita de inspección del albergue y rescisión del acuerdo de adopción.
              </p>
            </section>

            {/* 9. Propiedad intelectual */}
            <section id="propiedad-intelectual" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  9
                </span>
                Propiedad intelectual y uso aceptable
              </h2>
              <p>
                Todo el código fuente, logotipos, marcas, diseño de interfaz, modelos de recomendación y contenidos de Adoptanet están protegidos por las leyes de propiedad intelectual en el Perú y tratados internacionales. Se prohíbe terminantemente:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-muted-foreground pl-1">
                <li>El uso de bots, scrapers o sistemas automatizados de extracción masiva de datos.</li>
                <li>Intentar vulnerar la seguridad, autenticación o disponibilidad de los servicios.</li>
                <li>Publicar fotografías o información de animales sin ostentar los derechos o custodia correspondientes.</li>
              </ul>
            </section>

            {/* 10. Limitación de responsabilidad */}
            <section id="responsabilidad" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  10
                </span>
                Limitación de responsabilidad
              </h2>
              <p>
                Adoptanet actúa como plataforma tecnológica intermediaria y facilitadora de recomendaciones. En tal sentido:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-muted-foreground pl-1">
                <li>Adoptanet no asume la propiedad jurídica ni la responsabilidad médica directa sobre los animales albergados por terceros.</li>
                <li>Adoptanet no se responsabiliza por daños o perjuicios directos o indirectos derivados de conductas de los animales entregados o de los acuerdos privados suscritos entre adoptantes y albergues fuera de la plataforma.</li>
              </ul>
            </section>

            {/* 11. Sanciones y denuncias */}
            <section id="sanciones" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  11
                </span>
                Suspensión, bajas y denuncias penales
              </h2>
              <p>
                Adoptanet se reserva el derecho de suspender o cancelar de forma inmediata y sin previo aviso la cuenta de cualquier usuario que incurra en:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-muted-foreground pl-1">
                <li>Indicios de maltrato, crueldad o abandono de animales.</li>
                <li>Intentos de comercialización o cobros indebidos con fines lucrativos.</li>
                <li>Suplantación de identidad o falsedad en las declaraciones de adopción.</li>
              </ul>
              <p className="text-xs text-destructive font-medium bg-destructive/5 p-3 rounded-lg border border-destructive/20">
                En concordancia con el artículo 206-A del Código Penal Peruano (Ley N° 30407), los actos de crueldad y abandono de animales domésticos constituyen delito sancionado con pena privativa de la libertad. Adoptanet colaborará activamente con la Policía Nacional del Perú (PNP) y el Ministerio Público en cualquier investigación correspondiente.
              </p>
            </section>

            {/* 12. Jurisdicción */}
            <section id="jurisdiccion" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  12
                </span>
                Ley aplicable y jurisdicción
              </h2>
              <p>
                Estos Términos y Condiciones se rigen e interpretan conforme a las leyes de la <strong>República del Perú</strong>.
              </p>
              <p className="text-xs text-muted-foreground">
                Cualquier discrepancia o controversia derivada de la interpretación o ejecución de las presentes condiciones será sometida a la competencia de los Juzgados y Tribunales del <strong>Distrito Judicial de Lima, Perú</strong>, con renuncia expresa a cualquier otro fuero que pudiera corresponder.
              </p>
            </section>

            {/* 13. Contacto */}
            <section id="contacto" className="scroll-mt-24 space-y-4 pt-4 border-t border-border">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  13
                </span>
                Contacto legal y modificaciones
              </h2>
              <p>
                Adoptanet podrá actualizar periódicamente estos términos para adecuarlos a nuevas funcionalidades técnicas o actualizaciones legislativas. Los cambios entrarán en vigencia desde su publicación en este sitio web.
              </p>
              <div className="rounded-2xl border border-border bg-secondary/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-heading font-bold text-foreground text-sm">
                    Asesoría Legal y Cumplimiento Normativo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Para consultas legales o reportar irregularidades en adopciones.
                  </p>
                </div>
                <a href="mailto:legal@adoptanet.pe">
                  <Button variant="default" size="sm" className="gap-2">
                    <Mail className="size-4" />
                    legal@adoptanet.pe
                  </Button>
                </a>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
