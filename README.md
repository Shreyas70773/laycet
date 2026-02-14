# CET-4 词汇卡片 | CET-4 Vocabulary Flashcards

> 30天掌握1500个CET-4核心词汇 | Master 1,500 CET-4 core vocabulary words in 30 days

A bilingual (Chinese/English) flashcard web app designed for Chinese university students preparing for the CET-4 English exam.

Check it out live at https://laycet.netlify.app/

## ✨ Features

- **1,500 CET-4 words** — organized into 30 groups of 50 words, sorted by frequency (most common words first)
- **2,500+ Extra Dictionary words** — every non-trivial word from example sentences and synonyms has its own dictionary entry, browsable in a separate "Extra Dictionary" tab with A–Z filtering
- **Cumulative study plan** — Day 1 shows Group 1; Day 2 shows Groups 1–2; Day 30 shows all 1,500
- **Flashcard modal** — detailed view with IPA pronunciation, Chinese translation, example sentence, synonyms
- **Linked words** — hover over any word in example sentences to see its definition tooltip; click to navigate to that word's full entry
- **Text-to-Speech** — normal & slow speed playback (Web Speech API + Youdao fallback)
- **Sentence audio player** — play example sentences at 0.3x, 0.5x, 0.7x, or 1.0x speed
- **Green / Red marking** — mark words as known (green) or unknown (red) to track progress
- **Keyboard navigation** — Arrow keys, D (definition), S (speak word), G (green), R (red), W (reset), / (search), ESC
- **Mobile-friendly** — single tap on linked words shows tooltip; double tap navigates to definition
- **Shuffle & Sort** — shuffle all, shuffle within groups, sort by color
- **Search** — find any word instantly by English or Chinese across both CET and Extra dictionaries
- **Study statistics** — streak tracking, per-group completion %, hardest words, progress chart
- **Export unknown words** — copy to clipboard or print a formatted list of red-marked words
- **Bilingual UI** — switch between Chinese and English interface
- **LocalStorage persistence** — all progress saved locally, survives page refreshes

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm 9+

### Installation

```bash
git clone https://github.com/Shreyas70773/laycet.git
cd laycet
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

Static files are generated in the `out/` directory, ready for deployment.

## 🏗️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js](https://nextjs.org/) 16 | React framework (App Router, static export) |
| [TypeScript](https://typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Lucide React](https://lucide.dev/) | Icons |

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css        # Global styles & Tailwind imports
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main app page (CET tab + Extra Dictionary tab)
├── components/
│   ├── ControlPanel.tsx   # Shuffle/sort/reset buttons
│   ├── DaySlider.tsx      # Day 1-30 slider
│   ├── FlashcardModal.tsx # Word detail modal with TTS & linked sentences
│   ├── InstructionsModal.tsx # First-launch guide
│   ├── LinkedWord.tsx     # Hover tooltip + click navigation for linked words
│   ├── NavigationBar.tsx  # Top bar with nav & shortcuts
│   ├── SearchBar.tsx      # Word search overlay (CET + Extra)
│   ├── SentencePlayer.tsx # Sentence audio with speed controls
│   ├── StatsPanel.tsx     # Statistics side panel
│   ├── WordCard.tsx       # Individual word card
│   └── WordGrid.tsx       # 6-column word grid layout
├── data/
│   ├── words.json         # 1,500 validated CET-4 words
│   └── extra_words.json   # 2,500+ extra dictionary entries
├── hooks/
│   └── useAppState.tsx    # Global state (Context + localStorage)
├── lib/
│   ├── i18n.ts            # Bilingual translations (CN/EN)
│   ├── shuffle.ts         # Fisher-Yates shuffle utilities
│   ├── tts.ts             # Text-to-Speech engine
│   └── utils.ts           # Shared utility functions
└── types/
    ├── state.ts           # App state types
    └── word.ts            # Word data types
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` | Navigate between words |
| `↑` `↓` | Jump between groups |
| `D` | Open word detail modal |
| `S` | Speak word aloud |
| `G` | Mark word as known (green) |
| `R` | Mark word as unknown (red) |
| `W` | Reset word marking |
| `/` | Open search |
| `ESC` | Close modal / search |

## 📊 Word Data

Each of the 1,500 CET words includes:
- English word
- IPA phonetic transcription
- Part of speech
- Chinese translation
- Example sentence (A1–B1 level)
- Synonyms (where applicable)

The 2,500+ extra dictionary words provide definitions for every meaningful word that appears in example sentences and synonyms, creating a fully self-contained learning ecosystem.

Words are sorted by frequency — Group 1 contains the most common CET-4 words, Group 30 the least common.

## 🌐 Deployment

This app is configured for static deployment on **Netlify**:

1. Push to GitHub
2. Connect the repo in [Netlify](https://app.netlify.com/)
3. Build command: `npm run build`
4. Publish directory: `out`

Or deploy manually:
```bash
npm run build
# Upload the 'out' folder to any static hosting provider
```

## 📄 License

MIT
