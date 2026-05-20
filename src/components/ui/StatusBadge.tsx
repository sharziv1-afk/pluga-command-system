import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeStatusType = 
  | 'חדשה' | 'לביצוע' | 'בתהליך' | 'ממתין לאישור' | 'הושלם' | 'תקוע'
  | 'פתוח' | 'נסגר' | 'בטיפול' | 'נפתחה' | 'סופק' | 'approved' | 'pending' | 'rejected';

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatusType | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  ...props
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'הושלם':
      case 'סופק':
      case 'נסגר':
      case 'approved':
        return 'bg-[#00f5d4]/10 text-[#00f5d4] border-[#00f5d4]/20';
      case 'בתהליך':
      case 'בטיפול':
        return 'bg-[#00bbf9]/10 text-[#00bbf9] border-[#00bbf9]/20';
      case 'חדשה':
      case 'לביצוע':
      case 'נפתחה':
        return 'bg-slate-800 text-slate-300 border-slate-700/50';
      case 'ממתין לאישור':
      case 'pending':
        return 'bg-[#fee440]/10 text-[#fee440] border-[#fee440]/20 animate-pulse';
      case 'תקוע':
      case 'rejected':
        return 'bg-[#ff0054]/10 text-[#ff0054] border-[#ff0054]/20 font-black';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'הושלם': return 'הושלם';
      case 'סופק': return 'סופק';
      case 'נסגר': return 'נסגר';
      case 'approved': return 'מאושר';
      case 'בתהליך': return 'בתהליך';
      case 'בטיפול': return 'בטיפול';
      case 'חדשה': return 'חדשה';
      case 'לביצוע': return 'לביצוע';
      case 'נפתחה': return 'נפתחה';
      case 'ממתין לאישור': return 'ממתין לאישור';
      case 'pending': return 'ממתין לאישור';
      case 'תקוע': return 'תקוע';
      case 'rejected': return 'נדחה';
      default: return status;
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border tracking-wider",
        getStatusStyles(),
        className
      )}
      {...props}
    >
      {getStatusLabel()}
    </span>
  );
};
