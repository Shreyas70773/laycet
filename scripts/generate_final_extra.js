// Final comprehensive extra_words.json generator
// Merges: batch1 (full data for A-H) + compact_dict (Chinese+POS for all)
// Auto-generates IPA & example sentences for words only in compact_dict

const fs = require('fs');
const path = require('path');

// Load CET words
const cetWords = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/words.json'), 'utf-8'));
const cetSet = new Set(cetWords.map(w => w.word.toLowerCase()));

// Load batch1 full dictionary (has IPA, sentences, synonyms)
let BATCH1_DICT = {};
try {
  const b1 = fs.readFileSync(path.join(__dirname, 'dict_batch1.js'), 'utf-8');
  // Extract dict content between "const D = {" and "};" etc
  // Use Function constructor to safely evaluate the dict objects
  const extractDict = (varName) => {
    const regex = new RegExp(`const ${varName} = \\{([\\s\\S]*?)\\n\\};`);
    const match = b1.match(regex);
    if (match) {
      try {
        return new Function('return {' + match[1] + '\n}')();
      } catch(e) {
        console.log(`${varName} parse error:`, e.message);
        return {};
      }
    }
    return {};
  };
  const D = extractDict('D');
  const D2 = extractDict('D2');
  BATCH1_DICT = { ...D, ...D2 };
  console.log(`Loaded ${Object.keys(BATCH1_DICT).length} entries from batch1 (D:${Object.keys(D).length}, D2:${Object.keys(D2).length})`);
} catch(e) {
  console.log('Could not load batch1:', e.message);
}

// Load compact dictionaries (Chinese + POS for all remaining words)  
const COMPACT1 = require('./compact_dict.js');
const COMPACT2 = require('./compact_dict2.js');
const COMPACT = { ...COMPACT1, ...COMPACT2 };
console.log(`Loaded ${Object.keys(COMPACT1).length} + ${Object.keys(COMPACT2).length} = ${Object.keys(COMPACT).length} entries from compact dicts`);

// Load the list of ALL missing words (extracted from CET sentences/synonyms)
const allMissing = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_missing_words.json'), 'utf-8'));
console.log(`Total missing words to cover: ${allMissing.length}`);

// Simple IPA generator based on common English patterns
function generateIPA(word) {
  // Very basic phonetic approximation
  let ipa = word.toLowerCase();
  
  // Common pattern replacements
  const rules = [
    [/tion$/,'ʃən'], [/sion$/,'ʒən'], [/ous$/,'əs'], [/ious$/,'iəs'],
    [/ment$/,'mənt'], [/ness$/,'nəs'], [/ful$/,'fəl'], [/less$/,'ləs'],
    [/able$/,'əbəl'], [/ible$/,'ɪbəl'], [/ity$/,'ɪti'], [/ical$/,'ɪkəl'],
    [/ive$/,'ɪv'], [/ure$/,'ər'], [/ence$/,'əns'], [/ance$/,'əns'],
    [/ly$/,'li'], [/ing$/,'ɪŋ'], [/ed$/,'d'], [/er$/,'ər'], [/est$/,'əst'],
    [/al$/,'əl'], [/ph/g,'f'], [/th/g,'θ'], [/sh/g,'ʃ'], [/ch/g,'tʃ'],
    [/ck/g,'k'], [/gh/g,''], [/ght/g,'t'], [/wh/g,'w'], [/wr/g,'r'],
    [/kn/g,'n'], [/ee/g,'iː'], [/ea/g,'iː'], [/oo/g,'uː'], [/ou/g,'aʊ'],
    [/ow/g,'aʊ'], [/oi/g,'ɔɪ'], [/oy/g,'ɔɪ'], [/ai/g,'eɪ'], [/ay/g,'eɪ'],
    [/ie/g,'iː'], [/ei/g,'eɪ'],
  ];
  
  for (const [pattern, replacement] of rules) {
    ipa = ipa.replace(pattern, replacement);
  }
  
  return `/${ipa}/`;
}

// Build the final extra_words array
const extraWords = [];
let id = 1;
let coveredByBatch1 = 0;
let coveredByCompact = 0;
let uncovered = 0;

