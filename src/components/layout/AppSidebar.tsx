'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationItems } from '@/data/navigation';
import { Shield, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-950/80 border-e border-slate-900/60 backdrop-blur-xl fixed inset-y-0 right-0 z-30 select-none text-right">
      {/* 🚀 Brand Cockpit Header */}
      <div className="flex items-center gap-2.5 p-6 border-b border-slate-900">
        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/35 text-cyan-400">
          <Shield className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-sm font-black text-slate-100 uppercase tracking-wider">המפקד</h1>
          <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mt-0.5">סייבר פיקוד פלוגתי</p>
        </div>
      </div>

      {/* 📋 Sidebar Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (pathname === '/' && item.path === '/dashboard');
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border border-transparent group",
                isActive 
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_12px_rgba(0,229,255,0.06)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 hover:border-slate-900"
              )}
            >
              <Icon className={cn(
                "w-4 h-4 transition-all duration-300",
                isActive ? "text-cyan-400 animate-pulse" : "text-slate-500 group-hover:text-cyan-500/70"
              )} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 👤 Commander Info Section */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/40">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/30 border border-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-800">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] font-black text-slate-200">סרן אלון כהן</span>
              <span className="block text-[9px] text-slate-500">מפקד פלוגה ג׳</span>
            </div>
          </div>
          
          <Link
            href="/login"
            title="התנתק"
            className="p-1 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-[#ff0054] transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
