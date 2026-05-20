import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { GlassCard } from '../tactical/GlassCard';
import { StatusBadge } from '../tactical/StatusBadge';
import { ForumSummary, AbsentDetail, PlanVsActual, FrameType, ForumStatusType } from '@/lib/types';
import { 
  Users, Plus, Share2, Clipboard, Copy, FileText, X, Check, 
  UserPlus, Calendar, ArrowRight, HelpCircle, MessageSquare, Clock
} from 'lucide-react';

export const ForumTab: React.FC = () => {
  const { forumSummaries, addForumSummary, updateForumSummary, currentUser, activeRole, activeFrame } = useApp();

  // Drawer States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewingSummary, setViewingSummary] = useState<ForumSummary | null>(null);

  // Exporter Modal State
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form States (Daily Summary)
  const [presentCount, setPresentCount] = useState(25);
  const [totalCount, setTotalCount] = useState(28);
  const [absentName, setAbsentName] = useState('');
  const [absentReason, setAbsentReason] = useState('');
  const [absentsList, setAbsentsList] = useState<AbsentDetail[]>([]);
  
  const [welfareNotes, setWelfareNotes] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [logisticsNotes, setLogisticsNotes] = useState('');
  const [readinessNotes, setReadinessNotes] = useState('כוננות תקינה ללו"ז');
  
  const [planSubject, setPlanSubject] = useState('');
  const [planPlanned, setPlanPlanned] = useState('');
  const [planActual, setPlanActual] = useState('');
  const [planCompleted, setPlanCompleted] = useState(true);
  const [plansList, setPlansList] = useState<PlanVsActual[]>([]);
  
  const [dailyLesson, setDailyLesson] = useState('');
  const [commanderDecisions, setCommanderDecisions] = useState<string[]>([]);
  const [decisionInput, setDecisionInput] = useState('');

  const resolvedRole = activeRole || currentUser?.role;
  const resolvedFrame = activeFrame || currentUser?.assigned_frame;

  const handleAddAbsent = () => {
    if (!absentName || !absentReason) return;
    setAbsentsList([...absentsList, { name: absentName, reason: absentReason }]);
    setAbsentName('');
    setAbsentReason('');
  };

  const handleAddPlan = () => {
    if (!planSubject || !planPlanned) return;
    setPlansList([...plansList, { 
      subject: planSubject, 
      planned: planPlanned, 
      actual: planActual || 'בוצע', 
      completed: planCompleted 
    }]);
    setPlanSubject('');
    setPlanPlanned('');
    setPlanActual('');
    setPlanCompleted(true);
  };

  const handleAddDecision = () => {
    if (!decisionInput) return;
    setCommanderDecisions([...commanderDecisions, decisionInput]);
    setDecisionInput('');
  };

  const handleOpenCreate = () => {
    setViewingSummary(null);
    setPresentCount(25);
    setTotalCount(28);
    setAbsentsList([]);
    setPlansList([]);
    setWelfareNotes('');
    setMedicalNotes('');
    setLogisticsNotes('');
    setReadinessNotes('כוננות מלאה');
    setDailyLesson('');
    setCommanderDecisions([]);
    setDrawerOpen(true);
  };

  const handleSubmitSummary = (e: React.FormEvent) => {
    e.preventDefault();
    addForumSummary({
      date: new Date().toISOString().split('T')[0],
      assigned_frame: (resolvedFrame === 'פלוגה' || !resolvedFrame) ? 'מחלקה 1' : resolvedFrame,
      author_id: currentUser?.id || 'system',
      author_name: currentUser?.full_name || 'מפקד',
      status: 'מוכן',
      present_count: presentCount,
      total_count: totalCount,
      absent_details: absentsList,
      welfare_notes: welfareNotes || undefined,
      medical_notes: medicalNotes || undefined,
      logistics_notes: logisticsNotes || undefined,
      readiness_notes: readinessNotes || undefined,
      plan_vs_actual: plansList,
      daily_lesson: dailyLesson || undefined,
      commander_decisions: commanderDecisions
    });
    setDrawerOpen(false);
  };

  // 📝 Generate high-fidelity IDF WhatsApp Summary
  const generateWhatsappText = (): string => {
    const todayStr = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });
    
    let text = `📢 *סיכום יומי - פורום מוביל פלוגה ג׳* 📢\n`;
    text += `📅 *תאריך:* ${todayStr}\n`;
    text += `=========================\n\n`;

    if (forumSummaries.length === 0) {
      text += `_טרם הוזנו סיכומי מחלקות להיום._`;
      return text;
    }

    forumSummaries.forEach((sum) => {
      text += `🪖 *סיכום: ${sum.assigned_frame}* (${sum.author_name})\n`;
      text += `📊 *נוכחות:* ${sum.present_count}/${sum.total_count} נוכחים בלו"ז\n`;
      
      if (sum.absent_details.length > 0) {
        text += `🛑 *חוסרים/נעדרים:*\n`;
        sum.absent_details.forEach(a => {
          text += `  • ${a.name} - ${a.reason}\n`;
        });
      } else {
        text += `  • 100% נוכחות מחלקתית.\n`;
      }

      text += `📋 *לו"ז מול ביצוע:*\n`;
      sum.plan_vs_actual.forEach(p => {
        text += `  • ${p.subject} (${p.planned}) 👈 _${p.actual}_ [${p.completed ? '✅' : '❌'}]\n`;
      });

      if (sum.medical_notes) text += `⚕️ *רפואה:* ${sum.medical_notes}\n`;
      if (sum.welfare_notes) text += `🏠 *ת"ש ופרט:* ${sum.welfare_notes}\n`;
      if (sum.logistics_notes) text += `⚙️ *לוגיסטיקה:* ${sum.logistics_notes}\n`;
      if (sum.daily_lesson) text += `💡 *לקח יומי:* ${sum.daily_lesson}\n`;
      
      if (sum.commander_decisions.length > 0) {
        text += `⚖️ *החלטות מפקד/נדרש:* \n`;
        sum.commander_decisions.forEach(d => {
          text += `  - ${d}\n`;
        });
      }
      
      text += `\n-------------------------\n\n`;
    });

    text += `💪 *קדימה פלוגה ג׳ - מנצחים בכל מפגש!*`;
    return text;
  };

  const handleCopyText = () => {
    const text = generateWhatsappText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 relative">
      {/* 🚀 Platoon Summary & Whatsapp Exporter Widget */}
      <GlassCard className="border-emerald-500/25 bg-gradient-to-r from-slate-950 via-slate-900/40 to-slate-950 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Share2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-100">אינטגרציית WhatsApp פלוגתית</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              המערכת יודעת לאגד את סיכומי כלל המחלקות שהוגשו היום ולנסח הודעת סיכום יומי מעוצבת להפצה ישירה בקבוצת המפקדים.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWhatsappModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer shadow-[0_0_12px_rgba(0,245,212,0.2)]"
          >
            <MessageSquare className="w-4 h-4" />
            ייצא נוסח WhatsApp
          </button>
          
          {resolvedFrame !== 'פלוגה' && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              הגש סיכום מחלקתי
            </button>
          )}
        </div>
      </GlassCard>

      {/* Reports Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Submissions status tracker */}
        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-sm font-black text-slate-100 mb-4 pb-2 border-b border-slate-800/80">
              סטטוס הגשות יומי פלוגתי
            </h3>
            <div className="space-y-3.5 text-xs">
              {['מחלקה 1', 'מחלקה 2', 'מחלקה 3', 'מחלקה 4'].map((frame) => {
                const summary = forumSummaries.find(s => s.assigned_frame === frame);
                return (
                  <div key={frame} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 border border-slate-900">
                    <span className="font-bold text-slate-200">{frame}</span>
                    {summary ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        הוגש ({summary.author_name})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 animate-pulse-soft" />
                        טרם הוגש
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Submitted summaries list */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-black text-slate-400 pe-1">סיכומים שהוגשו היום</h3>
          
          {forumSummaries.length === 0 ? (
            <GlassCard className="text-center py-12 text-slate-500 flex flex-col items-center justify-center gap-2">
              <FileText className="w-8 h-8 text-slate-700" />
              <p className="text-sm font-semibold">לא נמצאו דוחות שהוגשו להיום.</p>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {forumSummaries.map((sum) => (
                <GlassCard key={sum.id} className="border-slate-850 p-5">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-900">
                    <div>
                      <h4 className="text-sm font-black text-slate-200">{sum.assigned_frame}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">הוגש על ידי: {sum.author_name} • בתאריך: {sum.date}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/20">
                      סד"כ: {sum.present_count}/{sum.total_count}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                    {sum.absent_details.length > 0 && (
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                        <span className="font-bold text-[#ff0054] block mb-1">חוסרים ונעדרים:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                          {sum.absent_details.map((a, i) => (
                            <li key={i}>{a.name} ({a.reason})</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 col-span-2 sm:col-span-1">
                      <span className="font-bold text-cyan-400 block mb-1">שגרת לו"ז ואימונים:</span>
                      <ul className="space-y-1 text-slate-400">
                        {sum.plan_vs_actual.map((p, i) => (
                          <li key={i} className="flex items-center justify-between">
                            <span>{p.subject} ({p.planned})</span>
                            <span className={p.completed ? "text-emerald-400 font-bold" : "text-[#ff0054] font-medium"}>
                              {p.completed ? "✅ בוצע" : "❌ חריג"}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    {sum.daily_lesson && (
                      <p className="text-slate-350">
                        💡 <span className="font-bold text-slate-200">לקח יומי:</span> {sum.daily_lesson}
                      </p>
                    )}
                    {sum.welfare_notes && (
                      <p className="text-slate-350">
                        🏠 <span className="font-bold text-slate-200">נושאי ת"ש ופרט:</span> {sum.welfare_notes}
                      </p>
                    )}
                    {sum.commander_decisions.length > 0 && (
                      <div className="pt-2 border-t border-slate-900 text-slate-300">
                        <span className="font-bold text-[#fee440] block mb-1">⚖️ החלטות מפקד נדרשות / שנתקבלו:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-450">
                          {sum.commander_decisions.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exporter Whatsapp HUD Modal */}
      {whatsappModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setWhatsappModalOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fade-in"
          />

          <GlassCard className="w-full max-w-2xl border-slate-700/60 shadow-2xl relative z-10 text-right flex flex-col max-h-[85vh]" glow="success">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                <h3 className="text-base font-black text-slate-100">נוסח הודעת WhatsApp פלוגתי מעוצב</h3>
              </div>
              <button 
                onClick={() => setWhatsappModalOpen(false)}
                className="p-1 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Generated Text Area */}
            <div className="flex-1 overflow-y-auto bg-slate-950 border border-slate-850 rounded-2xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap select-all leading-relaxed custom-scrollbar max-h-[50vh]">
              {generateWhatsappText()}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-900 flex items-center justify-between gap-3">
              <span className="text-[10px] text-slate-500">
                העתק את הטקסט למעלה והדבק ישירות בקבוצת ה-WhatsApp של מפקדי הפלוגה.
              </span>

              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#00f5d4] hover:bg-[#00e5c4] text-slate-950 text-xs font-black cursor-pointer shadow-[0_0_15px_rgba(0,245,212,0.2)] transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    הועתק ללוח!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    העתק נוסח להודעה
                  </>
                )}
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Slide Drawer for creating summary report */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
          />

          <div className="relative w-full max-w-lg bg-slate-950 border-s border-slate-800/80 p-6 flex flex-col h-full overflow-y-auto shadow-2xl animate-slide-in-ltr z-10 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
              <h3 className="text-base font-black text-slate-100">הגשת סיכום יומי - מחלקה / מפל"ג</h3>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSummary} className="space-y-4 flex-1">
              <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 text-xs text-slate-350 leading-relaxed mb-2">
                ✍️ <span className="font-bold text-cyan-400">הגשה עבור: </span>
                {resolvedFrame} • בתפקיד: {resolvedRole} ({currentUser?.full_name})
              </div>

              {/* Attendance metrics */}
              <div className="grid grid-cols-2 gap-3 bg-slate-900/30 p-3.5 rounded-xl border border-slate-900">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">נוכחים בפועל</label>
                  <input
                    type="number"
                    required
                    value={presentCount}
                    onChange={(e) => setPresentCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">סה"כ סד"כ רשום</label>
                  <input
                    type="number"
                    required
                    value={totalCount}
                    onChange={(e) => setTotalCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 px-3 text-xs text-slate-200"
                  />
                </div>
              </div>

              {/* Absent entry form */}
              <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-900/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-400">הוספת חוסרים ונעדרים</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="שם החייל..."
                    value={absentName}
                    onChange={(e) => setAbsentName(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-lg py-1 px-2.5 text-xs text-slate-250"
                  />
                  <input
                    type="text"
                    placeholder="סיבת חיסור (גימלים, שמירות...)"
                    value={absentReason}
                    onChange={(e) => setAbsentReason(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-lg py-1 px-2.5 text-xs text-slate-250"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddAbsent}
                  className="w-full py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold text-slate-300 cursor-pointer"
                >
                  + הוסף נעדר לרשימה
                </button>

                {absentsList.length > 0 && (
                  <ul className="text-[10px] text-slate-450 space-y-0.5 list-disc list-inside pt-1.5 border-t border-slate-900">
                    {absentsList.map((a, idx) => (
                      <li key={idx} className="font-semibold text-[#ff0054]">{a.name} ({a.reason})</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Plan vs Actual entries */}
              <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-900/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-400">לו"ז מול ביצוע פעילויות</span>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="הפעילות (לדוגמה: אימון בוקר...)"
                    value={planSubject}
                    onChange={(e) => setPlanSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg py-1 px-2.5 text-xs text-slate-250"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="שעה מתוכננת..."
                      value={planPlanned}
                      onChange={(e) => setPlanPlanned(e.target.value)}
                      className="bg-slate-950 border border-slate-850 rounded-lg py-1 px-2.5 text-xs text-slate-250"
                    />
                    <input
                      type="text"
                      placeholder="סטטוס ביצוע (בוצע במלואו...)"
                      value={planActual}
                      onChange={(e) => setPlanActual(e.target.value)}
                      className="bg-slate-950 border border-slate-850 rounded-lg py-1 px-2.5 text-xs text-slate-250"
                    />
                  </div>
                  <div className="flex items-center ps-1">
                    <input
                      type="checkbox"
                      checked={planCompleted}
                      onChange={(e) => setPlanCompleted(e.target.checked)}
                      className="w-3.5 h-3.5 text-cyan-500 border-slate-850 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400 ms-2">בוצע בהצלחה (ללא חריג)</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAddPlan}
                  className="w-full py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-bold text-slate-300 cursor-pointer"
                >
                  + הוסף פעילות לו"ז
                </button>

                {plansList.length > 0 && (
                  <ul className="text-[10px] text-slate-450 space-y-0.5 pt-1.5 border-t border-slate-900">
                    {plansList.map((p, idx) => (
                      <li key={idx} className="flex justify-between font-medium">
                        <span>{p.subject} ({p.planned})</span>
                        <span className={p.completed ? "text-emerald-400" : "text-[#ff0054]"}>
                          {p.completed ? "✅ בוצע" : "❌ חריג"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Free Text notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">לקחים ותובנות יומיים</label>
                <input
                  type="text"
                  value={dailyLesson}
                  onChange={(e) => setDailyLesson(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-250 focus:outline-none"
                  placeholder="רשום פער שעלה, לקח בטיחותי וכו'..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">עדכוני רפואה וכשירות</label>
                <input
                  type="text"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-250 focus:outline-none"
                  placeholder="לוחמים עם פטורים, ביקור רופא, כשירות..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">עדכוני ת"ש ופרט</label>
                <input
                  type="text"
                  value={welfareNotes}
                  onChange={(e) => setWelfareNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-250 focus:outline-none"
                  placeholder="חיילים בשיחות משקית תש, בעיות בית חריגות..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">עדכוני לוגיסטיקה</label>
                <input
                  type="text"
                  value={logisticsNotes}
                  onChange={(e) => setLogisticsNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-250 focus:outline-none"
                  placeholder="אספקת ציוד חסר, חלוקת בטריות, ציוד ב'..."
                />
              </div>

              {/* Commander Decisions needed */}
              <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-900/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-400">החלטות מפקד נדרשות / שנתקבלו</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="הזן דרישה להחלטה (למשל: אישור חופשה מיוחדת...)"
                    value={decisionInput}
                    onChange={(e) => setDecisionInput(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-lg py-1 px-2.5 text-xs text-slate-250"
                  />
                  <button
                    type="button"
                    onClick={handleAddDecision}
                    className="px-3 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-350 cursor-pointer"
                  >
                    הוסף
                  </button>
                </div>
                {commanderDecisions.length > 0 && (
                  <ul className="text-[10px] text-slate-450 list-disc list-inside space-y-0.5">
                    {commanderDecisions.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                הגש סיכום מחלקתי
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
