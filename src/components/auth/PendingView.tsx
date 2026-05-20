import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { GlassCard } from '../tactical/GlassCard';
import { ShieldAlert, LogOut, ArrowLeftRight, UserCheck } from 'lucide-react';

export const PendingView: React.FC = () => {
  const { currentUser, logout, login, profiles } = useApp();

  const handleSwitchToMpAndApprove = async () => {
    if (!currentUser) return;
    const pendingId = currentUser.id;
    const mpProfile = profiles.find(p => p.role === 'מ"פ');
    if (!mpProfile) return;

    // 1. Login as MP
    await login(mpProfile.email);
    
    // Store in localStorage that we want to auto-approve this pending user to make the demo seamless
    localStorage.setItem('pluga_auto_approve_id', pendingId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-tactical-bg">
      <div className="tactical-overlay" />

      <GlassCard className="w-full max-w-lg border-slate-700/50 shadow-2xl relative z-10 text-center" glow="orange">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,107,2,0.2)] animate-pulse">
            <ShieldAlert className="w-9 h-9 text-orange-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-100">ממתין לאישור מפקד</h1>
          <p className="text-sm text-orange-400 font-bold mt-1.5 uppercase tracking-wider animate-pulse-soft">
            סטטוס: בקשת גישה בבדיקה
          </p>
        </div>

        <div className="space-y-4 text-slate-300 leading-relaxed text-sm">
          <p>
            שלום <span className="font-bold text-slate-100">{currentUser?.full_name}</span>,
          </p>
          <p>
            פרטיך נקלטו במערכת בהצלחה כמפקד בתפקיד <span className="font-bold text-cyan-400">{currentUser?.role}</span> במסגרת <span className="font-bold text-cyan-400">{currentUser?.assigned_frame}</span>.
          </p>
          <p className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
            🔒 <span className="font-bold text-slate-200">הגנת אבטחת מידע צבאי:</span> גישה למערכת "המפקד" מוגבלת אך ורק לסגל שאושר במפורש. מפקד הפלוגה (המ"פ) או סגן מפקד הפלוגה (הסמ"פ) עודכנו לגבי הרשמתך והם יבחנו את בקשתך בקרוב. ברגע שיאשרו אותך, המערכת תיפתח עבורך באופן אוטומטי.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={logout}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <LogOut className="w-4 h-4" />
            התנתקות ויציאה
          </button>

          {/* Quick Demo Assist */}
          <button
            onClick={handleSwitchToMpAndApprove}
            className="w-full sm:w-auto bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 font-bold py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs shadow-[0_0_10px_rgba(0,229,255,0.05)] group"
          >
            <ArrowLeftRight className="w-4 h-4 group-hover:rotate-180 transition-all duration-300" />
            <span>מצב בדיקה: כנס כמ"פ לאישור</span>
          </button>
        </div>

        {/* Informative indicator that developer mode is active and how it works */}
        <p className="text-[10px] text-slate-500 mt-4">
          💡 לחיצה על "כנס כמ"פ לאישור" תעביר אותך לחשבון המ"פ. משם תוכל לגשת לפאנל הניהול (/admin) ולאשר את עצמך בלחיצת כפתור אחת!
        </p>
      </GlassCard>
    </div>
  );
};
