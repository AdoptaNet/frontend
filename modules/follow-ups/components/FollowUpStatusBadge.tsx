import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, RotateCcw, AlertOctagon } from 'lucide-react';
import type { FollowUpProcessStatus } from '../models/follow-up.types';

interface Props {
  status: FollowUpProcessStatus;
}

export function FollowUpStatusBadge({ status }: Props) {
  switch (status) {
    case 'in_progress':
      return (
        <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-800 gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          En Seguimiento
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="outline" className="border-emerald-500 bg-emerald-50 text-emerald-800 gap-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Graduado / Completado
        </Badge>
      );
    case 'returned':
      return (
        <Badge variant="outline" className="border-rose-400 bg-rose-50 text-rose-800 gap-1.5 font-medium">
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          Retorno Formalizado
        </Badge>
      );
    case 'revoked':
      return (
        <Badge variant="outline" className="border-stone-400 bg-stone-100 text-stone-700 gap-1.5 font-medium">
          <AlertOctagon className="w-3.5 h-3.5 text-stone-500" />
          Revocado
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
