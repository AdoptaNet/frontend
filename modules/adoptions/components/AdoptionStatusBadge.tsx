import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Ban,
} from 'lucide-react';
import type { AdoptionStatus } from '../models/adoption.types';
import { ADOPTION_STATUS_LABELS } from '../models/adoption.types';

interface AdoptionStatusBadgeProps {
  status: AdoptionStatus;
  className?: string;
}

export function AdoptionStatusBadge({ status, className = '' }: AdoptionStatusBadgeProps) {
  switch (status) {
    case 'pending':
      return (
        <Badge
          className={`bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 gap-1.5 font-medium ${className}`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{ADOPTION_STATUS_LABELS.pending}</span>
        </Badge>
      );
    case 'under_review':
      return (
        <Badge
          className={`bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 gap-1.5 font-medium ${className}`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{ADOPTION_STATUS_LABELS.under_review}</span>
        </Badge>
      );
    case 'approved':
      return (
        <Badge
          className={`bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 gap-1.5 font-medium ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{ADOPTION_STATUS_LABELS.approved}</span>
        </Badge>
      );
    case 'rejected':
      return (
        <Badge
          className={`bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 gap-1.5 font-medium ${className}`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>{ADOPTION_STATUS_LABELS.rejected}</span>
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge
          className={`bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 gap-1.5 font-medium ${className}`}
        >
          <Ban className="w-3.5 h-3.5" />
          <span>{ADOPTION_STATUS_LABELS.cancelled}</span>
        </Badge>
      );
    default:
      return (
        <Badge className={`bg-gray-100 text-gray-700 border-gray-200 ${className}`}>
          {status}
        </Badge>
      );
  }
}
