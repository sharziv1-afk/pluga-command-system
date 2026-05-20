import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { RoleType, FrameType } from '@/lib/types';
import { ShieldCheck, Eye, RefreshCw } from 'lucide-react';

export const RoleSelector: React.FC = () => {
  const { currentUser, activeRole, activeFrame, isSimulating, setSimulation, resetSimulation } = useApp();

  if (!currentUser) return null;

  const isBecior = currentUser.role === 'מ"פ' || currentUser.role === 'סמ"פ';

  const handleSimulateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'reset') {
      resetSimulation();
      return;
    }

    const [role, frame] = value.split('|') as [RoleType, FrameType];
    setSimulation(role, frame);
  };

  // Pre-configured options for simulation
  const simulationOptions = [
    { label: 'סמ"פ (פלוגה)', value: 'סמ"פ|פלוגה' },
    { label: 'רס"פ (מפל"ג)', value: 'רס"פ|מפל"ג' },
    { label: 'מ"מ 1 (מחלקה 1)', value: 'מ"מ|מחלקה 1' },
    { label: 'מ"מ 2 (מחלקה 2)', value: 'מ"מ|מחלקה 2' },
    { label: 'מ"מ 3 (מחלקה 3)', value: 'מ"מ|מחלקה 3' },
    { label: 'מ"מ 4 (מחלקה 4)', value: 'מ"מ|מחלקה 4' },
    { label: 'מ"כ 1 (כיתה 1)', value: 'מ"כ|כיתה 1' },
    { label: 'מ"כ 2 (כיתה 2)', value: 'מ"כ|כיתה 2' },
  ];

  return (
    <div className="flex items-center gap-3">
      {/* Simulation HUD glowing banner */}
      {isSimulating && (
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/35 text-cyan-400 text-xs font-bold animate-pulse-soft shadow-[0_0_10px_rgba(0,229,255,0.1)]">
          <Eye className="w-3.5 h-3.5" />
          <span>מצב הדמיה פעיל</span>
        </div>
      )}

      <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-xl px-3 py-1.5 gap-2">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-semibold leading-none mb-0.5">
            הרשאה פעילה
          </span>
          
          {isBecior ? (
            <select
              value={isSimulating ? `${activeRole}|${activeFrame}` : 'reset'}
              onChange={handleSimulateChange}
              className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer pe-4 py-0.5"
            >
              <option value="reset" className="bg-slate-950 text-slate-200">
                {currentUser.full_name} ({currentUser.role})
              </option>
              <optgroup label="הדמיית תפקידים" className="bg-slate-950 text-slate-400 font-semibold">
                {simulationOptions
                  .filter(opt => opt.value !== `${currentUser.role}|${currentUser.assigned_frame}`)
                  .map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-slate-950 text-slate-200">
                      הדמיה: {opt.label}
                    </option>
                  ))
                }
              </optgroup>
            </select>
          ) : (
            <span className="text-xs font-bold text-slate-200 py-0.5">
              {currentUser.full_name} ({currentUser.role} • {currentUser.assigned_frame})
            </span>
          )}
        </div>

        {isSimulating && (
          <button
            onClick={resetSimulation}
            title="חזרה לתפקיד מקורי"
            className="p-1 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-cyan-400 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
