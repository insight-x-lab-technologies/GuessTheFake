import { useEffect, useState } from 'react';
import {
  SOCIAL_WEB_FALLBACKS,
  createMatchResultShareText,
  createPlatformShareUrl,
  createShareMessage,
  createShareUrl,
  isDonationUrlConfigured,
  type PlatformShareData,
  type SharePlatform
} from '../../core/share/share';
import { GAME_MODES } from '../../game/modes';
import type { BeforeInstallPromptEvent, Translate } from '../app-types';
import { copyTextToClipboard, isRunningStandalonePwa, openExternalUrl } from '../browser';

export type GrowthController = ReturnType<typeof useGrowth>;

export type MatchResultSummary = {
  winnerNames: string[];
  modeId: string;
  totalRounds: number;
};

type ShareNavigator = Navigator & {
  share?: (data: PlatformShareData) => Promise<void>;
  canShare?: (data: PlatformShareData) => boolean;
};

export function canUseNativeShare(shareData: PlatformShareData) {
  const shareNavigator = navigator as ShareNavigator;
  if (!shareNavigator.share) return false;
  if (!shareNavigator.canShare) return true;
  try {
    return shareNavigator.canShare(shareData);
  } catch {
    return false;
  }
}

// Sharing, donations, and the PWA install prompt.
export function useGrowth({ t, matchResult }: { t: Translate; matchResult: MatchResultSummary | null }) {
  const [growthStatus, setGrowthStatus] = useState('');
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalonePwa, setIsStandalonePwa] = useState(() => isRunningStandalonePwa());

  const appShareUrl = typeof window !== 'undefined'
    ? createShareUrl(window.location.href, import.meta.env.VITE_GTF_PUBLIC_URL ?? '')
    : '';
  const appShareData: PlatformShareData = {
    title: t('share.title'),
    text: t('share.text'),
    url: appShareUrl
  };
  const resultShareData: PlatformShareData = {
    title: t('share.resultTitle'),
    text: matchResult
      ? createMatchResultShareText({
        winnerNames: matchResult.winnerNames,
        modeLabel: t(GAME_MODES.find(mode => mode.id === matchResult.modeId)?.titleKey ?? 'game.title'),
        totalRounds: matchResult.totalRounds,
        roundsLabel: t('share.roundsLabel'),
        gameTitle: t('game.title'),
        callToAction: t('share.resultCallToAction')
      })
      : '',
    url: appShareUrl
  };

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event as BeforeInstallPromptEvent);
      setGrowthStatus(t('pwa.installReady'));
    };
    const handleInstalled = () => {
      setDeferredInstallPrompt(null);
      setIsStandalonePwa(true);
      setGrowthStatus(t('pwa.installed'));
    };
    const handleVisibility = () => setIsStandalonePwa(isRunningStandalonePwa());

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('pageshow', handleVisibility);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('pageshow', handleVisibility);
    };
  }, [t]);

  async function shareNative(shareData: PlatformShareData, fallbackStatusKey = 'share.unavailable') {
    const shareNavigator = navigator as ShareNavigator;
    if (canUseNativeShare(shareData) && shareNavigator.share) {
      try {
        await shareNavigator.share(shareData);
        setGrowthStatus(t('share.shared'));
        return true;
      } catch (error) {
        if ((error as { name?: string })?.name === 'AbortError') return false;
      }
    }

    return copyShareMessage(shareData, fallbackStatusKey);
  }

  async function copyShareMessage(shareData: PlatformShareData, statusKey = 'share.copied') {
    try {
      await copyTextToClipboard(createShareMessage(shareData));
      setGrowthStatus(t(statusKey));
      return true;
    } catch {
      setGrowthStatus(t('share.copyFailed'));
      return false;
    }
  }

  async function shareToPlatform(platform: SharePlatform | 'native' | 'copy', shareData = appShareData) {
    if (platform === 'native') {
      await shareNative(shareData);
      return;
    }
    if (platform === 'copy') {
      await copyShareMessage(shareData);
      return;
    }

    if (platform === 'instagram' || platform === 'tiktok' || platform === 'threads') {
      const shared = await shareNative(shareData, `share.${platform}Fallback`);
      if (!canUseNativeShare(shareData)) {
        const fallbackUrl = SOCIAL_WEB_FALLBACKS[platform];
        if (fallbackUrl) openExternalUrl(fallbackUrl);
      }
      if (!shared) setGrowthStatus(t(`share.${platform}Fallback`));
      return;
    }

    const platformUrl = createPlatformShareUrl(platform, shareData);
    if (platformUrl) {
      openExternalUrl(platformUrl);
      setGrowthStatus(t('share.opened'));
      return;
    }

    await shareNative(shareData);
  }

  async function installPwa() {
    if (isStandalonePwa) {
      setGrowthStatus(t('pwa.alreadyInstalled'));
      return;
    }
    if (!deferredInstallPrompt) {
      setGrowthStatus(t('pwa.installUnavailable'));
      return;
    }

    await deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    setDeferredInstallPrompt(null);
    setGrowthStatus(t(choice.outcome === 'accepted' ? 'pwa.installAccepted' : 'pwa.installDismissed'));
  }

  function openDonationUrl(url: string) {
    if (!isDonationUrlConfigured(url)) {
      setGrowthStatus(t('donate.linkUnavailable'));
      return;
    }
    openExternalUrl(url);
  }

  return {
    growthStatus,
    isStandalonePwa,
    canInstall: Boolean(deferredInstallPrompt),
    appShareUrl,
    canShareNatively: typeof navigator !== 'undefined' && canUseNativeShare(appShareData),
    shareToPlatform,
    shareResult: () => shareNative(resultShareData),
    installPwa,
    openDonationUrl
  };
}
