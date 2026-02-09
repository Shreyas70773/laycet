# Decisions Log — CET-4 Flashcard App

> Every significant decision, alternatives considered, reasoning, and date.

---

### DEC-001: Framework — Next.js
- **Decision**: Use Next.js with static export
- **Alternatives**: Vanilla JS, Vite + React, Create React App
- **Reasoning**: User preference. Next.js provides excellent DX, file-based routing, static export for Netlify, and strong ecosystem. Static export means no server needed.
- **Date**: 2026-02-09

### DEC-002: Backend — Convex
- **Decision**: Use Convex for user auth and data sync
- **Alternatives**: Supabase, Firebase, no backend (localStorage only)
- **Reasoning**: User preference. Convex free tier is generous (1M calls/month), has built-in auth, real-time sync, and simple developer experience. Generous enough for a student app.
- **Date**: 2026-02-09

### DEC-003: Auth — Username/Password via Convex Auth
- **Decision**: Simple username + password authentication
- **Alternatives**: Email/password, phone SMS, WeChat OAuth, anonymous-first
- **Reasoning**: User requested simplicity. Convex Auth supports password-based auth natively. No need for third-party auth providers. Account creation is straightforward.
- **Date**: 2026-02-09

### DEC-004: Data Persistence — localStorage-first with Convex sync
- **Decision**: All user progress stored in localStorage immediately, then synced to Convex in background
- **Alternatives**: Convex-only, localStorage-only
- **Reasoning**: Convex may have latency issues from China. localStorage-first ensures the app always works instantly. Background sync provides cross-device capability when available.
- **Date**: 2026-02-09

### DEC-005: Word Count — 1,500 from CET-4 list
- **Decision**: Select top 1,500 high-frequency words from the ~4,500 official CET-4 vocabulary
- **Alternatives**: All 4,500, 1,000, 2,000
- **Reasoning**: Original spec requested 1,500. Frequency-based selection ensures students learn the most impactful words first. 30 groups × 50 words = 1,500.
- **Date**: 2026-02-09

### DEC-006: Word Grouping — Frequency-based
- **Decision**: Group 1 = highest frequency, Group 30 = lowest frequency (within top 1,500)
- **Alternatives**: Alphabetical, thematic, difficulty-based, random
- **Reasoning**: User chose frequency-based. Students benefit most from learning the most commonly tested words first.
- **Date**: 2026-02-09

### DEC-007: TTS Strategy — Web Speech API + Youdao fallback
- **Decision**: Primary: browser Web Speech API (en-US). Fallback: Youdao Dictionary TTS API
- **Alternatives**: ResponsiveVoice.js, pre-generated audio files, Google Cloud TTS
- **Reasoning**: Web Speech API is free and works in Chrome/Edge. Youdao is a Chinese service (no China firewall issues), free, no API key needed. Google TTS blocked in China. Pre-generated audio would add 45-135MB.
- **Date**: 2026-02-09

### DEC-008: Pronunciation — American English (en-US)
- **Decision**: Default to American English pronunciation
- **Alternatives**: British English (en-GB), user choice
- **Reasoning**: CET-4 exam uses American English as the standard. Consistent with what students will hear on the exam.
- **Date**: 2026-02-09

### DEC-009: UI Language — Bilingual (Chinese default)
- **Decision**: UI defaults to Chinese with toggle to switch to English
- **Alternatives**: English-only, Chinese-only
- **Reasoning**: Target users are Chinese students. Chinese UI is more comfortable. English toggle available for advanced learners or international use.
- **Date**: 2026-02-09

### DEC-010: Component Library — shadcn/ui + Tailwind CSS
- **Decision**: Use shadcn/ui components with Tailwind CSS for styling
- **Alternatives**: Material UI, Ant Design, Chakra UI, custom CSS
- **Reasoning**: shadcn/ui is lightweight (copy-paste, not a dependency), works perfectly with Next.js, highly customizable. Tailwind provides utility-first CSS. No runtime CSS-in-JS overhead.
- **Date**: 2026-02-09

### DEC-011: Grid Layout — 6 columns per row, vertically scrollable
- **Decision**: Show 6 group columns per row. If more than 6 groups visible, wrap to next row with spacing
- **Alternatives**: Horizontal scroll, pagination, accordion
- **Reasoning**: User specified 6 per laptop screen row. Vertical scrolling is more natural than horizontal. Each row of 6 groups separated by clear spacing.
- **Date**: 2026-02-09

### DEC-012: Day Advancement — Free slider
- **Decision**: Slider/scrollbar at top. User can freely choose any day 1-30
- **Alternatives**: Calendar-based (one day per real day), manual button, progress-gated
- **Reasoning**: User wants student autonomy. No locking. Student can study at their own pace, skip ahead, or revisit earlier days.
- **Date**: 2026-02-09

### DEC-013: Animations — Framer Motion
- **Decision**: Use Framer Motion for card transitions and modal animations
- **Alternatives**: CSS transitions only, React Spring, no animations
- **Reasoning**: Inspired by Remotion's spring-physics animations. Framer Motion is the React standard, lightweight, and provides excellent card flip/slide effects.
- **Date**: 2026-02-09

### DEC-014: Hosting — Netlify free tier
- **Decision**: Deploy to Netlify with free `*.netlify.app` subdomain
- **Alternatives**: GitHub Pages, Vercel, Cloudflare Pages
- **Reasoning**: User preference. Netlify free tier includes 100GB bandwidth, generous for a text-based app. Easy Next.js static deployment.
- **Date**: 2026-02-09

### DEC-015: Virtualized Rendering — react-window
- **Decision**: Use react-window for grid virtualization when displaying many words
- **Alternatives**: Full DOM render, react-virtualized, custom intersection observer
- **Reasoning**: 1,500 words in DOM would cause performance issues. react-window is lightweight and well-maintained. Only renders visible cards.
- **Date**: 2026-02-09

### DEC-016: Spaced Repetition — Not implemented
- **Decision**: Simple cumulative model only. Day N shows Groups 1 through N.
- **Alternatives**: Leitner box system, SM-2 algorithm, Anki-style intervals
- **Reasoning**: User explicitly said "not required." Keeps the app simple and predictable. Students control their own review pattern.
- **Date**: 2026-02-09

### DEC-017: Multiple POS — Single card
- **Decision**: Words with multiple parts of speech shown on one card
- **Alternatives**: Separate cards per POS
- **Reasoning**: User preference. Reduces total card count. Student sees all meanings at once, which is how CET-4 tests vocabulary.
- **Date**: 2026-02-09

### DEC-018: Dark Mode — Deferred
- **Decision**: Not in MVP. Will be added in a future phase.
- **Alternatives**: Include in MVP
- **Reasoning**: User said "dark mode can come later." Focus MVP on core functionality.
- **Date**: 2026-02-09
