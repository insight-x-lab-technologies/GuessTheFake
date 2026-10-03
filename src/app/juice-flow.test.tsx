import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, SETTINGS_KEY, SETTINGS_VERSION, type PlatformSettings } from '../core/settings/settings';
import { writeVersioned } from '../core/storage/storage';
import { App } from './App';

function saveSettings(overrides: Partial<PlatformSettings>) {
  writeVersioned(localStorage, SETTINGS_KEY, { ...DEFAULT_SETTINGS, shuffleRounds: false, ...overrides }, SETTINGS_VERSION);
}

async function startMatch(mode: string, players: string, rounds = '1') {
  fireEvent.click(screen.getAllByRole('button', { name: /nova partida|new match/i })[0]);
  await waitFor(() => expect(screen.getByRole('button', { name: /começar|start/i })).toBeEnabled());
  fireEvent.change(screen.getByLabelText(/modo|mode/i), { target: { value: mode } });
  fireEvent.change(screen.getByLabelText(/separe os nomes|separate names/i), { target: { value: players } });
  fireEvent.change(screen.getByRole('spinbutton'), { target: { value: rounds } });
  fireEvent.click(screen.getByRole('button', { name: /começar|start/i }));
}

describe('Onda 15 match flow', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('keeps round tools in a menu that closes on Escape', async () => {
    saveSettings({});
    render(<App />);
    await startMatch('classic', 'Ana, Bruno');
    fireEvent.click(screen.getByRole('button', { name: /iniciar turno|start turn/i }));
    fireEvent.click(screen.getByRole('button', { name: /mostrar frases|show statements/i }));

    expect(screen.getByRole('timer')).toHaveAccessibleName(/60s restantes|60s left/i);
    const trigger = screen.getByRole('button', { name: /mais ações da rodada|more round actions/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    const menu = screen.getByRole('menu');
    expect(within(menu).getAllByRole('menuitem')).toHaveLength(3);

    fireEvent.keyDown(menu, { key: 'Escape' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('hands the device over between all-guess players without showing the previous pick', async () => {
    saveSettings({ passDeviceEnabled: true });
    render(<App />);
    await startMatch('all-guess', 'Ana, Bruno');

    expect(screen.getByRole('heading', { name: /passe para ana|pass to ana/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /iniciar turno|start turn/i }));
    fireEvent.click(screen.getByRole('button', { name: /mostrar frases|show statements/i }));
    fireEvent.click(await screen.findByRole('button', { name: /frase 1|statement 1/i }));

    expect(screen.getByRole('heading', { name: /passe para bruno|pass to bruno/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /frase 1|statement 1/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /sou bruno|i'm bruno/i }));
    const first = await screen.findByRole('button', { name: /frase 1|statement 1/i });
    expect(first).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(first);

    expect(await screen.findByText(/ver resultado|see result/i)).toBeInTheDocument();
  });

  it('ends a table match on a podium with highlights and a rematch', async () => {
    saveSettings({});
    render(<App />);
    await startMatch('all-guess', 'Ana, Bruno, Caio');
    fireEvent.click(screen.getByRole('button', { name: /iniciar turno|start turn/i }));
    fireEvent.click(screen.getByRole('button', { name: /mostrar frases|show statements/i }));
    // Everyone picks statement 1; in the unshuffled pack it is true, so it fools the whole table.
    for (let pick = 0; pick < 3; pick += 1) {
      fireEvent.click(await screen.findByRole('button', { name: /frase 1|statement 1/i }));
    }
    expect(document.querySelector('svg text')?.textContent).toMatch(/fake|falso|faux/i);
    fireEvent.click(await screen.findByRole('button', { name: /ver resultado|see result/i }));

    const podium = await screen.findByRole('list', { name: /pódio da partida|match podium/i });
    expect(within(podium).getAllByRole('listitem')).toHaveLength(3);
    const highlights = screen.getByRole('list', { name: /destaques da partida|match highlights/i });
    expect(within(highlights).getByText(/melhor blefe|best bluff/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /revanche|rematch/i }));
    expect(await screen.findByRole('button', { name: /iniciar turno|start turn/i })).toBeInTheDocument();
    expect(screen.getAllByText(/rodada 1 de 1|round 1 of 1/i).length).toBeGreaterThan(0);
  });
});
