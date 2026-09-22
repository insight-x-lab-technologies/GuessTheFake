# Onda 9 - Design (2026-09-22)

Escopo aprovado: W9-02, W9-03 (curado parcial), W9-04, W9-05.

## Dados do builtin (W9-02 + W9-03)

- `src/game/data/builtin/catalog.ts`: estrutura neutra de idioma por rodada
  (`id`, `categoryId`, `difficulty`, `fakeIndex`, `ageRating`, `sources`,
  `review`) e categorias.
- `src/game/data/builtin/texts/<lang>.ts`: so texto,
  `roundId -> { statements: [5], explanation }`.
- `src/game/data/builtin/index.ts`: `createBuiltinPack(language, texts)` (sync,
  usado em testes) e `loadBuiltinPack(language)` (`import()` dinamico, um chunk
  por idioma, precache pelo PWA).
- Ids de rodada iguais em todos os idiomas. Template antigo removido.
- `?demo=game` inicia quando o pack do idioma carrega.

## Conteudo curado (W9-03)

- 7 categorias x 3 dificuldades x 4 rodadas = 84 rodadas, 6 idiomas.
- 4 verdades verificaveis, 1 falsa inequivoca, explicacao curta.
- Metadados editoriais nunca aparecem na partida. Conteudo escrito por IA
  entra como `review.status: 'draft'`; W9-03 fica `[/]` ate revisao humana.
- Checklist em `docs/CONTENT_GUIDE.md`.

## Auditoria (W9-04)

- `src/game/content-audit.ts` puro: cobertura por idioma/categoria/dificuldade,
  ids e frases duplicadas, explicacao vazia, texto faltando.
- `RELEASE_MIN_ROUNDS_PER_CELL = 4`; teste falha abaixo disso.
- `npm run audit:content` imprime a tabela.

## UI (W9-05 + estado vazio)

- Dicionarios reais `es/fr/de/it` para shell e jogo; teste de paridade de chaves.
- `usePacks` expoe carregamento do builtin; Setup mostra carregando e orientacao
  quando o idioma nao tem conteudo.
- Partida em andamento mantem o idioma em que foi sorteada.
