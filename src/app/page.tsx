'use client';

import { useState, useCallback, useEffect } from 'react';
import { AppProvider, useApp } from '@/hooks/useAppState';
import { Word } from '@/types/word';
import { initTTS } from '@/lib/tts';
import NavigationBar from '@/components/NavigationBar';
import DaySlider from '@/components/DaySlider';
import ControlPanel from '@/components/ControlPanel';
import WordGrid from '@/components/WordGrid';
import FlashcardModal from '@/components/FlashcardModal';
import InstructionsModal from '@/components/InstructionsModal';
import SearchBar from '@/components/SearchBar';
import StatsPanel from '@/components/StatsPanel';

function FlashcardApp() {
  const { state, currentWords, setWordStatus, setFocusedIndex, focusedIndex } = useApp();

  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showStats, setShowStats] = useState(false);

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
        case 'ArrowLeft':
          e.preventDefault();
          setFocusedIndex(Math.max(0, focusedIndex - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setFocusedIndex(Math.min(currentWords.length - 1, focusedIndex + 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(Math.max(0, focusedIndex - 50));
          break;
        case 'ArrowDown':
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
      <DaySlider />
      <ControlPanel />
      <WordGrid onWordClick={handleWordClick} />

      {/* Modals */}
      {selectedWord && (
        <FlashcardModal
          word={selectedWord}
          wordIndex={selectedIndex}
          isOpen={!!selectedWord}
          onClose={handleModalClose}
          onPrev={handleModalPrev}
          onNext={handleModalNext}
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
