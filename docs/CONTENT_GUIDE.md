# Guia de conteudo

Como escrever, revisar e auditar rodadas do pack builtin. Complementa ROADMAP
W9-01 a W9-04.

## Onde fica

- `src/game/data/builtin/catalog.ts`: estrutura neutra de idioma. Categorias,
  posicao da falsa (`fakeIndexes`), `ageRating`, `sources` e `review` de cada
  rodada. Ids seguem `<categoria>-<dificuldade>-<nn>`.
- `src/game/data/builtin/texts/<lang>.ts`: so texto, `roundId -> { statements:
  [5], explanation }`. Um arquivo por idioma, carregado sob demanda.
- A frase falsa e a de indice `fakeIndex` (0-4) no array `statements`.

Para adicionar uma rodada: acrescente a posicao da falsa em `fakeIndexes` e o
texto com o mesmo id nos seis arquivos de `texts/`. Rodada sem texto num idioma
simplesmente nao aparece nele.

## Checklist por rodada

1. As quatro verdadeiras sao fatos verificaveis numa fonte de referencia
   (enciclopedia, agencia cientifica, orgao oficial).
2. A falsa e inequivocamente falsa, sem "depende" nem disputa academica. Mitos
   populares e erros comuns funcionam melhor que absurdos.
3. Nenhuma verdadeira contradiz ou entrega a falsa na mesma rodada.
4. A explicacao diz em uma frase curta por que a falsa e falsa.
5. Linguagem familiar, sem violencia grafica, politica partidaria, religiao,
   doencas graves ou temas que envergonhem alguem na mesa.
6. Datas, recordes e contagens nao dependem de eventos futuros (evite "o time
   com mais titulos" quando isso pode mudar).
7. A traducao preserva o fato; nomes proprios usam a forma local (Keops,
   Cheops, Khufu).
8. `ageRating: '10+'` quando exigir contexto escolar mais avancado.

## Revisao humana

```bash
npm run review:content                      # content-review/pt.md, comparado com en
REVIEW_LANG=de REVIEW_COMPARE=en npm run review:content
REVIEW_ALL=1 npm run review:content         # inclui rodadas ja revisadas
```

A folha (ignorada pelo git) lista cada rodada `draft` com a falsa marcada,
o texto no idioma de comparacao, a explicacao e uma linha "Registro". Quando a
rodada passar no checklist em todos os idiomas, cole essa linha em
`src/game/data/builtin/reviews.ts`; use `notes` para idiomas conferidos ou uma
fonte especifica. `content-review.test.ts` falha se o log tiver id
desconhecido, status diferente de `reviewed` ou data fora de `AAAA-MM-DD`.
`npm run audit:content` mostra quantas estao revisadas por celula.

Rodadas que exigem contexto escolar avancado entram em `tenPlusRounds` em
`catalog.ts`.

## Auditoria

```bash
npm run audit:content   # tabela de cobertura + problemas
```

`src/game/content-audit.test.ts` roda dentro de `npm test` e falha quando:

- algum idioma publicado tem menos de `RELEASE_MIN_ROUNDS_PER_CELL` rodadas numa
  combinacao categoria/dificuldade;
- ha id de rodada ou de frase duplicado, frase repetida (normalizada), texto
  faltando, explicacao vazia ou falsa invalida.

## Estado (2026-09-22)

315 rodadas (15 por categoria/dificuldade, meta de W9-01), redigidas e
autoconferidas por IA, todas `draft`. Tres rodadas `10+`
(`science-hard-05`, `-07`, `-13`).
