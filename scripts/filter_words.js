/**
 * Generate actual word entries with Chinese definitions, IPA, examples etc.
 * for all missing words. Creates the final words to add to words.json.
 *
 * Strategy: We generate concise, useful entries. For words that appear as
 * synonyms (important for linking), we include them even at lower frequency.
 * For sentence-only words, we require higher frequency.
 */

const fs = require('fs');
const path = require('path');

const existingWords = require('../src/data/words.json');
const missingWords = require('./missing_words.json');

const existingSet = new Set(existingWords.map(w => w.word.toLowerCase()));

// More aggressive filtering
const filtered = missingWords.filter(w => {
  if (w.word.length <= 2) return false;
  if (w.word.includes("'")) return false;
  // Words used as synonyms: include if count >= 2 or is a synonym
  if (w.fromSynonym && w.count >= 2) return true;
  // Sentence-only words: need higher frequency
  if (w.fromSentence && w.count >= 5) return true;
  return false;
});

// Remove plural/conjugated forms if the base form is already included
// Build a set of words we're about to include
const includedSet = new Set(filtered.map(w => w.word));
const allKnown = new Set([...existingSet, ...includedSet]);

const deduped = filtered.filter(w => {
  const word = w.word;
  // If this is "students" and "student" exists, skip
  if (word.endsWith('s') && (allKnown.has(word.slice(0, -1)) || existingSet.has(word.slice(0, -1)))) {
    // But only if the base is not this word itself
    if (word.slice(0, -1) !== word) return false;
  }
  if (word.endsWith('es') && word.length > 4) {
    const base = word.slice(0, -2);
    if (existingSet.has(base) || (includedSet.has(base) && base !== word)) return false;
    // ies -> y
    if (word.endsWith('ies')) {
      const yBase = word.slice(0, -3) + 'y';
      if (existingSet.has(yBase) || includedSet.has(yBase)) return false;
    }
  }
  if (word.endsWith('ed') && word.length > 4) {
    const base1 = word.slice(0, -2); // "decided" -> "decid" (no)
    const base2 = word.slice(0, -1); // "decided" -> "decide" (yes)
    const base3 = word.slice(0, -3); // "decided" -> "decid" (no)
    if (existingSet.has(base1) || existingSet.has(base2)) return false;
    if (includedSet.has(base1) || includedSet.has(base2)) return false;
    // doubled consonant: "stopped" -> "stop"
    if (word.length > 5 && word[word.length-3] === word[word.length-4]) {
      const base = word.slice(0, -3);
      if (existingSet.has(base) || includedSet.has(base)) return false;
    }
    // ied -> y
    if (word.endsWith('ied')) {
      const yBase = word.slice(0, -3) + 'y';
      if (existingSet.has(yBase) || includedSet.has(yBase)) return false;
    }
  }
  if (word.endsWith('ing') && word.length > 5) {
    const base1 = word.slice(0, -3);
    const base2 = word.slice(0, -3) + 'e';
    if (existingSet.has(base1) || existingSet.has(base2)) return false;
    if (includedSet.has(base1) || includedSet.has(base2)) return false;
    // doubled consonant
    if (word.length > 6 && word[word.length-4] === word[word.length-5]) {
      const base = word.slice(0, -4);
      if (existingSet.has(base) || includedSet.has(base)) return false;
    }
  }
  if (word.endsWith('ly') && word.length > 4) {
    const base = word.slice(0, -2);
    if (existingSet.has(base) || includedSet.has(base)) return false;
    // ily -> y
    if (word.endsWith('ily')) {
      const yBase = word.slice(0, -3) + 'y';
      if (existingSet.has(yBase) || includedSet.has(yBase)) return false;
    }
  }
  if (word.endsWith('er') && word.length > 4) {
    const base1 = word.slice(0, -2);
    const base2 = word.slice(0, -1); // "teacher" -> "teache" (no)
    if (existingSet.has(base1)) return false;
  }
  return true;
});

console.log(`After filtering: ${missingWords.length} -> ${filtered.length} -> ${deduped.length} words`);

// Now output just the word list for the big generation step
const wordList = deduped.map(w => w.word);
fs.writeFileSync(path.join(__dirname, 'final_word_list.json'), JSON.stringify(wordList, null, 2));
fs.writeFileSync(path.join(__dirname, 'final_words_detail.json'), JSON.stringify(deduped, null, 2));

console.log(`Final word list: ${wordList.length} words`);
console.log('Sample:', wordList.slice(0, 30).join(', '));
