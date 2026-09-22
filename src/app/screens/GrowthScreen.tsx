import { AtSign, Coffee, Copy, Download, Facebook, Gift, Instagram, MessageCircle, Send, Share2, Smartphone, Twitter } from 'lucide-react';
import type { ReactNode } from 'react';
import { DONATION_LINKS, isDonationUrlConfigured, type SharePlatform } from '../../core/share/share';
import { Button } from '../../core/ui/Button';
import type { Translate } from '../app-types';
import type { GrowthController } from '../hooks/useGrowth';
import { ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

export function GrowthScreen({ t, growth }: { t: Translate; growth: GrowthController }) {
  const shareTargets: Array<{ id: SharePlatform | 'native' | 'copy'; label: string; icon: ReactNode }> = [
    { id: 'native', label: t('share.native'), icon: <Share2 size={18} /> },
    { id: 'copy', label: t('share.copy'), icon: <Copy size={18} /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle size={18} /> },
    { id: 'facebook', label: 'Facebook', icon: <Facebook size={18} /> },
    { id: 'x', label: 'X', icon: <Twitter size={18} /> },
    { id: 'instagram', label: 'Instagram', icon: <Instagram size={18} /> },
    { id: 'tiktok', label: 'TikTok', icon: <Send size={18} /> },
    { id: 'threads', label: 'Threads', icon: <AtSign size={18} /> }
  ];
  const donationOptions = [
    { url: DONATION_LINKS.buyMeCoffee, icon: <Coffee size={20} />, label: t('donate.buyMeCoffee'), sub: t('donate.buyMeCoffeeSub') },
    { url: DONATION_LINKS.koFi, icon: <Gift size={20} />, label: t('donate.koFi'), sub: t('donate.koFiSub') }
  ];

  return (
    <section className={styles.panel}>
      <ScreenHeader
        screen="growth"
        title={t('growth.title')}
        aside={(
          <div className={styles.sessionCode}>
            <Share2 size={16} />
            {growth.canShareNatively ? t('share.nativeAvailable') : t('share.copyAvailable')}
          </div>
        )}
      >
        <p>{t('growth.subtitle')}</p>
      </ScreenHeader>
      {growth.growthStatus ? <p className={styles.helperText} role="status">{growth.growthStatus}</p> : null}
      <div className={styles.growthGrid}>
        <article className={styles.smallCard}>
          <Coffee size={24} />
          <h3 className={styles.cardTitle}>{t('donate.title')}</h3>
          <p>{t('donate.subtitle')}</p>
          <div className={styles.donateGrid}>
            {donationOptions.map(option => {
              const configured = isDonationUrlConfigured(option.url);
              return (
                <button
                  key={option.label}
                  type="button"
                  className={styles.donateOption}
                  disabled={!configured}
                  onClick={() => growth.openDonationUrl(option.url)}
                >
                  {option.icon}
                  <span>
                    <b>{option.label}</b>
                    <small>{configured ? option.sub : t('donate.linkUnavailable')}</small>
                  </span>
                </button>
              );
            })}
          </div>
          <div className={styles.compactRows}>
            <span><b>{t('donate.whyLanguagesTitle')}</b>{t('donate.whyLanguages')}</span>
            <span><b>{t('donate.whyUpdatesTitle')}</b>{t('donate.whyUpdates')}</span>
          </div>
        </article>

        <article className={styles.smallCard}>
          <Share2 size={24} />
          <h3 className={styles.cardTitle}>{t('share.panelTitle')}</h3>
          <p>{t('share.panelSubtitle')}</p>
          <label className={styles.field}>
            <span>{t('share.linkLabel')}</span>
            <input value={growth.appShareUrl} readOnly />
          </label>
          <div className={styles.shareGrid} aria-label={t('share.platformsLabel')}>
            {shareTargets.map(target => (
              <button
                key={target.id}
                type="button"
                className={target.id === 'native' || target.id === 'copy' ? styles.shareAction : undefined}
                onClick={() => growth.shareToPlatform(target.id)} aria-label={target.label}
              >
                {target.icon} <span>{target.label}</span>
              </button>
            ))}
          </div>
        </article>

        <article className={styles.smallCard}>
          <Smartphone size={24} />
          <h3 className={styles.cardTitle}>{t('pwa.title')}</h3>
          <p>{t('pwa.description')}</p>
          <div className={styles.compactRows}>
            <span>
              <b>{t('pwa.installStatusTitle')}</b>
              {growth.isStandalonePwa ? t('pwa.installedStatus') : growth.canInstall ? t('pwa.readyStatus') : t('pwa.unavailableStatus')}
            </span>
            <span>
              <b>{t('pwa.offlineStatusTitle')}</b>
              {t('pwa.offlineStatus')}
            </span>
            <span>
              <b>{t('pwa.linksStatusTitle')}</b>
              {t('pwa.linksStatus')}
            </span>
          </div>
          <Button
            className={styles.growthAction}
            variant="secondary"
            icon={<Download size={18} />}
            onClick={growth.installPwa}
            disabled={growth.isStandalonePwa || !growth.canInstall}
          >
            {growth.isStandalonePwa ? t('pwa.installedAction') : t('pwa.installAction')}
          </Button>
        </article>
      </div>
    </section>
  );
}