for (const word of allMissing) {
  // Skip if it's already a CET word
  if (cetSet.has(word)) continue;
  
  let entry;
  
  // Priority 1: Use batch1 data (has full info)
  if (BATCH1_DICT[word]) {
    const d = BATCH1_DICT[word];
    entry = {
      id: `extra_${id}`,
      word: word,
      chinese: d[0],
      ipa: d[1],
      partOfSpeech: d[2],
      exampleSentence: d[3],
      synonyms: d[4] || [],
    };
    coveredByBatch1++;
  }
  // Priority 2: Use compact dict (has Chinese + POS, generate rest)
  else if (COMPACT[word]) {
    const raw = COMPACT[word]; // format: "chinese|pos"
    const [chinese, pos] = raw.split('|');
    entry = {
      id: `extra_${id}`,
      word: word,
      chinese: chinese,
      ipa: generateIPA(word),
      partOfSpeech: pos + '.',
      exampleSentence: generateSentence(word, pos),
      synonyms: [],
    };
    coveredByCompact++;
  }
  // Priority 3: Auto-generate minimal entry
  else {
    entry = {
      id: `extra_${id}`,
      word: word,
      chinese: word, // Keep original as placeholder
      ipa: generateIPA(word),
      partOfSpeech: guessPos(word),
      exampleSentence: `This is an example with the word ${word}.`,
      synonyms: [],
    };
    uncovered++;
  }
  
  extraWords.push(entry);
  id++;
}

function guessPos(word) {
  if (word.endsWith('ly')) return 'adv.';
  if (word.endsWith('tion') || word.endsWith('sion') || word.endsWith('ment') || word.endsWith('ness') || word.endsWith('ity')) return 'n.';
  if (word.endsWith('ful') || word.endsWith('less') || word.endsWith('ous') || word.endsWith('ive') || word.endsWith('al') || word.endsWith('ible') || word.endsWith('able')) return 'adj.';
  if (word.endsWith('ize') || word.endsWith('ise') || word.endsWith('ate') || word.endsWith('fy')) return 'v.';
  if (word.endsWith('ing')) return 'n.';
  if (word.endsWith('ed')) return 'adj.';
  if (word.endsWith('er') || word.endsWith('or')) return 'n.';
  return 'n.';
}

function generateSentence(word, pos) {
  // Generate contextual example sentences based on POS
  const templates = {
    'n': [
      `The ${word} was impressive.`,
      `We discussed the ${word} in detail.`,
      `The ${word} attracted everyone's attention.`,
      `She studied the ${word} carefully.`,
      `The ${word} played an important role.`,
    ],
    'v': [
      `They decided to ${word} the plan.`,
      `She wanted to ${word} the situation.`,
      `We need to ${word} this matter.`,
      `He tried to ${word} the problem.`,
      `The team will ${word} together.`,
    ],
    'adj': [
      `The result was quite ${word}.`,
      `It became ${word} over time.`,
      `The ${word} landscape stretched before us.`,
      `She found the experience ${word}.`,
      `The ${word} details caught our eye.`,
    ],
    'adv': [
      `She ${word} completed the task.`,
      `He spoke ${word} about the topic.`,
      `The project progressed ${word}.`,
      `They ${word} agreed to the terms.`,
    ],
    'prep': [
      `The book is ${word} the table.`,
    ],
    'interj': [
      `"${word.charAt(0).toUpperCase() + word.slice(1)}!" she exclaimed.`,
    ],
    'pron': [
      `${word.charAt(0).toUpperCase() + word.slice(1)} is the one we need.`,
    ],
    'conj': [
      `We waited, ${word} the rain stopped.`,
    ],
  };
  
  const posKey = pos.replace('.','').split('/')[0]; // Handle "v/n" -> "v"
  const options = templates[posKey] || templates['n'];
  // Use word hash to pick consistent template
  const hash = word.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return options[hash % options.length];
}

// Write the final extra_words.json
fs.writeFileSync(
  path.join(__dirname, '../src/data/extra_words.json'),
  JSON.stringify(extraWords, null, 2)
);

console.log(`\n=== GENERATION COMPLETE ===`);
console.log(`Total extra words: ${extraWords.length}`);
console.log(`From batch1 (full data): ${coveredByBatch1}`);
console.log(`From compact dict (Chinese+POS): ${coveredByCompact}`);
console.log(`Auto-generated (minimal): ${uncovered}`);

// Show uncovered words
if (uncovered > 0) {
  const uncoveredWords = extraWords.filter(e => !BATCH1_DICT[e.word] && !COMPACT[e.word]);
  console.log(`\nUncovered words (${uncoveredWords.length}):`);
  uncoveredWords.forEach(w => console.log(`  ${w.word}`));
}
