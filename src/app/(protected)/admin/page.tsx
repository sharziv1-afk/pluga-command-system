'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { GlossyButton } from '@/components/ui/GlossyButton';
import { Shield, UserCheck, UserX, Clock, Database } from 'lucide-react';

interface PendingRequest {
  id: string;
  name: string;
  role: string;
  frame: string;
  email: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminPage() {
  const [requests, setRequests] = useState<PendingRequest[]>([
    {
      id: 'REQ-101',
      name: 'סג״ם רועי לוי',
      role: 'מ״מ',
      frame: 'מחלקה 2',
      email: 'roey.l@idf.il',
      date: 'היום, 09:30',
      status: 'pending',
    },
    {
      id: 'REQ-102',
      name: 'סמ״ר יובל אשכנזי',
      role: 'מ״כ',
      frame: 'כיתה 3',
      email: 'yuval.a@idf.il',
      date: 'אתמול, 16:45',
      status: 'pending',
    },
    {
      id: 'REQ-099',
      name: 'סרן אלון גבע',
      role: 'סמ״פ',
      frame: 'פלוגה',
      email: 'alon.g@idf.il',
      date: '18 במאי, 11:20',
      status: 'approved',
    },
  ]);

  const handleAction = (id: string, action: 'approved' | 'rejected') => {
    setRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: action } : req)
    );
  };

  const activeRequests = requests.filter(r => r.status === 'pending');
  const pastRequests = requests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader 
        title="ניהול הרשאות ואישור מפקדים" 
        subtitle="בקרת גישה פלוגתית מאובטחת. כאן מפקד הפלוגה (המ״פ) או הסמ״פ מאשרים בקשות הצטרפות של מפקדים וסגל המפל״ג למערכת."
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Requests Column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-black text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-400" />
            בקשות גישה ממתינות לאישור ({activeRequests.length})
          </h2>

          {activeRequests.length === 0 ? (
            <GlassCard className="py-12 flex flex-col items-center justify-center text-center text-slate-500">
              <UserCheck className="w-8 h-8 mb-3 text-slate-600" />
              <span className="text-xs font-black text-slate-350">אין בקשות גישה ממתינות</span>
              <p className="text-[10px] text-slate-500 mt-1">כל בקשות המפקדים והסגל טופלו ואושרו בהצלחה.</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {activeRequests.map((req) => (
                <GlassCard key={req.id} glow="orange" className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-black text-slate-200">{req.name}</span>
                      <StatusBadge status={req.status} />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-450 font-bold">
                      <span>תפקיד: <strong className="text-orange-450">{req.role}</strong></span>
                      <span>•</span>
                      <span>מסגרת: <strong className="text-slate-300">{req.frame}</strong></span>
                      <span>•</span>
                      <span>דוא״ל: <strong className="text-slate-400 font-mono">{req.email}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    <GlossyButton 
                      variant="slate" 
                      size="sm" 
                      onClick={() => handleAction(req.id, 'rejected')}
                      className="border-slate-800 text-slate-300 hover:bg-[#ff0054]/10 hover:text-[#ff0054] hover:border-[#ff0054]/20"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      דחה גישה
                    </GlossyButton>

                    <GlossyButton 
                      variant="cyan" 
                      size="sm" 
                      onClick={() => handleAction(req.id, 'approved')}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      אשר גישה פלוגתית
                    </GlossyButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* History Column */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            היסטוריית בקשות שטופלו
          </h2>

          <div className="space-y-3">
            {pastRequests.map((req) => (
              <GlassCard key={req.id} className="p-4 bg-slate-950/45 border-slate-900/60" glow="none">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="block text-xs font-black text-slate-300">{req.name}</span>
                    <span className="block text-[9px] text-slate-500 font-bold">{req.role} • {req.frame}</span>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
