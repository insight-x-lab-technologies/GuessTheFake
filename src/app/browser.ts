import type { Language } from '../core/i18n/i18n';

export function downloadJson(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function readTextFile(file: File, onText: (content: string) => void, onError: () => void) {
  const reader = new FileReader();
  reader.onload = () => onText(String(reader.result ?? ''));
  reader.onerror = onError;
  reader.readAsText(file);
}

export async function copyTextToClipboard(value: string) {
  if (!value) return;
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.left = '-9999px';
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  document.body.appendChild(textarea);
  const activeElement = document.activeElement;
  textarea.focus();
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (activeElement instanceof HTMLElement) activeElement.focus();
  if (!copied) throw new Error('Clipboard copy failed');
}

export function openExternalUrl(url: string) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function isRunningStandalonePwa() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(display-mode: standalone)').matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function createLocalSignature(raw: string) {
  let hash = 0;
  for (let index = 0; index < raw.length; index += 1) {
    hash = (hash * 31 + raw.charCodeAt(index)) >>> 0;
  }
  return `local-${hash.toString(16).padStart(8, '0')}`;
}

const LANGUAGE_LABELS: Record<Language, string> = {
  pt: 'Português do Brasil',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano'
};

export function getLanguageLabel(language: Language) {
  return LANGUAGE_LABELS[language];
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// W15-02: short haptic cue; silently ignored where unsupported (iOS Safari).
export function vibrate(pattern: number | number[]) {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(pattern);
  } catch {
    undefined;
  }
}

// W15-06: run a state update inside a View Transition when the browser has
// one. `commit` makes the update synchronous inside the transition (React's
// flushSync); without the API the update runs as a plain state change.
export function runViewTransition(update: () => void, commit: (update: () => void) => void = run => run()) {
  const doc = typeof document === 'undefined'
    ? null
    : document as Document & { startViewTransition?: (callback: () => void) => unknown };
  if (!doc?.startViewTransition || prefersReducedMotion()) {
    update();
    return;
  }
  try {
    doc.startViewTransition(() => commit(update));
  } catch {
    update();
  }
}
