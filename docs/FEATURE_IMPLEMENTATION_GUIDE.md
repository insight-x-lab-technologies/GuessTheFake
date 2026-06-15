# Feature Implementation Guide

Este guia define como novas features devem ser planejadas, implementadas,
testadas e entregues no Guess the Fake. Use junto com `docs/ROADMAP.md`,
`docs/ARCHITECTURE.md` e `docs/FRONTEND_SYSTEM.md`.

---

## 1. Antes de implementar

Toda sessao de feature deve comecar lendo:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/FRONTEND_SYSTEM.md`
- arquivos diretamente afetados em `src/app`, `src/core` ou
  `src/games/guess-the-fake`

Depois disso, classifique a feature:

- **Gameplay:** regras, pontuacao, rodada, modos, times, streaks.
- **Conteudo:** packs, categorias, dificuldade, validacao, traducoes.
- **Plataforma:** storage, settings, leaderboard, achievements, themes, PWA.
- **UI/UX:** telas, fluxo, acessibilidade, responsividade, microinteracoes.
- **Integracao opcional:** audio, multi-device, import/export.

Defina tambem o limite arquitetural:

- Codigo reutilizavel por varios jogos pertence a `src/core`.
- Codigo especifico do Guess the Fake pertence a
  `src/games/guess-the-fake`.
- Orquestracao de tela pode ficar em `src/app`, mas regras de jogo nao devem
  depender da UI.

---

## 2. Contrato de implementacao

Cada feature deve entregar, quando aplicavel:

1. **Modelo/tipos**
   - Atualizar tipos antes da UI.
   - Manter dados serializaveis quando forem persistidos.
   - Versionar storage ou schema se a mudanca quebrar dado antigo.

2. **Regras puras**
   - Regras de partida devem ser funcoes testaveis.
   - Evitar `Date.now`, `setTimeout`, DOM, localStorage, audio ou rede dentro
     das regras.
   - Passar valores externos por parametros.

3. **Persistencia**
   - Usar `core/storage` com chave versionada.
   - Tratar dado ausente, invalido e versao antiga.
   - Nao reutilizar nomes antigos do prototipo como `npr_`, `joke`, `word`,
     `mime` ou `drawing` fora de adaptadores explicitos.

4. **UI**
   - Usar componentes e tokens existentes.
   - Nao criar botoes sem `onClick` real, exceto se estiverem `disabled` e
     claramente marcados como "em breve".
   - Garantir estado vazio, erro, carregando e sucesso quando a feature tiver
     fluxo assincrono ou importacao de arquivo.
   - Preservar responsividade documentada em `FRONTEND_SYSTEM.md`.

5. **i18n**
   - Todo texto visivel deve entrar nas traducoes.
   - Se conteudo de jogo nao existir em um idioma, filtrar ou indicar
     claramente o idioma do pack.

6. **Documentacao**
   - Atualizar `docs/ROADMAP.md` quando uma feature muda o status de uma onda.
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
npm test
npm run build
```

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
- [ ] Build passa.
- [ ] A UI nao quebra em mobile retrato/paisagem.
- [ ] O roadmap foi atualizado se o status mudou.
- [ ] Nenhum codigo novo acopla `core` a `guess-the-fake`.

---

## 5. Prompt para sessoes isoladas

Use este prompt em novas sessoes para pedir o desenvolvimento de uma feature
sem perder o contexto do projeto:

```text
Voce esta trabalhando no projeto GuessTheFake, um PWA local-first em Vite,
React e TypeScript para criar uma plataforma de party/family games. Antes de
implementar qualquer coisa, leia README.md e os documentos em docs,
principalmente ARCHITECTURE.md, ROADMAP.md, FRONTEND_SYSTEM.md e
FEATURE_IMPLEMENTATION_GUIDE.md. Depois leia os arquivos relevantes em src.

Contexto essencial:
- A base antiga esta em ref_src_old apenas como referencia de produto e ideias.
- O codigo ativo fica em src.
- Codigo reutilizavel de plataforma pertence a src/core.
- Codigo especifico do jogo Guess the Fake pertence a src/games/guess-the-fake.
- Regras de jogo devem ser puras e testaveis.
- O app deve continuar sendo PWA estatico, local-first e sem backend por padrao.
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
