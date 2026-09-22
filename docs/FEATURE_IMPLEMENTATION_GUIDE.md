# Feature Implementation Guide

Este guia define como novas features devem ser planejadas, implementadas,
testadas e entregues no Guess the Fake. Use junto com `docs/ROADMAP.md`,
`docs/ARCHITECTURE.md` e `docs/FRONTEND_SYSTEM.md`.

---

## 1. Antes de implementar

Toda sessao de feature deve comecar lendo:

- `CLAUDE.md`
- `README.md`
- `docs/ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/FRONTEND_SYSTEM.md`
- arquivos diretamente afetados em `src/app`, `src/core` ou `src/game`

Depois disso, classifique a feature:

- **Gameplay:** regras, pontuacao, rodada, modos, times, streaks.
- **Conteudo:** packs, categorias, dificuldade, validacao, traducoes.
- **App:** storage, settings, leaderboard, achievements, themes, PWA.
- **UI/UX:** telas, fluxo, acessibilidade, responsividade, microinteracoes.
- **Integracao opcional:** audio, multi-device, import/export.

Defina tambem o limite arquitetural:

- `src/game` - regras de rodada, pontuacao, conteudo e copy do jogo.
- `src/core` - modulos que nao sabem o que e uma rodada: storage, i18n, temas,
  settings, audio, share, leaderboard, achievements, packs, multiplayer.
- `src/app` - orquestracao de tela, timers e efeitos colaterais.

Regra dura: `core` **nunca** importa de `game`.

---

## 2. Contrato de implementacao

Cada feature deve entregar, quando aplicavel:

1. **Modelo/tipos**
   - Atualizar tipos antes da UI.
   - Manter dados serializaveis quando forem persistidos.
   - Versionar storage ou schema se a mudanca quebrar dado antigo.

2. **Regras puras**
   - Regras de partida devem ser funcoes testaveis em `src/game/rules.ts`.
   - Evitar `Date.now`, `setTimeout`, DOM, localStorage, audio ou rede dentro
     das regras.
   - Passar valores externos por parametros.

3. **Persistencia**
   - Usar `core/storage` com chave versionada
     `gtf.<scope>.<name>.v<n>`.
   - Tratar dado ausente, invalido e versao antiga.
   - O scope `platform` e um nome historico mantido de proposito; renomear
     orfanaria os dados locais de quem ja joga. Leia como "do app inteiro".

4. **UI**
   - Usar componentes e tokens existentes.
   - Nao criar botoes sem `onClick` real, exceto se estiverem `disabled` e
     claramente marcados como "em breve".
   - Garantir estado vazio, erro, carregando e sucesso quando a feature tiver
     fluxo assincrono ou importacao de arquivo.
   - Preservar responsividade documentada em `FRONTEND_SYSTEM.md`.

5. **i18n**
   - Todo texto visivel deve entrar nas traducoes dos seis idiomas: `pt`/`en`
     em `src/app/translations.ts` (shell) e `src/game/translations.ts` (jogo);
     `es/fr/de/it` em `src/app/locales/` e `src/game/locales/`. O teste de
     paridade falha se faltar chave.
   - Se conteudo de jogo nao existir em um idioma, filtrar ou indicar
     claramente o idioma do pack.

6. **Documentacao**
   - Atualizar `docs/ROADMAP.md` quando uma feature muda o status de um item,
     incluindo a linha "Ultima atualizacao de implementacao".
   - Criar nota curta no documento mais especifico quando houver novo contrato,
     schema ou fluxo de teste.

---

## 3. Estrategia de testes

### Testes unitarios obrigatorios

Adicione ou atualize testes quando a feature tocar:

- regras de jogo;
- validacao de conteudo;
- storage;
- leaderboard;
- achievements;
- settings;
- funcoes de ordenacao, filtro ou sorteio.

Casos minimos:

- caminho feliz;
- entrada invalida;
- limite inferior e superior;
- regressao especifica do bug/risco que motivou a feature;
- comportamento com dado vazio.

### Testes de UI recomendados

Para features que mudam fluxo de tela:

- testar renderizacao do estado principal;
- testar uma interacao critica com Testing Library quando viavel;
- rodar `npm run build`;
- fazer smoke manual ou headless nos viewports de
  `docs/DEVICE_VALIDATION.md` quando a mudanca for visual relevante.

### Comandos padrao

```bash
npm test        # vitest run (27 arquivos, 103 testes hoje)
npm run build   # tsc -b && vite build (typecheck + bundle)
```

Nao existe script de lint. O typecheck acontece dentro de `npm run build`.

Para mudancas visuais, tambem usar o servidor local:

```bash
npm run dev
```

Validar pelo menos:

- desktop;
- mobile retrato;
- mobile paisagem;
- `?demo=game` quando a feature afeta o tabuleiro.

---

## 4. Checklist de conclusao

Antes de considerar uma feature pronta:

- [ ] O comportamento esta conectado a UI real, sem controles decorativos.
- [ ] Regras novas ou alteradas tem testes unitarios.
- [ ] Storage/schema tem fallback para dados invalidos quando aplicavel.
- [ ] Textos visiveis estao em i18n.
- [ ] `npm test` e `npm run build` passam.
- [ ] A UI nao quebra em mobile retrato/paisagem.
- [ ] O roadmap foi atualizado se o status mudou.
- [ ] Nenhum import novo de `core` para `game`.

---

## 5. Prompt para sessoes isoladas

Use este prompt em novas sessoes para pedir o desenvolvimento de uma feature
sem perder o contexto do projeto:

```text
Voce esta trabalhando no projeto GuessTheFake, um PWA local-first em Vite,
React e TypeScript. E um jogo unico e isolado: entre cinco afirmacoes, achar a
falsa. Nao e uma plataforma de varios jogos e nao deve virar uma. Antes de
implementar qualquer coisa, leia CLAUDE.md, README.md e os documentos em docs,
principalmente ROADMAP.md, ARCHITECTURE.md, FRONTEND_SYSTEM.md e
FEATURE_IMPLEMENTATION_GUIDE.md. Depois leia os arquivos relevantes em src.

Contexto essencial:
- src/game tem regras puras, conteudo e traducoes do jogo.
- src/core tem modulos que nao sabem o que e uma rodada (storage, i18n, temas,
  settings, audio, share, leaderboard, achievements, packs, multiplayer).
- src/app orquestra telas, timers e efeitos colaterais.
- core nunca importa de game.
- Regras de jogo devem ser puras e testaveis.
- O app deve continuar sendo PWA estatico, local-first e sem backend.
- src/app/App.tsx e so o shell. Estado e efeitos ficam em hooks de
  src/app/hooks/ e cada tela e um componente visual em src/app/screens/ que
  recebe dados e callbacks por props. Nao coloque logica de dominio nas telas.
- A UI esta traduzida nos seis idiomas; chave nova entra em todos.
- Nao deixe botoes ou settings decorativos: conecte a funcionalidade real ou
  marque explicitamente como "em breve" e desabilite.

Feature solicitada:
[DESCREVA A FEATURE AQUI]

Requisitos de entrega:
1. Explique rapidamente onde a feature entra na arquitetura.
2. Implemente a feature seguindo os padroes existentes.
3. Adicione ou atualize testes unitarios para regras, storage, validacao ou
   helpers afetados.
4. Atualize docs/ROADMAP.md se a feature mudar o status de algum item.
5. Rode npm test e npm run build, ou explique claramente por que nao foi
   possivel.
6. No final, resuma arquivos alterados, comportamento entregue e testes
   executados.
```
