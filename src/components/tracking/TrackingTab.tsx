'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { GlassCard } from '../tactical/GlassCard';
import { TrackingColumn, TrackingCell, FrameType } from '@/lib/types';
import { Plus, Download, Table, Trash, ShieldCheck, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// ==================== SEED SOLDIERS ====================
const defaultSoldiers = [
  { name: 'סמ"ר רון אהרוני', frame: 'מחלקה 1' as FrameType },
  { name: 'סמל ניב ששון', frame: 'מחלקה 1' as FrameType },
  { name: 'רב"ט אדיר כהן', frame: 'מחלקה 1' as FrameType },
  { name: 'סמ"ר דניאל לוי', frame: 'מחלקה 2' as FrameType },
  { name: 'רב"ט גלעד מזרחי', frame: 'מחלקה 2' as FrameType },
  { name: 'סמ"ר מתן רוזן', frame: 'מחלקה 3' as FrameType },
  { name: 'סמל אסף ברק', frame: 'מחלקה 3' as FrameType },
  { name: 'רב"ט עידן סופר', frame: 'מחלקה 4' as FrameType }
];

// ==================== MEMOIZED CELL COMPONENT ====================

interface TableCellProps {
  soldierName: string;
  columnId: string;
  value: TrackingCell['value'];
  onToggle: (soldierName: string, colId: string, currentValue: TrackingCell['value']) => void;
}

const TableCell: React.FC<TableCellProps> = React.memo(({ soldierName, columnId, value, onToggle }) => {
  const getCellStyles = (val: typeof value) => {
    switch (val) {
      case 'עבר':
        return 'bg-[#00f5d4]/15 text-[#00f5d4] border-[#00f5d4]/30 font-bold';
      case 'לא עבר':
        return 'bg-[#ff0054]/15 text-[#ff0054] border-[#ff0054]/30 font-bold';
      case 'השלמה':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold';
      default:
        return 'bg-slate-900/10 text-slate-600 border-slate-900/50 hover:bg-slate-800/20';
    }
  };

  return (
    <td className="p-1.5 text-center border-e border-slate-900/40 min-w-[120px]">
      <button
        onClick={() => onToggle(soldierName, columnId, value)}
        className={cn(
          "w-full py-1.5 px-2 rounded-lg border text-xs transition-all cursor-pointer select-none",
          getCellStyles(value)
        )}
      >
        {value === 'ריק' ? '—' : value}
      </button>
    </td>
  );
});

TableCell.displayName = 'TableCell';

// ==================== TRACKING TAB COMPONENT ====================

export const TrackingTab: React.FC = () => {
  const { currentUser, activeFrame } = useApp();

  const [columns, setColumns] = useState<TrackingColumn[]>([]);
  const [cells, setCells] = useState<TrackingCell[]>([]);
  
  // New column form modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColCat, setNewColCat] = useState<'לוחמה' | 'שיעורים' | 'חניכה' | 'כשירות' | 'לוגיסטיקה'>('לוחמה');

  const resolvedFrame = activeFrame || currentUser?.assigned_frame || 'פלוגה';

  // Load columns and cells from LocalStorage or seed defaults
  useEffect(() => {
    const cachedCols = localStorage.getItem('pluga_tracking_columns');
    const cachedCells = localStorage.getItem('pluga_tracking_cells');

    if (cachedCols && cachedCells) {
      try {
        setColumns(JSON.parse(cachedCols));
        setCells(JSON.parse(cachedCells));
      } catch {
        initializeSeeds();
      }
    } else {
      initializeSeeds();
    }
  }, []);

  const initializeSeeds = () => {
    const seedCols: TrackingColumn[] = [
      { id: 'col-1', name: 'מקצה ירי לילה', category: 'כשירות', assigned_frame: 'פלוגה', order: 1 },
      { id: 'col-2', name: 'בוחן פלוגה 5 ק"מ', category: 'לוחמה', assigned_frame: 'פלוגה', order: 2 },
      { id: 'col-3', name: 'שיעור עזרה ראשונה', category: 'שיעורים', assigned_frame: 'פלוגה', order: 3 }
    ];

    const seedCells: TrackingCell[] = [];
    defaultSoldiers.forEach(sol => {
      seedCols.forEach(col => {
        seedCells.push({
          id: `cell-${sol.name}-${col.id}`,
          soldier_name: sol.name,
          assigned_frame: sol.frame,
          column_id: col.id,
          value: Math.random() > 0.6 ? 'עבר' : Math.random() > 0.6 ? 'השלמה' : 'ריק',
          updated_by: 'user-mp'
        });
      });
    });

    setColumns(seedCols);
    setCells(seedCells);
    localStorage.setItem('pluga_tracking_columns', JSON.stringify(seedCols));
    localStorage.setItem('pluga_tracking_cells', JSON.stringify(seedCells));
  };

  const saveToStorage = (updatedCols: TrackingColumn[], updatedCells: TrackingCell[]) => {
    setColumns(updatedCols);
    setCells(updatedCells);
    localStorage.setItem('pluga_tracking_columns', JSON.stringify(updatedCols));
    localStorage.setItem('pluga_tracking_cells', JSON.stringify(updatedCells));
  };

  // Cell Toggle Logic: ריק -> עבר -> לא עבר -> השלמה -> ריק
  const handleToggleCell = useCallback((soldierName: string, colId: string, currentValue: TrackingCell['value']) => {
    const cycleMap: Record<TrackingCell['value'], TrackingCell['value']> = {
      'ריק': 'עבר',
      'עבר': 'לא עבר',
      'לא עבר': 'השלמה',
      'השלמה': 'ריק'
    };

    const nextValue = cycleMap[currentValue];

    setCells(prevCells => {
      const existingCellIdx = prevCells.findIndex(
        c => c.soldier_name === soldierName && c.column_id === colId
      );

      let updated: TrackingCell[] = [];
      if (existingCellIdx > -1) {
        updated = prevCells.map((c, idx) => 
          idx === existingCellIdx ? { ...c, value: nextValue, updated_by: currentUser?.id || 'system' } : c
        );
      } else {
        const matchingSoldier = defaultSoldiers.find(s => s.name === soldierName);
        updated = [
          ...prevCells, 
          {
            id: `cell-${soldierName}-${colId}`,
            soldier_name: soldierName,
            assigned_frame: matchingSoldier?.frame || 'מחלקה 1',
            column_id: colId,
            value: nextValue,
            updated_by: currentUser?.id || 'system'
          }
        ];
      }

      localStorage.setItem('pluga_tracking_cells', JSON.stringify(updated));
      return updated;
    });
  }, [currentUser]);

  // Add custom check column
  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName) return;

    const newCol: TrackingColumn = {
      id: `col-${Math.random().toString(36).substr(2, 9)}`,
      name: newColName,
      category: newColCat,
      assigned_frame: resolvedFrame === 'פלוגה' ? 'פלוגה' : resolvedFrame,
      order: columns.length + 1
    };

    const updatedCols = [...columns, newCol];
    
    // Seed new cells as empty for all soldiers
    const newCells = [...cells];
    defaultSoldiers.forEach(sol => {
      newCells.push({
        id: `cell-${sol.name}-${newCol.id}`,
        soldier_name: sol.name,
        assigned_frame: sol.frame,
        column_id: newCol.id,
        value: 'ריק',
        updated_by: currentUser?.id || 'system'
      });
    });

    saveToStorage(updatedCols, newCells);
    setNewColName('');
    setModalOpen(false);
  };

  // Remove Column
  const handleRemoveColumn = (colId: string) => {
    const updatedCols = columns.filter(c => c.id !== colId);
    const updatedCells = cells.filter(c => c.column_id !== colId);
    saveToStorage(updatedCols, updatedCells);
  };

  // Filter soldiers depending on user scope
  const visibleSoldiers = defaultSoldiers.filter(s => 
    resolvedFrame === 'פלוגה' || s.frame === resolvedFrame
  );

  // Filter columns based on scope
  const visibleColumns = columns.filter(c =>
    resolvedFrame === 'פלוגה' || c.assigned_frame === 'פלוגה' || c.assigned_frame === resolvedFrame
  );

  // Export spreadsheet as CSV
  const handleExportCsv = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel Hebrew support!
    csvContent += 'שם החייל,מחלקה,' + visibleColumns.map(c => `${c.name} (${c.category})`).join(',') + '\n';
    
    visibleSoldiers.forEach(sol => {
      const row = [sol.name, sol.frame];
      visibleColumns.forEach(col => {
        const cell = cells.find(c => c.soldier_name === sol.name && c.column_id === col.id);
        row.push(cell ? cell.value : 'ריק');
      });
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `כשירות_חיילים_פלוגה_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 relative">
      {/* HUD Info and spreadsheet actions */}
      <GlassCard className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-100 flex items-center gap-1.5">
              טבלת בקרת כשירות ומעקבים פלוגתית
              <span className="text-[10px] font-black uppercase text-[#00f5d4] border border-[#00f5d4]/30 px-1.5 py-0.5 rounded bg-[#00f5d4]/5">
                עריכה מהירה מופעלת
              </span>
            </h2>
            <p className="text-[10px] text-slate-450 mt-0.5">
              סנכרון מהיר ונוח. לחיצה על תא בטבלה מחליפה סטטוס: <span className="text-slate-300 font-semibold">ריק 👈 עבר ✅ 👈 לא עבר ❌ 👈 השלמה 🟡</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.8 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 text-xs font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            יצוא ל-Excel/CSV
          </button>
          
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.15)]"
          >
            <Plus className="w-4 h-4" />
            הוסף עמודת מעקב
          </button>
        </div>
      </GlassCard>

      {/* Excel Table Container with sticky header columns */}
      <GlassCard className="p-2.5 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-right border-collapse border-slate-900 border-spacing-0">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400 font-bold bg-slate-950/40">
                <th className="p-3 font-black text-slate-100 min-w-[140px] sticky start-0 bg-slate-950/95 z-10 border-e border-slate-900">שם הלוחם</th>
                <th className="p-3 font-black text-cyan-400 min-w-[90px] border-e border-slate-900">שיוך מחלקה</th>
                
                {visibleColumns.map(col => (
                  <th 
                    key={col.id} 
                    className="p-3 font-black text-center min-w-[140px] border-e border-slate-900 group/col relative"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-slate-200">{col.name}</span>
                      <span className="text-[9px] text-slate-500 font-bold mt-0.5">({col.category})</span>
                    </div>
                    {/* Delete Column hover tag */}
                    <button
                      onClick={() => handleRemoveColumn(col.id)}
                      title="מחק עמודה זו"
                      className="absolute top-1 end-1 p-0.5 rounded bg-slate-900 border border-slate-800 hover:bg-[#ff0054]/10 hover:text-[#ff0054] text-slate-500 opacity-0 group-hover/col:opacity-100 transition-all cursor-pointer"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 text-xs text-slate-300">
              {visibleSoldiers.map(sol => (
                <tr key={sol.name} className="hover:bg-slate-900/10 transition-all">
                  <td className="p-3 font-bold text-slate-200 sticky start-0 bg-slate-950/90 z-10 border-e border-slate-900">
                    {sol.name}
                  </td>
                  <td className="p-3 text-cyan-400 font-semibold border-e border-slate-900">{sol.frame}</td>

                  {visibleColumns.map(col => {
                    const cell = cells.find(
                      c => c.soldier_name === sol.name && c.column_id === col.id
                    );
                    const cellVal = cell ? cell.value : 'ריק';

                    return (
                      <TableCell
                        key={`${sol.name}-${col.id}`}
                        soldierName={sol.name}
                        columnId={col.id}
                        value={cellVal}
                        onToggle={handleToggleCell}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add Column Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm animate-fade-in"
          />

          <GlassCard className="w-full max-w-md border-slate-700/60 shadow-2xl relative z-10 text-right" glow="cyan">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-black text-slate-100">הוספת עמודת מעקב ובדיקה</h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddColumn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">שם הבדיקה / המקצה</label>
                <input
                  type="text"
                  required
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-cyan-500/50"
                  placeholder="לדוגמה: בוחן קשר, מקצה יום 1..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">קטגוריה</label>
                <select
                  value={newColCat}
                  onChange={(e) => setNewColCat(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="כשירות">כשירות</option>
                  <option value="לוחמה">לוחמה</option>
                  <option value="שיעורים">שיעורים</option>
                  <option value="חניכה">חניכה</option>
                  <option value="לוגיסטיקה">לוגיסטיקה</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                סגור ואשר יצירת עמודה
              </button>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
