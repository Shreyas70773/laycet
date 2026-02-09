import { WordStatus } from './word';

export type Language = 'cn' | 'en';
export type SortMode = 'default' | 'color';

export interface UserSettings {
  language: Language;
  ttsSpeed: number;
}

export interface StudyStats {
  date: string;
  greenCount: number;
  redCount: number;
  totalReviewed: number;
}

export interface AppState {
  currentDay: number;
  wordStatuses: Record<string, WordStatus>;
  redCounts: Record<string, number>;
  lastStudyDate: string;
  streak: number;
  settings: UserSettings;
  studyHistory: StudyStats[];
  hasSeenInstructions: boolean;
}

export const DEFAULT_STATE: AppState = {
  currentDay: 1,
  wordStatuses: {},
  redCounts: {},
  lastStudyDate: '',
  streak: 0,
  settings: {
    language: 'cn',
    ttsSpeed: 1.0,
  },
  studyHistory: [],
  hasSeenInstructions: false,
};
