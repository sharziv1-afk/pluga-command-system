'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { GlossyButton } from '@/components/ui/GlossyButton';
import { 
  Shield, CheckSquare, Truck, Users, Activity, 
  AlertTriangle, CheckCircle, Clock 
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'סד״כ פלוגתי פעיל',
      value: '84%',
      sub: '92 מתוך 110 חיילים',
      icon: Users,
      color: 'cyan',
    },
    {
      title: 'משימות בביצוע',
      value: '12',
      sub: '4 משימות דחופות',
      icon: CheckSquare,
      color: 'orange',
    },
    {
      title: 'דרישות לוגיסטיקה פתוחות',
      value: '7',
      sub: '3 ממתינות לאישור רס״פ',
      icon: Truck,
      color: 'slate',
    },
    {
      title: 'כשירות מבצעית',
      value: '91%',
      sub: 'עלייה של 2% השבוע',
      icon: Activity,
      color: 'cyan',
    },
  ];

  const recentTasks = [
    { id: 'TSK-102', title: 'הכנת ציוד לתרח״ט', target: 'מחלקה 1', status: 'בתהליך', due: 'היום, 18:00' },
    { id: 'TSK-104', title: 'השלמת מבדקי כשירות קשר', target: 'מפל״ג', status: 'ממתין לאישור', due: 'מחר, 10:00' },
    { id: 'TSK-105', title: 'רענון פקודות בטיחות שבועיות', target: 'כלל הפלוגה', status: 'לביצוע', due: '22 במאי' },
    { id: 'TSK-101', title: 'תיאומי מטווחים מול חמ״ל חטיבה', target: 'מחלקה 2', status: 'הושלם', due: 'בוצע אתמול' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader 
        title="לוח בקרה טקטי" 
        subtitle="שלום המפקד. מרכז השליטה והבקרה הפלוגתי (Cockpit HUD) מציג תמונת מצב אופרטיבית חיה של המשימות, הכשירות המבצעית והלוגיסטיקה של פלוגה ג׳."
        actions={
          <GlossyButton variant="cyan" size="sm" onClick={() => alert('מייצר סיכום פלוגתי יומי...')}>
            ייצוא דוח מצב פלוגתי
          </GlossyButton>
        }
      />

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <GlassCard 
              key={idx} 
              glow={stat.color as 'cyan' | 'orange' | 'none'}
              className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-350"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">{stat.title}</span>
                  <span className="block text-2xl font-black text-slate-100 tracking-tight">{stat.value}</span>
                  <span className="block text-[10px] text-slate-400 font-bold">{stat.sub}</span>
                </div>
                <div className={`p-2 rounded-xl bg-slate-900 border ${
                  stat.color === 'cyan' ? 'border-cyan-500/20 text-cyan-400' :
                  stat.color === 'orange' ? 'border-orange-500/20 text-orange-400' :
                  'border-slate-800 text-slate-400'
                }`}>
                  <Icon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Main Grid: Tasks & Department Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks List */}
        <GlassCard className="lg:col-span-2 space-y-4" glow="none">
          <div className="flex items-center justify-between pb-3 border-b border-slate-900">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-black text-slate-200">משימות פיקוח אחרונות</h2>
            </div>
            <GlossyButton variant="slate" size="sm" onClick={() => window.location.href = '/tasks'}>
              כל המשימות
            </GlossyButton>
          </div>

          <div className="divide-y divide-slate-900/60 space-y-3">
            {recentTasks.map((task) => (
              <div key={task.id} className="pt-3 flex items-center justify-between gap-4 first:pt-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono font-bold">{task.id}</span>
                    <span className="text-xs font-black text-slate-200">{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>אחריות: {task.target}</span>
                    <span>•</span>
                    <span>יעד: {task.due}</span>
                  </div>
                </div>

                <div>
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Tactical Alerts and Quick Links */}
        <GlassCard className="space-y-4" glow="none">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-900">
            <Activity className="w-4 h-4 text-orange-400" />
            <h2 className="text-xs font-black text-slate-200">פערי פלוגה דחופים</h2>
          </div>

          <div className="space-y-3.5">
            {/* Warning block 1 */}
            <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/15 flex gap-3">
              <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="block text-[10px] font-black text-orange-400">מחסור במחסניות טקטיות</span>
                <span className="block text-[9px] text-slate-400 leading-relaxed">
                  מחלקה 3 דיווחה על פער של 14 מחסניות עבור פק״ל נגב. נדרש פתיחת דרישה לרס״פ.
                </span>
              </div>
            </div>

            {/* Warning block 2 */}
            <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/15 flex gap-3">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="block text-[10px] font-black text-cyan-400">סיכום פורום מוביל</span>
                <span className="block text-[9px] text-slate-400 leading-relaxed">
                  טרם התקבל סיכום מפקדים יומי ממחלקה 4. זמן הגשה מתוכנן עבר לפני שעתיים.
                </span>
              </div>
            </div>

            {/* Warning block 3 */}
            <div className="p-3 rounded-xl bg-[#00f5d4]/5 border border-[#00f5d4]/15 flex gap-3">
              <CheckCircle className="w-4 h-4 text-[#00f5d4] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="block text-[10px] font-black text-[#00f5d4]">ביקורת כשירות קשר עברה</span>
                <span className="block text-[9px] text-slate-400 leading-relaxed">
                  הושלמה ביקורת קשר בהצלחה למחלקה 1 ומחלקה 2 ללא חריגות ציוד.
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
