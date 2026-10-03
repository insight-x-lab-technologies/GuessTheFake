import { describe, expect, it } from 'vitest';
import {
  canonicalizePackForSigning,
  getPackDescription,
  getPackLicenseStatus,
  parsePackImport,
  setPackEnabled,
  upsertInstalledPack
} from './content-packs';

describe('content pack helpers', () => {
  const pack = {
    id: 'extra',
    gameId: 'guess-the-fake',
    schemaVersion: 1,
    title: { pt: 'Extra' },
    enabled: true,
    content: { categories: [], rounds: [] }
  };

  it('upserts and toggles installed packs', () => {
    const inserted = upsertInstalledPack({ packs: [] }, pack);
    const replaced = upsertInstalledPack(inserted, { ...pack, enabled: false });

    expect(replaced.packs).toHaveLength(1);
    expect(setPackEnabled(replaced.packs, 'extra', true)[0].enabled).toBe(true);
  });

  it('parses plain pack imports and rejects malformed JSON', () => {
    expect(parsePackImport(JSON.stringify(pack))?.id).toBe('extra');
    expect(parsePackImport('{')).toBeNull();
  });
});

describe('themed pack metadata (W13-07)', () => {
  const base = {
    id: 'themed',
    gameId: 'guess-the-fake',
    schemaVersion: 1,
    title: { en: 'Themed' },
    enabled: true,
    content: { categories: [], rounds: [] }
  };

  it('treats packs without a premium license as community packs', () => {
    expect(getPackLicenseStatus(base)).toBe('community');
    expect(getPackLicenseStatus({ ...base, meta: { license: { kind: 'community' as const } } })).toBe('community');
    expect(getPackLicenseStatus({ ...base, meta: { license: { kind: 'premium' as const } } })).toBe('premium-unsigned');
    expect(getPackLicenseStatus({
      ...base,
      meta: { license: { kind: 'premium' as const, signature: { algorithm: 'ed25519', keyId: 'k1', value: 'sig' } } }
    })).toBe('premium-unverified');
  });

  it('localizes the description', () => {
    const pack = { ...base, meta: { description: { en: 'English', pt: 'Português' } } };
    expect(getPackDescription(pack, 'pt')).toBe('Português');
    expect(getPackDescription(pack, 'de')).toBe('English');
    expect(getPackDescription(base, 'en')).toBe('');
  });

  it('canonicalizes a pack for signing without local state or signatures', () => {
    const signed = {
      ...base,
      signature: 'local-123',
      meta: { version: '1.0.0', license: { kind: 'premium' as const, publisher: 'Studio', signature: { algorithm: 'ed25519', keyId: 'k1', value: 'sig' } } }
    };
    const reordered = { content: base.content, meta: { license: { publisher: 'Studio', kind: 'premium' as const }, version: '1.0.0' }, title: base.title, schemaVersion: 1, gameId: base.gameId, id: base.id, enabled: false };
    const canonical = canonicalizePackForSigning(signed);

    expect(canonical).toBe(canonicalizePackForSigning(reordered));
    expect(canonical).not.toContain('sig');
    expect(canonical).not.toContain('enabled');
    expect(canonical.startsWith('{"content":')).toBe(true);
  });
});
