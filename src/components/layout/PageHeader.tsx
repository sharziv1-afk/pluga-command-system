import React from 'react';
import { Shield } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  category?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  category = 'מפקדת פלוגה ג׳',
  actions
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-900 mb-6">
      <div>
        {/* Breadcrumb / Category */}
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1.5">
          <Shield className="w-3.5 h-3.5 text-cyan-500/50" />
          <span>{category}</span>
          <span>•</span>
          <span className="text-cyan-400">{title}</span>
        </div>
        
        {/* Title & Subtitle */}
        <h1 className="text-lg font-black text-slate-100">{title}</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">{subtitle}</p>
      </div>

      {actions && (
        <div className="flex items-center gap-3 self-end md:self-center">
          {actions}
        </div>
      )}
    </div>
  );
};
