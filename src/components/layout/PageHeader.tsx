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
  category = "מפקדת פלוגה ג'",
  actions,
}) => {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[rgba(2,1,8,0.08)] pb-4 md:flex-row md:items-center">
      <div className="min-w-0">
        <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-black text-[#667085]">
          <Shield className="h-3.5 w-3.5 text-[#FF6B02]" />
          <span>{category}</span>
          <span>·</span>
          <span className="text-[#FF6B02]">{title}</span>
        </div>

        <h1 className="text-xl font-black text-[#020108]">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#667085]">{subtitle}</p>
      </div>

      {actions && (
        <div className="flex items-center gap-3 self-start md:self-center">
          {actions}
        </div>
      )}
    </div>
  );
};
