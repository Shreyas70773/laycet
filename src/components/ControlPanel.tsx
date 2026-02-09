'use client';

import { useApp } from '@/hooks/useAppState';
import { t } from '@/lib/i18n';
import { shuffleAll, shuffleWithinGroups, sortByColor } from '@/lib/shuffle';
import {
  Shuffle,
  ArrowUpDown,
  Palette,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

export default function ControlPanel() {
  const {
    state,
    currentWords,
    setCurrentWords,
    clearAllStatuses,
    resetAll,
    words,
  } = useApp();
  const lang = state.settings.language;
  const [showConfirm, setShowConfirm] = useState<'clearAll' | 'resetAll' | null>(null);

  const handleShuffleAll = () => {
    setCurrentWords(shuffleAll(currentWords));
  };

  const handleShuffleWithin = () => {
    setCurrentWords(shuffleWithinGroups(currentWords));
  };

  const handleSortByColor = () => {
    setCurrentWords(sortByColor(currentWords, state.wordStatuses));
  };

  const handleClearAll = () => {
    setShowConfirm('clearAll');
  };

  const handleResetAll = () => {
    setShowConfirm('resetAll');
  };

  const confirmAction = () => {
    if (showConfirm === 'clearAll') {
      clearAllStatuses();
    } else if (showConfirm === 'resetAll') {
      resetAll();
    }
    setShowConfirm(null);
  };

  // Quick stats
  const totalVisible = currentWords.length;
  const greenCount = currentWords.filter(
    (w) => state.wordStatuses[w.id] === 'green'
  ).length;
  const redCount = currentWords.filter(
    (w) => state.wordStatuses[w.id] === 'red'
  ).length;

  return (
    <>
      <div className="w-full px-4 py-2 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2">
          {/* Shuffle buttons */}
          <button
            onClick={handleShuffleAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Shuffle size={14} />
            {t('shuffleAll', lang)}
          </button>
          <button
            onClick={handleShuffleWithin}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors"
          >
            <ArrowUpDown size={14} />
            {t('shuffleWithin', lang)}
          </button>
          <button
            onClick={handleSortByColor}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Palette size={14} />
            {t('sortByColor', lang)}
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1" />

          {/* Reset buttons */}
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-medium transition-colors"
          >
            <RotateCcw size={14} />
            {t('clearAll', lang)}
          </button>
          <button
            onClick={handleResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Trash2 size={14} />
            {t('resetAll', lang)}
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Quick stats */}
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">
              {totalVisible} {t('totalWords', lang)}
            </span>
            <span className="text-emerald-600 font-medium">
              🟢 {greenCount}
            </span>
            <span className="text-red-600 font-medium">🔴 {redCount}</span>
            <span className="text-slate-400">
              ⬜ {totalVisible - greenCount - redCount}
            </span>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <p className="text-slate-700 text-sm mb-4">
              {showConfirm === 'clearAll'
                ? t('confirmClearAll', lang)
                : t('confirmResetAll', lang)}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                {t('cancel', lang)}
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                {t('confirm', lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
