import React, { useEffect } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { GlassCard } from '../tactical/GlassCard';
import { UserCheck, UserX, Clock, Users, ShieldAlert, BadgeCheck } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const AdminTab: React.FC = () => {
  const { profiles, approveUser, rejectUser } = useApp();

  const pendingUsers = profiles.filter(p => p.status === 'pending');
  const approvedUsers = profiles.filter(p => p.status === 'approved');

  // Check if there was an automatic demo request to approve a user
  useEffect(() => {
    const autoApproveId = localStorage.getItem('pluga_auto_approve_id');
    if (autoApproveId) {
      // Find the user and approve them
      const user = profiles.find(p => p.id === autoApproveId);
      if (user && user.status === 'pending') {
        approveUser(autoApproveId);
      }
      localStorage.removeItem('pluga_auto_approve_id');
    }
  }, [profiles, approveUser]);

  return (
    <div className="space-y-6">
      {/* Pending Requests Block */}
      <GlassCard glow="orange">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-orange-500 animate-pulse" />
            <h2 className="text-lg font-black text-slate-100">בקשות הצטרפות ממתינות לאישור</h2>
          </div>
          <span className="bg-orange-500/10 text-orange-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-orange-500/30">
            {pendingUsers.length} בקשות בקנה
          </span>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="text-center py-8 text-slate-500 flex flex-col items-center justify-center gap-2">
            <Clock className="w-8 h-8 text-slate-700" />
            <p className="text-sm font-semibold">אין בקשות גישה חדשות כרגע.</p>
            <p className="text-[11px] text-slate-600 max-w-sm">
              כדי לבדוק את התזרים, התנתק, הרשם כמפקד חדש דרך דף הרישום, כנס מחדש כמ"פ ותראה את בקשתו ממתינה כאן!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingUsers.map((user) => (
              <div 
                key={user.id} 
                className="bg-slate-950/70 border border-slate-850 hover:border-orange-500/30 rounded-2xl p-4.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-slate-200">{user.full_name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {user.role}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-400">
                    <p>📧 אימייל: <span className="text-slate-300 font-semibold">{user.email}</span></p>
                    <p>🪖 מסגרת מבוקשת: <span className="text-cyan-400 font-semibold">{user.assigned_frame}</span></p>
                    <p>⏰ מועד רישום: <span className="text-slate-400">{formatDate(user.created_at)}</span></p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => rejectUser(user.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ff0054]/10 hover:bg-[#ff0054]/20 text-[#ff0054] border border-[#ff0054]/25 transition-all text-xs font-bold cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    דחה בקשה
                  </button>
                  <button
                    onClick={() => approveUser(user.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00f5d4] hover:bg-[#00e5c4] text-slate-950 transition-all text-xs font-black cursor-pointer shadow-[0_0_10px_rgba(0,245,212,0.15)]"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    אשר גישה פלוגתית
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Approved Users Roster Block */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-black text-slate-100">סגל מפקדים רשום ומאושר</h2>
          </div>
          <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-cyan-500/30">
            {approvedUsers.length} מפקדים פעילים
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-500 font-bold">
                <th className="pb-3.5 ps-4 font-black">שם המפקד</th>
                <th className="pb-3.5 font-black">תפקיד</th>
                <th className="pb-3.5 font-black">מסגרת</th>
                <th className="pb-3.5 font-black">אימייל צבאי</th>
                <th className="pb-3.5 pe-4 font-black text-left">סטטוס</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 text-xs text-slate-350">
              {approvedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-900/20 transition-all">
                  <td className="py-3.5 ps-4 font-bold text-slate-200">{user.full_name}</td>
                  <td className="py-3.5 font-semibold">{user.role}</td>
                  <td className="py-3.5 text-cyan-400 font-bold">{user.assigned_frame}</td>
                  <td className="py-3.5 text-slate-400 font-mono">{user.email}</td>
                  <td className="py-3.5 pe-4 text-left">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/20">
                      <BadgeCheck className="w-3 h-3" />
                      מאושר במערכת
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
