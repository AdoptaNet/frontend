import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { PrivacyPolicyContent } from "@/components/legal/privacy-policy-content";
import { ENV } from "@/shared/config/env";

export const metadata: Metadata = {
  title: `Política de Privacidad | ${ENV.APP_NAME}`,
  description: `Política de Privacidad de ${ENV.APP_NAME}. Conoce cómo tratamos y protegemos tus datos personales, cumplimiento con Google OAuth y la Ley N° 29733 (Perú).`,
  openGraph: {
    title: `Política de Privacidad | ${ENV.APP_NAME}`,
    description: `Compromiso de privacidad, protección de datos personales y uso limitado de Google OAuth en ${ENV.APP_NAME}.`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <Navbar />
      <main className="flex-1">
        <PrivacyPolicyContent />
      </main>
      <Footer />
    </div>
  );
}
