import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { RegisterSWOptions } from 'virtual:pwa-register';
import { usePwaStatus, type RegisterServiceWorker } from './usePwaStatus';

function mockRegister() {
  const update = vi.fn(async () => undefined);
  let options: RegisterSWOptions = {};
  const register = vi.fn<RegisterServiceWorker>((registerOptions) => {
    options = registerOptions;
    return update;
  });
  return { register, update, options: () => options };
}

describe('usePwaStatus', () => {
  it('registers once and offers a reload when a new version is waiting', async () => {
    const { register, update, options } = mockRegister();
    const { result, rerender } = renderHook(() => usePwaStatus({ register }));
    rerender();

    expect(register).toHaveBeenCalledTimes(1);
    expect(options().immediate).toBe(true);
    expect(result.current.updateReady).toBe(false);

    act(() => options().onNeedRefresh?.());
    expect(result.current.updateReady).toBe(true);

    await act(async () => result.current.applyUpdate());
    expect(update).toHaveBeenCalledWith(true);
    expect(result.current.updateReady).toBe(false);
  });

  it('reports offline readiness and lets the player dismiss notices', () => {
    const { register, options } = mockRegister();
    const { result } = renderHook(() => usePwaStatus({ register }));

    act(() => options().onOfflineReady?.());
    expect(result.current.offlineReady).toBe(true);
    act(() => result.current.dismissOfflineReady());
    expect(result.current.offlineReady).toBe(false);

    act(() => options().onNeedRefresh?.());
    act(() => result.current.dismissUpdate());
    expect(result.current.updateReady).toBe(false);
  });

  it('tracks online and offline events', () => {
    const { register } = mockRegister();
    const { result } = renderHook(() => usePwaStatus({ register }));

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current.online).toBe(false);
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current.online).toBe(true);
  });

  it('keeps working when registration throws', () => {
    const register = vi.fn<RegisterServiceWorker>(() => {
      throw new Error('no service worker');
    });
    const { result } = renderHook(() => usePwaStatus({ register }));
    expect(() => result.current.applyUpdate()).not.toThrow();
  });
});
