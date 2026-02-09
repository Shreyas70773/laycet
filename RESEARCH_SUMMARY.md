# Flashcard Web App — Research Summary

*Compiled: February 9, 2026*

---

## 1. Remotion (remotion-dev/remotion) — UI Patterns & Animation Ideas

**Repository**: https://github.com/remotion-dev/remotion  
**Stars**: 35.8k | **Language**: TypeScript (77.7%) | **License**: Special/Commercial

### Project Structure Patterns (Adaptable for Flashcard App)

Remotion is a monorepo under `packages/` with clear separation of concerns:

- **`packages/core`** — Core primitives: `interpolate()`, `spring()`, `Easing`, `Sequence`, `Series`, `AbsoluteFill`, `useCurrentFrame()`
- **`packages/player`** — Embeddable `<Player>` component with controls, loading states, error fallbacks
- **`packages/design`** — Shared UI component library: `Button`, `Card`, `Counter`, `Input`, `Select`, `Switch`, `Tabs`, `Textarea`, `Toggle`
- **`packages/studio`** — Full IDE-like UI with modals, panels, and visual controls
- **`packages/template-next-pages`** and **`packages/template-next-app-tailwind`** — Next.js integration templates

### Animation Techniques We Can Adapt

| Technique | Remotion API | Flashcard Adaptation |
|---|---|---|
| **Spring physics** | `spring({ fps, frame, config: { damping } })` | Card flip animation with natural bounce |
| **Interpolation** | `interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' })` | Progress bars, fade-in/out of hints |
| **Easing curves** | `Easing.bezier(0.12, 1, 1, 1)`, `Easing.in(Easing.ease)` | Smooth card transitions |
| **Sequencing** | `<Sequence from={30}>`, `<Series>` | Step-through card reveal (word → pinyin → definition) |
| **Scale + fade combos** | `scaleIn(delay)` + `fadeIn(delay)` pattern | Staggered element reveal on flashcards |
| **SVG path animation** | `getLength(d)` + `stroke-dashoffset` keyframes | Progress rings, achievement animations |
| **CSS spring transforms** | `transform: translateY(${interpolate(animation, [0,1], [600,0])}px)` | Card enter/exit animations |

### Specific UI Patterns Worth Stealing

1. **`TextFade` component** — Fades text in/out with configurable timing; perfect for showing/hiding translations
2. **`Rings` component** — Concentric animated rings; adaptable as a review score visualization  
3. **`BackgroundAnimation`** — Subtle SVG ellipse animation; great for ambient background during study
4. **`AnimationPlayer`** with error fallback + loading states — Robust component pattern
5. **`Switcher` component** — Left/right navigation with pointer events; ideal for card swiping
6. **`@remotion/design` system** — Complete component library (Button, Card, Tabs, Select, Switch, etc.)
7. **Zod schema validation** — All props validated with `z.object()`; excellent pattern for flashcard data

### Key Takeaway for Flashcard App

Use **CSS spring animations** (via `framer-motion` or custom CSS) to replicate Remotion's physics-based feel. The `interpolate()` pattern (mapping progress 0→1 to visual values) is the core concept — implement it with CSS custom properties or a lightweight animation library.

---

## 2. Anthropic Skills (anthropics/skills) — Patterns for Next.js App

**Repository**: https://github.com/anthropics/skills  
**Stars**: 66.4k | **Languages**: Python (91.3%), HTML, Shell, JS

### Relevant Skills for Building a Next.js Flashcard App

| Skill | What It Provides | How It Helps |
|---|---|---|
| **`web-artifacts-builder`** | Full React + TypeScript + Vite + Tailwind + shadcn/ui scaffold | Complete tech stack blueprint |
| **`frontend-design`** | Design guidelines to avoid "AI slop" aesthetics | Professional UI quality |
| **`theme-factory`** | 10 curated color/font themes with CSS variables | Ready-to-use design system |
| **`webapp-testing`** | Playwright-based testing patterns | E2E testing for the flashcard app |
| **`mcp-builder`** | MCP server patterns (Python/TypeScript) | If we want AI-powered features |
| **`skill-creator`** | Meta-skill for creating structured workflows | Architecture planning |

### Frontend Design Guidelines (from `frontend-design/SKILL.md`)

