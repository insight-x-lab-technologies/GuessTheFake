import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';

describe('solo match flow', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('plays a one-player match to the final result screen', async () => {
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
});
