// Extract ALL unique words from CET sentences and synonyms
// excluding stop words and words already in CET list

const fs = require('fs');
const path = require('path');

const words = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/words.json'), 'utf-8'));

// Build set of existing CET words (lowercase)
const cetWords = new Set(words.map(w => w.word.toLowerCase()));

// Comprehensive stop words list
const STOP_WORDS = new Set([
  // articles
  'a', 'an', 'the',
  // pronouns
  'i', 'me', 'my', 'mine', 'myself',
  'you', 'your', 'yours', 'yourself', 'yourselves',
  'he', 'him', 'his', 'himself',
  'she', 'her', 'hers', 'herself',
  'it', 'its', 'itself',
  'we', 'us', 'our', 'ours', 'ourselves',
  'they', 'them', 'their', 'theirs', 'themselves',
  // be verbs
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  // have verbs
  'has', 'have', 'had', 'having',
  // do verbs
  'do', 'does', 'did', 'doing', 'done',
  // modals
  'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
  // prepositions
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about',
  'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between',
  'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
  'against', 'upon', 'along', 'across', 'behind', 'beyond', 'within', 'without',
  'toward', 'towards', 'among', 'around', 'down', 'near', 'beside', 'besides',
  // conjunctions
  'and', 'but', 'or', 'nor', 'so', 'yet', 'both', 'either', 'neither',
  'not', 'only', 'own', 'same', 'than', 'too', 'very',
  'if', 'when', 'while', 'as', 'that', 'which', 'who', 'whom', 'whose',
  'what', 'where', 'how', 'why', 'whether', 'because', 'since', 'until', 'although', 'though',
  // other common
  'no', 'yes', 'all', 'each', 'every', 'any', 'few', 'more', 'most', 'other',
  'some', 'such', 'just', 'also', 'now', 'here', 'there', 'this', 'these', 'those',
  'well', 'back', 'even', 'still', 'already', 'else', 'ever', 'never',
  'much', 'many', 'often', 'always', 'sometimes', 'however', 'therefore',
  // contractions base
  "don't", "doesn't", "didn't", "won't", "wouldn't", "can't", "couldn't",
  "shouldn't", "isn't", "aren't", "wasn't", "weren't", "hasn't", "haven't",
  "hadn't", "let's", "i'm", "you're", "he's", "she's", "it's", "we're",
  "they're", "i've", "you've", "we've", "they've", "i'd", "you'd",
  "he'd", "she'd", "we'd", "they'd", "i'll", "you'll", "he'll",
  "she'll", "we'll", "they'll", "that's", "who's", "what's", "here's",
  "there's", "where's", "when's", "why's", "how's",
  // misc very common words
  'get', 'got', 'getting', 'go', 'goes', 'going', 'went', 'gone',
  'come', 'came', 'coming', 'make', 'made', 'making',
  'take', 'took', 'taken', 'taking', 'give', 'gave', 'given', 'giving',
  'say', 'said', 'saying', 'tell', 'told', 'telling',
  'know', 'knew', 'known', 'knowing',
  'think', 'thought', 'thinking',
  'see', 'saw', 'seen', 'seeing',
  'want', 'wanted', 'wanting',
  'use', 'used', 'using',
  'find', 'found', 'finding',
  'put', 'putting', 'set', 'setting',
  'try', 'tried', 'trying',
  'ask', 'asked', 'asking',
  'need', 'needed', 'needing',
  'feel', 'felt', 'feeling',
  'become', 'became', 'becoming',
  'leave', 'left', 'leaving',
  'call', 'called', 'calling',
  'keep', 'kept', 'keeping',
  'let', 'begin', 'began', 'begun', 'beginning',
  'seem', 'seemed', 'seeming',
  'help', 'helped', 'helping',
  'show', 'showed', 'shown', 'showing',
  'hear', 'heard', 'hearing',
  'play', 'played', 'playing',
  'run', 'ran', 'running',
  'move', 'moved', 'moving',
  'live', 'lived', 'living',
  'believe', 'believed', 'believing',
  'bring', 'brought', 'bringing',
  'happen', 'happened', 'happening',
  'write', 'wrote', 'written', 'writing',
  'sit', 'sat', 'sitting',
  'stand', 'stood', 'standing',
  'lose', 'lost', 'losing',
  'pay', 'paid', 'paying',
  'meet', 'met', 'meeting',
  'include', 'included', 'including',
  'continue', 'continued', 'continuing',
  'learn', 'learned', 'learning',
  'change', 'changed', 'changing',
  'lead', 'led', 'leading',
  'understand', 'understood', 'understanding',
  'watch', 'watched', 'watching',
  'follow', 'followed', 'following',
  'stop', 'stopped', 'stopping',
  'create', 'created', 'creating',
  'speak', 'spoke', 'spoken', 'speaking',
  'read', 'allow', 'allowed', 'allowing',
  'add', 'added', 'adding',
  'spend', 'spent', 'spending',
  'grow', 'grew', 'grown', 'growing',
  'open', 'opened', 'opening',
  'walk', 'walked', 'walking',
  'win', 'won', 'winning',
  'offer', 'offered', 'offering',
  'remember', 'remembered', 'remembering',
  'consider', 'considered', 'considering',
  'appear', 'appeared', 'appearing',
  'buy', 'bought', 'buying',
  'wait', 'waited', 'waiting',
  'serve', 'served', 'serving',
  'die', 'died', 'dying',
  'send', 'sent', 'sending',
  'build', 'built', 'building',
  'stay', 'stayed', 'staying',
  'fall', 'fell', 'fallen', 'falling',
  'cut', 'cutting',
  'reach', 'reached', 'reaching',
  'kill', 'killed', 'killing',
  'remain', 'remained', 'remaining',
  'suggest', 'suggested', 'suggesting',
  'raise', 'raised', 'raising',
  'pass', 'passed', 'passing',
  'sell', 'sold', 'selling',
  'require', 'required', 'requiring',
  'report', 'reported', 'reporting',
  'pull', 'pulled', 'pulling',
  'develop', 'developed', 'developing',
  'hold', 'held', 'holding',
  'eat', 'ate', 'eaten', 'eating',
  // numbers/misc
  'one', 'two', 'three', 'first', 'second', 'third',
  'new', 'old', 'big', 'small', 'long', 'good', 'bad',
  'great', 'little', 'right', 'high', 'low', 'large',
  'last', 'next', 'own', 'able', 'possible', 'part', 'end',
  'home', 'hand', 'man', 'men', 'woman', 'women', 'day', 'time',
  'year', 'way', 'thing', 'world', 'life', 'work', 'place',
  'case', 'point', 'group', 'number', 'fact', 'lot', 'line',
  'really', 'quite', 'rather', 'almost', 'enough',
  // more
  'look', 'looked', 'looking',
  'turn', 'turned', 'turning',
  'start', 'started', 'starting',
  'might', 'actually', 'probably', 'certainly', 'perhaps', 'maybe',
  'through', 'between', 'another', 'different', 'important', 'people',
]);

