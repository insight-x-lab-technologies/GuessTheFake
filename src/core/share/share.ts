export type SharePlatform = 'whatsapp' | 'facebook' | 'x' | 'instagram' | 'tiktok' | 'threads';

export type PlatformShareData = {
  title: string;
  text: string;
  url: string;
};

export type MatchResultShareInput = {
  winnerNames: string[];
  modeLabel: string;
  totalRounds: number;
  roundsLabel: string;
  gameTitle: string;
  callToAction: string;
};

export const DONATION_LINKS = {
  buyMeCoffee: 'https://buymeacoffee.com/insight.x.lab.game.studio',
  koFi: 'https://ko-fi.com/insightxlabgamestudio'
} as const;

export const SOCIAL_WEB_FALLBACKS: Partial<Record<SharePlatform, string>> = {
  instagram: 'https://www.instagram.com/',
  tiktok: 'https://www.tiktok.com/',
  threads: 'https://www.threads.net/'
};

export function isDonationUrlConfigured(url: string | undefined) {
  return Boolean(url) && !/your-page|example\.com|configure/i.test(url ?? '');
}

export function createShareUrl(currentUrl: string, fallbackUrl = '') {
  try {
    const url = new URL(currentUrl);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      if (fallbackUrl && ['localhost', '127.0.0.1', '0.0.0.0'].includes(url.hostname)) {
        return fallbackUrl;
      }
      url.hash = '';
      return url.href;
    }
  } catch {
    return fallbackUrl;
  }

  return fallbackUrl;
}

export function createShareMessage(shareData: PlatformShareData) {
  return `${shareData.text} ${shareData.url}`.trim();
}

export function createPlatformShareUrl(platform: SharePlatform, shareData: PlatformShareData) {
  const encodedUrl = encodeURIComponent(shareData.url);
  const encodedText = encodeURIComponent(shareData.text);
  const encodedMessage = encodeURIComponent(createShareMessage(shareData));

  if (platform === 'whatsapp') return `https://wa.me/?text=${encodedMessage}`;
  if (platform === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  if (platform === 'x') return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;

  return '';
}

export function createMatchResultShareText(input: MatchResultShareInput) {
  const winners = input.winnerNames.length ? input.winnerNames.join(', ') : '-';
  return `${input.gameTitle}: ${winners} - ${input.modeLabel}, ${input.totalRounds} ${input.roundsLabel}. ${input.callToAction}`;
}
