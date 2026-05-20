import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glossHighlight?: boolean;
  glow?: 'cyan' | 'orange' | 'success' | 'stuck' | 'danger' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glossHighlight = true,
  glow = 'none',
  ...props
}) => {
  const glowClasses = {
    none: '',
    cyan: 'tactical-glow-cyan',
    orange: 'tactical-glow-orange',
    success: 'border-[#00f5d4]/40 shadow-[0_0_15px_rgba(0,245,212,0.15)]',
    stuck: 'border-[#fee440]/40 shadow-[0_0_15px_rgba(254,228,64,0.15)]',
    danger: 'border-[#ff0054]/40 shadow-[0_0_15px_rgba(255,0,84,0.15)]',
  };

  return (
    <div
      className={cn(
        "tactical-glass-card rounded-2xl p-6",
        glossHighlight && "tactical-gloss-highlight",
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
