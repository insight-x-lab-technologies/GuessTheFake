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
  // W13-07: themed pack presentation. Optional; community packs stay valid
  // without it.
  meta?: ContentPackMeta;
  content: TContent;
};

export type PackAudience = 'family' | 'kids' | 'teens' | 'adults';
export type PackDifficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export type ContentPackMeta = {
  cover?: { emoji?: string; color?: string };
  description?: Record<string, string>;
  audience?: PackAudience;
  difficulty?: PackDifficulty;
  version?: string;
  author?: string;
  changelog?: Array<{ version: string; date: string; notes: Record<string, string> }>;
  license?: ContentPackLicense;
};

// Ground work for future licensed packs. Nothing is verified yet: a
// signature is only shown as "unverified", and a pack without a license is a
// community pack that always installs.
export type ContentPackLicense = {
  kind: 'community' | 'premium';
  publisher?: string;
  signature?: { algorithm: string; keyId: string; value: string };
};

export type PackLicenseStatus = 'community' | 'premium-unverified' | 'premium-unsigned';

export const PACK_AUDIENCES: PackAudience[] = ['family', 'kids', 'teens', 'adults'];
export const PACK_DIFFICULTIES: PackDifficulty[] = ['easy', 'medium', 'hard', 'mixed'];

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

export function getPackDescription<TContent>(pack: ContentPack<TContent>, language: string) {
  const description = pack.meta?.description;
  if (!description) return '';
  return description[language] ?? description.en ?? description.pt ?? '';
}

export function getPackLicenseStatus<TContent>(pack: ContentPack<TContent>): PackLicenseStatus {
  const license = pack.meta?.license;
  if (!license || license.kind !== 'premium') return 'community';
  return license.signature?.value ? 'premium-unverified' : 'premium-unsigned';
}

// Stable text a future signature will cover: sorted keys, without local
// state (`enabled`, `builtin`) and without the signatures themselves.
export function canonicalizePackForSigning<TContent>(pack: ContentPack<TContent>) {
  const { enabled: _enabled, builtin: _builtin, signature: _signature, ...rest } = pack;
  const license = rest.meta?.license;
  const unsigned = license
    ? { ...rest, meta: { ...rest.meta, license: { kind: license.kind, publisher: license.publisher } } }
    : rest;
  return stableStringify(unsigned);
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(item => stableStringify(item)).join(',')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(',')}}`;
  }
  return JSON.stringify(value);
}
