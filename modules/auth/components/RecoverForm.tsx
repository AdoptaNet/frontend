"use client";

import * as React from "react";
import Link from "next/link";
import { AuthLayoutCard } from "./AuthLayoutCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export function RecoverForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <AuthLayoutCard
      title="Recuperar contraseña"
      subtitle="Te enviaremos instrucciones para restablecer tu acceso"
      maxWidthClassName="max-w-xl"
    >
      {submitted ? (
        <div className="space-y-4 text-center py-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
            <CheckCircle2 className="size-6" />
          </div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            Correo enviado
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Si existe una cuenta asociada a{" "}
            <strong className="text-foreground">{email}</strong>, recibirás un
            enlace para restablecer tu contraseña en los próximos minutos.
          </p>
          <div className="pt-4">
            <Link href="/login">
              <Button variant="outline" className="w-full">
                Volver a iniciar sesión
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="recover-email">Correo electrónico registrado</Label>
            <Input
              id="recover-email"
              type="email"
              placeholder="tu@correo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full font-semibold">
            Enviar enlace de recuperación
          </Button>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Volver a iniciar sesión</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayoutCard>
  );
}
