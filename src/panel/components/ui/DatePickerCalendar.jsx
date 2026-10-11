import React, { useState, useMemo } from 'react';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/**
 * Custom Interactive Calendar Picker
 * @param {string} value - Selected date string in YYYY-MM-DD format
 * @param {string} minDate - Minimum selectable date string in YYYY-MM-DD format
 * @param {function} onChange - Callback receiving the selected dateStr (YYYY-MM-DD)
 */
export function DatePickerCalendar({ value, minDate, maxDate, onChange }) {
  // Initial view year and month based on selected value or today
  const initialDate = useMemo(() => {
    if (value) {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(y, m - 1, d || 1);
    }
    return new Date();
  }, [value]);

  const [viewDate, setViewDate] = useState(initialDate);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Min and Max date boundaries
  const [minYear, minMonth] = useMemo(() => {
    if (!minDate) return [0, 0];
    const [y, m] = minDate.split('-').map(Number);
    return [y, m - 1];
  }, [minDate]);

  const [maxYear, maxMonth] = useMemo(() => {
    if (!maxDate) return [9999, 11];
    const [y, m] = maxDate.split('-').map(Number);
    return [y, m - 1];
  }, [maxDate]);

  const isPrevDisabled = viewYear < minYear || (viewYear === minYear && viewMonth <= minMonth);
  const isNextDisabled = viewYear > maxYear || (viewYear === maxYear && viewMonth >= maxMonth);

  const handlePrevMonth = () => {
    if (isPrevDisabled) return;
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    if (isNextDisabled) return;
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleTodayClick = () => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setViewDate(today);
    if (onChange && (!minDate || todayStr >= minDate)) {
      onChange(todayStr);
    }
  };

  // Calendar cells computation
  const calendarCells = useMemo(() => {
    const firstDayDow = new Date(viewYear, viewMonth, 1).getDay();
    const startOffset = (firstDayDow + 6) % 7; // Monday = 0, Sunday = 6
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];

    // 1. Previous month trailing days
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({
        dayNumber: daysInPrevMonth - i,
        isCurrentMonth: false,
        disabled: true,
      });
    }

    // 2. Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isPast = minDate ? dateStr < minDate : false;
      const isFuture = maxDate ? dateStr > maxDate : false;
      const disabled = isPast || isFuture;
      const isSelected = value === dateStr;
      
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const isToday = dateStr === todayStr;

      cells.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
        disabled,
        isPast,
        isFuture,
        isSelected,
        isToday,
      });
    }

    // 3. Next month leading days to complete grid
    const totalCells = cells.length <= 35 ? 35 : 42;
    const remaining = totalCells - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        dayNumber: d,
        isCurrentMonth: false,
        disabled: true,
      });
    }

    return cells;
  }, [viewYear, viewMonth, value, minDate, maxDate]);

  // Formatted human readable date for selected value
  const formattedSelected = useMemo(() => {
    if (!value) return '';
    try {
      const [y, m, d] = value.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return value;
    }
  }, [value]);

  return (
    <div className="bg-[#0c0e12] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl select-none h-full flex flex-col justify-between">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <span className="material-symbols-outlined text-lime-400 text-[18px]">calendar_month</span>
            <span className="capitalize">{MONTH_NAMES[viewMonth]}</span>
            <span className="text-slate-400 font-semibold">{viewYear}</span>
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleTodayClick}
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Hoy
          </button>
          
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={isPrevDisabled}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              isPrevDisabled 
                ? 'text-slate-700 cursor-not-allowed opacity-30' 
                : 'text-slate-300 hover:text-white hover:bg-white/[0.08] active:scale-95'
            }`}
            title="Mes anterior"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
            disabled={isNextDisabled}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              isNextDisabled 
                ? 'text-slate-700 cursor-not-allowed opacity-30' 
                : 'text-slate-300 hover:text-white hover:bg-white/[0.08] active:scale-95'
            }`}
            title="Mes siguiente"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {DAY_LABELS.map(label => (
          <div key={label} className="text-[11px] font-bold text-slate-500 uppercase tracking-wider py-1">
            {label}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {calendarCells.map((cell, idx) => {
          if (!cell.isCurrentMonth) {
            return (
              <div
                key={`pad-${idx}`}
                className="aspect-square rounded-xl flex items-center justify-center text-xs text-slate-700/40 select-none"
              >
                {cell.dayNumber}
              </div>
            );
          }

          if (cell.disabled) {
            return (
              <div
                key={`disabled-${cell.dateStr}`}
                className="aspect-square rounded-xl flex items-center justify-center text-xs text-slate-600/40 cursor-not-allowed select-none line-through"
                title={cell.isPast ? "Fecha no disponible" : cell.isFuture ? "Máximo 2 meses a partir de hoy" : "Fecha no disponible"}
              >
                {cell.dayNumber}
              </div>
            );
          }

          return (
            <button
              key={cell.dateStr}
              type="button"
              onClick={() => onChange(cell.dateStr)}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all relative group ${
                cell.isSelected
                  ? 'bg-lime-400 text-black font-extrabold shadow-[0_0_15px_rgba(163,230,53,0.35)] scale-[1.05] z-10'
                  : cell.isToday
                    ? 'bg-lime-500/10 border border-lime-500/40 text-lime-400 font-bold hover:bg-lime-500/20'
                    : 'bg-white/[0.02] text-slate-200 border border-white/[0.04] hover:bg-white/[0.08] hover:text-white hover:border-lime-500/40 active:scale-95'
              }`}
            >
              <span>{cell.dayNumber}</span>
              {cell.isToday && !cell.isSelected && (
                <span className="w-1 h-1 rounded-full bg-lime-400 absolute bottom-1.5"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Footer */}
      {formattedSelected && (
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
          <span className="text-slate-400">Fecha seleccionada:</span>
          <span className="font-semibold text-lime-400 capitalize flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">event_available</span>
            {formattedSelected}
          </span>
        </div>
      )}
    </div>
  );
}
