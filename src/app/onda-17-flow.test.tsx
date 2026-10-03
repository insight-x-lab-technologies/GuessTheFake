import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CONTENT_PACKS_KEY } from '../core/content-packs/content-packs';
import { DEFAULT_SETTINGS, SETTINGS_KEY, SETTINGS_VERSION, type PlatformSettings } from '../core/settings/settings';
import { writeVersioned } from '../core/storage/storage';
import { App } from './App';

function saveSettings(overrides: Partial<PlatformSettings> = {}) {
  writeVersioned(localStorage, SETTINGS_KEY, { ...DEFAULT_SETTINGS, language: 'en', shuffleRounds: false, ...overrides }, SETTINGS_VERSION);
}

async function openSetup(mode: string, players: string) {
  fireEvent.click(screen.getAllByRole('button', { name: /new match/i })[0]);
  await waitFor(() => expect(screen.getByRole('button', { name: /^start$/i })).toBeEnabled());
  fireEvent.change(screen.getByLabelText(/^mode$/i), { target: { value: mode } });
  fireEvent.change(screen.getByLabelText(/separate names/i), { target: { value: players } });
}

function writeRound(name: string) {
  fireEvent.click(screen.getByRole('button', { name: /write my statements/i }));
  expect(screen.getByRole('heading', { name: new RegExp(`${name}, write about yourself`, 'i') })).toBeInTheDocument();
  for (let index = 1; index <= 5; index += 1) {
    fireEvent.change(screen.getByLabelText(`Statement ${index}`), { target: { value: `${name} fact ${index}` } });
  }
  fireEvent.click(screen.getAllByLabelText(/^lie$/i)[2]);
  fireEvent.click(screen.getByRole('button', { name: /done, hide it/i }));
}

function showStatements() {
  fireEvent.click(screen.getByRole('button', { name: /start turn|ready, hide it/i }));
  fireEvent.click(screen.getByRole('button', { name: /show statements/i }));
}

describe('Onda 17 flows', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('plays an "about us" match written by the table and saves it as a pack', async () => {
    saveSettings();
    render(<App />);
    await openSetup('about-us', 'Ana, Bruno');
    expect(screen.getByText(/each player writes one round about themselves/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /write the rounds/i }));

    expect(screen.getByRole('heading', { name: /pass to ana/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /write my statements/i }));
    fireEvent.click(screen.getByRole('button', { name: /done, hide it/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/fill in all five/i);
    fireEvent.click(screen.getByRole('button', { name: /back to setup/i }));
    fireEvent.click(screen.getByRole('button', { name: /write the rounds/i }));

    writeRound('Ana');
    expect(screen.getByRole('heading', { name: /pass to bruno/i })).toBeInTheDocument();
    writeRound('Bruno');
    expect(screen.getByRole('heading', { name: /everyone has written/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^start$/i }));

    for (let round = 0; round < 2; round += 1) {
      const author = screen.getByRole('heading', { name: /'s round$/i }).textContent!.replace("'s round", '');
      showStatements();
      expect(screen.getByRole('note')).toHaveTextContent(new RegExp(`${author}'s statements`, 'i'));
      // The other player picks a statement that is not the lie (fact 1).
      const truth = screen.getAllByRole('button', { name: /statement \d/i })
        .find(button => button.textContent?.includes(`${author} fact 1`))!;
      fireEvent.click(truth);
      expect(await screen.findByText(new RegExp(`${author} fooled 1`, 'i'))).toBeInTheDocument();
      expect(screen.queryByRole('group', { name: /rate this round/i })).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /next round|see result/i }));
    }

    fireEvent.click(await screen.findByRole('button', { name: /save as local pack/i }));
    expect(screen.getByText(/pack saved/i)).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem(CONTENT_PACKS_KEY) ?? '{}');
    expect(stored.value.packs[0].content.rounds).toHaveLength(2);
  });

  it('lets the bluff master see the fake, then closes on a final defense', async () => {
    saveSettings();
    render(<App />);
    await openSetup('bluff-master', 'Ana, Bruno, Caio');
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /^start$/i }));

    expect(screen.getByRole('heading', { name: /only ana looks/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /show the fake/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/napoleon/i);
    showStatements();
    expect(screen.getByRole('timer')).toHaveAccessibleName(/120s left/i);

    fireEvent.click(await screen.findByRole('button', { name: /statement 1/i }));
    fireEvent.click(await screen.findByRole('button', { name: /statement 1/i }));
    const moment = screen.getByRole('region', { name: /table moment/i });
    expect(within(moment).getByRole('heading', { name: /final defense/i })).toBeInTheDocument();
    fireEvent.click(within(moment).getByRole('button', { name: /see result|reveal/i }));
    expect(await screen.findByText(/ana fooled 2/i)).toBeInTheDocument();
  });

  it('creates, validates and saves a pack in the editor', async () => {
    saveSettings();
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /^packs$/i })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: /create pack/i })[0]);

    fireEvent.click(screen.getByRole('button', { name: /save on this device/i }));
    expect(screen.getByText(/give the pack a title/i)).toBeInTheDocument();
    expect(screen.getByText(/round 1: mark which statement is fake/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/^title$/i), { target: { value: 'Grandma pack' } });
    for (let index = 1; index <= 5; index += 1) {
      fireEvent.change(screen.getByLabelText(`Statement ${index}`), { target: { value: `Grandma fact ${index}` } });
    }
    fireEvent.click(screen.getAllByLabelText(/^fake$/i)[3]);
    fireEvent.change(screen.getByLabelText(/explanation/i), { target: { value: 'Grandma never did that.' } });
    fireEvent.click(screen.getByRole('button', { name: /save on this device/i }));
    expect(screen.getByText(/pack saved and turned on/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /back to packs/i })[0]);
    expect(screen.getByRole('heading', { name: 'Grandma pack' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /continue draft/i })[0]).toBeInTheDocument();
  });

  it('draws only kids rounds with the Kids switch on, and remembers it', async () => {
    saveSettings();
    render(<App />);
    await openSetup('classic', 'Ana, Bruno');
    expect(await screen.findByText(/360 rounds available/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^food$/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('checkbox', { name: /kids \(ages 6-9\)/i }));
    expect(await screen.findByText(/105 rounds available/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^food$/i })).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}').value.kidsModeEnabled).toBe(true);
  });

  it('turns on a seasonal pack and adds its category to the setup', async () => {
    saveSettings();
    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: /^packs$/i })[0]);
    const card = screen.getByRole('heading', { name: /^halloween/i }).closest('article')!;
    fireEvent.click(within(card).getByRole('checkbox'));
    expect(await within(card).findByText(/30 rounds/i)).toBeInTheDocument();

    await openSetup('classic', 'Ana, Bruno');
    expect(await screen.findByRole('button', { name: /^halloween$/i })).toBeInTheDocument();
    expect(await screen.findByText(/390 rounds available/i)).toBeInTheDocument();
  });
});
