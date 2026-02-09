export interface Word {
  id: string;
  word: string;
  chinese: string;
  ipa: string;
  partOfSpeech: string;
  exampleSentence: string;
  synonyms: string[];
  day: number;
  groupNumber: number;
}

export type WordStatus = 'green' | 'red' | null;

export interface WordWithStatus extends Word {
  status: WordStatus;
}
