/**
 * Script to find all words used in example sentences and synonyms
 * that are NOT part of the 1500 core vocabulary.
 * Then generate new word entries for them.
 */

const fs = require('fs');
const path = require('path');

const words = require('../src/data/words.json');

// Build a set of all existing words (lowercased)
const existingWords = new Set(words.map(w => w.word.toLowerCase()));

// Common stop words / basic words that don't need cards
const STOP_WORDS = new Set([
  // Articles, pronouns, prepositions, conjunctions, etc.
  'a', 'an', 'the', 'i', 'me', 'my', 'we', 'us', 'our', 'you', 'your',
  'he', 'him', 'his', 'she', 'her', 'it', 'its', 'they', 'them', 'their',
  'this', 'that', 'these', 'those', 'who', 'whom', 'which', 'what', 'whose',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'having',
  'do', 'does', 'did', 'doing', 'done',
  'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
  'to', 'of', 'in', 'on', 'at', 'by', 'for', 'from', 'with', 'about',
  'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'out', 'off', 'up', 'down', 'over', 'under', 'again',
  'and', 'but', 'or', 'nor', 'not', 'no', 'so', 'if', 'then', 'than',
  'too', 'very', 'just', 'also', 'now', 'here', 'there', 'when', 'where',
  'how', 'why', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
  'other', 'some', 'any', 'such', 'only', 'own', 'same', 'as', 'well',
  'back', 'even', 'still', 'already', 'yet', 'ever', 'never', 'always',
  'often', 'sometimes', 'soon', 'ago', 'today', 'tomorrow', 'yesterday',
  'much', 'many', 'little', 'less', 'least', 'enough',
  // Basic verbs / words (pre-CET4 level)
  'get', 'got', 'go', 'went', 'gone', 'going',
  'come', 'came', 'coming',
  'make', 'made', 'making',
  'take', 'took', 'taken', 'taking',
  'give', 'gave', 'given', 'giving',
  'say', 'said', 'saying',
  'tell', 'told', 'telling',
  'see', 'saw', 'seen', 'seeing',
  'know', 'knew', 'known', 'knowing',
  'think', 'thought', 'thinking',
  'put', 'putting',
  'let', 'letting',
  'keep', 'kept', 'keeping',
  'begin', 'began', 'begun',
  'seem', 'seems', 'seemed',
  'help', 'helped', 'helping',
  'show', 'showed', 'shown', 'showing',
  'hear', 'heard', 'hearing',
  'play', 'played', 'playing',
  'run', 'ran', 'running',
  'move', 'moved', 'moving',
  'like', 'liked', 'likes',
  'live', 'lived', 'living',
  'want', 'wanted', 'wants',
  'need', 'needed', 'needs',
  'try', 'tried', 'tries',
  'ask', 'asked', 'asking',
  'use', 'used', 'using',
  'find', 'found', 'finding',
  'look', 'looked', 'looking',
  'call', 'called', 'calling',
  'work', 'worked', 'working',
  'read', 'reading',
  'write', 'wrote', 'written', 'writing',
  'learn', 'learned', 'learning',
  'feel', 'felt', 'feeling',
  'leave', 'left', 'leaving',
  'turn', 'turned', 'turning',
  'start', 'started', 'starting',
  'open', 'opened', 'opening',
  'close', 'closed', 'closing',
  'sit', 'sat', 'sitting',
  'stand', 'stood', 'standing',
  'stop', 'stopped', 'stopping',
  'set', 'setting',
  'talk', 'talked', 'talking',
  'walk', 'walked', 'walking',
  'eat', 'ate', 'eaten', 'eating',
  'drink', 'drank', 'drunk', 'drinking',
  'sleep', 'slept', 'sleeping',
  'bring', 'brought', 'bringing',
  'buy', 'bought', 'buying',
  'send', 'sent', 'sending',
  'fall', 'fell', 'fallen', 'falling',
  'cut', 'cutting',
  'grow', 'grew', 'grown', 'growing',
  'draw', 'drew', 'drawn', 'drawing',
  'pay', 'paid', 'paying',
  'win', 'won', 'winning',
  'lose', 'lost', 'losing',
  // Basic nouns
  'man', 'men', 'woman', 'women', 'child', 'children', 'boy', 'girl',
  'people', 'person', 'thing', 'things',
  'time', 'times', 'day', 'days', 'night', 'year', 'years', 'week', 'month',
  'way', 'ways', 'world', 'life', 'hand', 'head', 'eye', 'eyes', 'face',
  'house', 'home', 'door', 'room', 'place',
  'school', 'book', 'books', 'word', 'words', 'name',
  'water', 'food', 'money',
  'car', 'city', 'country',
  'part', 'number', 'line', 'end', 'side',
  // Basic adjectives
  'good', 'better', 'best', 'bad', 'worse', 'worst',
  'big', 'small', 'large', 'long', 'short', 'old', 'young', 'new',
  'high', 'low', 'right', 'wrong', 'first', 'last', 'next',
  'great', 'able', 'important',
  // Misc
  'yes', 'no', 'not', 'don', 'doesn', 'didn', 'won', 'can', 'isn',
  't', 's', 'll', 'd', 've', 're', 'mr', 'mrs', 'dr',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'hundred', 'thousand', 'million',
]);

