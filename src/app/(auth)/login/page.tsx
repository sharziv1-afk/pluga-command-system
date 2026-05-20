'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlossyButton } from '@/components/ui/GlossyButton';
import { Shield, Key, User, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // סימולציית התחברות - מעביר לדשבורד
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#030712] relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Tactical background elements */}
      <div className="tactical-overlay" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <GlassCard className="w-full max-w-md bg-slate-950/65 border-slate-900/80 backdrop-blur-2xl z-10 shadow-2xl" glow="cyan">
        {/* Brand/Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/35 text-cyan-400 mb-4 shadow-[0_0_15px_rgba(0,229,255,0.15)] animate-pulse">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-slate-100 tracking-wider">המפקד</h1>
          <p className="text-xs text-cyan-500 font-bold uppercase tracking-widest mt-1">מערכת פיקוד פלוגתית טקטית</p>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent mt-3" />
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">מזהה מפעיל / דואר אלקטרוני</label>
            <div className="relative">
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@idf.il"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2.5 pr-10 pl-4 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all duration-300 text-right"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">קוד גישה מאובטח</label>
            <div className="relative">
              <Key className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/60 rounded-xl py-2.5 pr-10 pl-4 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all duration-300 text-right font-sans"
              />
            </div>
          </div>

          {/* Login actions */}
          <div className="pt-2">
            <GlossyButton type="submit" variant="cyan" size="lg" className="w-full justify-center">
              אימות גישה וכניסה
            </GlossyButton>
          </div>
        </form>

        {/* Links to onboarding */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500 font-bold">
          <Link href="/onboarding" className="hover:text-cyan-400 transition-colors flex items-center gap-1 group">
            <span>רישום מפקד חדש (Onboarding)</span>
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/select-role" className="hover:text-orange-400 transition-colors">
            הדמיית תפקידים וכניסת פיתוח
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
