import { describe, expect, it } from 'vitest';
import {
  createMatchResultShareText,
  createPlatformShareUrl,
  createShareMessage,
  createShareUrl,
  isDonationUrlConfigured,
  type PlatformShareData
} from './share';

const shareData: PlatformShareData = {
  title: 'Guess the Fake',
  text: 'Play Guess the Fake with me!',
  url: 'https://example.test/play?join=GTF-ABC123'
};

describe('platform share helpers', () => {
  it('creates share urls while preserving useful query params and dropping hashes', () => {
    expect(createShareUrl('https://example.test/play?join=GTF-ABC123#card', 'https://fallback.test/')).toBe(
      'https://example.test/play?join=GTF-ABC123'
    );
  });

  it('uses the public fallback for localhost urls', () => {
    expect(createShareUrl('http://localhost:3000/?demo=game', 'https://public.example/guess-the-fake/')).toBe(
      'https://public.example/guess-the-fake/'
    );
  });

  it('builds social web intents for supported platforms', () => {
    expect(createPlatformShareUrl('whatsapp', shareData)).toContain('https://wa.me/?text=');
    expect(createPlatformShareUrl('facebook', shareData)).toBe(
      'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fexample.test%2Fplay%3Fjoin%3DGTF-ABC123'
    );
    expect(createPlatformShareUrl('x', shareData)).toContain('https://twitter.com/intent/tweet?');
    expect(createPlatformShareUrl('instagram', shareData)).toBe('');
  });

  it('creates copyable share messages and result text', () => {
    expect(createShareMessage(shareData)).toBe('Play Guess the Fake with me! https://example.test/play?join=GTF-ABC123');
    expect(createMatchResultShareText({
      winnerNames: ['Ana', 'Bruno'],
      modeLabel: 'Classic',
      totalRounds: 5,
      roundsLabel: 'rounds',
      gameTitle: 'Guess the Fake',
      callToAction: 'Come play too!'
    })).toBe('Guess the Fake: Ana, Bruno - Classic, 5 rounds. Come play too!');
  });

  it('detects configured donation links', () => {
    expect(isDonationUrlConfigured('https://ko-fi.com/insightxlabgamestudio')).toBe(true);
    expect(isDonationUrlConfigured('https://example.com/your-page')).toBe(false);
    expect(isDonationUrlConfigured('')).toBe(false);
  });
});
