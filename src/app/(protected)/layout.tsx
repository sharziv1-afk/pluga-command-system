import React from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#030712] relative flex flex-col lg:flex-row-reverse">
      {/* Tactical scanline/grid overlay */}
      <div className="tactical-overlay" />

      {/* Sidebar (Fixed on the right on Desktop) */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pe-64 min-w-0">
        {/* Mobile Header (Sticky on small screens) */}
        <MobileHeader />

        {/* Scrollable Dashboard Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
