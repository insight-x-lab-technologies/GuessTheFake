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

  const builtinStatus: 'loading' | 'ready' | 'error' = builtin?.language !== language
    ? 'loading'
    : builtin.pack ? 'ready' : 'error';
  const builtinPack = builtinStatus === 'ready' ? builtin?.pack ?? null : null;
  const allPacks = useMemo(
    () => (builtinPack ? [builtinPack, ...installedPacks.packs] : installedPacks.packs),
    [builtinPack, installedPacks.packs]
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
      if (pack.id === BUILTIN_PACK_ID || pack.builtin) {
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
    removePack,
    exportAllPacks
  };
}
