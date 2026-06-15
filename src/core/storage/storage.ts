export type StorageAdapter = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export type VersionedEnvelope<T> = {
  version: number;
  value: T;
  updatedAt: string;
};

export type StorageMigration<TPrevious, TNext> = {
  fromVersion: number;
  key: string;
  migrate: (value: TPrevious) => TNext;
};

export function createStorageKey(scope: string, name: string, version: number) {
  return `gtf.${scope}.${name}.v${version}`;
}

export function readVersioned<T>(
  storage: StorageAdapter,
  key: string,
  fallback: T,
  version: number
): T {
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as VersionedEnvelope<T>;
    if (parsed.version !== version) return fallback;
    return parsed.value ?? fallback;
  } catch {
    return fallback;
  }
}

export function readVersionedWithMigrations<T>(
  storage: StorageAdapter,
  key: string,
  fallback: T,
  version: number,
  migrations: Array<StorageMigration<unknown, T>>
): T {
  const current = readRawEnvelope<T>(storage, key);
  if (current && current.version === version) return current.value ?? fallback;

  const orderedMigrations = [...migrations].sort((a, b) => b.fromVersion - a.fromVersion);
  for (const migration of orderedMigrations) {
    const previous = readRawEnvelope<unknown>(storage, migration.key);
    if (!previous || previous.version !== migration.fromVersion) continue;
    try {
      const migrated = migration.migrate(previous.value);
      writeVersioned(storage, key, migrated, version);
      return migrated;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

export function writeVersioned<T>(
  storage: StorageAdapter,
  key: string,
  value: T,
  version: number
) {
  const envelope: VersionedEnvelope<T> = {
    version,
    value,
    updatedAt: new Date().toISOString()
  };
  storage.setItem(key, JSON.stringify(envelope));
}

export function removeStored(storage: StorageAdapter, key: string) {
  storage.removeItem(key);
}

function readRawEnvelope<T>(storage: StorageAdapter, key: string): VersionedEnvelope<T> | null {
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VersionedEnvelope<T>;
    if (!parsed || typeof parsed !== 'object' || typeof parsed.version !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}
