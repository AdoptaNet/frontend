'use client';

import React, { useState, useEffect } from 'react';
import { FastForward, Clock, Play, Sparkles, ChevronDown, ChevronUp, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { followUpService } from '../services/follow-up.service';
import type { FollowUpRecordItem } from '../models/follow-up.types';

interface Props {
  records: FollowUpRecordItem[];
  onActionComplete: () => void;
}

export function DemoTimeTravelToolbar({ records, onActionComplete }: Props) {
  const isDemo =
    process.env.NEXT_PUBLIC_FOLLOW_UP_DEMO_MODE === 'true' ||
    process.env.NODE_ENV !== 'production';

  const [isOpen, setIsOpen] = useState(true);
  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    records[0]?.id || '',
  );
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (records.length > 0 && (!selectedRecordId || !records.some((r) => r.id === selectedRecordId))) {
      setSelectedRecordId(records[0].id);
    }
  }, [records, selectedRecordId]);

  if (!isDemo) return null;

  const currentRecord = records.find((r) => r.id === selectedRecordId) || records[0];
  const pendingMilestones = currentRecord?.milestones || [];

  const handleSimulateTime = async (daysOffset: number, actionName: string) => {
    const targetMilestone =
      selectedMilestoneId ||
      pendingMilestones.find((m) => m.status === 'pending' || m.status === 'overdue')?.id ||
      pendingMilestones[0]?.id;

    if (!currentRecord || !targetMilestone) {
      setActionFeedback('No hay un hito seleccionado o disponible para simular.');
      return;
    }

    setIsLoading(true);
    setActionFeedback(null);

    try {
      const res = await followUpService.simulateMilestoneTime(
        currentRecord.id,
        targetMilestone,
        { daysOffset },
      );
      setActionFeedback(`✅ ${actionName}: ${res.message}`);
      onActionComplete();
    } catch (err: any) {
      setActionFeedback(
        `❌ Error: ${err?.response?.data?.message || err?.message || 'Error en simulación'}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerCron = async () => {
    setIsLoading(true);
    setActionFeedback(null);

    try {
      const res = await followUpService.triggerCron();
      setActionFeedback(
        `⚡ Cron ejecutado: ${res.scanned} hitos escaneados, ${res.remindersSent} recordatorios emitidos, ${res.overdueMarked} marcados vencidos.`,
      );
      onActionComplete();
    } catch (err: any) {
      setActionFeedback(
        `❌ Error al forzar cron: ${err?.response?.data?.message || err?.message}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-violet-950 via-purple-900 to-indigo-950 text-white rounded-2xl p-4 shadow-xl border border-purple-500/30 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-400/30">
            <FastForward className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30">
                Modo Demo & Evaluador
              </span>
              <span className="text-xs text-purple-300 font-mono">
                FOLLOW_UP_DEMO_MODE=true
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white mt-0.5">
              Simulador de Fechas y Notificaciones (Pruebas de Seguimiento)
            </h4>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-purple-200 transition-colors"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-purple-500/20 space-y-4">
          <p className="text-xs text-purple-200 leading-relaxed">
            Permite probar el flujo de seguimiento sin esperar los 30, 90 o 180 días reales ni el reloj medianoche. Puedes desplazar las fechas de vencimiento al pasado o futuro y disparar las notificaciones por correo de Resend inmediatamente.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {records.length > 0 && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-purple-300 font-medium">Expediente:</span>
                  <select
                    value={currentRecord?.id || ''}
                    onChange={(e) => {
                      setSelectedRecordId(e.target.value);
                      setSelectedMilestoneId('');
                    }}
                    className="bg-purple-900/60 border border-purple-400/40 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-300"
                  >
                    {records.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.pet.name} (Adopción #{r.adoptionId.slice(0, 8)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-purple-300 font-medium">Hito:</span>
                  <select
                    value={selectedMilestoneId}
                    onChange={(e) => setSelectedMilestoneId(e.target.value)}
                    className="bg-purple-900/60 border border-purple-400/40 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-purple-300"
                  >
                    <option value="">(Automático: Hito actual)</option>
                    {pendingMilestones.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.daysTarget}d — {m.status} (Vence: {new Date(m.dueDate).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSimulateTime(5, 'Vencimiento simulado')}
              disabled={isLoading || records.length === 0}
              className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border-rose-400/40 gap-1.5 text-xs h-8"
            >
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              Simular Vencimiento (+5 días vencido)
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSimulateTime(-3, 'Ventana de recordatorio')}
              disabled={isLoading || records.length === 0}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-400/40 gap-1.5 text-xs h-8"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Simular Recordatorio (-3 días a vencer)
            </Button>

            <Button
              size="sm"
              onClick={handleTriggerCron}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white gap-1.5 text-xs h-8 font-medium shadow-md shadow-purple-500/20"
            >
              <Play className="w-3.5 h-3.5" />
              Disparar Cron Nocturno Ya
            </Button>
          </div>

          {actionFeedback && (
            <div className="p-2.5 rounded-lg bg-black/40 border border-purple-400/30 text-xs font-mono text-purple-100 flex items-center gap-2 animate-in fade-in">
              <Info className="w-4 h-4 text-purple-300 flex-shrink-0" />
              <span>{actionFeedback}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
