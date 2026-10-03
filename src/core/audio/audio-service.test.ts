import { afterEach, describe, expect, it, vi } from 'vitest';
import { createBlobTrackLoader, createPlatformAudioService, type ThemeAudioTracks } from './audio';

const tracks: ThemeAudioTracks = {
  cosmic: { menu: '/cosmic-menu.mp3', gameplay: '/cosmic-play.mp3' },
  spring: { menu: '/spring-menu.mp3', gameplay: '/spring-play.mp3' },
  autumn: { menu: '/autumn-menu.mp3', gameplay: '/autumn-play.mp3' }
};

const settings = { soundEnabled: true, musicEnabled: true, musicVolume: 0.5 };

class FakeAudio {
  static created: FakeAudio[] = [];
  loop = false;
  volume = 1;
  paused = true;
  constructor(public src: string) {
    FakeAudio.created.push(this);
  }
  play() {
    this.paused = false;
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
  }
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

afterEach(() => {
  FakeAudio.created = [];
  vi.unstubAllGlobals();
});

describe('platform audio service music loading', () => {
  it('loads the theme track on first play and plays the resolved source', async () => {
    vi.stubGlobal('Audio', FakeAudio);
    const loadTrack = vi.fn(async (url: string) => `blob:${url}`);
    const service = createPlatformAudioService({ tracks, loadTrack });

    service.syncMusic({ settings, themeId: 'cosmic', zone: 'menu' });
    expect(loadTrack).not.toHaveBeenCalled();

    service.unlock();
    service.syncMusic({ settings, themeId: 'cosmic', zone: 'menu', reducedMotion: true });
    await flush();

    expect(loadTrack).toHaveBeenCalledWith('/cosmic-menu.mp3');
    expect(FakeAudio.created).toHaveLength(1);
    expect(FakeAudio.created[0].src).toBe('blob:/cosmic-menu.mp3');
    expect(FakeAudio.created[0].loop).toBe(true);
    expect(FakeAudio.created[0].paused).toBe(false);
    expect(FakeAudio.created[0].volume).toBe(0.5);
    service.dispose();
  });

  it('does not start a track that finished loading after music was stopped', async () => {
    vi.stubGlobal('Audio', FakeAudio);
    let resolveTrack: (source: string) => void = () => undefined;
    const loadTrack = vi.fn(() => new Promise<string>((resolve) => { resolveTrack = resolve; }));
    const service = createPlatformAudioService({ tracks, loadTrack });

    service.unlock();
    service.syncMusic({ settings, themeId: 'autumn', zone: 'gameplay', reducedMotion: true });
    service.syncMusic({ settings: { ...settings, musicEnabled: false }, themeId: 'autumn', zone: 'gameplay' });
    resolveTrack('blob:autumn');
    await flush();

    expect(FakeAudio.created).toHaveLength(1);
    expect(FakeAudio.created[0].paused).toBe(true);
    service.dispose();
  });
});

describe('blob track loader', () => {
  it('downloads each track once and falls back to the URL on failure', async () => {
    const fetchMock = vi.fn(async (url: string) => (
      url === '/broken.mp3'
        ? new Response(null, { status: 404 })
        : new Response(new Blob(['music']), { status: 200 })
    ));
    vi.stubGlobal('fetch', fetchMock);
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = vi.fn(() => 'blob:track');
    try {
      const loadTrack = createBlobTrackLoader();

      await expect(loadTrack('/song.mp3')).resolves.toBe('blob:track');
      await expect(loadTrack('/song.mp3')).resolves.toBe('blob:track');
      await expect(loadTrack('/broken.mp3')).resolves.toBe('/broken.mp3');
      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally {
      URL.createObjectURL = originalCreateObjectURL;
    }
  });
});
