# Plan — CET-4 Flashcard App

> Phased task breakdown with acceptance criteria per task.
> Each phase has entry and exit conditions.
> Date: 2026-02-09

---

## Phase 0: Foundation Setup
**Entry**: Research complete and approved ✅
**Exit**: Next.js app runs locally, Convex connected, basic page renders

| Task | Description | Acceptance Criteria |
|------|-------------|-------------------|
| 0.1 | Initialize Next.js 14+ project with TypeScript | `npm run dev` starts successfully |
| 0.2 | Install & configure Tailwind CSS | Utility classes render correctly |
| 0.3 | Install & configure shadcn/ui | At least Button component works |
| 0.4 | Set up Convex backend | `npx convex dev` connects, dashboard accessible |
| 0.5 | Configure Convex schema (users + progress tables) | Schema deployed without errors |
| 0.6 | Set up project structure (folders, types, utils) | All folders from architecture.md exist |
| 0.7 | Configure Netlify deployment | `netlify.toml` exists with correct settings |
| 0.8 | Set up Git repository | `.gitignore` configured, initial commit made |

---

## Phase 1: Word Data — THE MOST CRITICAL PHASE
**Entry**: Phase 0 complete
**Exit**: 1,500 validated words in words.json with correct IPA, translations, examples

| Task | Description | Acceptance Criteria |
|------|-------------|-------------------|
| 1.1 | Source CET-4 2023+ high-frequency word list (1,500 words) | Words ranked by frequency, all real CET-4 words |
| 1.2 | Add Chinese translations for all 1,500 words | Every word has accurate Chinese translation |
| 1.3 | Add IPA pronunciation for all 1,500 words | Every IPA verified against Oxford/Cambridge |
| 1.4 | Add part of speech for all words | Correct POS; multi-POS words show all types |
| 1.5 | Write A1-B1 example sentences for all words | Each sentence uses the word in clear context |
| 1.6 | Add synonyms where natural | Synonyms present for ~60-70% of words |
| 1.7 | Assign groupNumber 1-30 (frequency-based) | Group 1 = highest freq, 50 words per group |
| 1.8 | Create Zod validation schema | Schema validates all required fields |
| 1.9 | Run validation script against all 1,500 words | Zero validation errors |
| 1.10 | Manual spot-check: sample 50 random words | All 50 checked words are accurate |

---

## Phase 2: Core Grid UI
**Entry**: Phase 1 complete (validated word data)
**Exit**: Main grid view displays words in 6-column layout, clickable

| Task | Description | Acceptance Criteria |
|------|-------------|-------------------|
| 2.1 | Build WordCard component | Displays word text, responds to click |
| 2.2 | Build WordGrid component (6-column layout) | 6 groups per row, responsive breakpoints |
| 2.3 | Implement virtualized rendering (react-window) | Smooth scrolling with 1,500 cards |
| 2.4 | Build DaySlider component (1-30) | Slider changes day, filters visible groups |
| 2.5 | Implement cumulative day logic | Day N shows Groups 1 through N |
| 2.6 | Add responsive grid (6→3→2→1 columns) | Grid adapts at all breakpoints |

---

## Phase 3: Flashcard Detail Modal
**Entry**: Phase 2 complete (grid displays words)
**Exit**: Clicking a word opens modal with full details + TTS

| Task | Description | Acceptance Criteria |
|------|-------------|-------------------|
| 3.1 | Build FlashcardModal component | Modal opens with word details |
| 3.2 | Display: word, POS, Chinese, IPA, example, synonyms | All fields render correctly |
| 3.3 | Implement Web Speech API TTS | Play button speaks word in en-US |
| 3.4 | Implement slow speed TTS (0.7x) | Slow button speaks at reduced rate |
| 3.5 | Implement Youdao TTS fallback | Works when Web Speech API unavailable |
| 3.6 | ←→ navigation within modal | Arrows move between words in modal |
| 3.7 | ESC to close modal | ESC key closes the modal |
| 3.8 | Animate modal (Framer Motion) | Smooth open/close animation |

---

## Phase 4: Marking & State Management
**Entry**: Phase 3 complete (modal works)
**Exit**: Users can mark words green/red, state persists in localStorage

| Task | Description | Acceptance Criteria |
|------|-------------|-------------------|
| 4.1 | Implement green/red/neutral color marking | G/R/W keys change card color |
| 4.2 | Color coding visible on grid cards | Green/red backgrounds show on grid |
| 4.3 | localStorage persistence | Markings survive page refresh |
| 4.4 | "C" key — clear ALL markings | All cards reset to neutral |
| 4.5 | Per-group reset button | Reset only selected group's markings |
| 4.6 | Full reset button | Reset all progress with confirmation |
| 4.7 | Track red-count per word | Increment counter each time word marked red |