Critical anti-patterns to avoid ("AI slop"):
- ❌ Excessive centered layouts, purple gradients, uniform rounded corners, Inter font
- ✅ **Typography**: Distinctive font choices (not Arial/Inter), pair display + body fonts
- ✅ **Color**: Cohesive aesthetic with CSS variables, dominant colors + sharp accents
- ✅ **Motion**: CSS animations for micro-interactions, staggered reveals on page load, scroll-triggered and hover surprises
- ✅ **Layout**: Asymmetry, overlap, diagonal flow, grid-breaking elements, generous negative space

### Web Artifacts Builder Tech Stack

The `init-artifact.sh` script sets up:
- **React 18 + TypeScript** via Vite
- **Tailwind CSS 3.4.1** with shadcn/ui theming (CSS variables for light/dark)
- **40+ shadcn/ui components** pre-installed (accordion, button, card, dialog, drawer, tabs, toast, etc.)
- **Path aliases** (`@/components`, `@/lib`, `@/hooks`)
- All Radix UI dependencies included
- Bundling to single HTML via Parcel

### Theme Factory — Usable Themes

10 pre-built themes with hex color palettes and font pairings:
1. Ocean Depths (professional, calming)
2. Sunset Boulevard (warm, vibrant)
3. Forest Canopy (natural, earth tones)
4. **Modern Minimalist** (clean, contemporary) ← Good for study app
5. Golden Hour (rich, autumnal)
6. **Arctic Frost** (cool, crisp) ← Good for clean flashcard UI
7. Desert Rose (soft, sophisticated)
8. **Tech Innovation** (bold, modern) ← Good for app branding
9. Botanical Garden (fresh, organic)
10. Midnight Galaxy (dramatic, cosmic)

---

## 3. CET-4 Vocabulary — Official Syllabus Research

### Official Word Count

| Source | Word Count | Notes |
|---|---|---|
| **Wikipedia (College English Test)** | **4,500 words** | CET-4 vocabulary requirement |
| **CET-6 for comparison** | 6,500 words | |
| **Official Test Outline (2016 PDF)** | ~4,500 words | `cet.neea.edu.cn/res/Home/1704/55b02330ac17274664f06d9d3db8249d.pdf` |

### Authoritative Sources

1. **Official**: 中国教育考试网 (National Education Examinations Authority)
   - URL: https://cet.neea.edu.cn/
   - Test outline: https://cet.neea.edu.cn/html1/folder/16113/1588-1.htm
   - The syllabus/大纲 PDF is the gold standard

2. **Official Syllabus Book**: *Syllabus for College English Test* (2006, Shanghai Language Education Press) — Referenced in academic papers

3. **2023+ Revision Notes**: 
   - The CET committee periodically updates the syllabus. The most authoritative source remains the official 考试大纲 (test outline) published on `cet.neea.edu.cn`
   - The 2016 outline (most recent publicly available PDF) lists vocabulary requirements
   - For the most current 2023+ list, check the official website's 考试大纲 section or purchase the official syllabus book (《大学英语四级考试大纲》)

4. **Practical Sources for Word Lists**:
   - Hujiang (沪江) CET-4 word lists
   - Baicizhan (百词斩) vocabulary databases
   - Shanbay (扇贝) word lists
   - These are derived from official lists but may include additional high-frequency words

### Recommendation

Start with the **official 4,500-word list** from the CET syllabus PDF. Supplement with frequency-ranked sublists for spaced repetition prioritization.

---

## 4. Web Speech API — Browser Compatibility in China

### SpeechSynthesis (Text-to-Speech) — THE IMPORTANT ONE FOR FLASHCARDS

| Browser | Support | Notes |
|---|---|---|
| **Chrome (Desktop)** | ✅ Full support since v33 | ⚠️ Stops playback after ~15s on Windows (since v55) |
| **Edge** | ✅ Full support since v14 | Good quality Microsoft voices |
| **QQ Browser** | ✅ **Supported** (v14.9+) | Confirmed on caniuse.com |
| **360 Browser** | ✅ Likely supported | Chromium-based, inherits Chrome support |
| **WeChat Browser (Android)** | ⚠️ **Unreliable** | Uses Android System WebView (No support listed for WebView Android) |
| **WeChat Browser (iOS)** | ✅ Supported | Uses WKWebView (Safari support since v7) |
| **UC Browser** | ❌ **Not supported** (v15.5) | Explicitly listed as unsupported |
| **Baidu Browser** | ❌ **Not supported** (v13.52) | Explicitly listed as unsupported |
| **Opera Mini** | ❌ Not supported | |

### SpeechRecognition (Speech-to-Text) — SECONDARY FEATURE

