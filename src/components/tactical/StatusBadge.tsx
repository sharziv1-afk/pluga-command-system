import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = (s: string) => {
    switch (s) {
      // Tasks / Gaps / Requests
      case 'חדשה':
      case 'נפתחה':
      case 'פתוח':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'לביצוע':
      case 'בטיפול':
      case 'בתהליך':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'ממתין לאישור':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse-soft';
      case 'הושלם':
      case 'סופק':
      case 'נסגר':
        return 'bg-[#00f5d4]/10 text-[#00f5d4] border-[#00f5d4]/30';
      case 'תקוע':
        return 'bg-[#ff0054]/10 text-[#ff0054] border-[#ff0054]/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm",
        getStatusStyles(status),
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current me-1.5 animate-pulse" />
      {status}
    </span>
  );
};
