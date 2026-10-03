import { CalendarHeart, Download, ListChecks, Pencil, Plus, Star, Upload } from 'lucide-react';
import { useRef } from 'react';
import { getPackDescription, getPackLicenseStatus, getPackTitle } from '../../core/content-packs/content-packs';
import type { Language } from '../../core/i18n/i18n';
import { Button } from '../../core/ui/Button';
import { isSeasonalPackId } from '../../game/data/seasonal';
import type { LocalizeText, Translate } from '../app-types';
import type { PacksController } from '../hooks/usePacks';
import { ResponsiveActions, ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

export function PacksScreen({
  t,
  text,
  language,
  packs,
  onCreatePack,
  onEditPack,
  hasDraft
}: {
  t: Translate;
  text: LocalizeText;
  language: Language;
  packs: PacksController;
  onCreatePack: () => void;
  onEditPack: (packId: string) => void;
  hasDraft: boolean;
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
            <Button icon={<Plus size={18} />} onClick={onCreatePack}>
              {hasDraft ? t('editor.continueDraft') : t('editor.create')}
            </Button>
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
          {packs.packValidations.filter(({ pack }) => !isSeasonalPackId(pack.id)).map(({ pack, validation }) => (
            <article key={pack.id} className={styles.smallCard}>
              {pack.meta?.cover?.emoji ? (
                <span
                  className={styles.packCover}
                  style={pack.meta.cover.color ? { background: pack.meta.cover.color } : undefined}
                  aria-hidden="true"
                >
                  {pack.meta.cover.emoji}
                </span>
              ) : <ListChecks size={22} />}
              <h3 className={styles.cardTitle}>{getPackTitle(pack, language)}</h3>
              {getPackDescription(pack, language) ? <p>{getPackDescription(pack, language)}</p> : null}
              <div className={styles.tagList}>
                <span data-license={getPackLicenseStatus(pack)}>{t(`packMeta.license.${getPackLicenseStatus(pack)}`)}</span>
                {pack.meta?.audience ? <span>{t(`packMeta.audience.${pack.meta.audience}`)}</span> : null}
                {pack.meta?.difficulty ? <span>{t(`packMeta.difficulty.${pack.meta.difficulty}`)}</span> : null}
                {pack.meta?.version ? <span>{t('packMeta.version', { version: pack.meta.version })}</span> : null}
                {pack.languages?.length ? <span>{pack.languages.map(code => code.toUpperCase()).join(' · ')}</span> : null}
              </div>
              {pack.meta?.author ? <span>{t('packMeta.author', { author: pack.meta.author })}</span> : null}
              <p>
                {t('packs.roundSummary', {
                  rounds: pack.content.rounds.length,
                  categories: pack.content.categories.length
                })} · {pack.builtin ? t('packs.builtin') : t('packs.installed')}
              </p>
              <span>{t('packs.signature')}: {pack.signature ?? 'local-builtin-v1'}</span>
              {!validation.ok ? <p className={styles.errorText}>{validation.issues[0]?.message}</p> : null}
              {pack.meta?.changelog?.length ? (
                <details className={styles.changelog}>
                  <summary>{t('packMeta.changelog')}</summary>
                  <ul>
                    {pack.meta.changelog.map(entry => (
                      <li key={`${entry.version}-${entry.date}`}>
                        <b>{entry.version}</b> · {entry.date} · {entry.notes[language] ?? entry.notes.en ?? Object.values(entry.notes)[0]}
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
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
                  <button type="button" onClick={() => onEditPack(pack.id)}><Pencil size={14} /> {t('editor.edit')}</button>
                ) : null}
                {!pack.builtin ? (
                  <button type="button" onClick={() => packs.removePack(pack.id)}>{t('packs.remove')}</button>
                ) : null}
              </div>
            </article>
          ))}
          <h3 className={styles.cardTitle}><CalendarHeart size={20} /> {t('seasonalPacks.title')}</h3>
          <p className={styles.helperText}>{t('seasonalPacks.subtitle')}</p>
          {packs.seasonalCatalog.map(({ entry, enabled, loading, inSeason, rounds }) => (
            <article key={entry.id} className={styles.smallCard}>
              <span
                className={styles.packCover}
                style={entry.meta.cover?.color ? { background: entry.meta.cover.color } : undefined}
                aria-hidden="true"
              >
                {entry.meta.cover?.emoji}
              </span>
              <h3 className={styles.cardTitle}>
                {entry.title[language] ?? entry.title.en}
                {inSeason ? <> <span className={styles.seasonBadge}>{t('seasonalPacks.inSeason')}</span></> : null}
              </h3>
              <p>{entry.meta.description?.[language] ?? entry.meta.description?.en}</p>
              <p>
                {loading
                  ? t('seasonalPacks.loading')
                  : t('seasonalPacks.rounds', { rounds: rounds ?? 30 })}
              </p>
              <div className={styles.feedbackActions}>
                <label className={styles.switchField}>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={event => packs.toggleSeasonalPack(entry.id, event.target.checked)}
                  />
                  <span>{enabled ? t('packs.enabled') : t('packs.disabled')}</span>
                </label>
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