| Browser | Support |
|---|---|
| Chrome | ✅ Full support since v33 (cloud-based, requires internet) |
| Edge | ✅ Full support since v79 |
| Firefox | ❌ No support (disabled behind flag) |
| Safari | ✅ Since v14.1 (with webkit prefix) |
| QQ/360/WeChat | ⚠️ Depends on underlying engine; generally works in Chromium-based |

### Critical Finding for China

**WebView Android (used by WeChat, many mini-programs) does NOT support SpeechSynthesis.** This is the biggest risk. WeChat's in-app browser on Android has **No support** for TTS. A fallback is mandatory.

---

## 5. Convex Free Tier — Suitability Assessment

### Free Tier Limits (Starter Plan, $0/month)

| Resource | Free Allowance | Flashcard App Need | Sufficient? |
|---|---|---|---|
| **Function calls** | 1,000,000/month | ~100 users × 100 reviews/day × 30 days = 300K | ✅ Yes |
| **Database storage** | 0.5 GiB | 4,500 words × ~500 bytes = ~2.2 MB base; per-user progress ~1KB × 1000 users = ~1MB | ✅ Yes |
| **Database bandwidth** | 1 GiB/month | Moderate reads for card reviews | ✅ Yes |
| **File storage** | 1 GiB | Audio files if pre-generated | ⚠️ Tight if storing audio |
| **File bandwidth** | 1 GiB/month | Audio playback | ⚠️ Tight |
| **Action compute** | 20 GB-hours/month | Minimal server-side logic | ✅ Yes |
| **Concurrent queries** | 16 | Fine for small user base | ✅ Yes |
| **Concurrent mutations** | 16 | Fine for small user base | ✅ Yes |
| **Developers** | 1-6 | | ✅ Yes |
| **Deployments** | 40 | | ✅ Yes |

### Features Included (Free)

- ✅ Built-in auth (Convex Auth beta, or Clerk/Auth0/WorkOS integration)
- ✅ Indexes, full-text search, vector search
- ✅ Real-time subscriptions (live updates)
- ✅ Cron jobs (for spaced repetition scheduling)
- ✅ Webhooks
- ✅ Next.js, React, React Native support
- ✅ Preview deployments

### Auth Options with Convex

1. **Convex Auth** (beta) — Built-in, simplest, supports passwords + social providers + OTP
2. **Clerk** — Best Next.js integration, free tier: 10,000 MAU
3. **WorkOS AuthKit** — Free up to 1M users (!)
4. **Auth0** — Free tier: 25,000 MAU

### Verdict

**Convex free tier is excellent for a flashcard app** with up to ~500 daily active users. The 1M function calls/month and 0.5 GiB storage are generous for vocabulary data. The main constraint is file storage/bandwidth if you store audio pronunciation files — use Web Speech API or external TTS instead. Convex also offers **self-hosted open source** via Docker + Postgres as a fallback.

### Scaling Path

If you grow beyond free tier, the **Starter plan** charges:
- $2.20 per additional 1M function calls
- $0.22/GB additional storage
- Estimated cost for a moderate flashcard app: **$0-5/month**

---

## 6. TTS Fallback Options for China

### The Problem

- **Web Speech API** doesn't work in WeChat Android, UC Browser, Baidu Browser
- **ResponsiveVoice.js** loads from `code.responsivevoice.org` — may be slow/blocked in China
- Need a solution that works behind the Great Firewall

### Options Ranked by China Suitability

| Option | China Access | Quality | Cost | Latency |
|---|---|---|---|---|
| **1. Pre-generated audio files** | ✅ Excellent (self-hosted) | ⭐⭐⭐⭐⭐ | One-time generation cost | Instant (cached) |
| **2. Web Speech API (primary)** | ⚠️ Works in Chrome/Edge/QQ, NOT WeChat Android | ⭐⭐⭐ | Free | Instant |
| **3. Youdao TTS API** (有道) | ✅ Excellent (Chinese CDN) | ⭐⭐⭐⭐ | Free tier available | Low |
| **4. Baidu TTS API** (百度语音) | ✅ Excellent (Chinese CDN) | ⭐⭐⭐⭐ | Free: 50K calls/day | Low |
| **5. Tencent TTS API** (腾讯云) | ✅ Excellent (Chinese CDN) | ⭐⭐⭐⭐⭐ | Free tier: 8M chars/month | Low |
| **6. ResponsiveVoice.js** | ⚠️ CDN may be slow | ⭐⭐⭐ | Free (non-commercial) | Variable |
| **7. Google Cloud TTS** | ❌ Blocked in China | ⭐⭐⭐⭐⭐ | Paid | N/A |
| **8. Amazon Polly** | ⚠️ AWS China region available | ⭐⭐⭐⭐ | Paid | Medium |

