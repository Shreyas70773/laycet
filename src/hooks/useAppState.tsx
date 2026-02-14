'use client';

import { createContext, useContext, useCallback, useEffect, useState, useMemo, ReactNode } from 'react';
import { Word, WordStatus } from '@/types/word';
import { AppState, DEFAULT_STATE, Language } from '@/types/state';
import { getTodayISO } from '@/lib/utils';
import wordsData from '@/data/words.json';

const STORAGE_KEY = 'cet4-flashcard-state';

interface AppContextType {
  // State
  state: AppState;
  words: Word[];
  currentWords: Word[];
  focusedIndex: number;

  // Day management
  setCurrentDay: (day: number) => void;

  // Word status
  setWordStatus: (wordId: string, status: WordStatus) => void;
  clearAllStatuses: () => void;
  clearGroupStatuses: (groupNumber: number) => void;
  resetAll: () => void;

  // Focus
  setFocusedIndex: (index: number) => void;

  // Settings
  setLanguage: (lang: Language) => void;

  // Computed
  getGroupWords: (groupNumber: number) => Word[];
  getWordsForDay: (day: number) => Word[];
  getGroupStats: (groupNumber: number) => { total: number; green: number; red: number };

  // Word order (for shuffling)
  setCurrentWords: (words: Word[]) => void;

  // Word lookup
  findWordByText: (text: string) => Word | null;
  maxDay: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadState(): AppState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch {
    console.warn('Failed to load state from localStorage');
  }
  return DEFAULT_STATE;
}

