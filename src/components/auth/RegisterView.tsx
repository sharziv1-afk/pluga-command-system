import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { GlassCard } from '../tactical/GlassCard';
import { RoleType, FrameType } from '@/lib/types';
import { Shield, User, Mail, Sparkles, LogIn } from 'lucide-react';

interface RegisterViewProps {
  onSwitchToLogin: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onSwitchToLogin }) => {
  const { register } = useApp();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleType>('מ"כ');
  const [frame, setFrame] = useState<FrameType>('כיתה 1');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setLoading(true);
    await register(fullName, email, role, frame);
    setLoading(false);
  };

  // Pre-configured typical frames based on role selection to guide the user
  const handleRoleChange = (selectedRole: RoleType) => {
    setRole(selectedRole);
    if (selectedRole === 'מ"פ' || selectedRole === 'סמ"פ') {
      setFrame('פלוגה');
    } else if (selectedRole === 'רס"פ') {
      setFrame('מפל"ג');
    } else if (selectedRole === 'מ"מ') {
      setFrame('מחלקה 1');
    } else if (selectedRole === 'מ"כ') {
      setFrame('כיתה 1');
    }
  };

  const rolesList: RoleType[] = ['מ"פ', 'סמ"פ', 'רס"פ', 'מ"מ', 'מ"כ'];
  
  const getAvailableFrames = (): FrameType[] => {
    if (role === 'מ"פ' || role === 'סמ"פ') return ['פלוגה'];
    if (role === 'רס"פ') return ['מפל"ג'];
    if (role === 'מ"מ') return ['מחלקה 1', 'מחלקה 2', 'מחלקה 3', 'מחלקה 4'];
    return ['כיתה 1', 'כיתה 2', 'כיתה 3', 'כיתה 4'];
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-tactical-bg">
      <div className="tactical-overlay" />

      <GlassCard className="w-full max-w-md border-slate-700/50 shadow-2xl relative z-10" glow="orange">
        <div className="flex flex-col items-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(255,107,2,0.15)] animate-pulse-soft">
            <Sparkles className="w-7 h-7 text-orange-500" />
          </div>
          <h1 className="text-2xl font-black tracking-wider text-orange-500">קליטת מפקד (Onboarding)</h1>
          <p className="text-xs text-slate-400 mt-1">הרשמת גורם פיקודי חדש לפלוגה</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 pe-1">
              דרגה ושם מלא (לדוגמה: סג"ם רועי לוי)
            </label>
            <div className="relative">
              <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                placeholder="סמל מתן לוי..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-2.5 ps-10 pe-4 text-sm text-slate-250 placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 pe-1">
              אימייל ליצירת קשר
            </label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-2.5 ps-10 pe-4 text-sm text-slate-250 placeholder-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all text-left"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 pe-1">
                תפקיד / דרג
              </label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as RoleType)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all cursor-pointer"
              >
                {rolesList.map((r) => (
                  <option key={r} value={r} className="bg-slate-950 text-slate-200">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 pe-1">
                מסגרת משויכת
              </label>
              <select
                value={frame}
                onChange={(e) => setFrame(e.target.value as FrameType)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30 transition-all cursor-pointer"
              >
                {getAvailableFrames().map((f) => (
                  <option key={f} value={f} className="bg-slate-950 text-slate-200">
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-3 text-xs text-slate-400 leading-relaxed">
            📢 <span className="font-bold text-orange-400">שימו לב:</span> לאחר הרישום, הבקשה שלך תיכנס לסטטוס <span className="font-bold text-orange-400">"המתנה לאישור"</span>. מפקד או סגן מפקד הפלוגה יצטרכו לאשר אותך מפאנל המנהלים כדי לפתוח את הגישה למערכת.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(255,107,2,0.2)] hover:shadow-[0_0_20px_rgba(255,107,2,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'נקלט במערכת...' : 'הגשת בקשת הצטרפות'}
          </button>
        </form>

        <div className="mt-5 text-center flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>כבר רשום במערכת?</span>
          <button
            onClick={onSwitchToLogin}
            className="text-orange-400 hover:text-orange-350 font-semibold cursor-pointer underline flex items-center gap-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            חזרה להתחברות
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
