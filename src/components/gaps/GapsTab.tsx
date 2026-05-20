import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { GlassCard } from '../tactical/GlassCard';
import { StatusBadge } from '../tactical/StatusBadge';
import { Gap, GapCategoryType, GapStatusType, UrgencyType, FrameType, TaskPriorityType, TaskCategoryType } from '@/lib/types';
import { formatDateOnly, cn } from '@/lib/utils';
import { 
  Plus, Search, Filter, AlertTriangle, ArrowRightLeft, X, Check, 
  HelpCircle, ChevronRight, FileCode, CheckSquare 
} from 'lucide-react';

export const GapsTab: React.FC = () => {
  const { gaps, addGap, updateGap, convertGapToTask, profiles, currentUser, activeRole, activeFrame } = useApp();

  // Drawer States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [convertingGap, setConvertingGap] = useState<Gap | null>(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form States (New Gap)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GapCategoryType>('לוגיסטי');
  const [urgency, setUrgency] = useState<UrgencyType>('רגיל');
  const [gapFrame, setGapFrame] = useState<FrameType>('מחלקה 1');
  const [requiresDecision, setRequiresDecision] = useState(false);

  // Form States (Conversion to Task)
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskOwnerId, setTaskOwnerId] = useState('');
  const [taskFrame, setTaskFrame] = useState<FrameType>('מחלקה 1');
  const [taskPriority, setTaskPriority] = useState<TaskPriorityType>('חשוב');
  const [taskCat, setTaskCat] = useState<TaskCategoryType>('לוגיסטיקה');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskOutput, setTaskOutput] = useState('');

  const resolvedRole = activeRole || currentUser?.role;
  const resolvedFrame = activeFrame || currentUser?.assigned_frame;

  const isCommander = resolvedRole === 'מ"פ' || resolvedRole === 'סמ"פ' || resolvedRole === 'מ"מ';

  // Filter Gaps
  const filteredGaps = gaps.filter(gap => {
    const matchesSearch = 
      gap.title.toLowerCase().includes(search.toLowerCase()) ||
      gap.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'all' || gap.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || gap.category === filterCategory;

    // View boundaries
    const matchesFrame = resolvedFrame === 'פלוגה' || gap.assigned_frame === resolvedFrame;

    return matchesSearch && matchesStatus && matchesCategory && matchesFrame;
  });

  const handleOpenCreate = () => {
    setConvertingGap(null);
    setTitle('');
    setDescription('');
    setCategory('לוגיסטי');
    setUrgency('רגיל');
    setGapFrame((resolvedFrame === 'פלוגה' || !resolvedFrame) ? 'מחלקה 1' : resolvedFrame);
    setRequiresDecision(false);
    setDrawerOpen(true);
  };

  const handleOpenConversion = (gap: Gap) => {
    setConvertingGap(gap);
    setTaskTitle(`פתרון פער: ${gap.title}`);
    setTaskDesc(`משימה זו נוצרה כדי לסגור את הפער שדווח:\n"${gap.description}"`);
    setTaskFrame(gap.assigned_frame);
    
    // Convert urgency to priority
    const priorityMap: Record<UrgencyType, TaskPriorityType> = {
      'רגיל': 'רגיל',
      'חשוב': 'חשוב',
      'דחוף': 'דחוף',
      'קריטי': 'קריטי'
    };
    setTaskPriority(priorityMap[gap.urgency]);

    // Convert gap category to task category
    const categoryMap: Record<GapCategoryType, TaskCategoryType> = {
      'לוגיסטי': 'לוגיסטיקה',
      'הדרכתי': 'חניכה',
      'לו״זי': 'מנהלה'
    };
    setTaskCat(categoryMap[gap.category]);

    // Defaults
    const activeUsers = profiles.filter(p => p.status === 'approved');
    setTaskOwnerId(activeUsers[0]?.id || '');
    setTaskDeadline(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setTaskOutput('הוכחה לסגירת הפער ופתרון הבעיה בשטח');
    setDrawerOpen(true);
  };

  const handleSubmitGap = (e: React.FormEvent) => {
    e.preventDefault();
    addGap({
      title,
      description,
      category,
      urgency,
      reported_by: currentUser?.id || 'system',
      reported_by_name: currentUser?.full_name || 'מפקד',
      assigned_frame: gapFrame,
      status: 'פתוח',
      requires_commander_decision: requiresDecision
    });
    setDrawerOpen(false);
  };

  const handleSubmitConversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingGap) return;

    const owner = profiles.find(p => p.id === taskOwnerId);

    convertGapToTask(convertingGap.id, {
      title: taskTitle,
      description: taskDesc,
      creator_id: currentUser?.id || 'system',
      creator_name: currentUser?.full_name || 'מערכת',
      owner_id: taskOwnerId,
      owner_name: owner?.full_name || 'לא הוקצה',
      assigned_frame: taskFrame,
      status: 'לביצוע',
      priority: taskPriority,
      category: taskCat,
      deadline: new Date(taskDeadline).toISOString(),
      output_required: taskOutput,
      control_questions: ['האם הפער נפתר לגמרי?', 'האם העדכון נקלט ביומן?'],
      requires_commander_decision: false
    });

    setDrawerOpen(false);
  };

  const framesList: FrameType[] = ['מחלקה 1', 'מחלקה 2', 'מחלקה 3', 'מחלקה 4', 'מפל"ג', 'פלוגה'];

  return (
    <div className="space-y-6 relative">
      {/* Search and Filters panel */}
      <GlassCard className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-6">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="חפש פער פלוגתי..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-950/70 border border-slate-800 rounded-xl py-1.5 ps-9 pe-4 text-xs text-slate-200 placeholder-slate-655 focus:outline-none focus:border-cyan-500/50 w-full"
            />
          </div>

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-slate-350 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="פתוח">פתוח</option>
            <option value="בטיפול">בטיפול</option>
            <option value="נסגר">נסגר</option>
          </select>

          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-slate-350 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="all">כל הקטגוריות</option>
            <option value="לוגיסטי">לוגיסטי</option>
            <option value="הדרכתי">הדרכתי</option>
            <option value="לו״זי">לו״זי</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-1.5 px-4 py-1.8 rounded-xl bg-[#fee440] hover:bg-[#edd22b] text-slate-950 text-xs font-black cursor-pointer shadow-[0_0_12px_rgba(254,228,64,0.15)]"
        >
          <Plus className="w-4 h-4" />
          דיווח פער פלוגתי
        </button>
      </GlassCard>

      {/* Gaps List cards */}
      {filteredGaps.length === 0 ? (
        <GlassCard className="text-center py-12 text-slate-500 flex flex-col items-center justify-center gap-2">
          <AlertTriangle className="w-8 h-8 text-[#fee440]" />
          <p className="text-sm font-semibold">לא נמצאו פערים לא פתורים.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGaps.map((gap) => (
            <GlassCard 
              key={gap.id} 
              className="border-slate-850 hover:border-slate-700/60 p-5 flex flex-col justify-between"
              glow={gap.status === 'פתוח' && gap.urgency === 'קריטי' ? 'danger' : 'none'}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-200">{gap.title}</span>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[8px] font-black border",
                      gap.urgency === 'קריטי' && "bg-[#ff0054]/10 text-[#ff0054] border-[#ff0054]/20 animate-pulse",
                      gap.urgency === 'דחוף' && "bg-orange-500/10 text-orange-400 border-orange-500/20",
                      gap.urgency === 'חשוב' && "bg-[#fee440]/10 text-[#fee440] border-[#fee440]/20",
                      gap.urgency === 'רגיל' && "bg-slate-800 text-slate-400 border-slate-700"
                    )}>
                      {gap.urgency}
                    </span>
                  </div>
                  <StatusBadge status={gap.status} />
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4 whitespace-pre-wrap">
                  {gap.description}
                </p>

                <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-450 mb-4">
                  <p>🛡️ מסגרת פעילה: <span className="text-cyan-400 font-bold">{gap.assigned_frame}</span></p>
                  <p>📂 סיווג פער: <span className="text-slate-300 font-bold">{gap.category}</span></p>
                  <p>📢 מדווח: <span className="text-slate-350">{gap.reported_by_name}</span></p>
                  {gap.notes && <p className="text-amber-400 font-medium">📝 עדכון: {gap.notes}</p>}
                </div>
              </div>

              {/* Conversion and state triggers */}
              <div className="pt-3.5 border-t border-slate-900 flex items-center justify-between gap-3">
                <span className="text-[10px] text-slate-500 font-mono">
                  דיווח: {formatDateOnly(gap.created_at)}
                </span>

                <div className="flex items-center gap-2">
                  {gap.status === 'פתוח' && isCommander && (
                    <button
                      onClick={() => handleOpenConversion(gap)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 transition-all text-xs font-black cursor-pointer shadow-sm group"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-180 transition-all duration-300" />
                      המר למשימת עבודה
                    </button>
                  )}
                  
                  {gap.status !== 'נסגר' && isCommander && (
                    <button
                      onClick={() => updateGap(gap.id, { status: 'נסגר', notes: 'הפער נסגר פיזית בשטח.' })}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#00f5d4]/10 hover:bg-[#00f5d4]/20 text-[#00f5d4] border border-[#00f5d4]/25 transition-all text-xs font-bold cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      סגור פער
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Floating Drawers - Handle either creation or conversion */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
          />

          <div className="relative w-full max-w-md bg-slate-950 border-s border-slate-800/80 p-6 flex flex-col h-full overflow-y-auto shadow-2xl animate-slide-in-ltr z-10 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
              <h3 className="text-base font-black text-slate-100">
                {convertingGap ? 'המרת פער למשימה פלוגתית' : 'דיווח פער פלוגתי חדש'}
              </h3>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {convertingGap ? (
              // 📋 CONVERSION FORM
              <form onSubmit={handleSubmitConversion} className="space-y-4">
                <div className="p-4 rounded-xl border border-[#fee440]/25 bg-[#fee440]/5 text-xs text-slate-350 leading-relaxed mb-2">
                  <span className="font-bold text-[#fee440]">פער מקורי: </span>
                  {convertingGap.title}
                  <p className="mt-1 font-mono text-[10px] text-slate-500">
                    מחלקה: {convertingGap.assigned_frame} • דחיפות: {convertingGap.urgency}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">נושא משימת הפתרון</label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">פירוט המשימה והפתרון</label>
                  <textarea
                    required
                    rows={3}
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">אחראי (בעלים)</label>
                    <select
                      value={taskOwnerId}
                      onChange={(e) => setTaskOwnerId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none cursor-pointer"
                    >
                      {profiles.filter(p => p.status === 'approved').map(p => (
                        <option key={p.id} value={p.id}>{p.full_name} ({p.role})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">דרג / מסגרת</label>
                    <select
                      value={taskFrame}
                      onChange={(e) => setTaskFrame(e.target.value as FrameType)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none cursor-pointer"
                    >
                      {framesList.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">עדיפות משימה</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as TaskPriorityType)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="רגיל">רגיל</option>
                      <option value="חשוב">חשוב</option>
                      <option value="דחוף">דחוף</option>
                      <option value="קריטי">קריטי</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">קטגוריית משימה</label>
                    <select
                      value={taskCat}
                      onChange={(e) => setTaskCat(e.target.value as TaskCategoryType)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="לוחמה">לוחמה</option>
                      <option value="חניכה">חניכה</option>
                      <option value="מנהלה">מנהלה</option>
                      <option value="לוגיסטיקה">לוגיסטיקה</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">תאריך יעד</label>
                    <input
                      type="date"
                      required
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">תוצר נדרש לבקרה</label>
                    <input
                      type="text"
                      required
                      value={taskOutput}
                      onChange={(e) => setTaskOutput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <CheckSquare className="w-4 h-4" />
                  צור משימה וקשר לפער המקורי
                </button>
              </form>
            ) : (
              // ⚠️ NEW GAP FORM
              <form onSubmit={handleSubmitGap} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">נושא הפער / חוסר</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-[#fee440]/55"
                    placeholder="לדוגמה: מחסור במפות ניווט מחלקה 3..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">תיאור הפער וההשפעה שלו</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-[#fee440]/55"
                    placeholder="פרט איזה ציוד חסר, למה זה גורם עיכוב, ואיזה קשיים קיימים..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">סיווג פער</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as GapCategoryType)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="לוגיסטי">לוגיסטי</option>
                      <option value="הדרכתי">הדרכתי</option>
                      <option value="לו״זי">לו״זי</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">דחיפות</label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value as UrgencyType)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="רגיל">רגיל</option>
                      <option value="חשוב">חשוב</option>
                      <option value="דחוף">דחוף</option>
                      <option value="קריטי">קריטי</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">מסגרת משויכת</label>
                    <select
                      disabled={resolvedFrame !== 'פלוגה'}
                      value={gapFrame}
                      onChange={(e) => setGapFrame(e.target.value as FrameType)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none cursor-pointer disabled:opacity-50"
                    >
                      {framesList.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">החלטה פיקודית נדרשת</label>
                    <div className="flex items-center h-9 ps-1">
                      <input
                        type="checkbox"
                        checked={requiresDecision}
                        onChange={(e) => setRequiresDecision(e.target.checked)}
                        className="w-4 h-4 text-[#fee440] border-slate-850 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs text-slate-300 ms-2">כן, מחייב אישור מ"פ</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#fee440] hover:bg-[#edd22b] text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(254,228,64,0.2)] flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <AlertTriangle className="w-4 h-4" />
                  דווח פער פלוגתי לסגל
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
