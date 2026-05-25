'use client';

import React from 'react';
import { Activity, AlertTriangle, CheckCircle, CheckSquare, Clock, Truck, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlossyButton } from '@/components/ui/GlossyButton';
import { StatusBadge } from '@/components/ui/StatusBadge';

const stats = [
  {
    title: 'סד"כ פלוגתי פעיל',
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
    sub: '3 ממתינות לאישור רס"פ',
    icon: Truck,
    color: 'none',
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
  { id: 'TSK-102', title: 'הכנת ציוד לתרח"ט', target: 'מחלקה 1', status: 'בתהליך', due: 'היום, 18:00' },
  { id: 'TSK-104', title: 'השלמת מבדקי כשירות קשר', target: 'מפל"ג', status: 'ממתין לאישור', due: 'מחר, 10:00' },
  { id: 'TSK-105', title: 'רענון פקודות בטיחות שבועיות', target: 'כלל הפלוגה', status: 'חדש', due: '22 במאי' },
  { id: 'TSK-101', title: 'תיאומי מטווחים מול חמ"ל חטיבה', target: 'מחלקה 2', status: 'הושלם', due: 'בוצע אתמול' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="לוח בקרה"
        subtitle="תמונת מצב פלוגתית נקייה ומהירה לצפייה במשימות, כשירות, פערים ודרישות לוגיסטיות."
        actions={
          <GlossyButton variant="orange" size="sm" onClick={() => alert('מייצר סיכום פלוגתי יומי...')}>
            ייצוא דוח מצב
          </GlossyButton>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={stat.title} glow={stat.color as 'cyan' | 'orange' | 'none'} className="min-h-36">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <span className="block text-xs font-black text-[#667085]">{stat.title}</span>
                  <span className="block text-3xl font-black text-[#020108]">{stat.value}</span>
                  <span className="block text-xs font-semibold text-[#667085]">{stat.sub}</span>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#FF6B02]/18 bg-[#FF6B02]/10 text-[#FF6B02]">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="space-y-4 lg:col-span-2" glow="none">
          <div className="flex items-center justify-between gap-3 border-b border-[rgba(2,1,8,0.08)] pb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-[#FF6B02]" />
              <h2 className="text-sm font-black text-[#020108]">משימות פיקוח אחרונות</h2>
            </div>
            <GlossyButton variant="slate" size="sm" onClick={() => window.location.href = '/tasks'}>
              כל המשימות
            </GlossyButton>
          </div>

          <div className="divide-y divide-[rgba(2,1,8,0.08)]">
            {recentTasks.map((task) => (
              <div key={task.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#98A2B3]">{task.id}</span>
                    <span className="text-sm font-black text-[#020108]">{task.title}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#667085]">
                    <span>אחריות: {task.target}</span>
                    <span>·</span>
                    <span>יעד: {task.due}</span>
                  </div>
                </div>

                <StatusBadge status={task.status} className="self-start sm:self-center" />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="space-y-4" glow="orange">
          <div className="flex items-center gap-2 border-b border-[rgba(2,1,8,0.08)] pb-3">
            <Activity className="h-4 w-4 text-[#FF6B02]" />
            <h2 className="text-sm font-black text-[#020108]">פערים דחופים</h2>
          </div>

          <div className="space-y-3">
            <AlertBlock
              icon={AlertTriangle}
              title="מחסור במחסניות טקטיות"
              text='מחלקה 3 דיווחה על פער של 14 מחסניות עבור פק"ל נגב.'
              tone="orange"
            />
            <AlertBlock
              icon={Clock}
              title="סיכום פורום מוביל"
              text="טרם התקבל סיכום מפקדים יומי ממחלקה 4."
              tone="blue"
            />
            <AlertBlock
              icon={CheckCircle}
              title="ביקורת כשירות קשר עברה"
              text="מחלקות 1 ו-2 הושלמו ללא חריגות ציוד."
              tone="green"
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function AlertBlock({
  icon: Icon,
  title,
  text,
  tone,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  tone: 'orange' | 'blue' | 'green';
}) {
  const toneClasses = {
    orange: 'border-[#FF6B02]/18 bg-[#FF6B02]/10 text-[#C54F00]',
    blue: 'border-blue-500/18 bg-blue-500/10 text-blue-700',
    green: 'border-emerald-500/18 bg-emerald-500/10 text-emerald-700',
  };

  return (
    <div className={`flex gap-3 rounded-2xl border p-3 ${toneClasses[tone]}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <span className="block text-xs font-black">{title}</span>
        <span className="mt-1 block text-xs font-semibold leading-relaxed text-[#667085]">{text}</span>
      </div>
    </div>
  );
}
