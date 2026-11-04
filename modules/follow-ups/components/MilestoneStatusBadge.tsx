import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Send, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { MilestoneStatus } from '../models/follow-up.types';

interface Props {
  status: MilestoneStatus;
}

export function MilestoneStatusBadge({ status }: Props) {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="border-stone-300 bg-stone-50 text-stone-700 gap-1 text-xs">
          <Clock className="w-3 h-3 text-stone-500" />
          Pendiente
        </Badge>
      );
    case 'submitted':
      return (
        <Badge variant="outline" className="border-blue-400 bg-blue-50 text-blue-800 gap-1 text-xs font-medium">
          <Send className="w-3 h-3 text-blue-600" />
          En Revisión
        </Badge>
      );
    case 'approved':
      return (
        <Badge variant="outline" className="border-emerald-500 bg-emerald-50 text-emerald-800 gap-1 text-xs font-medium">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          Aprobado
        </Badge>
      );
    case 'rejected':
      return (
        <Badge variant="outline" className="border-rose-400 bg-rose-50 text-rose-800 gap-1 text-xs font-medium">
          <XCircle className="w-3 h-3 text-rose-600" />
          Observado / Rechazado
        </Badge>
      );
    case 'overdue':
      return (
        <Badge variant="outline" className="border-amber-500 bg-amber-50 text-amber-900 gap-1 text-xs font-semibold animate-pulse">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Plazo Vencido
        </Badge>
      );
    default:
      return <Badge variant="secondary" className="text-xs">{status}</Badge>;
  }
}
