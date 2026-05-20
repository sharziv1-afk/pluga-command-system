'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlossyButton } from '@/components/ui/GlossyButton';
import { Shield, Users, ArrowRight, UserCheck } from 'lucide-react';
import { RoleType, FrameType } from '@/types';

interface SimulationUser {
  name: string;
  role: RoleType;
  frame: FrameType;
  description: string;
  badgeColor: 'cyan' | 'orange' | 'slate';
}

export default function SelectRolePage() {
  const router = useRouter();

  const mockUsers: SimulationUser[] = [
    {
      name: 'רס"ן אוריאל דוד',
      role: 'מ"פ',
      frame: 'פלוגה',
      description: 'גישת פיקוד עליונה פלוגתית, אישור מפקדים ממתינים, צפייה בכלל המשימות והפערים.',
      badgeColor: 'cyan',
    },
    {
      name: 'קפטן איתי לוין',
      role: 'סמ"פ',
      frame: 'פלוגה',
      description: 'גישת סגן מפקד, ניהול משימות לוגיסטיקה, בקרה פלוגתית מלאה ואישור מפקדים.',
      badgeColor: 'cyan',
    },
    {
      name: 'סג"ם רועי אלבז',
      role: 'מ"מ',
      frame: 'מחלקה 1',
      description: 'ניהול משימות מחלקה 1, הגשת דרישות אספקה, דיווח נוכחות לפורום הפלוגתי.',
      badgeColor: 'orange',
    },
    {
      name: 'רס"ל גלעד צור',
      role: 'רס"פ',
      frame: 'מפל"ג',
      description: 'ניהול אספקה, ציוד טקטי ותחמושת, סגירת מעגל בדרישות לוגיסטיקה פלוגתיות.',
      badgeColor: 'slate',
    },
    {
      name: 'סמ"ר יניב כהן',
      role: 'מ"כ',
      frame: 'כיתה 1',
      description: 'עדכון סטטוס משימות כיתה 1, בקשות ציוד ישירות לריכוז הרס"פ.',
      badgeColor: 'slate',
    },
  ];

  const handleSelectUser = (user: SimulationUser) => {
    // סימולציית הגדרת משתמש ב-Context או LocalStorage (בשלב 2)
    // בשלב הנוכחי מעביר ישירות לדשבורד
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#030712] relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
      {/* Tactical background elements */}
      <div className="tactical-overlay" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl bg-slate-950/20 z-10 py-6">
        <GlassCard className="w-full bg-slate-950/65 border-slate-900/80 backdrop-blur-2xl shadow-2xl" glow="none">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/35 text-cyan-400 mb-4 shadow-[0_0_15px_rgba(0,229,255,0.15)] animate-pulse">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-black text-slate-100 tracking-wider">סימולציית מפעיל מערכת</h1>
            <p className="text-xs text-slate-400 mt-1">סביבת הדמיית תפקידים לצורכי בקרת איכות ופיתוח</p>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent mt-3" />
          </div>

          {/* Role selector items */}
          <div className="space-y-4">
            {mockUsers.map((user, idx) => (
              <div 
                key={idx}
                onClick={() => handleSelectUser(user)}
                className="group flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-900 hover:border-cyan-500/40 hover:bg-cyan-500/[0.02] cursor-pointer transition-all duration-300 gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl bg-slate-900/80 border ${
                    user.badgeColor === 'cyan' ? 'border-cyan-500/20 text-cyan-400' :
                    user.badgeColor === 'orange' ? 'border-orange-500/20 text-orange-400' :
                    'border-slate-800 text-slate-400'
                  } flex items-center justify-center`}>
                    <UserCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-200">{user.name}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                        user.badgeColor === 'cyan' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                        user.badgeColor === 'orange' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-slate-850 text-slate-400 border-slate-700'
                      }`}>
                        {user.role} ({user.frame})
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 max-w-md leading-relaxed">{user.description}</p>
                  </div>
                </div>

                <div className="self-end md:self-center opacity-0 group-hover:opacity-100 transition-opacity pl-2">
                  <span className="text-[10px] font-black text-cyan-400 flex items-center gap-1">
                    כנס כמדמה 
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-900 flex justify-center">
            <Link
              href="/login"
              className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl hover:bg-slate-900 text-xs font-black text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>חזרה למסך התחברות</span>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
