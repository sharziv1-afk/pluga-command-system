'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlossyButton } from '@/components/ui/GlossyButton';
import { Shield, User, ArrowRight, ClipboardList } from 'lucide-react';
import { RoleType, FrameType } from '@/types';

export default function OnboardingPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<RoleType>('מ"מ');
  const [frame, setFrame] = useState<FrameType>('מחלקה 1');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // סימולציית רישום מוצלח ומעבר להמתנה לאישור
    router.push('/pending-approval');
  };

  const roles: RoleType[] = ['מ"פ', 'סמ"פ', 'מ"מ', 'מ"כ', 'רס"פ'];
  const frames: FrameType[] = [
    'פלוגה', 'מפל"ג', 
    'מחלקה 1', 'מחלקה 2', 'מחלקה 3', 'מחלקה 4',
    'כיתה 1', 'כיתה 2', 'כיתה 3', 'כיתה 4'
  ];

  return (
    <div className="min-h-screen bg-[#030712] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Tactical background elements */}
      <div className="tactical-overlay" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <GlassCard className="w-full max-w-lg bg-slate-950/65 border-slate-900/80 backdrop-blur-2xl z-10 shadow-2xl" glow="orange">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/35 text-orange-500 mb-4 shadow-[0_0_15px_rgba(255,107,2,0.15)]">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h1 className="text-lg font-black text-slate-100 tracking-wider">רישום מפקד חדש</h1>
          <p className="text-xs text-slate-400 mt-1">אנא מלא את פרטיך הצבאיים להגשת בקשת הרשאה פלוגתית</p>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent mt-3" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">שם מלא ודרגה</label>
            <div className="relative">
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="לדוגמה: סג״ם רועי לוי"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-orange-500/60 rounded-xl py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition-all duration-300 text-right"
              />
            </div>
          </div>

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">כתובת דואר אלקטרוני</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@idf.il"
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-orange-500/60 rounded-xl py-2 px-4 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition-all duration-300 text-right"
            />
          </div>

          {/* Role selection */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">תפקיד פיקודי</label>
            <div className="grid grid-cols-5 gap-2">
              {roles.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-2 rounded-xl text-xs font-black cursor-pointer border transition-all duration-300 ${
                    role === r
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(255,107,2,0.1)]'
                      : 'bg-slate-950/40 text-slate-400 border-slate-900 hover:border-slate-850 hover:bg-slate-900/20'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Frame selection */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">מסגרת / מחלקה / כיתה מוקצית</label>
            <div className="relative">
              <select
                value={frame}
                onChange={(e) => setFrame(e.target.value as FrameType)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-orange-500/60 rounded-xl py-2 px-4 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition-all duration-300 text-right appearance-none"
              >
                {frames.map((f) => (
                  <option key={f} value={f} className="bg-slate-950 text-slate-100 text-right">
                    {f}
                  </option>
                ))}
              </select>
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col gap-3">
            <GlossyButton type="submit" variant="orange" size="lg" className="w-full justify-center">
              הגשת בקשת הצטרפות למפקד
            </GlossyButton>

            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 py-2 text-[10px] text-slate-500 hover:text-slate-300 font-black tracking-wider transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>חזרה למסך התחברות</span>
            </Link>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
