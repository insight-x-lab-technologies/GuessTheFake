import { describe, expect, it } from 'vitest';
import { parsePackImport, setPackEnabled, upsertInstalledPack } from './content-packs';

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
