'use client';

import { Word, WordStatus } from '@/types/word';
import { useApp } from '@/hooks/useAppState';
import { cn } from '@/lib/utils';

interface WordCardProps {
  word: Word;
  index: number;
  isFocused: boolean;
  onClick: () => void;
}

export default function WordCard({ word, index, isFocused, onClick }: WordCardProps) {
  const { state } = useApp();
  const status: WordStatus = state.wordStatuses[word.id] || null;

  return (
    <button
      onClick={onClick}
      data-index={index}
      className={cn(
        'w-full text-left px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150',
        'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
        'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1',
        // Color based on status
        status === 'green' && 'bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-150',
        status === 'red' && 'bg-red-100 border-red-300 text-red-800 hover:bg-red-150',
        !status && 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50',
        // Focused state
        isFocused && 'ring-2 ring-blue-500 ring-offset-1 shadow-md'
      )}
    >
      <span className="truncate block">{word.word}</span>
    </button>
  );
}
