# Architecture — CET-4 Flashcard App

> Source of truth for technical decisions. Every decision includes a one-line rationale.
> Date: 2026-02-09

---

## 1. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 14+ (App Router) | User preference; static export for Netlify |
| Language | TypeScript | Type safety for 1,500-word data model |
| Styling | Tailwind CSS | Utility-first, zero runtime cost |
| Components | shadcn/ui | Lightweight, copy-paste, Next.js native |
| Animations | Framer Motion | Spring-physics card transitions |
| Backend | Convex | Free tier, built-in auth, real-time sync |
| Auth | Convex Auth (password) | Simple username/password, no third-party |
| Local Storage | localStorage API | Instant offline persistence, Convex fallback |
| TTS | Web Speech API + Youdao | Free, works in China with fallback |
| Hosting | Netlify (free tier) | 100GB bandwidth, easy static deployment |
| Virtualization | react-window | Performance for 1,500-card grid |
| Validation | Zod | Runtime type checking for word data |

---

## 2. File Structure

```
d:\laycet/
├── discovery.md
├── research.md
├── decisions.md
├── architecture.md          # This file
├── plan.md
├── progress.md
│
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout with providers
│   │   ├── page.tsx          # Main flashcard grid page
│   │   ├── globals.css       # Tailwind imports + custom styles
│   │   └── favicon.ico
│   │
│   ├── components/
│   │   ├── ui/               # shadcn/ui components
│   │   ├── NavigationBar.tsx  # Top nav with arrow/action buttons
│   │   ├── ControlPanel.tsx   # Shuffle, sort, reset controls
│   │   ├── DaySlider.tsx      # Day 1-30 progress slider
│   │   ├── WordGrid.tsx       # Main 6-column grid view
│   │   ├── WordCard.tsx       # Individual word cell in grid
│   │   ├── FlashcardModal.tsx # Detail view modal overlay
│   │   ├── StatsPanel.tsx     # Analytics/statistics view
│   │   ├── SearchBar.tsx      # Word search component
│   │   ├── InstructionsModal.tsx # First-launch instructions
│   │   ├── AuthForm.tsx       # Login/signup form
│   │   └── LanguageToggle.tsx # CN/EN UI switcher
│   │
│   ├── data/
│   │   ├── words.json         # All 1,500 words (baked at build)
│   │   └── words.schema.ts    # Zod schema for word validation
│   │
│   ├── hooks/
│   │   ├── useWordState.ts    # Word status management (green/red)
│   │   ├── useDayFilter.ts    # Filter words by current day
│   │   ├── useShuffle.ts      # Shuffle logic (within/across groups)
│   │   ├── useTTS.ts          # Text-to-speech with fallback
│   │   ├── useKeyboard.ts     # Keyboard shortcut handler
│   │   ├── useLocalStorage.ts # localStorage persistence
│   │   └── useAuth.ts         # Convex auth wrapper
│   │
│   ├── lib/
│   │   ├── convex.ts          # Convex client setup
│   │   ├── tts.ts             # TTS engine (Web Speech + Youdao)
│   │   ├── shuffle.ts         # Fisher-Yates shuffle utilities
│   │   ├── i18n.ts            # Internationalization strings
│   │   └── utils.ts           # General utilities
│   │
│   ├── convex/
│   │   ├── _generated/        # Convex auto-generated
│   │   ├── schema.ts          # Convex DB schema
│   │   ├── users.ts           # User CRUD functions
│   │   ├── progress.ts        # Progress sync functions
│   │   └── auth.ts            # Auth configuration
│   │
│   └── types/
│       ├── word.ts            # Word TypeScript interfaces
│       └── state.ts           # App state types
│
├── public/
│   └── (static assets)
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── convex.json
└── netlify.toml
```

---

## 3. Data Model

### Word Object (words.json)
```typescript
interface Word {
  id: string;              // Unique ID: "word_001"
  word: string;            // "accomplish"
  chinese: string;         // "完成;实现;达到"
  ipa: string;             // "/əˈkʌmplɪʃ/"
  partOfSpeech: string;    // "v." or "n./v." for multiple
  exampleSentence: string; // "She accomplished her goal."
  synonyms: string[];      // ["achieve", "complete"] or []
  day: number;             // 1-30
  groupNumber: number;     // 1-30
}
```

### User State (localStorage + Convex)
```typescript
interface UserState {
  currentDay: number;           // 1-30
  wordStatuses: Record<string, 'green' | 'red' | null>;
  lastStudyDate: string;        // ISO date
  streak: number;               // Consecutive study days
  redCounts: Record<string, number>; // Times each word marked red
  settings: {
    language: 'cn' | 'en';
    ttsSpeed: number;           // 0.7 or 1.0
  };
}
```

### Convex Schema
```typescript
// users table
{
  username: string;
  passwordHash: string;
  createdAt: number;
}

// progress table
{
  userId: Id<"users">;
  currentDay: number;
  wordStatuses: string;  // JSON-stringified Record
  streak: number;
  redCounts: string;     // JSON-stringified Record
  lastStudyDate: string;
  settings: string;      // JSON-stringified settings
  updatedAt: number;
}
```

---

## 4. Key Algorithms

### Day Filter
```
getWordsForDay(day: number): Word[]
  → return words.filter(w => w.groupNumber <= day)
```

### Shuffle (Fisher-Yates)
```
shuffleWithinGroups(words, groups):
  for each group: Fisher-Yates shuffle within group boundaries

shuffleAll(words):
  Fisher-Yates shuffle entire array
```

### Sort by Color
```
sortByColor(words, statuses):
  → green words first, then red, then unmarked
  → within each color group, maintain original order
```

### TTS Fallback
```
speak(word, speed):
  if (speechSynthesis available && voices.length > 0):
    use Web Speech API with en-US, rate=speed
  else:
    play audio from Youdao: dict.youdao.com/dictvoice?audio={word}&type=1
```

---

## 5. Responsive Breakpoints

| Breakpoint | Columns | Grid Layout |
|-----------|---------|-------------|
| Desktop (≥1280px) | 6 columns | 6 groups per row |
| Laptop (≥1024px) | 6 columns | 6 groups per row, smaller cards |
| Tablet (≥768px) | 3 columns | 3 groups per row |
| Mobile (≥640px) | 2 columns | 2 groups per row |
| Small Mobile (<640px) | 1 column | 1 group per row |

---

## 6. Keyboard Shortcuts Map

| Key | Context | Action |
|-----|---------|--------|
| ← → ↑ ↓ | Grid | Navigate between word cards |
| ← → | Modal open | Previous/next word in modal |
| D | Grid (card focused) | Open detail modal |
| G | Grid (card focused) | Mark green |
| R | Grid (card focused) | Mark red |
| W | Grid (card focused) | Clear single card marking |
| C | Grid | Clear ALL markings |
| ESC | Modal open | Close modal |
| / | Grid | Focus search bar |

---

## 7. Sync Strategy

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  User Action  │────▶│ localStorage │────▶│    Convex     │
│  (immediate)  │     │  (instant)   │     │ (background)  │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                      │
                            ▼                      ▼
                     Always available        Cross-device sync
                     Works offline           Requires auth
```

1. User action → write to localStorage immediately (zero latency)
2. If authenticated → background sync to Convex (debounced, every 5s)
3. On login → merge localStorage with Convex data (Convex wins for conflicts)
4. On app load → read localStorage first, then fetch Convex updates

---

## 8. Environment Requirements

- Node.js 18+
- npm or pnpm
- Git
- Convex CLI (`npx convex`)
- Netlify CLI (optional, for local testing)
