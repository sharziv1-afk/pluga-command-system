import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { GlassCard } from '../tactical/GlassCard';
import { StatusBadge } from '../tactical/StatusBadge';
import { formatDateOnly } from '@/lib/utils';
import { 
  Shield, CheckSquare, AlertTriangle, Truck, Brain, Clock, 
  ArrowUpRight, AlertOctagon, HelpCircle, CheckCircle, Play
} from 'lucide-react';

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ onNavigate }) => {
  const { tasks, gaps, requests, profiles, activeRole, activeFrame, currentUser } = useApp();

  const resolvedRole = activeRole || currentUser?.role;
  const resolvedFrame = activeFrame || currentUser?.assigned_frame;

  // Filter tasks based on view context
  const filteredTasks = tasks.filter(t => 
    resolvedFrame === 'פלוגה' || t.assigned_frame === resolvedFrame
  );

  const filteredGaps = gaps.filter(g =>
    resolvedFrame === 'פלוגה' || g.assigned_frame === resolvedFrame
  );

  const filteredRequests = requests.filter(r =>
    resolvedFrame === 'פלוגה' || r.requesting_frame === resolvedFrame
  );

  // High Priority items
  const urgentTasks = filteredTasks.filter(t => t.priority === 'קריטי' || t.priority === 'דחוף');
  const decisionRequiredTasks = filteredTasks.filter(t => t.requires_commander_decision && t.status !== 'הושלם');
  const openGaps = filteredGaps.filter(g => g.status === 'פתוח');
  const pendingRequests = filteredRequests.filter(r => r.status === 'נפתחה' || r.status === 'בטיפול');

  // Stats
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.status === 'הושלם').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 🚀 Platoon Focus Headline */}
      <GlassCard className="border-cyan-500/25 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/80 p-5" glow="cyan">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-100">קשב פלוגתי ראשי - משימה מובילה</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {tasks.length > 0 
                  ? `המשימה המובילה כעת: "${tasks[0].title}" • באחריות: ${tasks[0].owner_name}`
                  : 'אין משימות מובילות מוגדרות כרגע.'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>שעון פעילות מפקדים • {new Date().toLocaleDateString('he-IL', { weekday: 'long' })}</span>
          </div>
        </div>
      </GlassCard>

      {/* 📊 Tactical Metrics Dashboard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Tasks */}
        <button 
          onClick={() => onNavigate('tasks')}
          className="text-right cursor-pointer group"
        >
          <GlassCard className="p-4 flex flex-col justify-between h-full group-hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">משימות ובקרה</span>
              <CheckSquare className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-100">{totalTasks}</span>
              <p className="text-[10px] text-slate-500 mt-1">
                אחוז ביצוע: <span className="text-cyan-400 font-bold">{completionRate}%</span> ({completedTasks} הושלמו)
              </p>
            </div>
          </GlassCard>
        </button>

        {/* Metric 2: Urgent Gaps */}
        <button 
          onClick={() => onNavigate('gaps')}
          className="text-right cursor-pointer group"
        >
          <GlassCard className="p-4 flex flex-col justify-between h-full group-hover:border-[#fee440]/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">פערים פתוחים</span>
              <AlertTriangle className="w-4 h-4 text-[#fee440]" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-100">{openGaps.length}</span>
              <p className="text-[10px] text-slate-500 mt-1">
                מתוכם פערים קריטיים: <span className="text-[#ff0054] font-bold">{openGaps.filter(g => g.urgency === 'קריטי').length}</span>
              </p>
            </div>
          </GlassCard>
        </button>

        {/* Metric 3: Logistics Requests */}
        <button 
          onClick={() => onNavigate('logistics')}
          className="text-right cursor-pointer group"
        >
          <GlassCard className="p-4 flex flex-col justify-between h-full group-hover:border-[#ff6b02]/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">דרישות לוגיסטיקה</span>
              <Truck className="w-4 h-4 text-[#ff6b02]" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-100">{pendingRequests.length}</span>
              <p className="text-[10px] text-slate-500 mt-1">
                דרישות בטיפול רס"פ: <span className="text-[#ff6b02] font-bold">{pendingRequests.filter(r => r.status === 'בטיפול').length}</span>
              </p>
            </div>
          </GlassCard>
        </button>

        {/* Metric 4: AI Recommendations */}
        <button 
          onClick={() => onNavigate('ai-summary')}
          className="text-right cursor-pointer group"
        >
          <GlassCard className="p-4 flex flex-col justify-between h-full group-hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">תובנות מפקד</span>
              <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-100">
                {decisionRequiredTasks.length + openGaps.filter(g => g.requires_commander_decision).length}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">
                אירועים הדורשים החלטה
              </p>
            </div>
          </GlassCard>
        </button>
      </div>

      {/* ⚠️ Critical Action Center (Urgent Actions required by commander) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Urgent Decisions and Tasks (Takes 2 columns in large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Decisions Needed Widget */}
          <GlassCard glow="orange">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-black text-slate-100">אירועים הדורשים החלטה פיקודית (מ"פ / סמ"פ)</h3>
              </div>
              <button 
                onClick={() => onNavigate('tasks')}
                className="text-[11px] text-cyan-400 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
              >
                בקרה מלאה
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {decisionRequiredTasks.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs flex flex-col items-center justify-center gap-1">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
                <span className="font-semibold text-emerald-400">הכל תקין! אין משימות הממתינות להחלטה כרגע.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {decisionRequiredTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{task.title}</span>
                        <StatusBadge status={task.status} />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 max-w-lg leading-relaxed">
                        שאלות בקרת מ"פ: {task.control_questions.join(', ') || 'לא הוגדרו שאלות בקרה.'}
                      </p>
                    </div>
                    <button 
                      onClick={() => onNavigate('tasks')}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-[10px] font-bold border border-cyan-500/20 cursor-pointer"
                    >
                      פתח בלוח
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Urgent Platoon Tasks list */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-black text-slate-100">משימות דחופות / קריטיות פעילות</h3>
              </div>
              <button 
                onClick={() => onNavigate('tasks')}
                className="text-[11px] text-cyan-400 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
              >
                כלל המשימות
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {urgentTasks.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                <span>אין משימות קריטיות לביצוע כרגע.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentTasks.slice(0, 3).map((task) => (
                  <div 
                    key={task.id} 
                    className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">{task.title}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-[#ff0054]/10 text-[#ff0054] border border-[#ff0054]/20">
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        אחראי: {task.owner_name} • מסגרת: {task.assigned_frame} • יעד: {formatDateOnly(task.deadline)}
                      </p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Open Gaps and Quick Actions list */}
        <div className="space-y-6">
          {/* Active Gaps Widget */}
          <GlassCard glow="stuck">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#fee440]" />
                <h3 className="text-sm font-black text-slate-100">פערי פלוגה דורשי טיפול</h3>
              </div>
              <button 
                onClick={() => onNavigate('gaps')}
                className="text-[11px] text-cyan-400 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
              >
                כל הפערים
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {openGaps.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                <span className="text-[#00f5d4] font-semibold">לא דווחו פערים לא פתורים. כבוד!</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {openGaps.slice(0, 3).map((gap) => (
                  <div 
                    key={gap.id}
                    className="p-3 rounded-xl border border-slate-900 bg-slate-950/30 flex flex-col justify-between gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]">{gap.title}</span>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-[#fee440]/10 text-[#fee440]">
                        {gap.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>דווח ע"י: {gap.reported_by_name}</span>
                      <span className="font-mono">{formatDateOnly(gap.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Quick HUD command reference cards */}
          <GlassCard className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider pe-1">קישורים מהירים</h3>
            
            <button
              onClick={() => onNavigate('forum')}
              className="w-full text-right p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400">סיכום פורום מוביל יומי</span>
                <p className="text-[9px] text-slate-500 mt-0.5">הגשת דוחות מחלקתיים וייצוא WhatsApp</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-all" />
            </button>

            <button
              onClick={() => onNavigate('tracking')}
              className="w-full text-right p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 transition-all flex items-center justify-between cursor-pointer group"
            >
              <div>
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400">טבלת מעקבי כשירות</span>
                <p className="text-[9px] text-slate-500 mt-0.5">דוח כשירות חיילים דמוי-אקסל מהיר</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-all" />
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
