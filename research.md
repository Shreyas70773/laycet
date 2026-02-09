# Research — CET-4 Flashcard App

> Date: 2026-02-09
> Status: Complete

---

## 1. CET-4 Vocabulary List

### Official Standard
- **Source**: National Education Examinations Authority (NEEA) — cet.neea.edu.cn
- **Full CET-4 vocabulary**: ~4,500 words per the official test outline
- **Our scope**: 1,500 essential high-frequency words selected by frequency analysis
- **Edition**: 2023+ revised syllabus

### Word Selection Strategy
- Use frequency-based ranking from established CET-4 word frequency corpora
- Group 1 = 50 most common words, Group 30 = least common of the 1,500
- Each word entry: word, chinese, IPA, partOfSpeech, exampleSentence, synonyms, day, groupNumber
- Words with multiple POS: combined into one card

### Data Quality Requirements
- IPA: **Mandatory, hand-verified quality**. Use CMU Pronouncing Dictionary cross-referenced with Oxford/Cambridge
- Chinese translations: Must match standard CET-4 exam preparation materials
- Example sentences: A1-B1 level, simple and clear
- Synonyms: Only where natural; function words excluded

---

## 2. Web Speech API — Browser Compatibility in China

| Browser | Desktop | Mobile | TTS Support |
|---------|---------|--------|-------------|
| Chrome | ✅ Full | ✅ Full | speechSynthesis fully supported |
| Edge | ✅ Full | ✅ Full | speechSynthesis fully supported |
| QQ Browser | ✅ Works | ⚠️ Limited | Desktop OK, mobile varies |
| 360 Browser | ✅ Works | ⚠️ Limited | Desktop OK, mobile varies |
| WeChat Browser | N/A | ❌ Fails | WebView has no SpeechSynthesis |
| UC Browser | N/A | ❌ Fails | No support |
| Baidu Browser | N/A | ❌ Fails | No support |

### TTS Fallback Strategy
**Recommended fallback chain:**
1. **Primary**: Web Speech API (`speechSynthesis.speak()`) — `en-US` voice
2. **Fallback**: Youdao Dictionary TTS — `https://dict.youdao.com/dictvoice?audio={word}&type=1`
   - Free, no API key needed
   - Works in China (Chinese service)
   - Type 1 = US English, Type 2 = UK English
3. **Detection**: Check `window.speechSynthesis` and `speechSynthesis.getVoices().length > 0`

### CET-4 Pronunciation Standard
- **American English (en-US)** is the standard for CET-4
- Default to `en-US` voice in Web Speech API
- Youdao fallback: `type=1` for American English

---

## 3. Convex — Backend Platform

### Free Tier Limits
| Resource | Free Tier |
|----------|-----------|
| Function calls | 1M / month |
| Database storage | 0.5 GiB |
| Bandwidth | 1 GiB / month |
| File storage | 1 GiB |
| Cron jobs | ✅ Included |
| Real-time subscriptions | ✅ Included |
| Auth integration | ✅ Built-in |

### Suitability Assessment
- **Excellent fit**: 1,500 words × user data is tiny (~100KB per user)
- **Auth**: Convex Auth with username/password (built-in, no third-party needed)
- **Real-time**: Progress syncs across devices automatically
- **Estimated capacity**: Comfortably serves 500+ daily active users on free tier

### China Accessibility
- Convex uses cloud infrastructure that may have latency from China
- **Mitigation**: localStorage-first architecture with background sync to Convex
- App works offline/degraded; syncs when connection is good

---

## 4. Next.js + Netlify Deployment

### Static Export Strategy
- Next.js `output: 'export'` for static site generation
- All 1,500 words baked into the JavaScript bundle at build time
- Convex client connects at runtime for user data sync
- Netlify free tier: 100GB bandwidth/month, 300 build minutes/month

### Performance Considerations
- 1,500 words JSON ≈ 300-500KB uncompressed, ~80-120KB gzipped
- Virtualized list rendering for grid view (react-window or similar)
- Code splitting: detail modal loaded on demand
- Images: None needed (text-only app)

---

## 5. UI Design Research

### Inspiration from Remotion
- Spring-physics animations for card interactions (adaptable via Framer Motion)
- Component composition patterns for sequential content reveal
- Zod schema validation for typed word data

### Inspiration from Anthropic Skills
- **Anti-AI-slop design principles**: distinctive fonts, dominant colors with sharp accents
- **shadcn/ui**: 40+ ready-made components for rapid UI development
- **Theme recommendation**: Modern Minimalist or Arctic Frost
- Staggered animation reveals for card grids

### Design Decisions
- **Primary colors**: Blue/teal academic palette
- **Fonts**: System fonts (Inter for Latin, system default for Chinese)
- **Component library**: shadcn/ui + Tailwind CSS
- **Animations**: Framer Motion for card transitions
- **Layout**: CSS Grid for card grid, responsive breakpoints

---

## 6. Accessibility & i18n

### Bilingual UI
- Default: Chinese (中文)
- Toggle: English
- All UI labels, buttons, instructions in both languages
- Word content always bilingual (English word + Chinese translation)

### Keyboard Navigation
- Full keyboard support confirmed
- Arrow keys, letter shortcuts (D, G, R, W, C), ESC
- Focus management for modal interactions

---

## ⚠️ Conflicts & Open Issues

1. **Word count**: Original spec says 1,500 words; official CET-4 has ~4,500. Resolution: Select top 1,500 by frequency. ✅ Resolved.
2. **TTS in WeChat**: No browser-native solution exists. Youdao fallback solves this. ✅ Resolved.
3. **Convex latency in China**: Mitigated by localStorage-first architecture. ✅ Resolved.
