/**
 * Generate new word entries for missing words.
 * Filter to meaningful words that appear frequently in sentences or as synonyms.
 * Group them into days 31+ (50 words per group).
 */

const fs = require('fs');
const path = require('path');

const existingWords = require('../src/data/words.json');
const missingWords = require('./missing_words.json');

// Build lookup for existing words
const existingSet = new Set(existingWords.map(w => w.word.toLowerCase()));

// Filter criteria: words that are meaningful enough to create cards for
// Must appear 2+ times OR be a synonym reference
const filtered = missingWords.filter(w => {
  // Skip very short words
  if (w.word.length <= 2) return false;
  // Skip words with apostrophes (contractions)
  if (w.word.includes("'")) return false;
  // Include if it appears as a synonym (important for linking)
  if (w.fromSynonym) return true;
  // Include if it appears 3+ times in sentences
  if (w.count >= 3) return true;
  return false;
});

console.log(`Filtered from ${missingWords.length} to ${filtered.length} words`);

// A comprehensive dictionary of word data
// For the actual implementation, we'll generate stubs that have basic info
// In production, this would come from a dictionary API

// Common word definitions (programmatically generated with reasonable defaults)
const WORD_DATA = {};

// We'll create a lookup for part of speech heuristics
function guessPOS(word) {
  if (word.endsWith('ly')) return 'adv.';
  if (word.endsWith('tion') || word.endsWith('sion') || word.endsWith('ment') || word.endsWith('ness') || word.endsWith('ity') || word.endsWith('ance') || word.endsWith('ence')) return 'n.';
  if (word.endsWith('ful') || word.endsWith('less') || word.endsWith('ous') || word.endsWith('ive') || word.endsWith('able') || word.endsWith('ible') || word.endsWith('al') || word.endsWith('ent') || word.endsWith('ant')) return 'adj.';
  if (word.endsWith('ize') || word.endsWith('ise') || word.endsWith('fy') || word.endsWith('ate')) return 'v.';
  if (word.endsWith('er') || word.endsWith('or') || word.endsWith('ist')) return 'n.';
  return 'n./adj.';
}

// We'll need actual Chinese translations and IPA for all these words.
// Let's create the structure and use a node script to batch-generate.

// For now, create the entries
const newEntries = [];
const WORDS_PER_GROUP = 50;
let currentDay = 31;
let currentGroup = 31;
let countInGroup = 0;

for (const item of filtered) {
  if (countInGroup >= WORDS_PER_GROUP) {
    currentDay++;
    currentGroup++;
    countInGroup = 0;
  }
  
  const groupStr = String(currentGroup).padStart(2, '0');
  const indexStr = String(countInGroup + 1).padStart(3, '0');
  
  newEntries.push({
    word: item.word,
    count: item.count,
    fromSentence: item.fromSentence,
    fromSynonym: item.fromSynonym,
    sources: item.sources,
    day: currentDay,
    groupNumber: currentGroup,
    id: `w${groupStr}-${indexStr}`,
  });
  
  countInGroup++;
}

const totalNewGroups = currentGroup - 30;
console.log(`Generated ${newEntries.length} entries across ${totalNewGroups} new groups (days ${31}-${currentDay})`);

// Write the list for the next step (generating actual definitions)
fs.writeFileSync(
  path.join(__dirname, 'new_word_list.json'),
  JSON.stringify(newEntries, null, 2)
);

console.log('Written to scripts/new_word_list.json');
console.log(`\nSample entries:`);
for (const e of newEntries.slice(0, 5)) {
  console.log(`  ${e.id}: ${e.word} (day ${e.day}, group ${e.groupNumber})`);
}
console.log(`  ...`);
for (const e of newEntries.slice(-3)) {
  console.log(`  ${e.id}: ${e.word} (day ${e.day}, group ${e.groupNumber})`);
}
