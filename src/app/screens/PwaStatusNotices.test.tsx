import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { PwaStatusController } from '../hooks/usePwaStatus';
import { PwaStatusNotices } from './PwaStatusNotices';

const t = (key: string) => key;

function pwaState(overrides: Partial<PwaStatusController> = {}): PwaStatusController {
  return {
    updateReady: false,
    offlineReady: false,
    online: true,
    applyUpdate: vi.fn(),
    dismissUpdate: vi.fn(),
    dismissOfflineReady: vi.fn(),
    ...overrides
  };
}

describe('PwaStatusNotices', () => {
  it('shows the update toast with a reload action', () => {
    const pwa = pwaState({ updateReady: true, offlineReady: true });
    render(<PwaStatusNotices t={t} pwa={pwa} toastSlotBusy={false} />);

    expect(screen.getByText('app.updateReady')).toBeInTheDocument();
    expect(screen.queryByText('app.offlineReady')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'app.updateAction' }));
    expect(pwa.applyUpdate).toHaveBeenCalled();
  });

  it('waits for the trophy toast and still shows the offline pill', () => {
    render(<PwaStatusNotices t={t} pwa={pwaState({ updateReady: true, online: false })} toastSlotBusy />);

    expect(screen.queryByText('app.updateReady')).not.toBeInTheDocument();
    expect(screen.getByText('app.offline')).toBeInTheDocument();
  });
});
