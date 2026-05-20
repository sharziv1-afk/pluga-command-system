'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { GlassCard } from '../tactical/GlassCard';
import { Search, Plus, BookOpen, Compass, ClipboardList, BookMarked, HelpCircle, X } from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';

interface DictionaryTerm {
  id: string;
  term: string; // ראשי התיבות / המונח
  expansion: string; // פירוש ראשי התיבות
  description: string; // הסבר מפורט ומעשי
  category: 'operational' | 'logistics' | 'training' | 'general';
  isCustom?: boolean;
}

const initialTerms: DictionaryTerm[] = [
  {
    id: 'term-aset',
    term: 'אש"ת',
    expansion: 'אישור תוכניות',
    description: 'שלב הכרחי בתיכנון לחימה או תרגיל בו מציג מפקד הכוח (למשל מ"מ למ"פ או מ"פ למח"ט) את תוכניותיו המבצעיות, לוח הזמנים, נוהל הקרב, דרכי הפינוי, מענה לוגיסטי ובטיחות כדי לקבל אישור רשמי לצאת לביצוע.',
    category: 'operational'
  },
  {
    id: 'term-sadac',
    term: 'סד"כ',
    expansion: 'סדר כוחות',
    description: 'רשימת כלל המשאבים האנושיים והחיילים העומדים לרשות היחידה או המסגרת בכל רגע נתון. נמדד בצורה מדויקת במסגרת דוחות הנוכחות (דו"ח 1) ומחלק את החיילים למצבות נוכחים, נעדרים, חולים (גימלים), מיוחדות ועוד.',
    category: 'general'
  },
  {
    id: 'term-ratak',
    term: 'רתק',
    expansion: 'רתק אש',
    description: 'כוח ייעודי (לרוב מבוסס מקלעים או נשק כבד) שתפקידו לייצר אש רציפה ומסיבית לעבר יעדי האויב כדי למנוע ממנו להרים את הראש או לירות, ובכך לאפשר לכוח המסתער להתקדם בצורה בטוחה ולכבוש את היעד.',
    category: 'operational'
  },
  {
    id: 'term-maplag',
    term: 'מפל"ג',
    expansion: 'מפקדת פלוגה',
    description: 'הגורם המנהלתי והלוגיסטי הראשי בפלוגה, המנוהל לרוב על ידי הרס"פ ובפיקוח הסמ"פ. המפל"ג אחראי על אספקת מזון, מים, תחמושת, דלק, ציוד לחימה, רפואה וטיפול בבעיות תנאי השירות (ת"ש) של החיילים.',
    category: 'logistics'
  },
  {
    id: 'term-hapak',
    term: 'חפ"ק',
    expansion: 'חבורת פיקוד קדמית',
    description: 'גרעין הפיקוד הקרוב ביותר לשטח הלחימה המלווה את המפקד (מ"פ/מג"ד) וכולל בדרך כלל קשר, נהג, חובש וגורמי פיקוד נוספים. תפקידו לאפשר שליטה ובקרה טקטית ישירה ומהירה בזמן אמת.',
    category: 'operational'
  },
  {
    id: 'term-kapeq',
    term: 'קפ"ק',
    expansion: 'קבוצת פקודות',
    description: 'מפגש תדריך פיקודי מובנה שבו המפקד מעביר את הפקודה המבצעית או המנהלתית לפקודיו. קפ"ק 1 מיועד לתכנון ראשוני, קפ"ק 2 להצגת טיוטות ותיאומים, וקפ"ק 3 להעברת הפקודה הסופית לביצוע.',
    category: 'operational'
  },
  {
    id: 'term-sabzaq',
    term: 'שבצ"ק',
    expansion: 'שיבוץ קרבי',
    description: 'טבלה מפורטת המגדירה את התפקיד, המיקום והציוד של כל לוחם ומפקד בכוח במהלך משימה, נסיעה או הגנה. מונע בלבול ומבטיח שכל אחד יודע בדיוק לאיזה כלי/עמדה הוא משויך ומהי משימתו.',
    category: 'general'
  },
  {
    id: 'term-pakal',
    term: 'פק"ל',
    expansion: 'פקודת קבע לקרב',
    description: 'מערכת נהלים ותרגולות קבועות מראש לביצוע פעולות שגרתיות או חירומיות (כגון פק"ל פריקה מרכב, פק"ל היתקלות, פק"ל פצוע). בנוסף, משמש ככינוי לציוד מוגדר מראש שחייל נושא (למשל: פק"ל חובש, פק"ל מטול).',
    category: 'training'
  },
  {
    id: 'term-bikas',
    term: 'ביק"ש',
    expansion: 'ביקורת כשירות',
    description: 'ביקורת מקיפה ורשמית הנערכת על ידי דרג ממונה כדי לבדוק את רמת מוכנות היחידה למלחמה. כוללת בחינת כשירות נשק, אמצעי לחימה, רמת אימון הלוחמים, נוכחות סד"כ ומלאי לוגיסטי.',
    category: 'training'
  },
  {
    id: 'term-doh1',
    term: 'דו"ח 1',
    expansion: 'דיווח נוכחות יומי',
    description: 'דיווח הבוקר החשוב ביותר ברמה הפלוגתית והגדודית. הדו"ח מפרט במדויק היכן נמצא כל חייל בפלוגה (בבסיס, בשטח, בבית, בחופשה, בגימלים, בקורס) ומסנכרן את מצבת המזון והשמירה בהתאם.',
    category: 'logistics'
  }
];