function saveState(state: AppState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn('Failed to save state to localStorage');
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const allWords: Word[] = wordsData as Word[];

  // Hydrate from localStorage on mount
  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setIsHydrated(true);
  }, []);

  // Update currentWords when day changes
  useEffect(() => {
    if (!isHydrated) return;
    const filtered = allWords.filter((w) => w.groupNumber <= state.currentDay);
    setCurrentWords(filtered);
    setFocusedIndex(-1);
  }, [state.currentDay, isHydrated, allWords]);

  // Persist state to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    saveState(state);
  }, [state, isHydrated]);

  // Track study streak
  useEffect(() => {
    if (!isHydrated) return;
    const today = getTodayISO();
    if (state.lastStudyDate !== today) {
      setState((prev) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayISO = yesterday.toISOString().split('T')[0];

        const newStreak =
          prev.lastStudyDate === yesterdayISO ? prev.streak + 1 : 1;

        return {
          ...prev,
          lastStudyDate: today,
          streak: newStreak,
        };
      });
    }
  }, [isHydrated, state.lastStudyDate]);

  const maxDay = Math.max(...allWords.map(w => w.day));

  const setCurrentDay = useCallback((day: number) => {
    setState((prev) => ({ ...prev, currentDay: Math.max(1, Math.min(maxDay, day)) }));
  }, [maxDay]);

  const setWordStatus = useCallback((wordId: string, status: WordStatus) => {
    setState((prev) => {
      const newStatuses = { ...prev.wordStatuses, [wordId]: status };
      const newRedCounts = { ...prev.redCounts };

      if (status === 'red') {
        newRedCounts[wordId] = (newRedCounts[wordId] || 0) + 1;
      }

      // Update study history
      const today = getTodayISO();
      const history = [...prev.studyHistory];
      let todayEntry = history.find((h) => h.date === today);
      if (!todayEntry) {
        todayEntry = { date: today, greenCount: 0, redCount: 0, totalReviewed: 0 };
        history.push(todayEntry);
      }

      const greenCount = Object.values(newStatuses).filter((s) => s === 'green').length;
      const redCount = Object.values(newStatuses).filter((s) => s === 'red').length;
      todayEntry.greenCount = greenCount;
      todayEntry.redCount = redCount;
      todayEntry.totalReviewed = greenCount + redCount;

      return {
        ...prev,
        wordStatuses: newStatuses,
        redCounts: newRedCounts,
        studyHistory: history,
      };
    });
  }, []);

  const clearAllStatuses = useCallback(() => {
    setState((prev) => ({ ...prev, wordStatuses: {} }));
  }, []);

  const clearGroupStatuses = useCallback(
    (groupNumber: number) => {
      setState((prev) => {
        const groupWordIds = allWords
          .filter((w) => w.groupNumber === groupNumber)
          .map((w) => w.id);
        const newStatuses = { ...prev.wordStatuses };
        groupWordIds.forEach((id) => {
          delete newStatuses[id];
        });
        return { ...prev, wordStatuses: newStatuses };
      });
    },
    [allWords]
  );

  const resetAll = useCallback(() => {
    setState({ ...DEFAULT_STATE, settings: state.settings });
  }, [state.settings]);

  const setLanguage = useCallback((lang: Language) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, language: lang },
    }));
  }, []);

  const getGroupWords = useCallback(
    (groupNumber: number) => allWords.filter((w) => w.groupNumber === groupNumber),
    [allWords]
  );

  const getWordsForDay = useCallback(
    (day: number) => allWords.filter((w) => w.groupNumber <= day),
    [allWords]
  );

  const getGroupStats = useCallback(
    (groupNumber: number) => {
      const groupWords = allWords.filter((w) => w.groupNumber === groupNumber);
      const total = groupWords.length;
      const green = groupWords.filter(
        (w) => state.wordStatuses[w.id] === 'green'
      ).length;
      const red = groupWords.filter(
        (w) => state.wordStatuses[w.id] === 'red'
      ).length;
      return { total, green, red };
    },
    [allWords, state.wordStatuses]
  );

  // Build a lookup map for fast word search by text
  const wordLookupMap = useMemo(() => {
    const map = new Map<string, Word>();
    for (const w of allWords) {
      map.set(w.word.toLowerCase(), w);
    }
    return map;
  }, [allWords]);

  const findWordByText = useCallback(
    (text: string): Word | null => {
      const lower = text.toLowerCase().trim();
      // Direct match
      if (wordLookupMap.has(lower)) return wordLookupMap.get(lower)!;
      // Try common morphological reductions
      const suffixes = ['s', 'es', 'ed', 'ing', 'er', 'est', 'ly', 'tion', 'ment', 'ness'];
      for (const suffix of suffixes) {
        if (lower.endsWith(suffix)) {
          const stem = lower.slice(0, -suffix.length);
          if (stem.length > 2 && wordLookupMap.has(stem)) return wordLookupMap.get(stem)!;
          if (wordLookupMap.has(stem + 'e')) return wordLookupMap.get(stem + 'e')!;
          // doubled consonant: "stopped" -> "stop"
          if (stem.length > 2 && stem[stem.length-1] === stem[stem.length-2]) {
            const shorter = stem.slice(0, -1);
            if (wordLookupMap.has(shorter)) return wordLookupMap.get(shorter)!;
          }
        }
      }
      // ied -> y
      if (lower.endsWith('ied')) {
        const yForm = lower.slice(0, -3) + 'y';
        if (wordLookupMap.has(yForm)) return wordLookupMap.get(yForm)!;
      }
      // ies -> y
      if (lower.endsWith('ies')) {
        const yForm = lower.slice(0, -3) + 'y';
        if (wordLookupMap.has(yForm)) return wordLookupMap.get(yForm)!;
      }
      return null;
    },
    [wordLookupMap]
  );

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        state,
        words: allWords,
        currentWords,
        focusedIndex,
        setCurrentDay,
        setWordStatus,
        clearAllStatuses,
        clearGroupStatuses,
        resetAll,
        setFocusedIndex,
        setLanguage,
        getGroupWords,
        getWordsForDay,
        getGroupStats,
        setCurrentWords,
        findWordByText,
        maxDay,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
