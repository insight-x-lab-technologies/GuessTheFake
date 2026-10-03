import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';

async function openSoloSetup() {
  fireEvent.click(screen.getByRole('button', { name: /jogar sozinho|play solo/i }));
  await waitFor(() => expect(screen.getByRole('button', { name: /começar|start/i })).toBeEnabled());
  expect(screen.getByRole('button', { name: /^solo/i })).toHaveAttribute('aria-pressed', 'true');
}

async function playOneSoloRound(name: string) {
  fireEvent.change(screen.getByLabelText(/seu nome|your name/i), { target: { value: name } });
  fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '1' } });
  fireEvent.click(screen.getByRole('button', { name: /começar|start/i }));
  // Solo goes straight to the statements: no "Start turn".
  expect(screen.queryByRole('button', { name: /iniciar turno|start turn/i })).not.toBeInTheDocument();
  fireEvent.click(await screen.findByRole('button', { name: /frase 1|statement 1/i }));
  fireEvent.click(await screen.findByRole('button', { name: /ver resultado|see result/i }));
}

describe('solo match flow', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('plays a one-player classic match to the final result screen', async () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /nova partida|new match/i })[0]);
    await waitFor(() => expect(screen.getByRole('button', { name: /começar|start/i })).toBeEnabled());
    fireEvent.change(screen.getByDisplayValue('Ana, Bruno'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /começar|start/i }));
    fireEvent.click(screen.getByRole('button', { name: /iniciar turno|start turn/i }));
    fireEvent.click(screen.getByRole('button', { name: /mostrar frases|show statements/i }));
    fireEvent.click(await screen.findByRole('button', { name: /1/ }));
    fireEvent.click(await screen.findByRole('button', { name: /ver resultado|see result/i }));

    expect(await screen.findByRole('heading', { name: 'Ana' })).toBeInTheDocument();
  });

  it('opens the solo setup from Home, sets a record, and keeps it off the wins leaderboard', async () => {
    render(<App />);
    await openSoloSetup();
    expect(screen.getByText(/primeira vez neste desafio|first time in this challenge/i)).toBeInTheDocument();

    await playOneSoloRound('Ana');

    expect(await screen.findByText(/novo recorde|new record/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /recalibrar pontuação|recalibrate scores/i })).not.toBeInTheDocument();
    expect(screen.getByText(/próximo objetivo|next objective/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /jogar de novo|play again/i }));
    fireEvent.click(await screen.findByRole('button', { name: /frase 1|statement 1/i }));
    fireEvent.click(await screen.findByRole('button', { name: /ver resultado|see result/i }));
    expect(await screen.findByRole('heading', { name: /pts/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /leaderboard|ranking/i }));
    const records = screen.getByRole('region', { name: /recordes solo|solo records/i });
    expect(within(records).getByText('ana')).toBeInTheDocument();
    expect(screen.getByText(/resultados aparecerão aqui|results will appear here/i)).toBeInTheDocument();
  });

  it('creates a family profile and offers it in the setup', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /família|family/i }));
    fireEvent.change(screen.getByLabelText(/^nome$|^name$/i), { target: { value: 'Duda' } });
    fireEvent.click(screen.getByRole('button', { name: /avatar 🦉/i }));
    fireEvent.click(screen.getByRole('button', { name: /criar perfil|create profile/i }));

    expect(await screen.findByRole('heading', { name: 'Duda' })).toBeInTheDocument();
    expect(screen.getByText(/troféus pessoais: 0\/7|personal trophies: 0\/7/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /nova partida|new match/i })[0]);
    const chips = await screen.findByLabelText(/perfis da família|family profiles/i);
    fireEvent.click(within(chips).getByRole('button', { name: /duda/i }));
    expect(screen.getByDisplayValue('Ana, Bruno, Duda')).toBeInTheDocument();
  });

  it('opens and closes the presenter view during a table match', async () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /nova partida|new match/i })[0]);
    await waitFor(() => expect(screen.getByRole('button', { name: /começar|start/i })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /começar|start/i }));
    fireEvent.click(screen.getByRole('button', { name: /iniciar turno|start turn/i }));
    fireEvent.click(screen.getByRole('button', { name: /mostrar frases|show statements/i }));

    fireEvent.click(screen.getByRole('button', { name: /^modo apresentador$|^presenter mode$/i }));
    const presenter = screen.getByRole('dialog', { name: /modo apresentador|presenter mode/i });
    expect(within(presenter).getAllByRole('listitem').length).toBeGreaterThanOrEqual(5);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