// Check if a word is a morphological variant of a CET word
function isCetVariant(word) {
  if (cetWords.has(word)) return true;
  
  // Common suffix stripping
  const suffixes = [
    { suffix: 's', replacement: '' },
    { suffix: 'es', replacement: '' },
    { suffix: 'ed', replacement: '' },
    { suffix: 'ing', replacement: '' },
    { suffix: 'er', replacement: '' },
    { suffix: 'est', replacement: '' },
    { suffix: 'ly', replacement: '' },
    { suffix: 'tion', replacement: '' },
    { suffix: 'ment', replacement: '' },
    { suffix: 'ness', replacement: '' },
    { suffix: 'ful', replacement: '' },
    { suffix: 'less', replacement: '' },
    { suffix: 'able', replacement: '' },
    { suffix: 'ible', replacement: '' },
    { suffix: 'ity', replacement: '' },
    { suffix: 'ous', replacement: '' },
    { suffix: 'ive', replacement: '' },
    { suffix: 'al', replacement: '' },
    { suffix: 'ial', replacement: '' },
    { suffix: 'ical', replacement: '' },
    { suffix: 'tion', replacement: 'te' },
    { suffix: 'ation', replacement: '' },
    { suffix: 'ation', replacement: 'e' },
    { suffix: 'ied', replacement: 'y' },
    { suffix: 'ies', replacement: 'y' },
    { suffix: 'ier', replacement: 'y' },
    { suffix: 'iest', replacement: 'y' },
    { suffix: 'ing', replacement: 'e' },
    { suffix: 'ed', replacement: 'e' },
    { suffix: 'er', replacement: 'e' },
    { suffix: 'est', replacement: 'e' },
  ];
  
  for (const { suffix, replacement } of suffixes) {
    if (word.endsWith(suffix)) {
      const base = word.slice(0, -suffix.length) + replacement;
      if (cetWords.has(base)) return true;
    }
  }
  
  // Doubled consonant + ing/ed (e.g. running -> run, stopped -> stop)
  if ((word.endsWith('ing') || word.endsWith('ed') || word.endsWith('er') || word.endsWith('est')) && word.length >= 5) {
    let suf, base;
    for (const s of ['ing', 'est', 'ed', 'er']) {
      if (word.endsWith(s)) {
        suf = s;
        base = word.slice(0, -s.length);
        break;
      }
    }
    if (base && base.length >= 2 && base[base.length - 1] === base[base.length - 2]) {
      const undoubled = base.slice(0, -1);
      if (cetWords.has(undoubled)) return true;
    }
  }
  
  return false;
}

