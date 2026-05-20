import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { GlassCard } from '../tactical/GlassCard';
import { formatDate } from '@/lib/utils';
import { 
  ScrollText, Search, ShieldAlert, CheckSquare, AlertTriangle, 
  Truck, User, Info, FileText 
} from 'lucide-react';

export const AuditTab: React.FC = () => {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckSquare className="w-4 h-4 text-cyan-400" />;
      case 'gap': return <AlertTriangle className="w-4 h-4 text-[#fee440]" />;
      case 'logistics': return <Truck className="w-4 h-4 text-[#ff6b02]" />;
      case 'user': return <User className="w-4 h-4 text-emerald-400" />;
      case 'system': return <ShieldAlert className="w-4 h-4 text-purple-400" />;
      default: return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.user_name.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filterType === 'all' || log.target_type === filterType;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <GlassCard>
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-black text-slate-100">יומן אירועים ופעולות סגל (Audit Logs)</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="חפש פעולה, מפקד או פרט..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-950/70 border border-slate-800 rounded-xl py-1.5 ps-9 pe-4 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-cyan-500/50 w-52"
              />
            </div>

            {/* Target Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950/70 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              <option value="all">כלל האירועים</option>
              <option value="task">משימות</option>
              <option value="gap">פערי לוגיסטיקה/הדרכה</option>
              <option value="logistics">דרישות רס"פ</option>
              <option value="user">משתמשים והרשאות</option>
              <option value="system">מערכת</option>
            </select>
          </div>
        </div>

        {/* Timeline Logs Container */}
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center gap-2">
            <FileText className="w-8 h-8 text-slate-700" />
            <p className="text-sm font-semibold">לא נמצאו רשומות יומן המתאימות לסינון המבוקש.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div 
                key={log.id}
                className="flex gap-4 p-4 rounded-xl border border-slate-900 bg-slate-950/20 hover:bg-slate-950/40 hover:border-slate-850/60 transition-all items-start"
              >
                {/* Visual Category Dot/Icon */}
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center shadow-inner mt-0.5">
                  {getLogIcon(log.target_type)}
                </div>

                {/* Log Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-200">
                        {log.user_name} ({log.user_role})
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">•</span>
                      <span className="text-xs font-bold text-cyan-400 group-hover:underline">
                        {log.action}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatDate(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed break-words">
                    {log.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
