'use client';

import { Word } from '@/types/word';
import { useApp } from '@/hooks/useAppState';
import { t } from '@/lib/i18n';
import { speakWord } from '@/lib/tts';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';

interface FlashcardModalProps {
  word: Word;
  wordIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function FlashcardModal({
  word,
  wordIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}: FlashcardModalProps) {
  const { state, setWordStatus, currentWords } = useApp();
  const lang = state.settings.language;
  const status = state.wordStatuses[word.id] || null;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case 'g':
        case 'G':
          setWordStatus(word.id, 'green');
          break;
        case 'r':
        case 'R':
          setWordStatus(word.id, 'red');
          break;
        case 'w':
        case 'W':
          setWordStatus(word.id, null);
          break;
      }
    },
    [isOpen, onClose, onPrev, onNext, word.id, setWordStatus]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Highlight word in example sentence
  const highlightSentence = (sentence: string, targetWord: string) => {
    const regex = new RegExp(`(${targetWord}[a-z]*)`, 'gi');
    const parts = sentence.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <strong key={i} className="text-blue-700 underline decoration-blue-300 underline-offset-2">
          {part}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className={cn(
                'relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden',
                'border-t-4',
                status === 'green' && 'border-t-emerald-500',
                status === 'red' && 'border-t-red-500',
                !status && 'border-t-blue-500'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                      {word.word}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-slate-400 font-mono">{word.ipa}</span>
                      <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-500 font-medium">
                        {word.partOfSpeech}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Audio buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => speakWord(word.word, 1.0)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Volume2 size={16} />
                    {t('playNormal', lang)}
                  </button>
                  <button
                    onClick={() => speakWord(word.word, 0.7)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Volume2 size={16} />
                    {t('playSlow', lang)}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-4 space-y-4">
                {/* Chinese translation */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    {t('chineseTranslation', lang)}
                  </h4>
                  <p className="text-lg text-slate-800 font-medium">{word.chinese}</p>
                </div>

                {/* Example sentence */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    {t('exampleSentence', lang)}
                  </h4>
                  <p className="text-slate-700 leading-relaxed italic bg-slate-50 rounded-lg p-3">
                    &ldquo;{highlightSentence(word.exampleSentence, word.word)}&rdquo;
                  </p>
                </div>

                {/* Synonyms */}
                {word.synonyms.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      {t('synonyms', lang)}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {word.synonyms.map((syn) => (
                        <span
                          key={syn}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setWordStatus(word.id, 'green')}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                      status === 'green'
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    )}
                  >
                    ✓ {t('markGreen', lang)}
                  </button>
                  <button
                    onClick={() => setWordStatus(word.id, 'red')}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                      status === 'red'
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                    )}
                  >
                    ✗ {t('markRed', lang)}
                  </button>
                  <button
                    onClick={() => setWordStatus(word.id, null)}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
                  >
                    {t('resetMark', lang)}
                  </button>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={onPrev}
                    disabled={wordIndex <= 0}
                    className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-xs text-slate-400 min-w-15 text-center">
                    {wordIndex + 1} / {currentWords.length}
                  </span>
                  <button
                    onClick={onNext}
                    disabled={wordIndex >= currentWords.length - 1}
                    className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