### Recommended Strategy: Tiered Fallback

```
1st: Try Web Speech API (free, instant, works in most desktop browsers)
   ↓ (if unavailable)
2nd: Play pre-generated MP3 files (hosted on your CDN or Convex file storage)
   ↓ (if not cached/available)
3rd: Call Youdao/Baidu TTS API server-side, cache result
```

### Pre-generating Audio — Best Approach for 4,500 Words

- Use **Edge TTS** (Microsoft, free, high quality) to batch-generate all 4,500 pronunciations
- Python package: `edge-tts` — supports American & British English voices
- File size: ~10-30 KB per word × 4,500 = **~45-135 MB total**
- Host on a Chinese CDN (Alibaba Cloud OSS, Tencent COS) for fast access
- This eliminates all runtime TTS dependency

### Youdao TTS (Best Free China-Native Option)

- URL pattern: `https://dict.youdao.com/dictvoice?audio={word}&type=1` (US) or `type=2` (UK)
- No API key required for basic usage
- Works as a simple `<audio>` src — no JavaScript SDK needed
- ⚠️ Not officially documented as a public API; may rate-limit

---

## 7. CET-4 — American vs British English

### Finding: CET-4 Prefers American English

From Wikipedia's College English Test article (citing the official test outline):

> "It includes two levels, CET4 (四级) and CET6 (六级), and **prefers American English**."  
> — Source: National College English Fourth, Sixth Grade Test Outline (2016), p.15

### Practical Implications

| Aspect | Recommendation |
|---|---|
| **Default TTS voice** | Use **American English** (en-US) |
| **Pronunciation toggle** | Offer both US/UK but default to US |
| **Spelling** | Use American spellings (color, center, organize) |
| **Vocabulary notes** | Flag British variants where they differ (e.g., "lift/elevator") |
| **Web Speech API lang** | Set `utterance.lang = 'en-US'` as default |
| **Edge TTS voice** | Use `en-US-JennyNeural` or `en-US-GuyNeural` |

---

## 8. Architecture Recommendations Summary

### Recommended Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14+ (App Router) | Best Convex integration, SSR for SEO |
| **Styling** | Tailwind CSS + shadcn/ui | Per anthropics/skills patterns |
| **Animations** | Framer Motion | Remotion-inspired spring physics |
| **Backend/DB** | Convex (free tier) | Real-time, built-in auth, generous free tier |
| **Auth** | Convex Auth or Clerk | Simplest integration |
| **TTS (Primary)** | Web Speech API | Free, zero-latency |
| **TTS (Fallback)** | Pre-generated audio + Youdao API | China-compatible |
| **Deployment** | Vercel | Best Next.js host, Edge network in Asia |

### Key Design Patterns to Implement (from research)

1. **Spring-physics card flip** (from Remotion's `spring()` → Framer Motion's `useSpring`)
2. **Sequenced reveal** (from Remotion's `<Sequence>` → staggered `motion.div` with delays)
3. **CSS variable theming** (from anthropics/skills Theme Factory)
4. **Zod schema validation** for all data (from Remotion patterns + Convex native support)
5. **Progressive disclosure** (from skills architecture → show word → tap for pinyin → tap for definition)
6. **Tiered TTS with graceful degradation** (Web Speech → cached audio → API fallback)
7. **Distinctive typography** (from frontend-design skill — avoid generic fonts)

---

## Source URLs

- Remotion: https://github.com/remotion-dev/remotion
- Anthropic Skills: https://github.com/anthropics/skills
- CET Official: https://cet.neea.edu.cn/
- CET Wikipedia: https://en.wikipedia.org/wiki/College_English_Test
- CET Outline PDF: https://cet.neea.edu.cn/res/Home/1704/55b02330ac17274664f06d9d3db8249d.pdf
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- Speech Synthesis caniuse: https://caniuse.com/speech-synthesis
- Convex Pricing: https://www.convex.dev/pricing
- Convex Limits: https://docs.convex.dev/production/state/limits
- Convex Auth: https://docs.convex.dev/auth
- ResponsiveVoice: https://responsivevoice.org/
