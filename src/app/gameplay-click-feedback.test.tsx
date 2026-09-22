import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { App } from './App';

describe('gameplay click feedback flow', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('supports mouse clicks from statement choice through feedback and next round', async () => {
    render(<App />);

    fireEvent.click(screen.getAllByRole('button', { name: /nova partida|new match/i })[0]);
    await waitFor(() => expect(screen.getByRole('button', { name: /começar|start/i })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: /começar|start/i }));
    fireEvent.click(screen.getByRole('button', { name: /iniciar turno|start turn/i }));
    fireEvent.click(screen.getByRole('button', { name: /mostrar frases|show statements/i }));

    const statementGrid = await screen.findByRole('button', { name: /1/i });
    fireEvent.click(statementGrid);

    expect(await screen.findByText(/acertou|não foi dessa vez|correct|not this time/i)).toBeInTheDocument();
    expect(statementGrid).toHaveAttribute('aria-disabled', 'true');

    const feedbackGroup = screen.getByLabelText(/feedback da rodada|round feedback/i);
    const resultPanel = feedbackGroup.closest('[data-layout="mobile-stack"]');
    expect(resultPanel).toBeInTheDocument();
    const goodFeedback = within(feedbackGroup).getByRole('button', { name: /boa|good/i });
    fireEvent.click(goodFeedback);

    await waitFor(() => expect(goodFeedback).toHaveAttribute('aria-pressed', 'true'));

    fireEvent.click(screen.getByRole('button', { name: /próxima rodada|next round/i }));

    expect(await screen.findByRole('button', { name: /iniciar turno|start turn/i })).toBeInTheDocument();
  });
});
