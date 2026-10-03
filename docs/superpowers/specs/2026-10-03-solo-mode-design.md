# Modo Solo - Design (2026-10-03)

Escopo aprovado: modo Single Player como **desafio pessoal** (rodadas fixas +
recorde), e contrato de harmonia que todo item da Onda 13 deve seguir.

## Contexto

Antes deste design, jogar sozinho era o modo `classic` com um nome so. A
avaliacao de 2026-10-03 encontrou:

- tela final em branco em todos os modos (`round` nulo em `finished`) -
  corrigido junto com este design, teste em `src/app/solo-match.test.tsx`;
- solo escondido: sem card de modo, campo de nomes padrao `Ana, Bruno`,
  resumo "1 jogadores";
- cerimonia de passar o aparelho ("Vez de", "Iniciar turno", preparacao) sem
  sentido para uma pessoa;
- final com trofeu e "vencedor" mesmo com 0 pts, sem acertos nem recorde;
- leaderboard conta toda partida solo como vitoria (100% de aproveitamento);
- textos de mesa no resultado ("Palpites da mesa", "Recalibrar pontuacao").

## Decisoes

- Solo e um modo proprio (`modeId: 'solo'`), nao deteccao de 1 jogador.
- Formato: rodadas fixas, como hoje. Sobrevivencia/morte subita chegam pelo
  W13-02 para solo e grupo ao mesmo tempo.
- Recorde guardado por nome normalizado do jogador, para o W13-03 migrar para
  id de perfil.

## 1. Regras (`src/game`)

- `GameMode` ganha `solo: boolean`. `GAME_MODES` recebe, em primeiro lugar,
  `{ id: 'solo', minPlayers: 1, maxPlayers: 1, solo: true }`; os demais
  `solo: false`. Telas e regras perguntam `isSoloMode(modeId)` (helper em
  `modes.ts`), nunca `players.length`.
- `GuessTheFakeModeId` inclui `'solo'`.
- `startMatch` com `solo`: usa so o primeiro nome. Turno igual ao `classic`.
- `getWinners` retorna `[]` no solo.
- `GuessTheFakeState` ganha `challenge: { categoryId: string; difficulty:
  GuessTheFakeDifficulty | 'all' }`, preenchido por `startMatch` (default
  `all`/`all`). `match-storage` aceita estado salvo sem o campo (default) para
  partidas em andamento de versoes anteriores.
- Novo `src/game/solo-records.ts` (puro + storage por `core/storage`):
  - `getSoloChallengeKey({ totalRounds, categoryId, difficulty })` ->
    `"<rodadas>|<categoria>|<dificuldade>"`. Itens futuros da Onda 13 que
    mudam o desafio (rodadas especiais, pack tematico) acrescentam segmentos.
  - `SoloResult = { points, correct, totalRounds, bestStreak, achievedAt }`.
  - `getSoloResult(state)` deriva o resultado do estado `finished`.
  - `isNewSoloRecord(previous, next)`: mais pontos vence; empate em pontos
    vence quem tem mais acertos; empate total nao e recorde.
  - `SoloRecordsModel = { records: Record<playerKey, Record<challengeKey,
    SoloResult>> }`, `playerKey` = nome `trim().toLocaleLowerCase()`.
  - `recordSoloResult(model, playerName, challengeKey, result)` -> `{ model,
    previous, isNewRecord }`.
  - Chave `gtf.game.guess-the-fake.solo-records.v1` (mesmo scope de
    `match-storage`, porque o recorde depende de dificuldade/categoria, que sao
    dominio). Load com fallback para dado ausente, invalido e versao errada.

## 2. Fluxo da partida no solo (`src/app/hooks/useMatch.ts`)

- "Comecar" e "Proxima rodada" levam direto a `playing` (`beginPlaying` a
  partir de `intro`), sem preparacao nem "Iniciar turno". Timer de rodada e
  bonus de velocidade continuam.
