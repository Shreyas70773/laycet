# Discovery Q&A — CET-4 Vocabulary Flashcard App

> Date: 2026-02-09
> Total Questions: 25+

---

## 🎯 Scope & Goals

**Q1: Target users?**
A: Chinese university students preparing for CET-4. UI bilingual — Chinese default with option to switch to English.

**Q2: "Day 31-34" mentioned in original spec?**
A: Removed. Only 30 days. Day slider goes from 1 to 30.

**Q3: MVP vs Full — which optional features?**
A: MVP includes:
- ✅ Progress statistics (per-group %)
- ✅ Daily streak counter
- ✅ Export/import progress (JSON backup)
- ✅ Search/filter words
- ✅ Print study list (PDF of red-marked words)
- ✅ Keyboard navigation
- ✅ Per-group reset + Full reset
- ✅ Language toggle (CN/EN UI)
- ✅ Hardest words list
- ✅ Historical progress chart
- ✅ TTS fallback for limited browsers
- ❌ Dark mode (later)
- ❌ Sound effects (no)
- ❌ High contrast mode (later)
- ❌ Font size adjustment (later)

---

## 📦 Data & Content

**Q4: Word list source?**
A: No existing list. Must source and validate CET-4 2023+ revised syllabus. 1,500 essential high-frequency words selected from the full ~4,500 CET-4 list.

**Q5: Data accuracy?**
A: IPA is mandatory. Must be accurate — this is a student learning tool, no errors acceptable.

**Q6: Example sentences?**
A: A1-B1 level. Simple and learner-friendly.

**Q7: CET-4 word list standard?**
A: 2023+ revised syllabus.

**Q8: Parts of speech?**
A: One card with multiple meanings. If "record" is noun + verb, show both on the same card.

**Q9: Synonyms?**
A: Only where natural. Basic/function words (the, is, at) don't need synonyms.

**Q10: Word grouping logic?**
A: Frequency-based — most common words first (Group 1 = highest frequency).

---

## 🖥️ Tech Stack

**Q11: React vs Vanilla JS?**
A: Next.js (React). Deploy on Netlify.

**Q12: Remotion & Anthropic Skills repos?**
A: Reference repos for project structure, UI patterns, and design inspiration. Not core dependencies.

**Q13: Build tooling?**
A: Next.js with static export capability.

---

## 🎨 UI/UX

**Q14: Grid layout for 30 groups?**
A: Show 6 groups per row on desktop. After 6, add spacing and show next 6. Scrollable vertically.

**Q15: Color coding persistence?**
A: Colors persist across days. "C" key clears ALL color markings. Per-group and full reset available.

**Q16: Mobile priority?**
A: Both desktop and mobile important. Optimal UI for all screen sizes.

**Q17: Color theme?**
A: Developer's choice — blue/teal academic feel.

**Q18: Font choice?**
A: Developer's choice — system fonts preferred for performance.

**Q19: Dark mode?**
A: Not in MVP. Add later.

**Q20: Sound effects?**
A: No.

---

## 🔄 Learning Logic

**Q21: Spaced repetition?**
A: Not required. Simple cumulative model (Day N = Groups 1 through N).

**Q22: Day advancement?**
A: Scroll bar/slider on top. Student can slide freely. No calendar locking.

**Q23: Can users skip ahead?**
A: Yes. Up to the student to choose any day.

---

## 💾 Backend & Auth

**Q24: Auth method?**
A: Simple username + password. Create account flow.

**Q25: Supabase vs Convex?**
A: Convex.

**Q26: China fallback?**
A: Yes — fallback to localStorage if Convex is unreachable.

**Q27: Reset capability?**
A: Both full reset and per-group reset.

---

## 🔊 TTS & Audio

**Q28: Browser support?**
A: Whatever is free and works for China. Web Speech API + fallback.

**Q29: Pronunciation preference?**
A: American English (en-US) — CET-4 uses American English.

**Q30: TTS fallback?**
A: Yes. Fallback chain: Web Speech API → Youdao dictionary TTS API.

---

## 🚀 Deployment

**Q31: Hosting?**
A: Netlify. Free tier. Fresh setup.

**Q32: Domain?**
A: Free `*.netlify.app` subdomain initially.

**Q33: Repository?**
A: `d:\laycet`. Will be pushed to GitHub.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ↑↓←→ | Navigate between cards |
| D | Show definition/detail modal |
| G | Mark green (known) |
| R | Mark red (unknown) |
| W | Reset single card marking |
| C | Clear ALL color markings |
| ESC | Close card detail popup |

---

## 📊 Analytics/Stats

- Daily study streak counter
- "Hardest words" list (most times marked red)
- Per-group completion percentage
- Historical progress chart (over days/weeks)
