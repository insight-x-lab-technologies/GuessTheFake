import { useCallback, useEffect, useRef, useState } from 'react';
import { registerSW, type RegisterSWOptions } from 'virtual:pwa-register';

export type RegisterServiceWorker = (options: RegisterSWOptions) => (reloadPage?: boolean) => Promise<void>;

export type PwaStatusController = ReturnType<typeof usePwaStatus>;

// Service worker updates and connectivity (W14-04). The worker is registered
// in prompt mode: a new version waits until the player chooses to reload, so
// an update never interrupts a match. `register` is injectable for tests.
export function usePwaStatus({ register = registerSW }: { register?: RegisterServiceWorker } = {}) {
  const updateRef = useRef<((reloadPage?: boolean) => Promise<void>) | null>(null);
  const [updateReady, setUpdateReady] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine !== false));

  useEffect(() => {
    if (updateRef.current) return;
    try {
      updateRef.current = register({
        immediate: true,
        onNeedRefresh: () => setUpdateReady(true),
        onOfflineReady: () => setOfflineReady(true)
      });
    } catch {
      updateRef.current = null;
    }
  }, [register]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    setUpdateReady(false);
    updateRef.current?.(true).catch(() => undefined);
  }, []);

  return {
    updateReady,
    offlineReady,
    online,
    applyUpdate,
    dismissUpdate: useCallback(() => setUpdateReady(false), []),
    dismissOfflineReady: useCallback(() => setOfflineReady(false), [])
  };
}
