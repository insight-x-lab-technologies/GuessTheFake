# CLAUDE.md

Instrucoes para agentes que abrem uma nova sessao neste repositorio.
**Leia este arquivo antes de qualquer outra coisa.**

---

## 1. Entenda o escopo antes de codar

Ordem de leitura obrigatoria no inicio de cada sessao:

1. `CLAUDE.md` (este arquivo) - orientacao e estado real.
2. `README.md` - resumo curto do produto.
3. `docs/ROADMAP.md` - **fonte de verdade do que esta feito e do que falta**.
   Secao 1 (estado atual), secao 2 (estado por area), secao 3 (ondas W0-W13).
4. `docs/ARCHITECTURE.md` - fronteiras `app` / `core` / `game`, regras puras,
   chaves de storage.
5. `docs/FEATURE_IMPLEMENTATION_GUIDE.md` - contrato de entrega de feature.
6. `docs/FRONTEND_SYSTEM.md` - breakpoints, hierarquia de titulos, botoes.
7. Somente entao: os arquivos de `src` afetados pela tarefa.

Documentos de apoio, ler sob demanda:

- `docs/DEVICE_VALIDATION.md` - viewports usados na validacao responsiva.
- `docs/CONTENT_GUIDE.md` - onde fica o conteudo, checklist editorial, auditoria.
- `docs/superpowers/plans/` e `docs/superpowers/specs/` - planos pontuais.
- `docs/sample/` - screenshots mobile de referencia.

Trabalho de feature normalmente e referenciado por **ID de roadmap**
(`W7-02`, `W9-05`, `W13-01`). Procure o ID em `docs/ROADMAP.md`, leia o item
inteiro e o objetivo da onda antes de mexer em codigo.

---

## 2. O que o projeto e

PWA estatico, local-first, sem backend. **Um jogo unico e isolado**:
`Guess the Fake` - entre cinco afirmacoes, achar a falsa.

Nao e uma plataforma de varios jogos e nao deve virar uma. Nao existe registry,
seletor de jogo, nem um segundo jogo planejado. Qualquer abstracao nova precisa
se justificar por este jogo sozinho.

Stack real: Vite 7 + React 19 + TypeScript 5 + CSS Modules + tokens CSS,
Vitest 4 + jsdom + Testing Library, `vite-plugin-pwa`, `lucide-react`, `qrcode`.
Sem router, sem biblioteca de estado, sem ESLint/Prettier configurados.

Deploy: GitHub Pages via `.github/workflows/static.yml` no push para `main`
(`npm ci` -> `npm test` -> `npm run build` com `VITE_BASE_PATH`).

---

## 3. Estado real do codigo (2026-09-22)

Confira sempre contra o codigo; o resumo abaixo evita as armadilhas mais comuns.

- **`src/app/App.tsx` e so o shell** (~215 linhas): compoe os hooks, desenha
  navegacao/toast e escolhe a tela. Onda 6 concluida.
- **Estado e efeitos** vivem em hooks de `src/app/hooks/`: `useSettings`,
  `useAudio`, `useProgress` (leaderboard, trofeus, feedback), `usePacks`,
  `useLocalData` (import/export), `useMatchSetup` (formulario de Nova
  Partida), `useMatch` (partida, timers, persistencia, wake lock),
  `useMultiDevice` (BroadcastChannel/WebRTC/QR) e `useGrowth` (share/PWA).
  Nao ha Context, reducer, Redux ou Zustand; o shell passa o controller de
  cada hook por props.
- **Telas** em `src/app/screens/`: componentes visuais que recebem dados e
  callbacks por props, sem logica de dominio. Helpers de browser em
  `src/app/browser.ts` e `src/app/peer-connection.ts`; derivacoes puras da
  partida em `src/app/match-summary.ts`.
- **Navegacao**: uniao de tipos
  `'home' | 'play' | 'leaderboard' | 'achievements' | 'packs' | 'multiDevice' | 'growth' | 'settings'`
  com render condicional. Nao ha router. Deep-link de demo: `?demo=game`.
