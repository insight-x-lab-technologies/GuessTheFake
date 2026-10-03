import { useEffect, useMemo, useState } from 'react';
import {
  type ContentPack,
  exportPacks,
  getEnabledPacks,
  loadInstalledPacks,
  parsePackImport,
  removeInstalledPack,
  saveInstalledPacks,
  setPackEnabled,
  upsertInstalledPack
} from '../../core/content-packs/content-packs';
import type { Language } from '../../core/i18n/i18n';
import { validateGuessTheFakePack } from '../../game/content-schema';
import { BUILTIN_PACK_ID, loadBuiltinPack } from '../../game/data/builtin';
import {
  isPackInSeason,
  isSeasonalPackId,
  loadSeasonalPackIds,
  loadSeasonalPacks,
  saveSeasonalPackIds,
  SEASONAL_PACKS,
  type SeasonalPackId
} from '../../game/data/seasonal';
import { getSeasonalSuggestion } from '../../core/themes/seasonal';
import type { GuessTheFakePackContent } from '../../game/types';
import { GAME_ID } from '../../game/modes';
import type { Translate } from '../app-types';
import { createLocalSignature, downloadJson, readTextFile } from '../browser';
import { memoryStorage } from './storage-fallback';

export type PacksController = ReturnType<typeof usePacks>;

