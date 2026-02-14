'use client';

import { Word } from '@/types/word';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface LinkedWordProps {
  text: string;
  word: Word | null; // null = no match found, just render plain text
  onNavigate: (word: Word) => void;
}

export default function LinkedWord({ text, word, onNavigate }: LinkedWordProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const [tooltipPos, setTooltipPos] = useState<'above' | 'below'>('above');
  const ref = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastTapRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const calculateTooltipPosition = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const centerX = rect.left + rect.width / 2;

    // Vertical: prefer above, fall back to below
    const above = rect.top > 80;
    setTooltipPos(above ? 'above' : 'below');

    // The tooltip will be position: fixed, so use viewport coordinates directly
    const style: React.CSSProperties = {
      position: 'fixed' as const,
      zIndex: 9999,
    };

    if (above) {
      style.top = rect.top - 6; // mb-1.5 equivalent
      style.transform = 'translateY(-100%)';
    } else {
      style.top = rect.bottom + 6;
    }

    // Horizontal centering with edge clamping
    const tooltipWidth = 250; // approximate
    let left = centerX - tooltipWidth / 2;
    if (left < 8) left = 8;
    if (left + tooltipWidth > viewportWidth - 8) left = viewportWidth - tooltipWidth - 8;
    style.left = left;

    setTooltipStyle(style);

    // Arrow position: always point to the center of the word
    const arrowLeft = centerX - left;
    setArrowStyle({ left: Math.max(8, Math.min(arrowLeft, tooltipWidth - 8)) });
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

  const tooltip = showTooltip && mounted
    ? createPortal(
        <span
          style={tooltipStyle}
          className={cn(
            'px-3 py-2 rounded-lg shadow-lg',
            'bg-slate-800 text-white text-xs whitespace-nowrap',
            'pointer-events-none',
            'animate-in fade-in duration-150'
          )}
        >
          <span className="font-semibold text-blue-300">{word.word}</span>
          <span className="text-slate-400 mx-1.5">·</span>
          <span className="text-slate-300">{word.ipa}</span>
          <span className="text-slate-400 mx-1.5">·</span>
          <span>{word.chinese}</span>
          {/* Arrow */}
          <span
            style={arrowStyle}
            className={cn(
              'absolute w-0 h-0',
              'border-x-4 border-x-transparent',
              tooltipPos === 'above'
                ? 'top-full border-t-4 border-t-slate-800'
                : 'bottom-full border-b-4 border-b-slate-800'
            )}
          />
        </span>,
        document.body
      )
    : null;

  return (
    <span ref={ref} className="relative inline">
      <span
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'cursor-pointer border-b border-dotted border-slate-400',
          'hover:border-blue-500 hover:text-blue-700 transition-colors',
        )}
      >
        {text}
      </span>
      {tooltip}
    </span>
  );
}