- Ao finalizar: grava o recorde, guarda `{ previous, isNewRecord }` para a tela
  final, toca `match-finished` (ou som de vitoria em recorde novo).
- `recordMatchFinished` nao grava partida solo no leaderboard de vitorias.
  Contadores de trofeu por modo continuam (o modo `solo` entra sozinho).

## 3. Interface

- **Home:** botao novo "Jogar sozinho" abre o setup com `solo` selecionado.
- **Setup:** card Solo primeiro ("Bata seu recorde"). Com Solo selecionado:
  campo de um nome so, preenchido com o ultimo nome solo (setting novo
  `lastSoloPlayerName`); resumo "Voce - N rodadas"; linha "Seu recorde neste
  desafio: X pts (Y/N)" ou "Primeira vez neste desafio", recalculada ao trocar
  rodadas/categoria/dificuldade.
- **Tabuleiro:** cabecalho "Rodada X de N" + pontos, acertos e sequencia atual;
  sem "Vez de" e sem "Recalibrar pontuacao". Resultado da rodada usa "Seu
  palpite".
- **Final:** `SoloResultPanel` separado de `FinalResultPanel`: pontos, acertos
  X/N, maior sequencia; selo "Novo recorde!" ou "Recorde: Y pts" com a
  diferenca. Acoes: "Jogar de novo" (mesmo desafio), "Compartilhar", "Novo
  desafio" (setup).
- **Compartilhar:** texto solo, ex. "Fiz 42 pts e acertei 4/5 no Guess the
  Fake (Ciencia, dificil)".
- **Leaderboard:** secao "Recordes solo" (jogador, desafio, pontos, acertos,
  data) com limpar. Recordes entram no import/export de `useLocalData`.
- **i18n:** toda chave nova nos seis idiomas.

## 4. Contrato de harmonia com a Onda 13

Todo item W13 declara seu comportamento solo: **igual**, **variante** ou
**some** (oculto, nao desabilitado). Decisao sempre via `isSoloMode`.

| Item | Solo |
|---|---|
| W13-01 Momentos de mesa | Some (setting oculto no setup solo). |
| W13-02 Rodadas especiais | Igual; regras puras sobre o sujeito ativo. Ativar especiais muda a chave do desafio. |
| W13-03 Perfis familiares | Variante: solo escolhe perfil; recordes migram de nome para id de perfil; perfil mostra recordes solo e estatisticas de mesa. |
| W13-04 Narrativa de progresso | Variante: "proximo objetivo" no final solo; trilhas contam solo e mesa, separando conquistas so de mesa. |
| W13-05 Balanceamento dinamico | Igual; no solo sugere o proximo desafio perto do recorde. |
| W13-06 Modo apresentador | Some (sem atalho no solo). |
| W13-07 Packs tematicos | Igual; pack ativo entra na chave do desafio. |

Registro: `docs/ARCHITECTURE.md` (regra `isSoloMode`) e uma linha "Solo:" em
cada item W13 de `docs/ROADMAP.md`.

## 5. Testes

- `rules.test.ts`: `startMatch` solo (um jogador, `challenge` preenchido),
  `getWinners` vazio no solo.
- `solo-records.test.ts`: chave, `getSoloResult`, desempate, `recordSoloResult`,
  storage com dado ausente/invalido/versao errada.
- `match-storage.test.ts`: estado salvo sem `challenge` restaura com default.
- App: partida solo completa com "Novo recorde!"; segunda partida pior mostra
  "Recorde: Y"; leaderboard sem vitoria solo; Home "Jogar sozinho" abre setup
  solo.
- Paridade de i18n e smoke por viewport cobrindo setup solo e final solo.
- Validacao manual: viewports de `docs/DEVICE_VALIDATION.md`.

## Fora de escopo

- Sobrevivencia/morte subita (W13-02), perfis (W13-03), desafio diario.
