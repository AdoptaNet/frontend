'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Award,
  RefreshCw,
  FileText,
  Heart,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { AdopterHistorySection } from '@/modules/adoptions/components/AdopterHistorySection';
import { adoptionsService } from '@/modules/adoptions/services/adoptions.service';
import type { AdopterHistoryData } from '@/modules/adoptions/models/adoption.types';

export function AdopterHistoryTab() {
  const [history, setHistory] = useState<AdopterHistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adoptionsService.getMyHistory();
      setHistory(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo cargar tu historial de adopciones',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <Card className="border-line shadow-xs">
      <CardHeader className="pb-4 border-b border-line/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-xl font-heading font-bold text-tinta-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>Historial y Confiabilidad</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-tinta-600">
              Consulta tus antecedentes de adopción, certificados de seguimiento obtenidos y tu nivel de confiabilidad.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fetchHistory}
              disabled={isLoading}
              className="h-8 px-3 text-xs border-line text-tinta-700 hover:bg-superficie-2 gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Info Banner */}
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-emerald-950">
              ¿Cómo funciona el nivel de confiabilidad en la plataforma?
            </p>
            <p className="text-emerald-800 leading-relaxed text-[11px] sm:text-xs">
              Los albergues evalúan este historial cuando postulas a una mascota. Al formalizar adopciones y completar satisfactoriamente los protocolos de seguimiento (30, 90 y 180 días), acumulas certificaciones oficiales de tenencia responsable que fortalecen tu perfil.
            </p>
          </div>
        </div>

        {/* Section with Metrics, Badge, Previous Adoptions & Returns */}
        <AdopterHistorySection
          history={history}
          isLoading={isLoading}
          error={error}
        />

        {/* Quick Links */}
        <div className="pt-2 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-tinta-500 text-center sm:text-left">
            ¿Deseas revisar el estado de alguna solicitud enviada?
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/applications"
              className={buttonVariants({
                variant: 'outline',
                size: 'sm',
                className: 'h-8 px-3 text-xs border-line text-tinta-800 gap-1.5 w-full sm:w-auto justify-center',
              })}
            >
              <FileText className="w-3.5 h-3.5 text-verde-700" />
              <span>Ver mis solicitudes</span>
              <ArrowRight className="w-3 h-3 text-tinta-400" />
            </Link>
            <Link
              href="/pets"
              className={buttonVariants({
                size: 'sm',
                className: 'h-8 px-3 text-xs bg-verde-700 hover:bg-verde-800 text-white gap-1.5 w-full sm:w-auto justify-center',
              })}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Buscar mascotas</span>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
