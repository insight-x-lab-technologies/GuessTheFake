import { Download, ListChecks, Star, Upload } from 'lucide-react';
import { useRef } from 'react';
import { getPackTitle } from '../../core/content-packs/content-packs';
import type { Language } from '../../core/i18n/i18n';
import { Button } from '../../core/ui/Button';
import type { LocalizeText, Translate } from '../app-types';
import type { PacksController } from '../hooks/usePacks';
import { ResponsiveActions, ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

export function PacksScreen({
  t,
  text,
  language,
  packs
}: {
  t: Translate;
  text: LocalizeText;
  language: Language;
  packs: PacksController;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewRound = packs.enabledPacks[0]?.content.rounds[0];

  return (
    <section className={styles.panel}>
      <ScreenHeader
        screen="packs"
        title={t('packs.title')}
        aside={(
          <ResponsiveActions label={t('app.actions')} name="packs">
            <Button variant="secondary" icon={<Upload size={18} />} onClick={() => fileInputRef.current?.click()}>
              {t('packs.import')}
            </Button>
            <Button variant="ghost" icon={<Download size={18} />} onClick={packs.exportAllPacks}>
              {t('packs.export')}
            </Button>
          </ResponsiveActions>
        )}
      >
        <p>{t('packs.subtitle')}</p>
      </ScreenHeader>
      <input
        ref={fileInputRef}
        hidden
        type="file"
        accept="application/json,.json"
        onChange={event => {
          const file = event.target.files?.[0];
          if (file) packs.importPackFromFile(file);
          event.currentTarget.value = '';
        }}
      />
      {packs.packStatus ? <p className={styles.helperText}>{packs.packStatus}</p> : null}
      <div className={styles.packLayout}>
        <div className={styles.list}>
          {packs.packValidations.map(({ pack, validation }) => (
            <article key={pack.id} className={styles.smallCard}>
              <ListChecks size={22} />
              <h3 className={styles.cardTitle}>{getPackTitle(pack, language)}</h3>
              <p>
                {t('packs.roundSummary', {
                  rounds: pack.content.rounds.length,
                  categories: pack.content.categories.length
                })} · {pack.builtin ? t('packs.builtin') : t('packs.installed')}
              </p>
              <span>{t('packs.signature')}: {pack.signature ?? 'local-builtin-v1'}</span>
              {!validation.ok ? <p className={styles.errorText}>{validation.issues[0]?.message}</p> : null}
              <div className={styles.feedbackActions}>
                <label className={styles.switchField}>
                  <input
                    type="checkbox"
                    checked={pack.enabled !== false}
                    disabled={pack.builtin}
                    onChange={event => packs.togglePack(pack.id, event.target.checked)}
                  />
                  <span>{pack.enabled !== false ? t('packs.enabled') : t('packs.disabled')}</span>
                </label>
                {!pack.builtin ? (
                  <button type="button" onClick={() => packs.removePack(pack.id)}>{t('packs.remove')}</button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
        <article className={styles.smallCard}>
          <Star size={22} />
          <h3 className={styles.cardTitle}>{t('packs.preview')}</h3>
          <p>{text(previewRound?.statements[0]?.text, t('packs.empty'))}</p>
          <span>{previewRound?.categoryId ?? '-'}</span>
          <p>{t('packs.validationSummary', {
            valid: packs.validPackCount,
            total: packs.allPacks.length
          })}</p>
        </article>
      </div>
    </section>
  );
}