- **Identidade e modos** em `src/game/modes.ts`: `GAME_ID` e `GAME_MODES`
  (`classic`, `all-guess`, `teams`). Nao ha objeto de manifesto nem registry.
- **Regras puras** em `src/game/rules.ts` - sem React, DOM, storage, timer,
  audio ou rede. Mantenha assim.
- **i18n**: seis idiomas (`pt en es fr de it`) com UI traduzida de verdade.
  `pt`/`en` ficam em `src/app/translations.ts` e `src/game/translations.ts`;
  `es/fr/de/it` em `src/app/locales/` e `src/game/locales/`. Toda chave nova
  entra nos seis (`src/app/translations.test.ts` checa paridade).
- **Conteudo builtin e curado, carregado por idioma**: catalogo neutro em
  `src/game/data/builtin/catalog.ts` + `texts/<lang>.ts` via `import()`.
  315 rodadas (7 x 3 x 15, meta de W9-01), redigidas por IA e `draft` ate
  revisao humana (W9-03), registrada em `data/builtin/reviews.ts`. Checklist em `docs/CONTENT_GUIDE.md`;
  `npm run audit:content` mostra a cobertura; `npm run review:content` gera a
  folha de revisao em `content-review/<lang>.md`.
- **Multiplayer e serverless**: `BroadcastChannel` entre abas do mesmo device,
  WebRTC com troca **manual** de offer/answer por copiar-colar, e snapshot
  offline. Nao ha servidor de sinalizacao, sala ou lobby.
- **PWA**: configurado so em `vite.config.ts`. Nao ha `virtual:pwa-register`
  nem UX de atualizacao/offline no app.
- **Storage usa o scope `platform`** (`gtf.platform.settings.v3`, etc). E nome
  historico, mantido de proposito: renomear orfanaria dados locais reais. Leia
  como "do app inteiro".

---

## 4. Fronteiras de arquitetura

```txt
src/app     # boot, shell, telas, timers, efeitos colaterais, traducoes do shell
src/core    # modulos que nao sabem o que e uma rodada
src/game    # dominio: regras, modos, conteudo e traducoes do Guess the Fake
src/styles  # reset, tokens, base
```

O split `core` / `game` existe para manter a logica de rodada pura e barata de
testar, **nao** para suportar jogos futuros.

Regras nao negociaveis:

- `core` **nunca** importa de `game`.
- Regras de jogo permanecem funcoes puras e testaveis em `src/game/rules.ts`.
- Storage sempre por `core/storage` com chave versionada
  `gtf.<scope>.<name>.v<n>`.
- Nada de botao/setting decorativo: ou conecta comportamento real, ou fica
  `disabled` e marcado como "em breve".
- Todo texto visivel entra nos dicionarios de i18n.

---

## 5. Comandos

```bash
npm run dev      # vite --host 0.0.0.0
npm test         # vitest run (27 arquivos, 103 testes)
npm run audit:content  # cobertura do conteudo builtin
npm run review:content # folha de revisao humana (REVIEW_LANG, REVIEW_COMPARE)
npm run build    # tsc -b && vite build (typecheck + bundle)
npm run preview
```

Nao existe script de lint. Typecheck acontece dentro de `npm run build`.

Antes de considerar uma tarefa pronta: `npm test` e `npm run build` passando.
Para mudanca visual relevante, subir `npm run dev` e conferir os viewports de
`docs/DEVICE_VALIDATION.md` (desktop, mobile retrato, mobile paisagem,
e `?demo=game` quando o tabuleiro for afetado).

---

## 6. Ao terminar

- Atualize `docs/ROADMAP.md` quando o status de um item mudar, incluindo a
  linha "Ultima atualizacao de implementacao".
- Registre novo contrato, schema ou fluxo de teste no documento mais especifico.
- Nao marque um item como `[x]` sem comportamento conectado a UI e coberto por
  teste ou build. Use `[/]` quando so existir base tecnica.
