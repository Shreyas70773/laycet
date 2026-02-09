'use client';

import { useApp } from '@/hooks/useAppState';
import { t } from '@/lib/i18n';
import { cn, formatPercent } from '@/lib/utils';
import WordCard from './WordCard';
import { Word } from '@/types/word';

interface WordGridProps {
  onWordClick: (word: Word, index: number) => void;
}

export default function WordGrid({ onWordClick }: WordGridProps) {
  const { state, currentWords, focusedIndex, getGroupStats } = useApp();
  const lang = state.settings.language;

  // Group currentWords by groupNumber
  const groups: Record<number, Word[]> = {};
  currentWords.forEach((word) => {
    if (!groups[word.groupNumber]) {
      groups[word.groupNumber] = [];
    }
    groups[word.groupNumber].push(word);
  });

  const groupNumbers = Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b);

  // Split into rows of 6
  const rows: number[][] = [];
  for (let i = 0; i < groupNumbers.length; i += 6) {
    rows.push(groupNumbers.slice(i, i + 6));
  }

  // Calculate running index for words
  let runningIndex = 0;
  const groupStartIndex: Record<number, number> = {};
  groupNumbers.forEach((gn) => {
    groupStartIndex[gn] = runningIndex;
    runningIndex += groups[gn].length;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {row.map((groupNum) => {
              const stats = getGroupStats(groupNum);
              const startIdx = groupStartIndex[groupNum];

              return (
                <div key={groupNum} className="flex flex-col">
                  {/* Group Header */}
                  <div className="flex items-center justify-between mb-2 px-1">
                    <h3 className="text-sm font-bold text-slate-600">
                      {t('groupLabel', lang, { n: groupNum })}
                    </h3>
                    <span
                      className={cn(
                        'text-xs font-medium px-1.5 py-0.5 rounded',
                        stats.green === stats.total
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      )}
                    >
                      {formatPercent(stats.green, stats.total)}
                    </span>
                  </div>

                  {/* Progress mini-bar */}
                  <div className="h-1 bg-slate-100 rounded-full mb-2 overflow-hidden">
                    <div className="h-full flex">
                      <div
                        className="bg-emerald-400 transition-all duration-300"
                        style={{
                          width: `${stats.total ? (stats.green / stats.total) * 100 : 0}%`,
                        }}
                      />
                      <div
                        className="bg-red-400 transition-all duration-300"
                        style={{
                          width: `${stats.total ? (stats.red / stats.total) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Word Cards */}
                  <div className="space-y-1 max-h-150 overflow-y-auto pr-1 scrollbar-thin">
                    {groups[groupNum].map((word, idx) => {
                      const globalIdx = startIdx + idx;
                      return (
                        <WordCard
                          key={word.id}
                          word={word}
                          index={globalIdx}
                          isFocused={focusedIndex === globalIdx}
                          onClick={() => onWordClick(word, globalIdx)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
