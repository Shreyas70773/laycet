'use client';

import { useApp } from '@/hooks/useAppState';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function DaySlider() {
  const { state, setCurrentDay } = useApp();
  const lang = state.settings.language;

  return (
    <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        {/* Mobile: stack vertically / Desktop: single row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {/* Label + slider row */}
          <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1">
            <label className="text-xs sm:text-sm font-semibold text-slate-600 whitespace-nowrap">
              {t('dayLabel', lang, { day: state.currentDay })}
            </label>
            <input
              type="range"
              min={1}
              max={30}
              value={state.currentDay}
              onChange={(e) => setCurrentDay(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          {/* Quick-pick day buttons */}
          <div className="flex gap-1 shrink-0">
            {[1, 5, 10, 15, 20, 25, 30].map((day) => (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className={cn(
                  'px-2 py-1 text-xs rounded font-medium transition-colors',
                  state.currentDay === day
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(state.currentDay / 30) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
