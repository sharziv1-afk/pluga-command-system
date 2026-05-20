import React from 'react';
import { GlassCard } from './GlassCard';
import { GlossyButton } from './GlossyButton';
import { LucideIcon, HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = HelpCircle,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <GlassCard className="flex flex-col items-center justify-center text-center py-16 px-6 max-w-lg mx-auto border-dashed border-slate-800/80 bg-slate-950/20">
      <div className="p-4 rounded-full bg-slate-900/60 border border-slate-800 text-slate-500 mb-4 animate-pulse-soft">
        <Icon className="w-10 h-10" />
      </div>
      
      <h3 className="text-sm font-black text-slate-200 mb-2">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed mb-6 max-w-sm">
        {description}
      </p>
      
      {actionText && onAction && (
        <GlossyButton variant="cyan" onClick={onAction}>
          {actionText}
        </GlossyButton>
      )}
    </GlassCard>
  );
};
