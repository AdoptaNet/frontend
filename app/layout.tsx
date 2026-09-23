import type { Metadata } from "next";
import { Archivo, Plus_Jakarta_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Adoptanet";

export const metadata: Metadata = {
  title: `${appName} — Adopción responsable con razones reales`,
  description:
    "Plataforma web de adopción de animales rescatados en el Perú con sistema de recomendación explicable. Conoce a tu compañero ideal según tu estilo de vida.",
  verification: {
    google: "1jsDb7660y7OB1rCoiefV6sJQRhw7A5G9Cy-1aPG6Zw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
