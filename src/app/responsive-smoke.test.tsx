import { fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';

const viewports = [
  ['desktop', 1440, 900],
  ['ipad portrait', 820, 1180],
  ['ipad landscape', 1180, 820],
  ['phone portrait', 402, 874],
  ['phone landscape', 874, 402]
] as const;

function setViewport(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
  window.dispatchEvent(new Event('resize'));
}

describe('responsive app smoke', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it.each(viewports)('renders and navigates core screens at %s', async (_name, width, height) => {
    setViewport(width, height);
    render(<App />);

    expect(screen.getByRole('heading', { name: /guess the fake/i })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /nova partida|new match/i })[0]);
    expect(await screen.findByRole('heading', { name: /preparar partida|prepare match/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/opções da partida|match options/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /leaderboard/i }));
    expect(screen.getByRole('heading', { name: /leaderboard/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /packs/i }));
    expect(screen.getByRole('heading', { name: /conteúdo e packs|content and packs/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /multi-device/i }));
    expect(screen.getByRole('heading', { name: /multi-device/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /configurações|settings/i }));
    expect(screen.getByRole('heading', { name: /configurações|settings/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/tamanho do texto|text size/i)).toBeInTheDocument();
    const highContrastPreview = screen.getByRole('button', { name: /aplicar tema alto contraste|apply high contrast theme/i });
    fireEvent.click(highContrastPreview);
    expect(document.documentElement.dataset.theme).toBe('high-contrast');
    expect(highContrastPreview).toHaveAttribute('aria-pressed', 'true');
  });

  it('smokes setup, card click, feedback, recalibration, and leaderboard navigation', async () => {
    setViewport(1440, 900);
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /nova partida|new match/i })[0]);
    await waitFor(() => expect(screen.getByRole('button', { name: /começar|start/i })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /começar|start/i }));
    fireEvent.click(screen.getByRole('button', { name: /iniciar turno|start turn/i }));
    fireEvent.click(screen.getByRole('button', { name: /mostrar frases|show statements/i }));

    const firstStatement = await screen.findByRole('button', { name: /1/i });
    fireEvent.click(firstStatement);

    expect(await screen.findByText(/acertou|não foi dessa vez|correct|not this time/i)).toBeInTheDocument();

    const feedbackGroup = screen.getByLabelText(/feedback da rodada|round feedback/i);
    fireEvent.click(within(feedbackGroup).getByRole('button', { name: /boa|good/i }));
    expect(within(feedbackGroup).getByRole('button', { name: /boa|good/i })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: /recalibrar pontuação|recalibrate scores/i }));
    fireEvent.click(screen.getByRole('button', { name: /zerar agora|reset now/i }));
    expect(screen.getByText(/pontuação zerada|scores reset/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /leaderboard/i }));
    expect(screen.getByRole('heading', { name: /leaderboard/i })).toBeInTheDocument();
  });

  it('keeps utility data actions inside compact mobile disclosures', () => {
    setViewport(402, 874);
    const { container } = render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /leaderboard/i }));
    const leaderboardDisclosure = container.querySelector('[data-mobile-actions="leaderboard"]');
    expect(leaderboardDisclosure).toBeInstanceOf(HTMLDetailsElement);
    expect(leaderboardDisclosure).not.toHaveAttribute('open');
    expect(within(leaderboardDisclosure as HTMLElement).getByText(/ações|actions/i)).toBeInTheDocument();
    expect(within(leaderboardDisclosure as HTMLElement).getByRole('button', { name: /exportar ranking|export ranking/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /packs/i }));
    const packsDisclosure = container.querySelector('[data-mobile-actions="packs"]');
    expect(packsDisclosure).toBeInstanceOf(HTMLDetailsElement);
    expect(packsDisclosure).not.toHaveAttribute('open');
    expect(within(packsDisclosure as HTMLElement).getByRole('button', { name: /importar pack|import pack/i })).toBeInTheDocument();
  });

  it('marks only the selected New Game mode with a persistent indicator', () => {
    setViewport(402, 874);
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /nova partida|new match/i })[0]);
    const selectedMode = screen.getByRole('button', { name: /clássico|classic/i });
    const otherMode = screen.getByRole('button', { name: /todos palpitam|everyone guesses/i });

    expect(selectedMode).toHaveAttribute('aria-pressed', 'true');
    expect(within(selectedMode).getByText(/selecionado|selected/i)).toBeInTheDocument();
    expect(within(otherMode).queryByText(/selecionado|selected/i)).not.toBeInTheDocument();
  });
});
