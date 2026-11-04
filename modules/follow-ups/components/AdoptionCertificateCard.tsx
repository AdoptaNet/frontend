import React from 'react';
import { Award, Download, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FollowUpRecordItem } from '../models/follow-up.types';

interface Props {
  record: FollowUpRecordItem;
}

export function AdoptionCertificateCard({ record }: Props) {
  if (record.status !== 'completed' || !record.certificateCode) {
    return null;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-amber-50/40 p-6 shadow-md">
      {/* Decorative badge background watermark */}
      <div className="absolute -right-8 -bottom-8 text-amber-200/40 pointer-events-none">
        <Award className="w-56 h-56" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-2xl text-white shadow-lg shadow-amber-500/20">
            <Award className="w-9 h-9" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Certificación Oficial
              </span>
              <span className="text-xs text-stone-500 font-mono">
                {record.certificateCode}
              </span>
            </div>

            <h3 className="text-xl font-bold text-stone-900 mt-1">
              Certificado de Adopción Responsable Definitiva
            </h3>

            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Se certifica que <strong className="text-stone-900 font-semibold">{record.adopter.fullName || record.adopter.name || 'El Adoptante'}</strong> ha culminado satisfactoriamente los 180 días de adaptación y bienestar con <strong className="text-stone-900 font-semibold">{record.pet.name}</strong>, consolidando formalmente la adopción de por vida con el respaldo de <strong className="text-stone-900 font-semibold">{record.shelter.name}</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-stone-600 font-medium">
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Hitos 30, 90 y 180 días verificados
              </div>
              <div className="flex items-center gap-1.5 text-stone-500">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
                Fecha de Emisión: {record.completionDate ? new Date(record.completionDate).toLocaleDateString() : 'Reciente'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col gap-2 w-full md:w-auto">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-amber-300 hover:bg-amber-100/60 text-amber-900 gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-amber-700" />
            Imprimir / Descargar Certificado
          </Button>
        </div>
      </div>
    </div>
  );
}