export default function DictionaryTab() {
  const { addAudit } = useApp();
  const [terms, setTerms] = useState<DictionaryTerm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // New Term Form State
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const [newTerm, setNewTerm] = useState('');
  const [newExpansion, setNewExpansion] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'operational' | 'logistics' | 'training' | 'general'>('general');

  // Load from localstorage or seed
  useEffect(() => {
    const saved = localStorage.getItem('pluga_dictionary');
    if (saved) {
      try {
        setTerms(JSON.parse(saved));
      } catch {
        setTerms(initialTerms);
        localStorage.setItem('pluga_dictionary', JSON.stringify(initialTerms));
      }
    } else {
      setTerms(initialTerms);
      localStorage.setItem('pluga_dictionary', JSON.stringify(initialTerms));
    }
  }, []);

  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTerm || !newDesc) return;

    const added: DictionaryTerm = {
      id: `term-${Math.random().toString(36).substr(2, 9)}`,
      term: newTerm,
      expansion: newExpansion,
      description: newDesc,
      category: newCategory,
      isCustom: true
    };

    const updated = [added, ...terms];
    setTerms(updated);
    localStorage.setItem('pluga_dictionary', JSON.stringify(updated));

    // Audit log
    addAudit(
      'הוספת מונח למילון',
      'system',
      added.id,
      `נוסף מונח חדש למילון הפלוגתי: "${added.term}" (${added.expansion || 'אין פירוש'})`
    );

    // Reset Form
    setNewTerm('');
    setNewExpansion('');
    setNewDesc('');
    setNewCategory('general');
    setShowAddDrawer(false);
  };

  const handleDeleteTerm = (id: string, termName: string) => {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את המונח "${termName}" מהמילון?`)) return;

    const updated = terms.filter(t => t.id !== id);
    setTerms(updated);
    localStorage.setItem('pluga_dictionary', JSON.stringify(updated));

    addAudit(
      'מחיקת מונח מהמילון',
      'system',
      id,
      `נמחק המונח "${termName}" מהמילון הפלוגתי.`
    );
  };

  // Filter terms
  const filteredTerms = useMemo(() => {
    return terms.filter(t => {
      const matchesSearch = 
        t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.expansion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [terms, searchQuery, activeCategory]);

  const categories = [
    { id: 'all', label: 'כל המונחים', icon: BookOpen },
    { id: 'operational', label: 'מבצעי ולוחמה', icon: Compass },
    { id: 'logistics', label: 'לוגיסטיקה ומנהלה', icon: ClipboardList },
    { id: 'training', label: 'הדרכה וחניכה', icon: BookMarked },
    { id: 'general', label: 'כללי ודרגים', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-right relative" dir="rtl">
      {/* Top bar search and add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute top-1/2 start-3.5 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="חפש מונח, ראשי תיבות או הסבר..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl py-2 px-10 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all font-semibold"
          />
        </div>

        {/* Add custom term */}
        <button
          onClick={() => setShowAddDrawer(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-l from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-xs md:text-sm font-black shadow-[0_0_15px_rgba(0,180,216,0.2)] hover:shadow-[0_0_20px_rgba(0,180,216,0.3)] transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>הוסף מונח פלוגתי</span>
        </button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isActive 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.08)]'
                  : 'bg-slate-950/20 border-transparent text-slate-450 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Terms Grid */}
      {filteredTerms.length === 0 ? (
        <div className="py-16 text-center">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-bold text-sm">לא נמצאו מונחים מתאימים לחיפוש שלך.</p>
          <p className="text-slate-500 text-xs mt-1">נסה לשנות את מילת החיפוש או לבחור קטגוריה אחרת.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.map((t) => (
            <GlassCard key={t.id} className="relative group border border-slate-800/80 hover:border-cyan-500/25 transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-cyan-400 tracking-wide">{t.term}</h3>
                      {t.isCustom && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                          מותאם פלוגה
                        </span>
                      )}
                    </div>
                    {t.expansion && (
                      <p className="text-xs text-slate-300 font-bold">({t.expansion})</p>
                    )}
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    t.category === 'operational' ? 'bg-red-500/10 text-red-400 border border-red-500/15' :
                    t.category === 'logistics' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' :
                    t.category === 'training' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/15' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {t.category === 'operational' ? 'מבצעי' :
                     t.category === 'logistics' ? 'לוגיסטיקה' :
                     t.category === 'training' ? 'הדרכה' : 'כללי'}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-slate-450 leading-relaxed font-semibold">
                  {t.description}
                </p>

                {t.isCustom && (
                  <button
                    onClick={() => handleDeleteTerm(t.id, t.term)}
                    className="absolute bottom-4 end-4 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/15 border border-transparent hover:border-red-500/20 rounded-lg text-slate-500 hover:text-red-400 transition-all cursor-pointer text-[10px] font-bold"
                  >
                    מחק מונח
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Sliding Side Drawer for Adding Custom Terms */}
      {showAddDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay */}
          <div 
            onClick={() => setShowAddDrawer(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <div className="relative flex flex-col w-full max-w-md bg-slate-950 border-s border-slate-900 h-screen p-6 animate-slide-in-rtl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-y-auto">
            {/* Close button */}
            <button 
              onClick={() => setShowAddDrawer(false)}
              className="absolute top-6 end-6 p-2 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-6 mt-8">
              <div>
                <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span>הוספת מונח פיקודי פלוגתי</span>
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  הזן מונח, קיצור או ראשי תיבות כדי להנגישם לשאר המפקדים בפלוגה.
                </p>
              </div>

              <form onSubmit={handleAddTerm} className="space-y-4">
                {/* Term Name */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-black">המונח / ראשי התיבות *</label>
                  <input 
                    type="text"
                    required
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                    placeholder="למשל: סדכ, אשת, פקל..."
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-all font-semibold"
                  />
                </div>

                {/* Expansion */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-black">פירוש ראשי התיבות (אם קיים)</label>
                  <input 
                    type="text"
                    value={newExpansion}
                    onChange={(e) => setNewExpansion(e.target.value)}
                    placeholder="למשל: סדר כוחות, אישור תוכניות..."
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-all font-semibold"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-black">קטגוריה צבאית</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-all font-semibold cursor-pointer"
                  >
                    <option value="general">כללי ודרגים</option>
                    <option value="operational">מבצעי ולוחמה</option>
                    <option value="logistics">לוגיסטיקה ומנהלה</option>
                    <option value="training">הדרכה וחניכה</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-black">הסבר והגדרת המונח *</label>
                  <textarea
                    required
                    rows={4}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="כתוב תיאור מעשי וברור של המונח..."
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 px-4 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-cyan-500/50 transition-all font-semibold"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-l from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-xs md:text-sm font-black shadow-[0_0_15px_rgba(0,180,216,0.2)] transition-all cursor-pointer"
                  >
                    הוסף מונח
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddDrawer(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 text-xs md:text-sm font-black transition-all cursor-pointer"
                  >
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
