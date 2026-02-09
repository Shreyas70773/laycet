/**
 * Text-to-Speech engine with Web Speech API + Youdao fallback
 * Optimized for Chinese browser environments
 */

let speechSupported: boolean | null = null;

function checkSpeechSupport(): boolean {
  if (speechSupported !== null) return speechSupported;
  if (typeof window === 'undefined') return false;

  speechSupported =
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined';

  return speechSupported;
}

/**
 * Speak a word using Web Speech API (primary) or Youdao (fallback)
 */
export function speakWord(word: string, speed: number = 1.0): void {
  if (checkSpeechSupport()) {
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = speed;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to find a US English voice
      const voices = window.speechSynthesis.getVoices();
      const usVoice = voices.find(
        (v) =>
          v.lang === 'en-US' ||
          v.lang.startsWith('en-US') ||
          v.lang === 'en_US'
      );
      if (usVoice) {
        utterance.voice = usVoice;
      }

      window.speechSynthesis.speak(utterance);
      return;
    } catch {
      // Fall through to Youdao fallback
    }
  }

  // Fallback: Youdao Dictionary TTS (works in China, no API key needed)
  speakWithYoudao(word);
}

/**
 * Youdao Dictionary TTS fallback
 * type=1 = US English, type=2 = UK English
 */
function speakWithYoudao(word: string): void {
  try {
    const audio = new Audio(
      `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=1`
    );
    audio.play().catch(() => {
      // Silently fail if audio can't play
      console.warn('TTS: Both Web Speech API and Youdao fallback failed for:', word);
    });
  } catch {
    console.warn('TTS: Unable to create audio element');
  }
}

/**
 * Initialize voices (must be called after user interaction on some browsers)
 */
export function initTTS(): void {
  if (!checkSpeechSupport()) return;

  // Chrome requires getVoices() to be called; voices load async
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

/**
 * Check if TTS is available
 */
export function isTTSAvailable(): boolean {
  return checkSpeechSupport() || typeof Audio !== 'undefined';
}
