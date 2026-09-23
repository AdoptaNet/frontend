import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { TermsOfServiceContent } from "@/components/legal/terms-of-service-content";
import { ENV } from "@/shared/config/env";

export const metadata: Metadata = {
  title: `Condiciones del Servicio | ${ENV.APP_NAME}`,
  description: `Condiciones del Servicio y Términos de Uso de ${ENV.APP_NAME}. Conoce tus derechos y deberes, marco legal de bienestar animal (Ley N° 30407) y prohibición de venta de animales.`,
  openGraph: {
    title: `Condiciones del Servicio | ${ENV.APP_NAME}`,
    description: `Términos legales y compromiso de bienestar animal en la plataforma de adopción ${ENV.APP_NAME}.`,
  },
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <Navbar />
      <main className="flex-1">
        <TermsOfServiceContent />
      </main>
      <Footer />
    </div>
  );
}
