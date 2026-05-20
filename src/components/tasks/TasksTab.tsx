import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { GlassCard } from '../tactical/GlassCard';
import { StatusBadge } from '../tactical/StatusBadge';
import { Task, TaskStatusType, TaskPriorityType, TaskCategoryType, FrameType } from '@/lib/types';
import { formatDateOnly, cn } from '@/lib/utils';
import { 
  Plus, Calendar, Search, Filter, AlertOctagon, HelpCircle, Check, 
  X, Trash2, Edit2, AlertCircle, CalendarRange 
} from 'lucide-react';

export const TasksTab: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask, profiles, currentUser, activeRole, activeFrame } = useApp();
  
  // Drawer States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterFrame, setFilterFrame] = useState<string>('all');

  // Form States (New Task)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [taskFrame, setTaskFrame] = useState<FrameType>('פלוגה');
  const [priority, setPriority] = useState<TaskPriorityType>('רגיל');
  const [category, setCategory] = useState<TaskCategoryType>('לוחמה');
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [outputRequired, setOutputRequired] = useState('');
  const [controlQuestion1, setControlQuestion1] = useState('');
  const [controlQuestion2, setControlQuestion2] = useState('');
  const [requiresCommanderDecision, setRequiresCommanderDecision] = useState(false);

  // Form States (Edit Task extra fields)
  const [editStatus, setEditStatus] = useState<TaskStatusType>('חדשה');
  const [editStuckReason, setEditStuckReason] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const resolvedRole = activeRole || currentUser?.role;
  const resolvedFrame = activeFrame || currentUser?.assigned_frame;

  // Filter Logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    // Frame scope security: if activeFrame is a department, user can only see department tasks
    const matchesFrame = 
      resolvedFrame === 'פלוגה' 
        ? (filterFrame === 'all' || task.assigned_frame === filterFrame)
        : task.assigned_frame === resolvedFrame;

    return matchesSearch && matchesStatus && matchesPriority && matchesFrame;
  });

  const handleOpenCreate = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    // Default owner to first active user
    const activeUsers = profiles.filter(p => p.status === 'approved');
    setOwnerId(activeUsers[0]?.id || '');
    setTaskFrame((resolvedFrame === 'פלוגה' || !resolvedFrame) ? 'פלוגה' : resolvedFrame);
    setPriority('רגיל');
    setCategory('לוחמה');
    setDeadline(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setLocation('');
    setOutputRequired('');
    setControlQuestion1('');
    setControlQuestion2('');
    setRequiresCommanderDecision(false);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setOwnerId(task.owner_id);
    setTaskFrame(task.assigned_frame);
    setPriority(task.priority);
    setCategory(task.category);
    setDeadline(new Date(task.deadline).toISOString().split('T')[0]);
    setLocation(task.location || '');
    setOutputRequired(task.output_required);
    setControlQuestion1(task.control_questions[0] || '');
    setControlQuestion2(task.control_questions[1] || '');
    setRequiresCommanderDecision(task.requires_commander_decision);
    setEditStatus(task.status);
    setEditStuckReason(task.stuck_reason || '');
    setEditNotes(task.notes || '');
    setDrawerOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const owner = profiles.find(p => p.id === ownerId);

    const taskPayload = {
      title,
      description,
      creator_id: currentUser?.id || 'system',
      creator_name: currentUser?.full_name || 'מערכת',
      owner_id: ownerId,
      owner_name: owner?.full_name || 'לא הוקצה',
      assigned_frame: taskFrame,
      status: editingTask ? editStatus : ('חדשה' as TaskStatusType),
      priority,
      category,
      deadline: new Date(deadline).toISOString(),
      location: location || undefined,
      output_required: outputRequired,
      control_questions: [controlQuestion1, controlQuestion2].filter(Boolean),
      requires_commander_decision: requiresCommanderDecision,
      stuck_reason: editStatus === 'תקוע' ? editStuckReason : undefined,
      notes: editNotes || undefined
    };

    if (editingTask) {
      updateTask(editingTask.id, taskPayload);
    } else {
      addTask(taskPayload);
    }
    setDrawerOpen(false);
  };

  // Simulate ICS Calendar Export
  const handleExportIcs = () => {
    const calendarContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Pluga//CommandRebuild//HE\n` + 
      filteredTasks.map(t => 
        `BEGIN:VEVENT\nSUMMARY:${t.title}\nDESCRIPTION:${t.description}\nDTSTART:${t.deadline.replace(/[-:]/g, '').split('.')[0]}Z\nLOCATION:${t.location || 'בסיס'}\nEND:VEVENT\n`
      ).join('') + `END:VCALENDAR`;

    const blob = new Blob([calendarContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `לוז_משימות_פלוגה_${new Date().toISOString().split('T')[0]}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const framesList: FrameType[] = [
    'פלוגה', 'מפל"ג', 'מחלקה 1', 'מחלקה 2', 'מחלקה 3', 'מחלקה 4', 
    'כיתה 1', 'כיתה 2', 'כיתה 3', 'כיתה 4'
  ];

  return (
    <div className="space-y-6 relative">
      {/* Search and Filters panel */}
      <GlassCard className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-6">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="חפש משימה..."
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
            <option value="חדשה">חדשה</option>
            <option value="לביצוע">לביצוע</option>
            <option value="בתהליך">בתהליך</option>
            <option value="ממתין לאישור">ממתין לאישור</option>
            <option value="הושלם">הושלם</option>
            <option value="תקוע">תקוע</option>
          </select>

          {/* Priority filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-950/70 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-slate-350 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
          >
            <option value="all">כל העדפויות</option>
            <option value="רגיל">רגיל</option>
            <option value="חשוב">חשוב</option>
            <option value="דחוף">דחוף</option>
            <option value="קריטי">קריטי</option>
          </select>

          {/* Frame filter - Hidden if user frame is a specific department */}
          {resolvedFrame === 'פלוגה' && (
            <select
              value={filterFrame}
              onChange={(e) => setFilterFrame(e.target.value)}
              className="bg-slate-950/70 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-slate-350 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              <option value="all">כל המסגרות</option>
              {framesList.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          )}
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportIcs}
            className="flex items-center gap-1.5 px-3 py-1.8 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
          >
            <CalendarRange className="w-3.5 h-3.5" />
            יצוא ICS
          </button>
          
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-1.8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.15)]"
          >
            <Plus className="w-4 h-4" />
            הוצאת משימה
          </button>
        </div>
      </GlassCard>

      {/* Tasks Table */}
      <GlassCard>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center gap-2">
            <Check className="w-8 h-8 text-emerald-500" />
            <p className="text-sm font-semibold">לא נמצאו משימות המתאימות לסינון.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-500 font-bold">
                  <th className="pb-3 px-4 font-black">משימה</th>
                  <th className="pb-3 font-black">קטגוריה</th>
                  <th className="pb-3 font-black">דרג מבצע</th>
                  <th className="pb-3 font-black">אחראי</th>
                  <th className="pb-3 font-black">תאריך יעד</th>
                  <th className="pb-3 font-black">עדיפות</th>
                  <th className="pb-3 font-black">סטטוס</th>
                  <th className="pb-3 pe-4 text-left font-black">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-xs text-slate-350">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-900/10 transition-all group">
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5">
                          {task.requires_commander_decision && (
                            <span title="דורש החלטת מפקד">
                              <AlertOctagon className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                            </span>
                          )}
                          {task.title}
                        </span>
                        {task.stuck_reason && (
                          <span className="text-[10px] text-[#ff0054] font-medium mt-0.5 max-w-[200px] truncate">
                            ⚠️ תקוע: {task.stuck_reason}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-400">{task.category}</td>
                    <td className="py-3.5 text-cyan-400 font-semibold">{task.assigned_frame}</td>
                    <td className="py-3.5">{task.owner_name}</td>
                    <td className="py-3.5 font-mono">{formatDateOnly(task.deadline)}</td>
                    <td className="py-3.5">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                        task.priority === 'קריטי' && "bg-[#ff0054]/10 text-[#ff0054] border-[#ff0054]/20",
                        task.priority === 'דחוף' && "bg-orange-500/10 text-orange-400 border-orange-500/20",
                        task.priority === 'חשוב' && "bg-[#fee440]/10 text-[#fee440] border-[#fee440]/20",
                        task.priority === 'רגיל' && "bg-slate-800 text-slate-400 border-slate-700/50"
                      )}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="py-3.5 pe-4 text-left">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-1 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-lg text-slate-400 hover:text-cyan-400 cursor-pointer transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 hover:bg-[#ff0054]/10 border border-transparent hover:border-[#ff0054]/20 rounded-lg text-slate-500 hover:text-[#ff0054] cursor-pointer transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Sliding Side Drawer for Create/Edit Task */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
          />

          {/* Drawer Body Container */}
          <div className="relative w-full max-w-md bg-slate-950 border-s border-slate-800/80 p-6 flex flex-col h-full overflow-y-auto shadow-2xl animate-slide-in-ltr z-10 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
              <h3 className="text-base font-black text-slate-100">
                {editingTask ? 'עריכה ובקרת משימה' : 'הוצאת משימה פלוגתית חדשה'}
              </h3>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">כותרת המשימה</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-cyan-500/50"
                  placeholder="לדוגמה: ביצוע ביקורת רכבים פלוגתית..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">תיאור ופרטים נוספים</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-cyan-500/50"
                  placeholder="פרט את מטרות המשימה, מתווה ושלבים..."
                />
              </div>

              {/* Status & Stuck fields - ONLY in edit mode */}
              {editingTask && (
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">סטטוס משימה</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as TaskStatusType)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                      >
                        <option value="חדשה">חדשה</option>
                        <option value="לביצוע">לביצוע</option>
                        <option value="בתהליך">בתהליך</option>
                        <option value="ממתין לאישור">ממתין לאישור</option>
                        <option value="הושלם">הושלם</option>
                        <option value="תקוע">תקוע</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">החלטת מ"פ נדרשת</label>
                      <div className="flex items-center h-9 ps-1">
                        <input
                          type="checkbox"
                          checked={requiresCommanderDecision}
                          onChange={(e) => setRequiresCommanderDecision(e.target.checked)}
                          className="w-4 h-4 text-cyan-500 border-slate-850 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-xs text-slate-300 ms-2">כן, דורש התערבות</span>
                      </div>
                    </div>
                  </div>

                  {editStatus === 'תקוע' && (
                    <div className="animate-pulse-soft">
                      <label className="block text-xs font-semibold text-[#ff0054] mb-1">
                        ⚠️ סיבת תקיעת המשימה (חובה)
                      </label>
                      <input
                        type="text"
                        required
                        value={editStuckReason}
                        onChange={(e) => setEditStuckReason(e.target.value)}
                        className="w-full bg-slate-950 border border-[#ff0054]/30 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-[#ff0054]"
                        placeholder="פרט למה המשימה תקועה ואיזה מענה נדרש..."
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">אחראי (מבצע)</label>
                  <select
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                  >
                    {profiles.filter(p => p.status === 'approved').map(p => (
                      <option key={p.id} value={p.id}>{p.full_name} ({p.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">דרג/מסגרת</label>
                  <select
                    disabled={resolvedFrame !== 'פלוגה'}
                    value={taskFrame}
                    onChange={(e) => setTaskFrame(e.target.value as FrameType)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 cursor-pointer disabled:opacity-50"
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
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriorityType)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                  >
                    <option value="רגיל">רגיל</option>
                    <option value="חשוב">חשוב</option>
                    <option value="דחוף">דחוף</option>
                    <option value="קריטי">קריטי</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">קטגוריה</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TaskCategoryType)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                  >
                    <option value="לוחמה">לוחמה</option>
                    <option value="חניכה">חניכה</option>
                    <option value="מנהלה">מנהלה</option>
                    <option value="לוגיסטיקה">לוגיסטיקה</option>
                    <option value="חינוך">חינוך</option>
                    <option value="ערכים">ערכים</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">תאריך יעד</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">מיקום לביצוע</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-cyan-500/50"
                    placeholder={"משרד מ\"פ, מטווחים, שטח וכו'"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">התוצר הנדרש לבקרה</label>
                <input
                  type="text"
                  required
                  value={outputRequired}
                  onChange={(e) => setOutputRequired(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-cyan-500/50"
                  placeholder="דוח חתום, מצגת מאושרת, סיום ביקורת..."
                />
              </div>

              {/* Platoon Commander Control Questions */}
              <div className="p-4.5 rounded-2xl border border-slate-900 bg-slate-950/40 space-y-3">
                <span className="text-[11px] font-black text-cyan-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  שאלות בקרת מפקד פלוגה (HUD Control)
                </span>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    value={controlQuestion1}
                    onChange={(e) => setControlQuestion1(e.target.value)}
                    className="w-full bg-slate-900/40 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-350 focus:outline-none focus:border-cyan-500/50"
                    placeholder="שאלה בולטת 1... (לדוגמה: האם אושר ציר המילוט?)"
                  />
                  <input
                    type="text"
                    value={controlQuestion2}
                    onChange={(e) => setControlQuestion2(e.target.value)}
                    className="w-full bg-slate-900/40 border border-slate-850 rounded-xl py-2 px-3 text-xs text-slate-350 focus:outline-none focus:border-cyan-500/50"
                    placeholder="שאלה בולטת 2... (לדוגמה: האם יש חובש מלווה?)"
                  />
                </div>
              </div>

              {editingTask && (
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">הערות ועדכונים מהשטח</label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-cyan-500/50"
                    placeholder="הוסף עדכון, סטטוס מפורט..."
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {editingTask ? 'שמור שינויים ועדכן בלוח' : 'הוצאת משימה ואישור שילוח'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
