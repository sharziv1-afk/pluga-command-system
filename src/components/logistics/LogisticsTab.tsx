import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { GlassCard } from '../tactical/GlassCard';
import { StatusBadge } from '../tactical/StatusBadge';
import { LogisticsRequest, RequestStatusType, RequestTypeType, FrameType } from '@/lib/types';
import { formatDateOnly, cn } from '@/lib/utils';
import { 
  Plus, Search, Filter, Truck, Calendar, X, Check, Clock, 
  Settings, CheckCircle, PackageOpen, AlertOctagon 
} from 'lucide-react';

export const LogisticsTab: React.FC = () => {
  const { requests, addRequest, updateRequest, profiles, currentUser, activeRole, activeFrame } = useApp();
  
  // Drawer States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<LogisticsRequest | null>(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Form States (New Request)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestFrame, setRequestFrame] = useState<FrameType>('מחלקה 1');
  const [type, setType] = useState<RequestTypeType>('ציוד');
  const [dueDate, setDueDate] = useState('');

  // Edit status states (RSAP mode)
  const [editStatus, setEditStatus] = useState<RequestStatusType>('נפתחה');

  const resolvedRole = activeRole || currentUser?.role;
  const resolvedFrame = activeFrame || currentUser?.assigned_frame;

  const isLogisticsManager = resolvedRole === 'רס"פ' || resolvedRole === 'מ"פ' || resolvedRole === 'סמ"פ';

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.title.toLowerCase().includes(search.toLowerCase()) ||
      req.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesType = filterType === 'all' || req.type === filterType;
    
    // Non-logistics managers can only see requests from their own frame
    const matchesFrame = isLogisticsManager || req.requesting_frame === resolvedFrame;

    return matchesSearch && matchesStatus && matchesType && matchesFrame;
  });

  const handleOpenCreate = () => {
    setEditingRequest(null);
    setTitle('');
    setDescription('');
    setRequestFrame((resolvedFrame === 'פלוגה' || !resolvedFrame) ? 'מחלקה 1' : resolvedFrame);
    setType('ציוד');
    setDueDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (req: LogisticsRequest) => {
    if (!isLogisticsManager) return; // Only RSAP/MP/SMP can modify status
    setEditingRequest(req);
    setEditStatus(req.status);
    setDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingRequest) {
      updateRequest(editingRequest.id, { status: editStatus });
    } else {
      addRequest({
        title,
        description,
        requesting_frame: requestFrame,
        requested_by: currentUser?.id || 'system',
        requested_by_name: currentUser?.full_name || 'מפקד',
        status: 'נפתחה',
        type,
        due_date: new Date(dueDate).toISOString()
      });
    }
    setDrawerOpen(false);
  };

  const requestTypes: RequestTypeType[] = ['ציוד', 'כשירות', 'תחמושת', 'הזנה', 'אחר'];
  const framesList: FrameType[] = ['מחלקה 1', 'מחלקה 2', 'מחלקה 3', 'מחלקה 4', 'מפל"ג', 'פלוגה'];

  return (
    <div className="space-y-6 relative">
      {/* 🚚 Logistics Command Banner for RSAP */}
      {isLogisticsManager && (
        <GlassCard className="border-[#ff6b02]/30 bg-gradient-to-r from-slate-950 via-slate-900/40 to-slate-950 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ff6b02]/10 border border-[#ff6b02]/35 text-[#ff6b02]">
              <Truck className="w-5 h-5 animate-bounce-soft" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-100 uppercase tracking-wider">HUD שליטת רס"פ / לוגיסטיקה פעיל</h2>
              <p className="text-[11px] text-slate-450 mt-0.5">
                יש לך הרשאות ניהול גלובליות. לחיצה על דרישה כלשהי תפתח את חלונית עדכון הסטטוס המהיר לניהול מלאי ואספקה.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-900 border border-slate-800 rounded px-2 py-0.5">
            הרשאה פעילה: {resolvedRole} • {resolvedFrame}
          </span>
        </GlassCard>
      )}

      {/* Controls & Filters */}
      <GlassCard className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-6">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="חפש דרישת ציוד..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950/70 border border-slate-800 rounded-xl py-1.5 ps-9 pe-4 text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-cyan-500/50 w-full"
            />
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-slate-350 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="נפתחה">נפתחה</option>
            <option value="בטיפול">בטיפול</option>
            <option value="ממתין לאישור">ממתין לאישור</option>
            <option value="סופק">סופק</option>
            <option value="תקוע">תקוע</option>
          </select>

          {/* Filter Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-slate-350 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="all">כל הסוגים</option>
            {requestTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-1.8 rounded-xl bg-[#ff6b02] hover:bg-[#ef5b00] text-slate-950 text-xs font-black cursor-pointer shadow-[0_0_12px_rgba(255,107,2,0.15)]"
        >
          <Plus className="w-4 h-4" />
          דרישה חדשה
        </button>
      </GlassCard>

      {/* Requests Table */}
      <GlassCard>
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center gap-2">
            <PackageOpen className="w-8 h-8 text-slate-700" />
            <p className="text-sm font-semibold">לא נמצאו דרישות אספקה.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-500 font-bold">
                  <th className="pb-3 px-4 font-black">הדרישה</th>
                  <th className="pb-3 font-black">סוג ציוד</th>
                  <th className="pb-3 font-black">מחלקה דורשת</th>
                  <th className="pb-3 font-black">מבקש</th>
                  <th className="pb-3 font-black">מטפל (רס"פ)</th>
                  <th className="pb-3 font-black">מועד אספקה מבוקש</th>
                  <th className="pb-3 font-black">סטטוס אספקה</th>
                  {isLogisticsManager && <th className="pb-3 pe-4 text-left font-black">פעולות</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-xs text-slate-350">
                {filteredRequests.map((req) => (
                  <tr 
                    key={req.id} 
                    onClick={() => isLogisticsManager && handleOpenEdit(req)}
                    className={cn(
                      "transition-all",
                      isLogisticsManager ? "hover:bg-slate-900/15 cursor-pointer group" : "hover:bg-slate-900/5"
                    )}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      <div className="flex flex-col">
                        <span>{req.title}</span>
                        <span className="text-[10px] text-slate-500 font-semibold mt-0.5 truncate max-w-xs">
                          {req.description}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-400">{req.type}</td>
                    <td className="py-3.5 text-cyan-400 font-bold">{req.requesting_frame}</td>
                    <td className="py-3.5">{req.requested_by_name}</td>
                    <td className="py-3.5 text-slate-400">{req.handler_name || 'טרם שויך'}</td>
                    <td className="py-3.5 font-mono">{formatDateOnly(req.due_date)}</td>
                    <td className="py-3.5">
                      <StatusBadge status={req.status} />
                    </td>
                    {isLogisticsManager && (
                      <td className="py-3.5 pe-4 text-left">
                        <span className="inline-flex items-center gap-1 text-cyan-400 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all">
                          <Settings className="w-3 h-3 animate-spin-soft" />
                          נהל
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Slide Drawer for Logistics */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
          />

          <div className="relative w-full max-w-md bg-slate-950 border-s border-slate-800/80 p-6 flex flex-col h-full overflow-y-auto shadow-2xl animate-slide-in-ltr z-10 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
              <h3 className="text-base font-black text-slate-100">
                {editingRequest ? 'עדכון סטטוס אספקה (רס"פ)' : 'הגשת דרישה לוגיסטית חדשה'}
              </h3>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 flex-1">
              {editingRequest ? (
                // RSAP Status Update Only Panel
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border border-slate-850 bg-slate-900/20 text-xs">
                    <p className="font-bold text-slate-200">שם הדרישה: <span className="text-slate-350 font-semibold">{editingRequest.title}</span></p>
                    <p className="text-slate-400 mt-1">מחלקה: <span className="text-cyan-400 font-bold">{editingRequest.requesting_frame}</span></p>
                    <p className="text-slate-450 mt-1">פירוט: {editingRequest.description}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">עדכן סטטוס טיפול לוגיסטי</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as RequestStatusType)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-[#ff6b02] cursor-pointer"
                    >
                      <option value="נפתחה">נפתחה (דרישה חדשה)</option>
                      <option value="בטיפול">בטיפול (בבדיקת מלאי/שילוח)</option>
                      <option value="ממתין לאישור">ממתין לאישור מפקד</option>
                      <option value="סופק">סופק (הציוד נמשך בהצלחה)</option>
                      <option value="תקוע">תקוע (חסר במחסן חטיבה)</option>
                    </select>
                  </div>
                </div>
              ) : (
                // New Request Panel
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">נושא הדרישה</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-[#ff6b02]"
                      placeholder="לדוגמה: השלמת 15 מצרפי מנות קרב..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">פירוט וכמויות</label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-[#ff6b02]"
                      placeholder="פרט מידות, דגמים או תנאי אספקה..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">סוג דרישה</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as RequestTypeType)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-[#ff6b02] cursor-pointer"
                      >
                        {requestTypes.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">המחלקה הדורשת</label>
                      <select
                        disabled={resolvedFrame !== 'פלוגה'}
                        value={requestFrame}
                        onChange={(e) => setRequestFrame(e.target.value as FrameType)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-[#ff6b02] cursor-pointer disabled:opacity-50"
                      >
                        {framesList.map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">מועד אספקה מבוקש</label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-[#ff6b02]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#ff6b02] hover:bg-[#ef5b00] text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(255,107,2,0.2)] flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {editingRequest ? 'שמור שינוי סטטוס אספקה' : 'הגש דרישת אספקה לרס"פ'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
