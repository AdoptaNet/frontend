import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, PawPrint, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      {/* Minimal Top Header */}
      <header className="w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-200 group-hover:scale-105">
              <PawPrint className="size-5 fill-current" />
            </div>
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              Adoptanet
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="size-4" />
            <span>Regresar al inicio</span>
          </Link>
        </div>
      </header>

      {/* Main 404 Content */}
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          {/* Paw Icon Badge */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-secondary border border-border/60 text-primary shadow-xs">
            <PawPrint className="size-10 fill-primary/20 text-primary animate-pulse" />
          </div>

          {/* 404 Heading */}
          <span className="inline-block rounded-full bg-reason px-3 py-1 text-xs font-semibold uppercase tracking-wider text-reason-foreground mb-4">
            Error 404 · Huella perdida
          </span>

          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            Parece que esta mascota tomó otro camino
          </h1>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            La página o recurso que buscas no existe o fue movido. No te preocupes,
            en Adoptanet siempre hay un compañero esperando por ti.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="accent" size="default" className="w-full sm:w-auto gap-2">
                <Home className="size-4" />
                <span>Ir al inicio</span>
              </Button>
            </Link>
            <Link href="/#como-funciona" className="w-full sm:w-auto">
              <Button variant="outline" size="default" className="w-full sm:w-auto gap-2">
                <Search className="size-4" />
                <span>¿Cómo funciona?</span>
              </Button>
            </Link>
          </div>

          {/* Supportive note */}
          <div className="mt-12 rounded-xl border border-border/80 bg-card p-4 text-xs text-muted-foreground">
            <p>
              ¿Crees que esto es un error del sistema? Escríbenos a{" "}
              <a
                href="mailto:contacto@adoptanet.pe"
                className="font-medium text-primary underline underline-offset-2 hover:text-[#153E36]"
              >
                contacto@adoptanet.pe
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Adoptanet — Adopción responsable con razones reales.</p>
      </footer>
    </div>
  );
}
