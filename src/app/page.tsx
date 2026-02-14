'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { AppProvider, useApp } from '@/hooks/useAppState';
import { Word } from '@/types/word';
import { initTTS } from '@/lib/tts';
import { t } from '@/lib/i18n';
import NavigationBar from '@/components/NavigationBar';
import DaySlider from '@/components/DaySlider';
import ControlPanel from '@/components/ControlPanel';
import WordGrid from '@/components/WordGrid';
import FlashcardModal from '@/components/FlashcardModal';
import InstructionsModal from '@/components/InstructionsModal';
import SearchBar from '@/components/SearchBar';
import StatsPanel from '@/components/StatsPanel';

function FlashcardApp() {
  const { state, currentWords, extraWords, setWordStatus, setFocusedIndex, focusedIndex } = useApp();
  const lang = state.settings.language;

  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [activeTab, setActiveTab] = useState<'cet' | 'extra'>('cet');
  const [extraLetterFilter, setExtraLetterFilter] = useState<string>('A');

  // Show instructions on first launch
  useEffect(() => {
    if (!state.hasSeenInstructions) {
      setShowInstructions(true);
    }
  }, [state.hasSeenInstructions]);

  // Initialize TTS
  useEffect(() => {
    initTTS();
  }, []);

  const handleWordClick = useCallback(
    (word: Word, index: number) => {
      setSelectedWord(word);
      setSelectedIndex(index);
      setFocusedIndex(index);
    },
    [setFocusedIndex]
  );

  const handleModalClose = useCallback(() => {
    setSelectedWord(null);
    setSelectedIndex(-1);
  }, []);

  const handleModalPrev = useCallback(() => {
    if (selectedIndex > 0) {
      const newIndex = selectedIndex - 1;
      setSelectedWord(currentWords[newIndex]);
      setSelectedIndex(newIndex);
      setFocusedIndex(newIndex);
    }
  }, [selectedIndex, currentWords, setFocusedIndex]);

  const handleModalNext = useCallback(() => {
    if (selectedIndex < currentWords.length - 1) {
      const newIndex = selectedIndex + 1;
      setSelectedWord(currentWords[newIndex]);
      setSelectedIndex(newIndex);
      setFocusedIndex(newIndex);
    }
  }, [selectedIndex, currentWords, setFocusedIndex]);

  const handleSearchWordSelect = useCallback(
    (word: Word, index: number) => {
      setSelectedWord(word);
      setSelectedIndex(index);
      setFocusedIndex(index);
    },
    [setFocusedIndex]
  );

  const handleNavigateToWord = useCallback(
    (targetWord: Word) => {
      // Find the index of this word in currentWords
      const idx = currentWords.findIndex(w => w.id === targetWord.id);
      if (idx >= 0) {
        setSelectedWord(currentWords[idx]);
        setSelectedIndex(idx);
        setFocusedIndex(idx);
      } else {
        // Word might be in a group not currently loaded — still show it
        setSelectedWord(targetWord);
        setSelectedIndex(-1);
      }
    },
    [currentWords, setFocusedIndex]
  );

  // Group extra words by starting letter
  const extraLetters = useMemo(() => {
    const letters = new Set(extraWords.map(w => w.word[0].toUpperCase()));
    return Array.from(letters).sort();
  }, [extraWords]);

  const filteredExtraWords = useMemo(() => {
    return extraWords.filter(w => w.word[0].toUpperCase() === extraLetterFilter);
  }, [extraWords, extraLetterFilter]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if modal, search, or instructions are open
      if (selectedWord || showSearch) return;

      // Don't handle if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(Math.max(0, focusedIndex - 1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(Math.min(currentWords.length - 1, focusedIndex + 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedIndex(Math.max(0, focusedIndex - 50));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFocusedIndex(Math.min(currentWords.length - 1, focusedIndex + 50));
          break;
        case 'd':
        case 'D':
          if (focusedIndex >= 0 && focusedIndex < currentWords.length) {
            handleWordClick(currentWords[focusedIndex], focusedIndex);
          }
          break;
        case 'g':
        case 'G':
          if (focusedIndex >= 0 && focusedIndex < currentWords.length) {
            setWordStatus(currentWords[focusedIndex].id, 'green');
          }
          break;
        case 'r':
        case 'R':
          if (focusedIndex >= 0 && focusedIndex < currentWords.length) {
            setWordStatus(currentWords[focusedIndex].id, 'red');
          }
          break;
        case 'w':
        case 'W':
          if (focusedIndex >= 0 && focusedIndex < currentWords.length) {
            setWordStatus(currentWords[focusedIndex].id, null);
          }
          break;
        case '/':
          e.preventDefault();
          setShowSearch(true);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    focusedIndex,
    currentWords,
    selectedWord,
    showSearch,
    setFocusedIndex,
    setWordStatus,
    handleWordClick,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <NavigationBar
        onSearch={() => setShowSearch(true)}
        onStats={() => setShowStats(true)}
      />

      {/* Tab Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto flex">
          <button
            onClick={() => setActiveTab('cet')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === 'cet'
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('cetTab', lang)}
            {activeTab === 'cet' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('extra')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === 'extra'
                ? 'text-amber-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('extraWordsTab', lang)}
            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
              {extraWords.length}
            </span>
            {activeTab === 'extra' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'cet' ? (
        <>
          <DaySlider />
          <ControlPanel />
          <WordGrid onWordClick={handleWordClick} />
        </>
      ) : (
        /* Extra Words Dictionary View */
        <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-4">
          <p className="text-xs text-slate-400 mb-3 text-center">
            {t('extraWordsSubtitle', lang)}
          </p>

          {/* Letter filter bar */}
          <div className="flex flex-wrap gap-1 justify-center mb-4">
            {extraLetters.map(letter => (
              <button
                key={letter}
                onClick={() => setExtraLetterFilter(letter)}
                className={`w-8 h-8 text-xs font-semibold rounded-lg transition-colors ${
                  extraLetterFilter === letter
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 text-center mb-3">
            {t('extraWordsCount', lang, { count: filteredExtraWords.length })}
          </p>

          {/* Extra words grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {filteredExtraWords.map((word) => (
              <button
                key={word.id}
                onClick={() => {
                  setSelectedWord(word);
                  setSelectedIndex(-1);
                }}
                className="bg-white rounded-lg border border-slate-200 p-2.5 text-left hover:border-amber-400 hover:shadow-sm transition-all group"
              >
                <div className="text-sm font-medium text-slate-800 group-hover:text-amber-700 truncate">
                  {word.word}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {word.chinese}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedWord && (
        <FlashcardModal
          word={selectedWord}
          wordIndex={selectedIndex}
          isOpen={!!selectedWord}
          onClose={handleModalClose}
          onPrev={handleModalPrev}
          onNext={handleModalNext}
          onNavigateToWord={handleNavigateToWord}
        />
      )}

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />

      <SearchBar
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onWordSelect={handleSearchWordSelect}
      />

      <StatsPanel
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <FlashcardApp />
    </AppProvider>
  );
}
