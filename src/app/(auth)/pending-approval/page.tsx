'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlossyButton } from '@/components/ui/GlossyButton';
import { ShieldAlert, RefreshCw, UserCheck, LogOut } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function PendingApprovalPage() {
  const router = useRouter();

  const handleBypassAsCommander = () => {
    // מדמה התחברות כמ"פ לאישור המשתמש
    router.push('/admin');
  };

  const handleRefresh = () => {
    // מדמה רענון סטטוס (במצב אמת ימשוך נתונים)
    alert('בודק סטטוס אישור מול השרת...');
  };

  return (
    <div className="min-h-screen bg-[#030712] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Tactical background elements */}
      <div className="tactical-overlay" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <GlassCard className="w-full max-w-md bg-slate-950/65 border-slate-900/80 backdrop-blur-2xl z-10 shadow-2xl" glow="orange">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/35 text-orange-500 shadow-[0_0_15px_rgba(255,107,2,0.15)] animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            {/* Tactical pulse rings */}
            <div className="absolute inset-0 rounded-2xl border border-orange-500/25 scale-110 animate-ping pointer-events-none" />
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-black text-slate-100 tracking-wider">ממתין לאישור מפקד</h1>
            <StatusBadge status="ממתין לאישור" />
          </div>
          <p className="text-xs text-slate-400">גישת מפעיל נחסמה זמנית עד לאישור גישה מהמפל״ג</p>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent mt-3" />
        </div>

        {/* Informative details */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-900 mb-6 space-y-3.5 text-right">
          <div>
            <span className="block text-[9px] font-black text-slate-500 uppercase">מזהה בקשה במערכת</span>
            <span className="text-[10px] text-slate-300 font-mono">REQ-2026-0520-X84</span>
          </div>
          <div>
            <span className="block text-[9px] font-black text-slate-500 uppercase">סטטוס אישור</span>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              בקשתך לרישום כ מפקד מחלקה 1 נשלחה בהצלחה למ"פ (רס"ן אוריאל דוד) ולסמ"פ. המערכת תפתח אוטומטית ברגע שהגישה תאושר.
            </p>
          </div>
        </div>

        {/* Action triggers */}
        <div className="space-y-3 flex flex-col">
          <GlossyButton variant="slate" onClick={handleRefresh} className="w-full justify-center">
            <RefreshCw className="w-3.5 h-3.5" />
            בדוק סטטוס אישור מחדש
          </GlossyButton>

          <GlossyButton variant="cyan" onClick={handleBypassAsCommander} className="w-full justify-center">
            <UserCheck className="w-3.5 h-3.5 text-slate-950" />
            מצב בדיקה: כנס כמ"פ לאישור
          </GlossyButton>

          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 py-2 mt-2 rounded-xl bg-slate-950/20 hover:bg-[#ff0054]/10 text-[10px] font-black text-slate-500 hover:text-[#ff0054] border border-slate-900 hover:border-[#ff0054]/25 transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>התנתקות מהמערכת</span>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
