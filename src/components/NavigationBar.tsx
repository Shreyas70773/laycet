'use client';

import { useApp } from '@/hooks/useAppState';
import { t } from '@/lib/i18n';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, BookOpen, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationBarProps {
  onSearch: () => void;
  onStats: () => void;
}

export default function NavigationBar({ onSearch, onStats }: NavigationBarProps) {
  const { state, setLanguage, setWordStatus, setFocusedIndex, focusedIndex, currentWords } = useApp();
  const lang = state.settings.language;

  const navigate = (direction: 'up' | 'down' | 'left' | 'right') => {
    const maxIndex = currentWords.length - 1;
    if (maxIndex < 0) return;

    let newIndex = focusedIndex;
    switch (direction) {
      case 'up':
        newIndex = Math.max(0, focusedIndex - 1); // Move up within column
        break;
      case 'down':
        newIndex = Math.min(maxIndex, focusedIndex + 1); // Move down within column
        break;
      case 'left':
        newIndex = Math.max(0, focusedIndex - 50); // Jump to previous group
        break;
      case 'right':
        newIndex = Math.min(maxIndex, focusedIndex + 50); // Jump to next group
        break;
    }
    setFocusedIndex(newIndex);
  };

  const currentWord = focusedIndex >= 0 && focusedIndex < currentWords.length
    ? currentWords[focusedIndex]
    : null;

  return (
    <header className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      {/* Top row: Logo + utility buttons */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-2.5 pb-1.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Logo / Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
            <BookOpen size={16} className="text-white sm:hidden" />
            <BookOpen size={18} className="text-white hidden sm:block" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-bold leading-tight truncate">{t('appTitle', lang)}</h1>
            <p className="text-[10px] sm:text-xs text-blue-200 truncate hidden sm:block">{t('appSubtitle', lang)}</p>
          </div>
        </div>

        {/* Right side utilities */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {/* Search */}
          <button
            onClick={onSearch}
            className="p-1.5 sm:p-2 rounded hover:bg-white/20 transition-colors"
            title={t('searchPlaceholder', lang)}
          >
            <Search size={16} />
          </button>

          {/* Stats */}
          <button
            onClick={onStats}
            className="p-1.5 sm:p-2 rounded text-sm hover:bg-white/20 transition-colors"
          >
            📊
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(lang === 'cn' ? 'en' : 'cn')}
            className="px-2 py-1 rounded text-xs font-bold hover:bg-white/20 transition-colors"
          >
            {lang === 'cn' ? 'EN' : '中'}
          </button>

          {/* Streak */}
          {state.streak > 0 && (
            <span className="text-[10px] sm:text-xs bg-amber-400/80 text-amber-900 px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
              🔥 {state.streak}{lang === 'cn' ? '天' : 'd'}
            </span>
          )}
        </div>
      </div>

      {/* Bottom row: Navigation arrows + action shortcut buttons */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-2.5 sm:pb-3">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {/* Arrow buttons */}
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={() => navigate('up')}
              className="p-1.5 rounded hover:bg-white/20 transition-colors"
              title="↑"
            >
              <ArrowUp size={14} />
            </button>
            <button
              onClick={() => navigate('down')}
              className="p-1.5 rounded hover:bg-white/20 transition-colors"
              title="↓"
            >
              <ArrowDown size={14} />
            </button>
            <button
              onClick={() => navigate('left')}
              className="p-1.5 rounded hover:bg-white/20 transition-colors"
              title="←"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={() => navigate('right')}
              className="p-1.5 rounded hover:bg-white/20 transition-colors"
              title="→"
            >
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="w-px h-5 bg-white/20 mx-1 shrink-0" />

          {/* Action shortcut buttons */}
          {[
            { key: 'D', label: t('definition', lang), color: 'bg-white/20 hover:bg-white/30' },
            { key: 'G', label: t('markGreen', lang), color: 'bg-emerald-500/80 hover:bg-emerald-500' },
            { key: 'R', label: t('markRed', lang), color: 'bg-red-500/80 hover:bg-red-500' },
            { key: 'W', label: t('resetMark', lang), color: 'bg-slate-500/80 hover:bg-slate-500' },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => {
                if (!currentWord) return;
                if (key === 'G') setWordStatus(currentWord.id, 'green');
                else if (key === 'R') setWordStatus(currentWord.id, 'red');
                else if (key === 'W') setWordStatus(currentWord.id, null);
              }}
              className={cn(
                'px-2 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1 shrink-0',
                color
              )}
              title={label}
            >
              <kbd className="text-[10px] font-mono bg-white/20 px-1 rounded">{key}</kbd>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