export function usePacks({ t, language }: { t: Translate; language: Language }) {
  const [installedPacks, setInstalledPacks] = useState(() =>
    loadInstalledPacks<GuessTheFakePackContent>(typeof localStorage === 'undefined' ? memoryStorage : localStorage)
  );
  const [packStatus, setPackStatus] = useState('');
  const [builtin, setBuiltin] = useState<{
    language: Language;
    pack: ContentPack<GuessTheFakePackContent> | null;
  } | null>(null);
  // W17-06: optional seasonal packs, one lazy chunk per language.
  const [seasonalIds, setSeasonalIds] = useState<SeasonalPackId[]>(() =>
    loadSeasonalPackIds(typeof localStorage === 'undefined' ? memoryStorage : localStorage)
  );
  const [seasonalLoaded, setSeasonalLoaded] = useState<{
    key: string;
    packs: Array<ContentPack<GuessTheFakePackContent>>;
  } | null>(null);
  const seasonalKey = `${language}:${[...seasonalIds].sort().join('+')}`;

  useEffect(() => {
    saveInstalledPacks(installedPacks);
  }, [installedPacks]);

  // The builtin pack ships one lazy chunk per language.
  useEffect(() => {
    let cancelled = false;
    loadBuiltinPack(language)
      .then(pack => {
        if (!cancelled) setBuiltin({ language, pack });
      })
      .catch(() => {
        if (!cancelled) setBuiltin({ language, pack: null });
      });
    return () => {
      cancelled = true;
    };
  }, [language]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') saveSeasonalPackIds(seasonalIds);
  }, [seasonalIds]);

  useEffect(() => {
    let cancelled = false;
    loadSeasonalPacks(language, seasonalIds)
      .then(packs => {
        if (!cancelled) setSeasonalLoaded({ key: seasonalKey, packs });
      })
      .catch(() => {
        if (!cancelled) setSeasonalLoaded({ key: seasonalKey, packs: [] });
      });
    return () => {
      cancelled = true;
    };
    // seasonalKey covers language and ids.
  }, [seasonalKey]);

  const seasonalPacks = seasonalLoaded?.key === seasonalKey ? seasonalLoaded.packs : [];
  const currentSeasonId = getSeasonalSuggestion(new Date())?.season.id ?? null;
  const seasonalCatalog = SEASONAL_PACKS.map(entry => ({
    entry,
    enabled: seasonalIds.includes(entry.id),
    loading: seasonalIds.includes(entry.id) && !seasonalPacks.some(pack => pack.id === entry.id),
    inSeason: isPackInSeason(entry, currentSeasonId),
    rounds: seasonalPacks.find(pack => pack.id === entry.id)?.content.rounds.length ?? null
  }));

  const builtinStatus: 'loading' | 'ready' | 'error' = builtin?.language !== language
    ? 'loading'
    : builtin.pack ? 'ready' : 'error';
  const builtinPack = builtinStatus === 'ready' ? builtin?.pack ?? null : null;
  const allPacks = useMemo(
    () => [...(builtinPack ? [builtinPack] : []), ...seasonalPacks, ...installedPacks.packs],
    [builtinPack, seasonalPacks, installedPacks.packs]
  );
  const enabledPacks = useMemo(
    () => getEnabledPacks(allPacks).filter(pack => !pack.languages || pack.languages.includes(language)),
    [allPacks, language]
  );
  const packValidations = useMemo(
    () => allPacks.map(pack => ({ pack, validation: validateGuessTheFakePack(pack, { expectedGameId: GAME_ID }) })),
    [allPacks]
  );
  const validPackCount = useMemo(
    () => allPacks.filter(pack => validateGuessTheFakePack(pack).ok).length,
    [allPacks]
  );

  function importPackFromFile(file: File) {
    readTextFile(file, raw => {
      const pack = parsePackImport<GuessTheFakePackContent>(raw);
      if (!pack) {
        setPackStatus(t('packs.invalidJson'));
        return;
      }
      if (pack.id === BUILTIN_PACK_ID || pack.builtin || isSeasonalPackId(pack.id)) {
        setPackStatus(t('packs.reservedPack'));
        return;
      }
      const validation = validateGuessTheFakePack(pack, {
        expectedGameId: GAME_ID,
        language
      });
      if (!validation.ok) {
        setPackStatus(`${t('packs.invalidSchema')}: ${validation.issues[0]?.path ?? 'pack'}`);
        return;
      }
      setInstalledPacks(current =>
        upsertInstalledPack(current, {
          ...pack,
          enabled: true,
          signature: pack.signature ?? createLocalSignature(raw)
        })
      );
      setPackStatus(t('packs.imported'));
    }, () => setPackStatus(t('packs.invalidFile')));
  }

  function togglePack(packId: string, enabled: boolean) {
    if (packId === BUILTIN_PACK_ID && !enabled) {
      setPackStatus(t('packs.builtinRequired'));
      return;
    }
    setInstalledPacks(current => ({ packs: setPackEnabled(current.packs, packId, enabled) }));
    setPackStatus(t('packs.toggled'));
  }

  function toggleSeasonalPack(packId: SeasonalPackId, enabled: boolean) {
    setSeasonalIds(current => (enabled ? [...new Set([...current, packId])] : current.filter(id => id !== packId)));
    setPackStatus(t('packs.toggled'));
  }

  // W17-05 editor and W17-01 "save as pack": install or replace a local pack.
  function savePack(pack: ContentPack<GuessTheFakePackContent>) {
    if (pack.id === BUILTIN_PACK_ID || isSeasonalPackId(pack.id)) return false;
    const validation = validateGuessTheFakePack(pack, { expectedGameId: GAME_ID });
    if (!validation.ok) {
      setPackStatus(`${t('packs.invalidSchema')}: ${validation.issues[0]?.path ?? 'pack'}`);
      return false;
    }
    setInstalledPacks(current => upsertInstalledPack(current, {
      ...pack,
      enabled: true,
      signature: createLocalSignature(JSON.stringify(pack.content))
    }));
    return true;
  }

  function removePack(packId: string) {
    setInstalledPacks(current => removeInstalledPack(current, packId));
    setPackStatus(t('packs.removed'));
  }

  function exportAllPacks() {
    downloadJson('guess-the-fake-packs.json', exportPacks(allPacks));
  }

  return {
    installedPacks,
    setInstalledPacks,
    allPacks,
    enabledPacks,
    builtinStatus,
    packValidations,
    validPackCount,
    packStatus,
    importPackFromFile,
    togglePack,
    seasonalCatalog,
    toggleSeasonalPack,
    savePack,
    removePack,
    exportAllPacks
  };
}
