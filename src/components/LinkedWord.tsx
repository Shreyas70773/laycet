'use client';

import { Word } from '@/types/word';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

interface LinkedWordProps {
  text: string;
  word: Word | null; // null = no match found, just render plain text
  onNavigate: (word: Word) => void;
}

export default function LinkedWord({ text, word, onNavigate }: LinkedWordProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<'above' | 'below'>('above');
  const ref = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!word) {
    return <span>{text}</span>;
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Calculate position
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      setTooltipPos(spaceAbove < 80 ? 'below' : 'above');
    }
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowTooltip(false), 150);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(false);
    onNavigate(word);
  };

  return (
    <span
      ref={ref}
      className="relative inline"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        onClick={handleClick}
        className={cn(
          'cursor-pointer border-b border-dotted border-slate-400',
          'hover:border-blue-500 hover:text-blue-700 transition-colors',
        )}
      >
        {text}
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <span
          className={cn(
            'absolute z-100 px-3 py-2 rounded-lg shadow-lg',
            'bg-slate-800 text-white text-xs whitespace-nowrap',
            'pointer-events-none',
            'animate-in fade-in duration-150',
            tooltipPos === 'above'
              ? 'bottom-full left-1/2 -translate-x-1/2 mb-1.5'
              : 'top-full left-1/2 -translate-x-1/2 mt-1.5'
          )}
        >
          <span className="font-semibold text-blue-300">{word.word}</span>
          <span className="text-slate-400 mx-1.5">·</span>
          <span className="text-slate-300">{word.ipa}</span>
          <span className="text-slate-400 mx-1.5">·</span>
          <span>{word.chinese}</span>
          {/* Arrow */}
          <span
            className={cn(
              'absolute left-1/2 -translate-x-1/2 w-0 h-0',
              'border-x-4 border-x-transparent',
              tooltipPos === 'above'
                ? 'top-full border-t-4 border-t-slate-800'
                : 'bottom-full border-b-4 border-b-slate-800'
            )}
          />
        </span>
      )}
    </span>
  );
}
