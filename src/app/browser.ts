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
