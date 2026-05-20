import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { GlassCard } from '../tactical/GlassCard';
import { FrameType } from '@/lib/types';
import { 
  Network, Users, Shield, ArrowRight, ChevronDown, ChevronLeft, 
  Sparkles, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const FramesTab: React.FC = () => {
  const { tasks, profiles } = useApp();
  const [expandedFrame, setExpandedFrame] = useState<string | null>(null);

  const getFrameCommander = (frame: string) => {
    const commander = profiles.find(p => p.assigned_frame === frame && p.status === 'approved');
    return commander ? commander.full_name : 'לא הוקצה מפקד';
  };

  const getFrameStats = (frame: string) => {
    // Get all tasks for this frame or subframe (e.g. מחלקה 1 covers כיתה 1-2 too for stats)
    const frameTasks = tasks.filter(t => 
      t.assigned_frame === frame || 
      (frame.startsWith('מחלקה') && t.assigned_frame.startsWith('כיתה') && t.assigned_frame.includes(frame.split(' ')[1]))
    );

    const completed = frameTasks.filter(t => t.status === 'הושלם').length;
    const total = frameTasks.length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 100;

    // Simulate training/combat readiness percent based on task completions & pre-seeded constant
    const seedReadinessMap: Record<string, number> = {
      'מחלקה 1': 95,
      'מחלקה 2': 88,
      'מחלקה 3': 92,
      'מחלקה 4': 85,
    };
    
    const baseReadiness = seedReadinessMap[frame] || 90;
    const calculatedReadiness = total > 0 
      ? Math.round((baseReadiness + completionRate) / 2)
      : baseReadiness;

    return {
      totalTasks: total,
      completedTasks: completed,
      readiness: calculatedReadiness
    };
  };

  const departments = [
    { id: 'מחלקה 1', name: 'מחלקה 1 - מחלקת חוד', motto: 'ראשונים בקרב, מובילים בניצחון', classes: ['כיתה 1', 'כיתה 2'] },
    { id: 'מחלקה 2', name: 'מחלקה 2 - מחלקת רתק', motto: 'עוצמת האש, דיוק בשטח', classes: ['כיתה 3', 'כיתה 4'] },
    { id: 'מחלקה 3', name: 'מחלקה 3 - מחלקת חבלה', motto: 'במקום שבו כולם נעצרים, אנו פורצים', classes: [] },
    { id: 'מחלקה 4', name: 'מחלקה 4 - מחלקת מילואים', motto: 'נקראים תמיד, מוכנים מיד', classes: [] }
  ];

  return (
    <div className="space-y-6">
      {/* Platoon Headquarters block */}
      <div className="flex justify-center mb-4">
        <GlassCard className="w-full max-w-lg border-cyan-500/30 text-center relative z-10" glow="cyan">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h2 className="text-base font-black text-slate-100">מפקדת פלוגה ג׳ • "העקרב"</h2>
          </div>
          <p className="text-xs text-slate-400 mb-4">מפקד פלוגה: <span className="text-slate-200 font-bold">{getFrameCommander('פלוגה')}</span> • סגן מפקד: סרן איתי רפאל • רס"פ: רס"ל ערן כהן</p>
          
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-900 text-xs">
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="text-slate-500 font-bold block mb-1">סך סד"כ פלוגתי</span>
              <span className="text-base font-black text-slate-200">120 לוחמים</span>
            </div>
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="text-slate-500 font-bold block mb-1">כשירות כשירות ממוצעת</span>
              <span className="text-base font-black text-[#00f5d4] animate-pulse">92%</span>
            </div>
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
              <span className="text-slate-500 font-bold block mb-1">משימות פתוחות</span>
              <span className="text-base font-black text-orange-400">
                {tasks.filter(t => t.status !== 'הושלם').length} משימות
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Visual connectors representation (Line) */}
      <div className="hidden md:flex justify-center items-center">
        <div className="w-1 h-8 bg-gradient-to-b from-cyan-500/40 to-slate-800" />
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {departments.map((dept) => {
          const stats = getFrameStats(dept.id);
          const isExpanded = expandedFrame === dept.id;
          const commanderName = getFrameCommander(dept.id);

          return (
            <GlassCard 
              key={dept.id} 
              className={cn(
                "border-slate-850 hover:border-slate-700/60 p-5 transition-all flex flex-col justify-between cursor-pointer",
                isExpanded && "border-cyan-500/25 shadow-[0_0_15px_rgba(0,229,255,0.06)]"
              )}
              onClick={() => setExpandedFrame(isExpanded ? null : dept.id)}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-black text-slate-200">{dept.name}</h3>
                  </div>
                  
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded border",
                    stats.readiness >= 90 
                      ? "bg-[#00f5d4]/10 text-[#00f5d4] border-[#00f5d4]/20" 
                      : "bg-[#fee440]/10 text-[#fee440] border-[#fee440]/20"
                  )}>
                    כשירות: {stats.readiness}%
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 font-bold mb-3 italic pe-1">"{dept.motto}"</p>

                <div className="space-y-1.5 text-xs text-slate-400 mb-4 bg-slate-950/40 border border-slate-900 rounded-xl p-3">
                  <p>👑 מפקד מחלקה (מ"מ): <span className="text-slate-200 font-semibold">{commanderName}</span></p>
                  <p>📋 משימות פעילות במחלקה: <span className="text-slate-300 font-bold">{stats.totalTasks}</span> משימות</p>
                  <p>📈 אחוז ביצוע משימות: <span className="text-cyan-400 font-bold">{stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 100}%</span></p>
                </div>

                {/* Subframe (Classes list) - Shown only when expanded */}
                {isExpanded && dept.classes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-900 space-y-2 animate-fade-in text-right">
                    <span className="text-[10px] font-black text-cyan-400 block mb-1">כיתות ותפקידי כותבים במחלקה:</span>
                    <div className="grid grid-cols-2 gap-2">
                      {dept.classes.map((cls) => {
                        const classStats = getFrameStats(cls);
                        return (
                          <div key={cls} className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900 text-xs">
                            <span className="font-bold text-slate-350 block mb-0.5">{cls}</span>
                            <span className="text-[10px] text-slate-500 block">מפקד כיתה (מ"כ): {getFrameCommander(cls)}</span>
                            <span className="text-[9px] font-bold text-cyan-400 block mt-1">משימות: {classStats.totalTasks}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Expander Arrow */}
              <div className="pt-3 border-t border-slate-900/60 flex items-center justify-end text-[10px] text-slate-500 font-bold">
                <span className="flex items-center gap-1">
                  {isExpanded ? 'צמצם תצוגת כיתות' : 'לחץ להרחבת כיתות'}
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
