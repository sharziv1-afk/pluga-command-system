'use client';

import React, { useMemo } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { GlassCard } from '../tactical/GlassCard';
import { StatusBadge } from '../tactical/StatusBadge';
import { 
  Brain, 
  AlertTriangle, 
  Users, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  CheckCircle,
  Activity,
  Flame,
  ChevronLeft
} from 'lucide-react';

export default function AiSummaryTab() {
  const { tasks, gaps, requests, profiles } = useApp();

  // 1. Stuck Tasks Analysis
  const stuckTasks = useMemo(() => {
    return tasks.filter(t => t.status === 'תקוע');
  }, [tasks]);

  // 2. Overloaded Commanders Analysis (Owners of more than 2 active/incomplete tasks)
  const overloadedCommanders = useMemo(() => {
    // Group active tasks by owner_id
    const activeTasks = tasks.filter(t => 
      t.status === 'חדשה' || 
      t.status === 'לביצוע' || 
      t.status === 'בתהליך' || 
      t.status === 'ממתין לאישור'
    );

    const taskCounts: Record<string, typeof tasks> = {};
    activeTasks.forEach(task => {
      if (!task.owner_id) return;
      if (!taskCounts[task.owner_id]) {
        taskCounts[task.owner_id] = [];
      }
      taskCounts[task.owner_id].push(task);
    });

    return Object.entries(taskCounts)
      .map(([ownerId, ownerTasks]) => {
        const profile = profiles.find(p => p.id === ownerId);
        return {
          profile,
          taskCount: ownerTasks.length,
          tasks: ownerTasks
        };
      })
      .filter(item => item.profile && item.taskCount > 2)
      .sort((a, b) => b.taskCount - a.taskCount);
  }, [tasks, profiles]);

  // 3. Dynamic Tactical Tips & Recommendations Generator
  const tacticalTips = useMemo(() => {
    const tips: { id: string; title: string; desc: string; type: 'warning' | 'success' | 'info' | 'critical' }[] = [];

    // Tip on Stuck Tasks
    if (stuckTasks.length > 0) {
      tips.push({
        id: 'tip-stuck',
        title: `מערכת מזהה ${stuckTasks.length} משימות תקועות בסבב הנוכחי`,
        desc: 'מומלץ לעבור על סיבות התקיעה במגש המשימות ולקיים ישיבת סינכרון מהירה בין הרס"פ למ"מים הרלוונטיים לפריצת החסמים.',
        type: 'critical'
      });
    }

    // Tip on Open Gaps
    const openGapsCount = gaps.filter(g => g.status === 'פתוח').length;
    if (openGapsCount > 1) {
      tips.push({
        id: 'tip-gaps',
        title: `קיימים ${openGapsCount} פערי פלוגה בלתי מטופלים`,
        desc: 'פערים לא מטופלים גורמים לגרר לוגיסטי והדרכתי. מומלץ להמירם מיידית למשימות עבודה מוגדרות מול בעלי תפקידים בפלוגה.',
        type: 'warning'
      });
    }

    // Tip on Readiness by frame (dynamic check)
    // Let's check completed vs total tasks for each department (Mahlaka)
    const departments = ['מחלקה 1', 'מחלקה 2', 'מחלקה 3', 'מחלקה 4'];
    departments.forEach(dept => {
      const deptTasks = tasks.filter(t => t.assigned_frame === dept);
      if (deptTasks.length > 0) {
        const completed = deptTasks.filter(t => t.status === 'הושלם').length;
        const ratio = completed / deptTasks.length;
        if (ratio >= 0.75) {
          tips.push({
            id: `tip-dept-ready-${dept}`,
            title: `${dept} מציגה רמת כשירות משימתית גבוהה מאוד (${Math.round(ratio * 100)}%)`,
            desc: `המחלקה השלימה את רוב המשימות שהוטלו עליה. מומלץ לנתב אליה משימה פלוגתית רוחבית או למשוך אותה לסיוע למחלקות אחרות.`,
            type: 'success'
          });
        }
      }
    });

    // Overload alert tip
    if (overloadedCommanders.length > 0) {
      tips.push({
        id: 'tip-overload',
        title: 'עומס משימות חריג על סגל הפיקוד',
        desc: `זוהו מפקדים המחזיקים יותר מ-2 משימות פעילות במקביל. מומלץ לבצע חלוקת סמכויות מחדש ולהאציל סמכויות למפקדי הכיתות (מ"כים).`,
        type: 'warning'
      });
    }

    // Logistics requests tip
    const pendingLogistics = requests.filter(r => r.status === 'נפתחה' || r.status === 'בטיפול').length;
    if (pendingLogistics > 3) {
      tips.push({
        id: 'tip-logistics',
        title: 'צבר דרישות לוגיסטיות ממתין לטיפול',
        desc: `ישנן ${pendingLogistics} דרישות אספקה פתוחות. נדרש אישור מיידי של מ"פ/סמ"פ כדי לאפשר לרס"פ למשוך ציוד מול המחסן הגדודי.`,
        type: 'info'
      });
    }

    // Seed defaults if empty
    if (tips.length === 0) {
      tips.push({
        id: 'tip-default-1',
        title: 'רמת הכשירות המשימתית של הפלוגה מאוזנת ויציבה',
        desc: 'כל המשימות מתקדמות על פי התוכנית ואין פקקים תפעוליים שזוהו בשלב זה.',
        type: 'success'
      });
      tips.push({
        id: 'tip-default-2',
        title: 'שגרת אימונים ותהליכי למידה תקינים',
        desc: 'פורום המפקדים מוביל בצורה מקצועית. מומלץ להמשיך להזין את הסיכומים היומיים לטובת יצוא ההודעות הפלוגתיות.',
        type: 'info'
      });
    }

    return tips;
  }, [tasks, gaps, requests, overloadedCommanders, stuckTasks]);

  return (
    <div className="space-y-8 animate-fade-in text-right" dir="rtl">
      {/* Overview Dashboard widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="border-e-4 border-e-red-500 bg-red-950/10" glossHighlight={false}>
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400 font-semibold">משימות תקועות</p>
              <h3 className="text-3xl font-black text-red-400 mt-1">{stuckTasks.length}</h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="border-e-4 border-e-amber-500 bg-amber-950/10" glossHighlight={false}>
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400 font-semibold">מפקדים בעומס יתר</p>
              <h3 className="text-3xl font-black text-amber-400 mt-1">{overloadedCommanders.length}</h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="border-e-4 border-e-cyan-500 bg-cyan-950/10" glossHighlight={false}>
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400 font-semibold">פערי פלוגה פתוחים</p>
              <h3 className="text-3xl font-black text-cyan-400 mt-1">
                {gaps.filter(g => g.status === 'פתוח').length}
              </h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="border-e-4 border-e-emerald-500 bg-emerald-950/10" glossHighlight={false}>
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400 font-semibold">משימות שהושלמו</p>
              <h3 className="text-3xl font-black text-emerald-400 mt-1">
                {tasks.filter(t => t.status === 'הושלם').length}
              </h3>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Right side: Dynamic Tactical Tips */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse-soft" />
            <h2 className="text-lg font-black text-slate-200">המלצות והכוונות טקטיות (AI Assistant)</h2>
          </div>

          <div className="space-y-4">
            {tacticalTips.map((tip) => (
              <GlassCard 
                key={tip.id} 
                className={`relative overflow-hidden border-s-4 hover:-translate-y-0.5 transition-all ${
                  tip.type === 'critical' ? 'border-s-[#ef476f] bg-[#ef476f]/5' :
                  tip.type === 'warning' ? 'border-s-[#f1c40f] bg-[#f1c40f]/5' :
                  tip.type === 'success' ? 'border-s-[#06d6a0] bg-[#06d6a0]/5' :
                  'border-s-[#00e5ff] bg-[#00e5ff]/5'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    tip.type === 'critical' ? 'bg-[#ef476f]/10 text-[#ef476f]' :
                    tip.type === 'warning' ? 'bg-[#f1c40f]/10 text-[#f1c40f]' :
                    tip.type === 'success' ? 'bg-[#06d6a0]/10 text-[#06d6a0]' :
                    'bg-[#00e5ff]/10 text-[#00e5ff]'
                  }`}>
                    {tip.type === 'critical' && <ShieldAlert className="w-5 h-5" />}
                    {tip.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                    {tip.type === 'success' && <CheckCircle className="w-5 h-5" />}
                    {tip.type === 'info' && <Brain className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-slate-100 text-sm md:text-base">{tip.title}</h4>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">{tip.desc}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Left side: Overloaded Commanders & Stuck Tasks Drilldown */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-slate-200">בקרת כוח אדם ועומסים</h2>
          </div>

          {/* Overloaded card container */}
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>סגל הפיקוד בעומס גבוה</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400">נתון חם</span>
            </h3>

            {overloadedCommanders.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs font-semibold">
                ✅ אין מפקדים בעומס משימות חריג כעת.
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-900">
                {overloadedCommanders.map(({ profile, taskCount, tasks: ownerTasks }, idx) => (
                  <div key={profile?.id || idx} className="pt-3 first:pt-0 space-y-2 text-right">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-200">{profile?.full_name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{profile?.role} • {profile?.assigned_frame}</p>
                      </div>
                      <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black">
                        {taskCount} משימות פעילות
                      </span>
                    </div>

                    <div className="space-y-1.5 bg-slate-950/40 p-2 rounded-lg border border-slate-850">
                      {ownerTasks.map(task => (
                        <div key={task.id} className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                          <span className="truncate max-w-[150px]">{task.title}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                            task.priority === 'קריטי' ? 'bg-red-500/10 text-red-400' :
                            task.priority === 'דחוף' ? 'bg-orange-500/10 text-orange-400' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Stuck tasks detailed card */}
          <GlassCard className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>פירוט חסמי התקדמות</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400">תקועים</span>
            </h3>

            {stuckTasks.length === 0 ? (
              <div className="py-6 text-center text-slate-500 text-xs font-semibold">
                🚀 אין משימות תקועות בפלוגה! מצוין.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {stuckTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-2.5 rounded-xl bg-red-500/5 border border-red-500/15 hover:border-red-500/30 transition-colors space-y-1.5"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[11px] font-black text-slate-200 truncate max-w-[170px]">
                        {task.title}
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold">{task.assigned_frame}</span>
                    </div>

                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold bg-black/40 p-1.5 rounded border border-red-500/10">
                      <strong className="text-red-400">סיבה:</strong> {task.stuck_reason || 'לא צוינה סיבה מפורטת.'}
                    </p>

                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold mt-1">
                      <span>אחראי: {task.owner_name}</span>
                      <span>עדיפות: {task.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