// Extract words from a sentence
function extractWords(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^a-z\s'-]/g, ' ')
    .split(/\s+/)
    .map(w => w.replace(/^['-]+|['-]+$/g, ''))
    .filter(w => w.length >= 2 && /^[a-z]+$/.test(w));
}

// Collect all missing words
const allMissing = new Map(); // word -> { fromSentences: Set, fromSynonyms: Set }

for (const entry of words) {
  // Extract from example sentence
  const sentenceWords = extractWords(entry.exampleSentence);
  for (const w of sentenceWords) {
    if (STOP_WORDS.has(w)) continue;
    if (isCetVariant(w)) continue;
    
    if (!allMissing.has(w)) {
      allMissing.set(w, { fromSentences: new Set(), fromSynonyms: new Set() });
    }
    allMissing.get(w).fromSentences.add(entry.word);
  }
  
  // Extract from synonyms
  for (const syn of (entry.synonyms || [])) {
    const synLower = syn.toLowerCase().trim();
    if (synLower.length < 2) continue;
    if (STOP_WORDS.has(synLower)) continue;
    if (isCetVariant(synLower)) continue;
    
    // Handle multi-word synonyms
    const synWords = synLower.split(/\s+/);
    for (const sw of synWords) {
      if (sw.length < 2 || STOP_WORDS.has(sw) || isCetVariant(sw)) continue;
      if (!allMissing.has(sw)) {
        allMissing.set(sw, { fromSentences: new Set(), fromSynonyms: new Set() });
      }
      allMissing.get(sw).fromSynonyms.add(entry.word);
    }
  }
}

// Sort alphabetically
const sortedWords = [...allMissing.keys()].sort();

console.log(`Total missing words found: ${sortedWords.length}`);
console.log(`\nSample words:`);
sortedWords.slice(0, 50).forEach(w => {
  const info = allMissing.get(w);
  const sources = [];
  if (info.fromSentences.size) sources.push(`sentences(${info.fromSentences.size})`);
  if (info.fromSynonyms.size) sources.push(`synonyms(${info.fromSynonyms.size})`);
  console.log(`  ${w} - ${sources.join(', ')}`);
});

// Write the list
fs.writeFileSync(
  path.join(__dirname, 'all_missing_words.json'),
  JSON.stringify(sortedWords, null, 2)
);
console.log(`\nWritten to scripts/all_missing_words.json`);