---

## Phase 5: Navigation & Keyboard
**Entry**: Phase 4 complete (state works)
**Exit**: Full keyboard navigation functional

| Task | Description | Acceptance Criteria |
|------|-------------|-------------------|
| 5.1 | Build NavigationBar component | Arrow buttons + D/G/R/W buttons visible |
| 5.2 | Arrow key navigation in grid | Focus moves between cards |
| 5.3 | D key opens detail modal | Works from focused card |
| 5.4 | G/R/W keys mark focused card | Works without opening modal |
| 5.5 | Visual focus indicator on cards | Clear outline/highlight on focused card |

---

## Phase 6: Shuffle & Sort
**Entry**: Phase 5 complete (navigation works)
**Exit**: All shuffle/sort functions work

| Task | Description | Acceptance Criteria |
|------|-------------|-------------------|
| 6.1 | Build ControlPanel component | Buttons for shuffle/sort visible |
| 6.2 | Shuffle Within Groups | Words randomized within group boundaries |
| 6.3 | Shuffle Everything | All visible words fully randomized |
| 6.4 | Sort by Color | Green → Red → Unmarked ordering |
| 6.5 | Debounce shuffle operations | No UI lag on rapid clicks |

---

## Phase 7: Bilingual UI & i18n
**Entry**: Phase 6 complete
**Exit**: App fully usable in both Chinese and English

| Task | Description | Acceptance Criteria |
|------|-------------|-------------------|
| 7.1 | Create i18n string file (CN + EN) | All UI strings in both languages |
| 7.2 | Build LanguageToggle component | Toggle switches all UI text |
| 7.3 | Default to Chinese | App loads in Chinese |
| 7.4 | Persist language preference | Survives page refresh |
| 7.5 | Build InstructionsModal (bilingual) | Shows on first launch, clear instructions |

---

## Phase 8: Auth & Convex Sync
**Entry**: Phase 7 complete (app fully works with localStorage)
**Exit**: Users can sign up, login, and sync progress across devices

| Task | Description | Acceptance Criteria |
|------|-------------|-------------------|
| 8.1 | Build AuthForm component (login/signup) | Clean form with validation |
| 8.2 | Implement Convex Auth (username/password) | User can create account and login |
| 8.3 | Write Convex progress sync functions | Save/load progress from Convex |
| 8.4 | Background sync (debounced, 5s interval) | Changes sync without blocking UI |
| 8.5 | Merge logic (localStorage ↔ Convex) | Convex wins on conflict; no data loss |
| 8.6 | Fallback to localStorage when offline | App works without Convex connection |
| 8.7 | Show sync status indicator | User sees "synced" / "offline" state |

---

## Phase 9: Analytics & Stats
**Entry**: Phase 8 complete
**Exit**: Student can view study statistics

| Task | Description | Acceptance Criteria |
|------|-------------|-------------------|
| 9.1 | Build StatsPanel component | Stats accessible from UI |
| 9.2 | Per-group completion percentage | Shows % green per group |
| 9.3 | Daily streak counter | Tracks consecutive study days |
| 9.4 | Hardest words list | Shows top 20 most-red-marked words |
| 9.5 | Historical progress chart | Line/bar chart over time |

---

## Phase 10: Search, Print, Polish
**Entry**: Phase 9 complete
**Exit**: All features complete, ready for deployment

| Task | Description | Acceptance Criteria |
|------|-------------|-------------------|
| 10.1 | Build SearchBar component | Search filters words by English/Chinese |
| 10.2 | Search highlights matching words in grid | Matched words visually distinct |
| 10.3 | Print/export red-marked words | Generates printable list of unknown words |
| 10.4 | Mobile touch optimization | All buttons ≥44px, touch-friendly |
| 10.5 | Performance audit | Grid renders smoothly with 1,500 words |
| 10.6 | Cross-browser testing (Chrome, Edge) | TTS works, layout correct |
| 10.7 | Final UI polish | Consistent spacing, colors, transitions |

---

## Phase 11: Deployment
**Entry**: Phase 10 complete
**Exit**: App live on Netlify, accessible by students

| Task | Description | Acceptance Criteria |
|------|-------------|-------------------|
| 11.1 | Configure Netlify build settings | Build succeeds on Netlify |
| 11.2 | Deploy to Netlify | App accessible at *.netlify.app |
| 11.3 | Test deployed app end-to-end | All features work in production |
| 11.4 | Convex production deployment | Backend accessible from deployed app |
| 11.5 | Write README.md | Clear setup/usage instructions |

---

## Total Tasks: 65
## Estimated Phases: 12 (0-11)
