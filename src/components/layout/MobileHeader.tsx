'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationItems } from '@/data/navigation';
import { Menu, X, Shield, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MobileHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="lg:hidden w-full bg-slate-950/80 border-b border-slate-900/60 backdrop-blur-xl sticky top-0 z-40 select-none text-right px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/35 text-cyan-400">
          <Shield className="w-4 h-4" />
        </div>
        <span className="text-xs font-black text-slate-100">המפקד • פלוגה ג׳</span>
      </div>

      <button
        onClick={toggleMenu}
        className="p-1.5 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer transition-all"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Slide Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[49px] z-30 flex justify-start lg:hidden">
          {/* Backdrop */}
          <div 
            onClick={closeMenu}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
          />

          {/* Drawer Menu */}
          <div className="relative w-64 bg-slate-950 border-s border-slate-900 p-5 flex flex-col h-full shadow-2xl animate-slide-in-ltr z-10">
            <nav className="flex-1 space-y-2 mt-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || (pathname === '/' && item.path === '/dashboard');

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 border border-transparent",
                      isActive 
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-900">
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-slate-900 hover:bg-[#ff0054]/10 text-slate-400 hover:text-[#ff0054] border border-slate-800 hover:border-[#ff0054]/20 transition-all text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                התנתק מהמערכת
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
