import { createStorageKey, readVersioned, writeVersioned, type StorageAdapter } from '../storage/storage';

export type ContentPack<TContent> = {
  id: string;
  gameId: string;
  schemaVersion: number;
  title: Record<string, string>;
  languages?: string[];
  enabled: boolean;
  builtin?: boolean;
  signature?: string;
  content: TContent;
};

export type InstalledContentPacksModel<TContent> = {
  packs: Array<ContentPack<TContent>>;
};

export const CONTENT_PACKS_VERSION = 1;
export const CONTENT_PACKS_KEY = createStorageKey('platform', 'content-packs', CONTENT_PACKS_VERSION);

export function getPackTitle<TContent>(pack: ContentPack<TContent>, language: string, fallback = 'Untitled pack') {
  return pack.title[language] ?? pack.title.en ?? pack.title.pt ?? fallback;
}

export function getEnabledPacks<TContent>(packs: Array<ContentPack<TContent>>) {
  return packs.filter(pack => pack.enabled !== false);
}

export function createEmptyInstalledPacks<TContent>(): InstalledContentPacksModel<TContent> {
  return { packs: [] };
}

export function loadInstalledPacks<TContent>(storage: StorageAdapter = localStorage): InstalledContentPacksModel<TContent> {
  return readVersioned(storage, CONTENT_PACKS_KEY, createEmptyInstalledPacks<TContent>(), CONTENT_PACKS_VERSION);
}

export function saveInstalledPacks<TContent>(
  model: InstalledContentPacksModel<TContent>,
  storage: StorageAdapter = localStorage
) {
  writeVersioned(storage, CONTENT_PACKS_KEY, model, CONTENT_PACKS_VERSION);
}

export function upsertInstalledPack<TContent>(
  model: InstalledContentPacksModel<TContent>,
  pack: ContentPack<TContent>
): InstalledContentPacksModel<TContent> {
  const existingIndex = model.packs.findIndex(existing => existing.id === pack.id && existing.gameId === pack.gameId);
  if (existingIndex === -1) return { packs: [...model.packs, pack] };

  return {
    packs: model.packs.map((existing, index) => (index === existingIndex ? pack : existing))
  };
}

export function setPackEnabled<TContent>(
  packs: Array<ContentPack<TContent>>,
  packId: string,
  enabled: boolean
) {
  return packs.map(pack => (pack.id === packId ? { ...pack, enabled } : pack));
}

export function removeInstalledPack<TContent>(
  model: InstalledContentPacksModel<TContent>,
  packId: string
): InstalledContentPacksModel<TContent> {
  return { packs: model.packs.filter(pack => pack.id !== packId) };
}

export function exportPacks<TContent>(packs: Array<ContentPack<TContent>>) {
  return JSON.stringify({ packs }, null, 2);
}

export function parsePackImport<TContent>(raw: string): ContentPack<TContent> | null {
  try {
    const parsed = JSON.parse(raw) as ContentPack<TContent> | { pack?: ContentPack<TContent> };
    if ('pack' in parsed && parsed.pack) return parsed.pack;
    return parsed as ContentPack<TContent>;
  } catch {
    return null;
  }
}
