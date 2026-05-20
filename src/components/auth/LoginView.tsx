import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { GlassCard } from '../tactical/GlassCard';
import { Shield, Mail, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onSwitchToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSwitchToRegister }) => {
  const { login, profiles } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setLoading(true);
    
    const success = await login(email);
    setLoading(false);
    
    if (!success) {
      setError('אימייל זה אינו רשום במערכת. אנא ודא שהקלדת נכון או הירשם כמפקד חדש.');
    }
  };

  const handleQuickLogin = async (quickEmail: string) => {
    setError('');
    setLoading(true);
    await login(quickEmail);
    setLoading(false);
  };

  const approvedProfiles = profiles.filter(p => p.status === 'approved');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-tactical-bg">
      {/* Tactical Grid Background */}
      <div className="tactical-overlay" />

      <GlassCard className="w-full max-w-md border-slate-700/50 shadow-2xl relative z-10" glow="cyan">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(0,229,255,0.15)] animate-pulse-soft">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-black tracking-wider text-cyan-400">המפקד</h1>
          <p className="text-sm text-slate-400 mt-1">מערכת פיקוד ובקרה פלוגתית</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 pe-1">
              כתובת אימייל צבאית / אישית
            </label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl py-2.5 ps-10 pe-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-left"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#ff0054] font-medium bg-[#ff0054]/5 border border-[#ff0054]/10 rounded-lg p-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'מאמת...' : 'כניסה למערכת'}
            <ArrowRight className="w-4 h-4 transform rotate-180" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800/60">
          <p className="text-xs font-bold text-slate-400 mb-3 pe-1">
            כניסה מהירה כמפקד מאושר:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {approvedProfiles.slice(0, 4).map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleQuickLogin(profile.email)}
                className="bg-slate-900/60 hover:bg-slate-850/80 border border-slate-800/80 hover:border-cyan-500/30 rounded-xl p-2.5 text-right transition-all cursor-pointer flex flex-col group"
              >
                <span className="text-xs font-bold text-slate-350 group-hover:text-cyan-400">
                  {profile.full_name}
                </span>
                <span className="text-[10px] text-slate-500">
                  {profile.role} • {profile.assigned_frame}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onSwitchToRegister}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline transition-all"
          >
            הרשמת מפקד חדש במערכת (Onboarding)
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