// Extract words from text
function extractWords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, ' ')
    .split(/\s+/)
    .map(w => w.replace(/^['-]+|['-]+$/g, '')) // trim leading/trailing quotes/hyphens
    .filter(w => w.length > 1);
}

// Check if a word is a morphological variant of an existing word
function isVariantOf(word, existing) {
  // Common suffixes
  const suffixes = ['s', 'es', 'ed', 'ing', 'er', 'est', 'ly', 'tion', 'ment', 'ness', 'ful', 'less', 'able', 'ible', 'ous', 'ive', 'al', 'ity', 'ize', 'ise'];
  
  for (const suffix of suffixes) {
    if (word.endsWith(suffix)) {
      const stem = word.slice(0, -suffix.length);
      if (stem.length > 2 && existing.has(stem)) return true;
      // Double consonant removal: e.g., "stopped" -> "stop"
      if (stem.length > 2 && stem[stem.length - 1] === stem[stem.length - 2]) {
        const shorter = stem.slice(0, -1);
        if (shorter.length > 1 && existing.has(shorter)) return true;
      }
      // Add back 'e': e.g., "making" -> "make"
      if (existing.has(stem + 'e')) return true;
      // "ies" -> "y": e.g., "studies" -> "study"
      if (suffix === 'es' && word.endsWith('ies')) {
        const yForm = word.slice(0, -3) + 'y';
        if (existing.has(yForm)) return true;
      }
    }
  }
  
  // "ied" -> "y"
  if (word.endsWith('ied')) {
    const yForm = word.slice(0, -3) + 'y';
    if (existing.has(yForm)) return true;
  }
  
  return false;
}

// Collect all words from sentences and synonyms
const sentenceWords = new Map(); // word -> { count, sources }
const synonymWords = new Map();

for (const entry of words) {
  // Process example sentence
  const sWords = extractWords(entry.exampleSentence);
  for (const w of sWords) {
    if (!sentenceWords.has(w)) {
      sentenceWords.set(w, { count: 0, sources: [] });
    }
    const info = sentenceWords.get(w);
    info.count++;
    if (info.sources.length < 3) {
      info.sources.push(entry.word);
    }
  }
  
  // Process synonyms
  for (const syn of entry.synonyms) {
    const sw = syn.toLowerCase().trim();
    if (!synonymWords.has(sw)) {
      synonymWords.set(sw, { count: 0, sources: [] });
    }
    const info = synonymWords.get(sw);
    info.count++;
    if (info.sources.length < 3) {
      info.sources.push(entry.word);
    }
  }
}

// Find missing words
const missingFromSentences = new Map();
const missingFromSynonyms = new Map();

for (const [word, info] of sentenceWords) {
  if (!existingWords.has(word) && !STOP_WORDS.has(word) && !isVariantOf(word, existingWords)) {
    missingFromSentences.set(word, info);
  }
}

for (const [word, info] of synonymWords) {
  if (!existingWords.has(word) && !STOP_WORDS.has(word) && !isVariantOf(word, existingWords)) {
    missingFromSynonyms.set(word, info);
  }
}

// Merge all missing words
const allMissing = new Map();
for (const [word, info] of missingFromSentences) {
  allMissing.set(word, { ...info, fromSentence: true, fromSynonym: false });
}
for (const [word, info] of missingFromSynonyms) {
  if (allMissing.has(word)) {
    allMissing.get(word).fromSynonym = true;
    allMissing.get(word).count += info.count;
  } else {
    allMissing.set(word, { ...info, fromSentence: false, fromSynonym: true });
  }
}

// Sort by frequency
const sorted = [...allMissing.entries()].sort((a, b) => b[1].count - a[1].count);

console.log(`\n=== ANALYSIS ===`);
console.log(`Total existing words: ${existingWords.size}`);
console.log(`Unique words in sentences: ${sentenceWords.size}`);
console.log(`Unique synonyms: ${synonymWords.size}`);
console.log(`Missing from sentences: ${missingFromSentences.size}`);
console.log(`Missing from synonyms: ${missingFromSynonyms.size}`);
console.log(`Total unique missing words: ${allMissing.size}`);
console.log(`\nTop 50 missing words by frequency:`);
for (const [word, info] of sorted.slice(0, 50)) {
  console.log(`  ${word} (${info.count}x) [sentence:${info.fromSentence}, synonym:${info.fromSynonym}] — used with: ${info.sources.join(', ')}`);
}

// Output all missing words as JSON
const output = sorted.map(([word, info]) => ({
  word,
  count: info.count,
  fromSentence: info.fromSentence,
  fromSynonym: info.fromSynonym,
  sources: info.sources,
}));

fs.writeFileSync(
  path.join(__dirname, 'missing_words.json'),
  JSON.stringify(output, null, 2)
);

console.log(`\nFull list written to scripts/missing_words.json (${output.length} words)`);
