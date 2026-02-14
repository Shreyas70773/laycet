'use client';

import { speakWord } from '@/lib/tts';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Volume2 } from 'lucide-react';
import { useState, ReactNode } from 'react';

interface SentencePlayerProps {
  sentence: string;
  highlightedContent: ReactNode;
  lang: 'cn' | 'en';
}

const SPEED_OPTIONS = [0.3, 0.5, 0.7] as const;

export default function SentencePlayer({ sentence, highlightedContent, lang }: SentencePlayerProps) {
  const [activeSpeed, setActiveSpeed] = useState<number | null>(null);

  const handlePlay = (speed: number) => {
    setActiveSpeed(speed);
    speakWord(sentence, speed);
    // Reset active indicator after estimated duration
    const estimatedDuration = Math.max(3000, (sentence.length * 100) / speed);
    setTimeout(() => setActiveSpeed(null), estimatedDuration);
  };

  return (
    <div className="space-y-2">
      {/* Sentence text */}
      <p className="text-slate-700 leading-relaxed italic bg-slate-50 rounded-lg p-3">
        &ldquo;{highlightedContent}&rdquo;
      </p>

      {/* Playback controls */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Normal speed play */}
        <button
          onClick={() => handlePlay(1.0)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            activeSpeed === 1.0
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
          )}
          title={t('playSentence', lang)}
        >
          <Volume2 size={14} className={activeSpeed === 1.0 ? 'animate-pulse' : ''} />
          {t('sentenceNormal', lang)}
        </button>

        {/* Speed options */}
        {SPEED_OPTIONS.map((speed) => (
          <button
            key={speed}
            onClick={() => handlePlay(speed)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              activeSpeed === speed
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
            )}
            title={`${speed}x ${t('speed', lang)}`}
          >
            <Volume2 size={14} className={activeSpeed === speed ? 'animate-pulse' : ''} />
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
}
