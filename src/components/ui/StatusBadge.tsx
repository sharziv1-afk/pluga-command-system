import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeStatusType =
  | 'חדש'
  | 'דחוף'
  | 'קריטי'
  | 'בתהליך'
  | 'ממתין לאישור'
  | 'הושלם'
  | 'תקוע'
  | 'בוטל'
  | 'פתוח'
  | 'נסגר'
  | 'בטיפול'
  | 'נפתחה'
  | 'סופק'
  | 'approved'
  | 'pending'
  | 'rejected'
  | string;

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  ...props
}) => {
  const normalizedStatus = normalizeStatus(status);

  return (
    <span
      className={cn(
        'inline-flex min-h-6 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold',
        getStatusStyles(normalizedStatus),
        className
      )}
      {...props}
    >
      {normalizedStatus}
    </span>
  );
};

function normalizeStatus(status: string) {
  switch (status) {
    case 'approved':
      return 'הושלם';
    case 'pending':
      return 'ממתין לאישור';
    case 'rejected':
      return 'בוטל';
    default:
      return status;
  }
}

function getStatusStyles(status: string) {
  switch (status) {
    case 'הושלם':
    case 'סופק':
    case 'נסגר':
      return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
    case 'בתהליך':
    case 'בטיפול':
      return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
    case 'חדש':
    case 'פתוח':
    case 'נפתחה':
      return 'bg-slate-500/10 text-slate-700 border-slate-500/20';
    case 'ממתין לאישור':
      return 'bg-[#FF6B02]/10 text-[#C54F00] border-[#FF6B02]/25';
    case 'דחוף':
    case 'קריטי':
    case 'תקוע':
      return 'bg-red-500/10 text-red-700 border-red-500/20';
    case 'בוטל':
      return 'bg-zinc-500/10 text-zinc-700 border-zinc-500/20';
    default:
      return 'bg-slate-500/10 text-slate-700 border-slate-500/20';
  }
}
