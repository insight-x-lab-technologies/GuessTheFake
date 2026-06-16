import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, SETTINGS_KEY, SETTINGS_VERSION } from '../core/settings/settings';
import { writeVersioned } from '../core/storage/storage';
import { App } from './App';

describe('score recalibration flow', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
    writeVersioned(
      localStorage,
      SETTINGS_KEY,
      { ...DEFAULT_SETTINGS, shuffleRounds: false, speedBonusPoints: 0 },
      SETTINGS_VERSION
    );
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('requires confirmation and resets team scores from gameplay', async () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /nova partida|new match/i })[0]);
    fireEvent.change(screen.getByLabelText(/modo|mode/i), { target: { value: 'teams' } });
    fireEvent.click(screen.getByRole('button', { name: /começar|start/i }));
    fireEvent.click(screen.getByRole('button', { name: /iniciar turno|start turn/i }));
    fireEvent.click(screen.getByRole('button', { name: /mostrar frases|show statements/i }));
    fireEvent.click(await screen.findByRole('button', { name: /marco polo/i }));

    expect(await screen.findByText(/Time 1: 10 pts/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /recalibrar pontuação|recalibrate scores/i }));

    expect(screen.getByRole('group', { name: /zerar pontuação|reset scores/i })).toBeInTheDocument();
    expect(screen.getByText(/Time 1: 10 pts/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /zerar agora|reset now/i }));

    expect(await screen.findByText(/pontuação zerada|scores reset/i)).toBeInTheDocument();
    expect(screen.getByText(/Time 1: 0 pts/i)).toBeInTheDocument();
    expect(screen.getByText(/Time 2: 0 pts/i)).toBeInTheDocument();
  });
});
