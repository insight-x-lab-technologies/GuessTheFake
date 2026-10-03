import { ArrowLeft, CheckCircle2, Download, FolderPlus, Plus, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { SUPPORTED_LANGUAGES, type Language } from '../../core/i18n/i18n';
import { Button } from '../../core/ui/Button';
import { getLocalizedText } from '../../game/content-schema';
import { PACK_DRAFT_MAX_STATEMENT, type PackDraftIssue } from '../../game/pack-editor';
import type { GuessTheFakeDifficulty } from '../../game/types';
import type { Translate } from '../app-types';
import { getLanguageLabel } from '../browser';
import type { PackEditorController } from '../hooks/usePackEditor';
import { ResponsiveActions, ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

const DIFFICULTIES: GuessTheFakeDifficulty[] = ['easy', 'medium', 'hard'];

// W17-05: create or edit a one-language pack, validate it and save or export.
export function PackEditorPanel({ t, editor }: { t: Translate; editor: PackEditorController }) {
  const [categoryName, setCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const draft = editor.draft;
  if (!draft) return null;

  const issueLine = (issue: PackDraftIssue) => t(issue.key, {
    round: (issue.roundIndex ?? 0) + 1,
    statement: (issue.statementIndex ?? 0) + 1
  });
  const packIssues = editor.issues.filter(issue => issue.roundIndex === undefined);

  return (
    <section className={styles.panel}>
      <ScreenHeader
        screen="packs"
        title={draft.packId ? t('editor.editTitle') : t('editor.title')}
        aside={(
          <ResponsiveActions label={t('app.actions')} name="pack-editor">
            <Button variant="ghost" icon={<ArrowLeft size={18} />} onClick={editor.close}>{t('editor.back')}</Button>
          </ResponsiveActions>
        )}
      >
        <p>{t('editor.subtitle')}</p>
      </ScreenHeader>

      <div className={styles.editorLayout}>
        <div className={styles.list}>
          <article className={styles.smallCard}>
            <h3 className={styles.cardTitle}>{t('editor.packInfo')}</h3>
            <div className={styles.editorMeta}>
              <label className={styles.field}>
                <span>{t('editor.packTitle')}</span>
                <input value={draft.title} maxLength={60} onChange={event => editor.setTitle(event.target.value)} />
              </label>
              <label className={styles.field}>
                <span>{t('editor.emoji')}</span>
                <input value={draft.emoji} maxLength={8} onChange={event => editor.setEmoji(event.target.value)} />
              </label>
              <label className={styles.field}>
                <span>{t('editor.language')}</span>
                <select value={draft.language} onChange={event => editor.setLanguage(event.target.value as Language)}>
                  {SUPPORTED_LANGUAGES.map(language => (
                    <option key={language} value={language}>{getLanguageLabel(language)}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className={styles.field}>
              <span>{t('editor.description')}</span>
              <textarea value={draft.description} maxLength={200} rows={2} onChange={event => editor.setDescription(event.target.value)} />
            </label>
            <form
              className={styles.editorMeta}
              onSubmit={event => {
                event.preventDefault();
                if (editor.addCategory(categoryName)) {
                  setCategoryName('');
                  setCategoryError('');
                } else {
                  setCategoryError(t('editor.categoryInvalid'));
                }
              }}
            >
              <label className={styles.field}>
                <span>{t('editor.newCategory')}</span>
                <input value={categoryName} maxLength={40} onChange={event => setCategoryName(event.target.value)} />
              </label>
              <Button type="submit" variant="secondary" icon={<FolderPlus size={18} />}>{t('editor.addCategory')}</Button>
            </form>
            {categoryError ? <p className={styles.errorText} role="alert">{categoryError}</p> : null}
          </article>

          {draft.rounds.map((round, roundIndex) => {
            const roundIssues = editor.issues.filter(issue => issue.roundIndex === roundIndex);
            return (
              <article
                key={round.key}
                className={`${styles.smallCard} ${styles.editorRound}`}
                data-invalid={editor.showIssues && roundIssues.length ? 'true' : undefined}
                aria-label={t('editor.roundTitle', { number: roundIndex + 1 })}
              >
                <header>
                  <h3 className={styles.cardTitle}>{t('editor.roundTitle', { number: roundIndex + 1 })}</h3>
                  <button type="button" className={styles.inlineTool} onClick={() => editor.removeRound(roundIndex)}>
                    <Trash2 size={16} /> {t('editor.removeRound')}
                  </button>
                </header>
                <div className={styles.editorMeta}>
                  <label className={styles.field}>
                    <span>{t('setup.category')}</span>
                    <select value={round.categoryId} onChange={event => editor.setRoundField(roundIndex, 'categoryId', event.target.value)}>
                      {draft.categories.map(category => (
                        <option key={category.id} value={category.id}>{getLocalizedText(category.title, draft.language, category.id)}</option>
                      ))}
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>{t('setup.difficulty')}</span>
                    <select
                      value={round.difficulty}
                      onChange={event => editor.setRoundField(roundIndex, 'difficulty', event.target.value as GuessTheFakeDifficulty)}
                    >
                      {DIFFICULTIES.map(difficulty => <option key={difficulty} value={difficulty}>{t(`setup.${difficulty}`)}</option>)}
                    </select>
                  </label>
                </div>
                <ol className={styles.authoringList}>
                  {round.statements.map((statement, statementIndex) => (
                    <li key={statementIndex} data-lie={round.fakeIndex === statementIndex ? 'true' : undefined}>
                      <label className={styles.field}>
                        <span>{t('editor.statement', { number: statementIndex + 1 })}</span>
                        <textarea
                          value={statement}
                          rows={1}
                          maxLength={PACK_DRAFT_MAX_STATEMENT}
                          onChange={event => editor.setStatement(roundIndex, statementIndex, event.target.value)}
                        />
                      </label>
                      <label className={styles.lieToggle}>
                        <input
                          type="radio"
                          name={`fake-${round.key}`}
                          checked={round.fakeIndex === statementIndex}
                          onChange={() => editor.setRoundField(roundIndex, 'fakeIndex', statementIndex)}
                        />
                        <span>{t('editor.fake')}</span>
                      </label>
                    </li>
                  ))}
                </ol>
                <label className={styles.field}>
                  <span>{t('editor.explanation')}</span>
                  <textarea
                    value={round.explanation}
                    rows={2}
                    maxLength={300}
                    onChange={event => editor.setRoundField(roundIndex, 'explanation', event.target.value)}
                  />
                </label>
                {editor.showIssues && roundIssues.length ? (
                  <ul className={styles.editorIssues}>
                    {roundIssues.map((issue, index) => <li key={`${issue.key}-${index}`}>{issueLine(issue)}</li>)}
                  </ul>
                ) : null}
              </article>
            );
          })}
          <Button variant="secondary" icon={<Plus size={18} />} onClick={editor.addRound}>{t('editor.addRound')}</Button>
        </div>

        <aside className={styles.smallCard} aria-label={t('editor.summary')}>
          <h3 className={styles.cardTitle}>{t('editor.summary')}</h3>
          <p>{t('editor.summaryLine', { rounds: draft.rounds.length, issues: editor.issues.length })}</p>
          {editor.showIssues && packIssues.length ? (
            <ul className={styles.editorIssues}>
              {packIssues.map(issue => <li key={issue.key}>{issueLine(issue)}</li>)}
            </ul>
          ) : null}
          <Button variant="secondary" icon={<CheckCircle2 size={18} />} onClick={editor.validate}>{t('editor.validate')}</Button>
          <Button icon={<Save size={18} />} onClick={editor.save}>{t('editor.save')}</Button>
          <Button variant="secondary" icon={<Download size={18} />} onClick={editor.exportJson}>{t('editor.export')}</Button>
          <Button variant="ghost" icon={<Trash2 size={18} />} onClick={editor.discard}>{t('editor.discard')}</Button>
          {editor.status ? <p className={styles.helperText} role="status">{editor.status}</p> : null}
        </aside>
      </div>
    </section>
  );
}
