'use client';

import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/hooks/useAppState';
import { t } from '@/lib/i18n';
import { Word } from '@/types/word';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  onWordSelect: (word: Word, index: number) => void;
}

export default function SearchBar({ isOpen, onClose, onWordSelect }: SearchBarProps) {
  const { state, words, currentWords } = useApp();
  const lang = state.settings.language;
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
      if (e.key === '/' && !isOpen) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const results = query.trim()
    ? words.filter(
        (w) =>
          w.word.toLowerCase().includes(query.toLowerCase()) ||
          w.chinese.includes(query)
      ).slice(0, 20)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="flex items-center px-4 py-3 border-b border-slate-100">
                <Search size={18} className="text-slate-400 mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('searchPlaceholder', lang)}
                  className="flex-1 text-sm outline-none text-slate-700 placeholder:text-slate-300"
                />
                <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-slate-100 text-slate-400"
                >
                  <X size={16} />
                </button>
              </div>

              {results.length > 0 && (
                <div className="max-h-80 overflow-y-auto">
                  {results.map((word) => {
                    const status = state.wordStatuses[word.id];
                    const idx = currentWords.findIndex((w) => w.id === word.id);
                    return (
                      <button
                        key={word.id}
                        onClick={() => {
                          onWordSelect(word, idx >= 0 ? idx : 0);
                          onClose();
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0"
                      >
                        <div>
                          <span className="text-sm font-medium text-slate-800">
                            {word.word}
                          </span>
                          <span className="text-xs text-slate-400 ml-2">
                            {word.ipa}
                          </span>
                          <span className="text-xs text-slate-500 ml-2">
                            {word.chinese}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            G{word.groupNumber}
                          </span>
                          {status === 'green' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          )}
                          {status === 'red' && (
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {query.trim() && results.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-slate-400">
                  {t('noResults', lang)}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
