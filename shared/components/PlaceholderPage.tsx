import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <Card className="bg-white border-line shadow-sm text-center py-10 px-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-verde-50 text-verde-700 flex items-center justify-center mb-5">
          {icon || <Clock className="w-8 h-8" />}
        </div>

        <CardHeader className="p-0">
          <span className="text-xs font-bold uppercase tracking-wider text-ambar-700 bg-ambar-100 px-3 py-1 rounded-full w-fit mx-auto mb-2">
            En construcción
          </span>
          <CardTitle className="text-2xl font-heading text-tinta-900 mt-2">
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-tinta-600 max-w-md mx-auto mt-2">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8">
          <Link href="/profile">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver a Mi Perfil
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
