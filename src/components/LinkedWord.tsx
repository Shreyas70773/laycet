'use client';

import { Word } from '@/types/word';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, useCallback } from 'react';

interface LinkedWordProps {
  text: string;
  word: Word | null; // null = no match found, just render plain text
  onNavigate: (word: Word) => void;
}

export default function LinkedWord({ text, word, onNavigate }: LinkedWordProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<'above' | 'below'>('above');
  const [tooltipAlign, setTooltipAlign] = useState<'left' | 'center' | 'right'>('center');
  const ref = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const calculateTooltipPosition = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    setTooltipPos(spaceAbove < 80 ? 'below' : 'above');

    // Horizontal edge detection - tooltip is ~250px wide
    const tooltipHalfWidth = 125;
    const viewportWidth = window.innerWidth;
    const centerX = rect.left + rect.width / 2;

    if (centerX < tooltipHalfWidth + 12) {
      setTooltipAlign('left');
    } else if (centerX > viewportWidth - tooltipHalfWidth - 12) {
      setTooltipAlign('right');
    } else {
      setTooltipAlign('center');
    }
  }, []);

  if (!word) {
    return <span>{text}</span>;
  }

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    calculateTooltipPosition();
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

  // Mobile: single tap = tooltip, double tap = navigate
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    lastTapRef.current = now;

    if (timeSinceLastTap < 350 && timeSinceLastTap > 0) {
      // Double tap - navigate
      e.preventDefault();
      setShowTooltip(false);
      onNavigate(word);
    } else {
      // Single tap - toggle tooltip
      e.preventDefault();
      if (!showTooltip) {
        calculateTooltipPosition();
        setShowTooltip(true);
      } else {
        setShowTooltip(false);
      }
    }
  };

  // Tooltip alignment classes
  const alignClasses = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0',
  };

  const arrowAlignClasses = {
    left: 'left-3',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-3',
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
        onTouchEnd={handleTouchEnd}
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
              ? `bottom-full ${alignClasses[tooltipAlign]} mb-1.5`
              : `top-full ${alignClasses[tooltipAlign]} mt-1.5`
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
              `absolute ${arrowAlignClasses[tooltipAlign]} w-0 h-0`,
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
