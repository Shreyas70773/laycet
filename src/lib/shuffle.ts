import { Word } from '@/types/word';
import { WordStatus } from '@/types/word';

/**
 * Fisher-Yates (Knuth) shuffle algorithm
 * Returns a new shuffled array (does not mutate input)
 */
function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Shuffle all words across all groups (ignoring group boundaries)
 */
export function shuffleAll(words: Word[]): Word[] {
  return fisherYatesShuffle(words);
}

/**
 * Shuffle words within each group (maintaining group boundaries)
 */
export function shuffleWithinGroups(words: Word[]): Word[] {
  const groups: Record<number, Word[]> = {};

  // Group words by groupNumber
  words.forEach((word) => {
    if (!groups[word.groupNumber]) {
      groups[word.groupNumber] = [];
    }
    groups[word.groupNumber].push(word);
  });

  // Shuffle within each group
  const result: Word[] = [];
  const groupNumbers = Object.keys(groups)
    .map(Number)
    .sort((a, b) => a - b);

  groupNumbers.forEach((groupNum) => {
    result.push(...fisherYatesShuffle(groups[groupNum]));
  });

  return result;
}

/**
 * Sort words by color status: green first, then red, then unmarked
 * Within each color group, maintain the current order
 */
export function sortByColor(
  words: Word[],
  statuses: Record<string, WordStatus>
): Word[] {
  const green: Word[] = [];
  const red: Word[] = [];
  const unmarked: Word[] = [];

  words.forEach((word) => {
    const status = statuses[word.id];
    if (status === 'green') green.push(word);
    else if (status === 'red') red.push(word);
    else unmarked.push(word);
  });

  return [...green, ...red, ...unmarked];
}
