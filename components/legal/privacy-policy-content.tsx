"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  ExternalLink,
  Mail,
  Scale,
  Clock,
  ArrowLeft,
  ChevronRight,
  Database,
  EyeOff,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  { id: "responsable", title: "1. Responsable del tratamiento" },
  { id: "datos-recopilados", title: "2. Información que recopilamos" },
  { id: "google-oauth", title: "3. Uso de datos de Google OAuth (Limited Use)" },
  { id: "finalidades", title: "4. Finalidad del tratamiento" },
  { id: "recomendacion", title: "5. Sistema de recomendación explicable" },
  { id: "comparticion", title: "6. Destinatarios y transferencia de datos" },
  { id: "seguridad", title: "7. Seguridad y almacenamiento" },
  { id: "derechos-arco", title: "8. Derechos del usuario y eliminación" },
  { id: "revocacion-google", title: "9. Cómo revocar el acceso de Google" },
  { id: "cookies", title: "10. Almacenamiento local y cookies" },
  { id: "contacto", title: "11. Canales de contacto y vigencia" },
];

export function PrivacyPolicyContent() {
  const [activeSection, setActiveSection] = React.useState<string>("responsable");

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
          <span className="text-foreground font-semibold">Política de Privacidad</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <Badge variant="disponible" className="gap-1.5 py-1 px-3">
            <ShieldCheck className="size-3.5" />
            Cumplimiento Google OAuth & Ley 29733 (Perú)
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="size-3.5" />
            Última actualización: 15 de septiembre de 2026
          </span>
        </div>

        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Política de Privacidad
        </h1>
        <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-3xl">
          En <strong>Adoptanet</strong> valoramos y respetamos tu privacidad. Este documento detalla con total transparencia cómo recopilamos, utilizamos, protegemos y administramos tus datos personales cuando accedes a nuestra plataforma, incluyendo el uso del servicio de inicio de sesión de <strong>Google OAuth</strong> y la aplicación de la <strong>Ley N° 29733 (Ley de Protección de Datos Personales en el Perú)</strong>.
        </p>

        {/* Highlight Card: Google OAuth Compliance */}
        <div className="mt-8 rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Lock className="size-5" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-foreground font-heading">
                Compromiso con la Política de Datos de Usuario de Google
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                El uso que hace Adoptanet de la información recibida a través de las APIs de Google cumple rigurosamente con la{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary underline underline-offset-2 hover:opacity-80 inline-flex items-center gap-0.5"
                >
                  Política de Datos de Usuario de los Servicios de las API de Google
                  <ExternalLink className="size-3 ml-0.5 inline" />
                </a>
                , incluidos los estrictos requisitos de <strong>Uso Limitado (Limited Use Requirements)</strong>. Nunca venderemos tus datos de Google ni los emplearemos para fines publicitarios.
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
                  Índice de contenido
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
                  ¿Preguntas o solicitudes de revocación?
                </p>
                <a
                  href="mailto:privacidad@adoptanet.pe"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <Mail className="size-3.5" />
                  privacidad@adoptanet.pe
                </a>
              </div>
            </div>
          </aside>

          {/* Policy Body */}
          <main className="lg:col-span-8 space-y-12 text-sm leading-relaxed text-foreground/90">
            {/* 1. Responsable */}
            <section id="responsable" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  1
                </span>
                Responsable del tratamiento de tus datos
              </h2>
              <p>
                El responsable del tratamiento de los datos personales recopilados a través de esta plataforma es el proyecto <strong>Adoptanet</strong>, una iniciativa académica y tecnológica desarrollada en Lima, Perú, cuyo fin exclusivo es optimizar la adopción ética, informada y responsable de animales de compañía en situación de vulnerabilidad o rescate.
              </p>
              <div className="rounded-xl border border-border bg-secondary/30 p-4 text-xs space-y-1.5">
                <p><strong>Plataforma:</strong> Adoptanet (adopción responsable con IA explicable)</p>
                <p><strong>Domicilio legal:</strong> Lima, Perú</p>
                <p><strong>Correo electrónico de privacidad y datos:</strong> <a href="mailto:privacidad@adoptanet.pe" className="text-primary underline">privacidad@adoptanet.pe</a></p>
                <p><strong>Marco normativo aplicable:</strong> Ley N° 29733 (Ley de Protección de Datos Personales de la República del Perú) y su Reglamento (Decreto Supremo N° 003-2013-JUS).</p>
              </div>
            </section>

            {/* 2. Información que recopilamos */}
            <section id="datos-recopilados" className="scroll-mt-24 space-y-4">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  2
                </span>
                Información que recopilamos
              </h2>
              <p>
                Recopilamos únicamente los datos necesarios para brindar una experiencia de adopción segura y confiable para los animales y los usuarios:
              </p>

              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                    <UserCheck className="size-4 text-primary" />
                    a) Datos recibidos mediante inicio de sesión con Google (Google OAuth)
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Cuando eliges registrarte o iniciar sesión utilizando tu cuenta de Google, solicitamos únicamente los scopes estándar esenciales (<code>openid</code>, <code>profile</code>, <code>email</code>). A través de ellos recibimos:
                  </p>
                  <ul className="mt-2 list-disc list-inside text-xs text-muted-foreground space-y-1 pl-1">
                    <li>Nombre y apellidos registrados en Google.</li>
                    <li>Dirección de correo electrónico asociada y verificada.</li>
                    <li>URL de tu fotografía de perfil (avatar).</li>
                    <li>Identificador numérico único de usuario de Google (Google User ID).</li>
                  </ul>
                  <p className="mt-2 text-[11px] font-medium text-foreground bg-secondary/50 p-2 rounded-md">
                    Nota de seguridad: Nunca solicitamos, almacenamos ni tenemos acceso a tu contraseña de Google, lista de contactos, correos de Gmail, archivos de Drive ni ninguna otra información privada de tu cuenta Google.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                    <Sparkles className="size-4 text-primary" />
                    b) Datos de estilo de vida del Cuestionario de Compatibilidad (Adoptantes)
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Para evaluar compatibilidad con el animal rescatado, solicitamos información sobre:
                  </p>
                  <ul className="mt-2 list-disc list-inside text-xs text-muted-foreground space-y-1 pl-1">
                    <li>Tipo de vivienda (casa, departamento) y tenencia de patio/jardín cerrado.</li>
                    <li>Disponibilidad de tiempo y horas diarias que el animal permanecerá solo.</li>
                    <li>Composición del hogar (presencia de niños, adultos mayores u otros animales).</li>
                    <li>Experiencia previa en tenencia de animales y nivel de actividad física deseado.</li>
                    <li>Ubicación geográfica aproximada (departamento, provincia, distrito en Perú).</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
                  <h3 className="font-semibold text-foreground flex items-center gap-2 text-sm">
                    <Database className="size-4 text-primary" />
                    c) Datos de Albergues y Rescatistas
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Nombre institucional o de rescatista independiente, datos de contacto para coordinaciones, ubicación del refugio y fichas técnicas de los animales en custodia (historial médico, vacunas, esterilización y temperamento).
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Google OAuth & Limited Use */}
            <section id="google-oauth" className="scroll-mt-24 space-y-4">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  3
                </span>
                Uso de datos de Google OAuth y Requisitos de Uso Limitado
              </h2>
              <p>
                Adoptanet cumple de manera irrevocable con la <strong>Google API Services User Data Policy</strong>. Específicamente declaramos:
              </p>

              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-3">
                <div className="flex items-center gap-2 font-heading font-bold text-foreground text-sm">
                  <ShieldCheck className="size-4.5 text-primary" />
                  Declaración de Requisitos de Uso Limitado (Limited Use Requirements)
                </div>
                <blockquote className="text-xs text-foreground/90 italic border-l-2 border-primary pl-3 py-1">
                  &quot;El uso y la transferencia por parte de Adoptanet a cualquier otra aplicación de la información recibida a través de las API de Google se apegará a la <strong>Google API Services User Data Policy</strong>, incluidos los requisitos de Uso Limitado (Limited Use requirements).&quot;
                </blockquote>
                <ul className="text-xs space-y-2 text-muted-foreground pt-1">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">✓</span>
                    <span><strong>Prohibición total de venta de datos:</strong> Adoptanet nunca transferirá, venderá, licenciará ni cederá datos obtenidos a través de Google a intermediarios de datos (data brokers), centrales de información ni terceros.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">✓</span>
                    <span><strong>Prohibición de uso publicitario:</strong> Los datos de Google nunca se usan para fines comerciales, creación de perfiles publicitarios, remarketing ni anuncios de terceros.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">✓</span>
                    <span><strong>Acceso humano restringido:</strong> Ningún desarrollador o administrador humano accede a tus datos personales de Google a menos que: (1) hayas dado tu consentimiento previo y explícito para resolver un incidente técnico específico, (2) sea indispensable por motivos de ciberseguridad o prevención de fraude comprobado, o (3) se reciba un mandato judicial formal de las autoridades peruanas competentes.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 4. Finalidades del tratamiento */}
            <section id="finalidades" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  4
                </span>
                Finalidad del tratamiento de tus datos
              </h2>
              <p>Tus datos son tratados exclusivamente para los siguientes propósitos legítimos:</p>
              <ul className="list-disc list-inside space-y-2 text-xs text-muted-foreground pl-1">
                <li><strong>Autenticación y perfil:</strong> Identificar de forma unívoca y segura tu cuenta de usuario en Adoptanet.</li>
                <li><strong>Intermediación de adopciones:</strong> Conectar a los solicitantes con los albergues correspondientes para el trámite y evaluación de la solicitud.</li>
                <li><strong>Seguimiento post-adopción:</strong> Gestionar los reportes obligatorios programados a los 30, 90 y 180 días posteriores a la adopción para comprobar la salud y el bienestar del animal, conforme a la <strong>Ley N° 30407 (Ley de Protección y Bienestar Animal del Perú)</strong>.</li>
                <li><strong>Comunicaciones operativas:</strong> Enviarte notificaciones sobre el estado de tu postulación, respuestas del albergue o recordatorios de seguimiento.</li>
              </ul>
            </section>

            {/* 5. Sistema de recomendación */}
            <section id="recomendacion" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  5
                </span>
                Sistema de recomendación híbrido y explicabilidad
              </h2>
              <p>
                Adoptanet emplea un modelo de Inteligencia Artificial híbrido diseñado bajo principios éticos:
              </p>
              <div className="rounded-xl border border-border bg-card p-4 text-xs space-y-2">
                <p>
                  <strong>Explicabilidad en vez de puntuación opaca:</strong> La plataforma nunca muestra porcentajes abstractos ni incompatibilidades arbitrarias. En su lugar, el sistema expone <em>razones concretas y auditables</em> (por ejemplo: &quot;Compatible con departamentos pequeños&quot;, &quot;Se lleva bien con otros felinos&quot;, &quot;Requiere paseos de baja intensidad&quot;).
                </p>
                <p>
                  <strong>Sin discriminación algorítmica:</strong> Las recomendaciones se centran en las necesidades etológicas y de bienestar del animal, sin evaluar variables de nivel socioeconómico ni emitir juicios de valor sobre el adoptante.
                </p>
              </div>
            </section>

            {/* 6. Destinatarios y transferencia */}
            <section id="comparticion" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  6
                </span>
                Destinatarios y transferencia de datos
              </h2>
              <p>
                Adoptanet <strong>no comparte tus datos con entidades comerciales</strong>. La transferencia de datos se restringe estrictamente a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-xs text-muted-foreground pl-1">
                <li><strong>El albergue o rescatista responsable:</strong> Cuando envías formalmente una solicitud de adopción, el albergue recibe tu nombre, datos de contacto y respuestas del cuestionario de compatibilidad para evaluar y coordinar la entrega responsable del animal.</li>
                <li><strong>Proveedores de infraestructura tecnológica confiable:</strong> Servicios de alojamiento en la nube y bases de datos seguras bajo estándares internacionales de encriptación (SOC 2, ISO 27001).</li>
                <li><strong>Autoridades públicas:</strong> Únicamente ante mandato judicial expreso o en denuncias formales por actos tipificados de maltrato o abandono animal según la Ley N° 30407.</li>
              </ul>
            </section>

            {/* 7. Seguridad y almacenamiento */}
            <section id="seguridad" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  7
                </span>
                Seguridad y almacenamiento
              </h2>
              <p>
                Implementamos rigurosas medidas técnicas, organizativas y legales para proteger tus datos contra acceso no autorizado, pérdida, alteración o divulgación:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-secondary/30 p-3.5 space-y-1">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Lock className="size-3.5 text-primary" />
                    Cifrado en tránsito y reposo
                  </span>
                  <p className="text-muted-foreground">
                    Toda la comunicación web se realiza bajo HTTPS con certificados TLS vigentes. Contraseñas protegidas mediante algoritmos de hash robustos (bcrypt).
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-3.5 space-y-1">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <EyeOff className="size-3.5 text-primary" />
                    Aislamiento de sesiones
                  </span>
                  <p className="text-muted-foreground">
                    Autenticación mediante tokens JWT firmados criptográficamente con tiempos de vida acotados y rotación segura.
                  </p>
                </div>
              </div>
            </section>

            {/* 8. Derechos ARCO */}
            <section id="derechos-arco" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  8
                </span>
                Derechos del usuario (ARCO) y eliminación de cuenta
              </h2>
              <p>
                De acuerdo con la <strong>Ley N° 29733</strong>, tienes pleno derecho a ejercer en cualquier momento tus derechos de:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="rounded-lg border border-border bg-card p-3 font-medium">
                  <span className="block font-bold text-primary text-sm mb-0.5">Acceso</span>
                  Conocer qué datos conservamos sobre ti.
                </div>
                <div className="rounded-lg border border-border bg-card p-3 font-medium">
                  <span className="block font-bold text-primary text-sm mb-0.5">Rectificación</span>
                  Corregir información inexacta o incompleta.
                </div>
                <div className="rounded-lg border border-border bg-card p-3 font-medium">
                  <span className="block font-bold text-primary text-sm mb-0.5">Cancelación</span>
                  Solicitar la eliminación total de tus datos.
                </div>
                <div className="rounded-lg border border-border bg-card p-3 font-medium">
                  <span className="block font-bold text-primary text-sm mb-0.5">Oposición</span>
                  Oponerte al tratamiento en supuestos específicos.
                </div>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Para solicitar la eliminación definitiva de tu cuenta y de toda tu información personal registrada, envía una solicitud con el asunto <em>&quot;Eliminación de cuenta y datos&quot;</em> a <a href="mailto:privacidad@adoptanet.pe" className="text-primary font-medium underline">privacidad@adoptanet.pe</a> desde el correo electrónico con el que te registraste. La eliminación se efectuará en un plazo máximo de <strong>cinco (5) días hábiles</strong>.
              </p>
            </section>

            {/* 9. Cómo revocar acceso Google */}
            <section id="revocacion-google" className="scroll-mt-24 space-y-4">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  9
                </span>
                Cómo revocar los permisos de Google OAuth inmediatamente
              </h2>
              <p>
                Puedes desvincular Adoptanet de tu cuenta de Google de forma inmediata y autónoma sin necesidad de intermediarios:
              </p>
              <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-xs">
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Ingresa al panel oficial de permisos de tu cuenta de Google en: <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">https://myaccount.google.com/permissions</a>.</li>
                  <li>Localiza la aplicación <strong>&quot;Adoptanet&quot;</strong> en la lista de aplicaciones con acceso a tu cuenta.</li>
                  <li>Haz clic en ella y selecciona <strong>&quot;Quitar acceso&quot;</strong> o <strong>&quot;Eliminar todas las conexiones&quot;</strong>.</li>
                </ol>
                <div className="pt-2">
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2 text-xs">
                      Gestionar permisos en Google
                      <ExternalLink className="size-3.5" />
                    </Button>
                  </a>
                </div>
              </div>
            </section>

            {/* 10. Cookies */}
            <section id="cookies" className="scroll-mt-24 space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  10
                </span>
                Almacenamiento local (localStorage) y cookies
              </h2>
              <p>
                Adoptanet no utiliza cookies de seguimiento de terceros ni píxeles publicitarios invasivos. Hacemos uso exclusivo del almacenamiento local del navegador (<code>localStorage</code>) para:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-muted-foreground pl-1">
                <li>Conservar el token criptográfico de sesión segura (JWT) para mantener tu sesión activa mientras navegas.</li>
                <li>Recordar preferencias visuales o de navegación indispensables para el correcto funcionamiento de la interfaz.</li>
              </ul>
            </section>

            {/* 11. Contacto y vigencia */}
            <section id="contacto" className="scroll-mt-24 space-y-4 pt-4 border-t border-border">
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-primary font-mono text-xs">
                  11
                </span>
                Canales de contacto y cambios a esta política
              </h2>
              <p>
                Adoptanet podrá actualizar periódicamente esta Política de Privacidad para reflejar mejoras técnicas, actualizaciones en las políticas de Google o cambios normativos en el Perú. Cuando se realicen modificaciones sustanciales, se notificará a través de un aviso destacado en la plataforma o mediante correo electrónico a los usuarios registrados.
              </p>
              <div className="rounded-2xl border border-border bg-secondary/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-heading font-bold text-foreground text-sm">
                    Canal Oficial de Privacidad y Cumplimiento
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Atención de dudas, solicitudes ARCO y revocación de datos personales.
                  </p>
                </div>
                <a href="mailto:privacidad@adoptanet.pe">
                  <Button variant="default" size="sm" className="gap-2">
                    <Mail className="size-4" />
                    privacidad@adoptanet.pe
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
