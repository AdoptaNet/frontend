"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, PawPrint } from "lucide-react";
import { scrollToSection } from "@/components/providers/smooth-scroll";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection(id);
  };

  const handleMobileNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    scrollToSection(id);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
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

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          <button
            type="button"
            onClick={handleNavClick("como-funciona")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            Cómo funciona
          </button>
          <button
            type="button"
            onClick={handleNavClick("diferencia")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            La diferencia
          </button>
          <button
            type="button"
            onClick={handleNavClick("albergues")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            Para albergues
          </button>
          <button
            type="button"
            onClick={handleNavClick("faq")}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            Preguntas frecuentes
          </button>
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="outline" size="sm">
              Ingresar
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="default" size="sm">
              Crear cuenta
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-md text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="flex items-center gap-2 text-lg">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <PawPrint className="size-4 fill-current" />
                  </div>
                  <span>Adoptanet</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleMobileNavClick("como-funciona")}
                  className="rounded-lg px-3 py-2 text-left text-base font-medium text-foreground transition-colors hover:bg-secondary cursor-pointer"
                >
                  Cómo funciona
                </button>
                <button
                  type="button"
                  onClick={handleMobileNavClick("diferencia")}
                  className="rounded-lg px-3 py-2 text-left text-base font-medium text-foreground transition-colors hover:bg-secondary cursor-pointer"
                >
                  La diferencia
                </button>
                <button
                  type="button"
                  onClick={handleMobileNavClick("albergues")}
                  className="rounded-lg px-3 py-2 text-left text-base font-medium text-foreground transition-colors hover:bg-secondary cursor-pointer"
                >
                  Para albergues
                </button>
                <button
                  type="button"
                  onClick={handleMobileNavClick("faq")}
                  className="rounded-lg px-3 py-2 text-left text-base font-medium text-foreground transition-colors hover:bg-secondary cursor-pointer"
                >
                  Preguntas frecuentes
                </button>
                <hr className="my-2 border-border" />
                <div className="flex flex-col gap-2.5">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">
                      Ingresar
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button variant="default" className="w-full justify-center">
                      Crear cuenta
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
