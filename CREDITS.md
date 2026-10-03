# Credits

Origem e licenca de cada asset que vai para o bundle. Mantido junto com
W16-04 (trilhas por tema) e W16-01/02/03/06 (arte).

## Musica

Tres loops de 90 s (`src/assets/songs/`, 96 kbps, gerados por
`scripts/encode-music.sh` a partir dos mestres em `art-source/songs/`).
Entraram no repositorio em 2026-06-14 (commit `682a4ab`).

| Faixa | Arquivos | Origem | Licenca |
| --- | --- | --- | --- |
| Cosmic | `cosmic_gameroom.mp3`, `cosmic_gameplay.mp3` | a confirmar pelo mantenedor | a confirmar |
| Spring | `spring_gameroom.mp3`, `spring_gameplay.mp3` | a confirmar pelo mantenedor | a confirmar |
| Autumn | `autumn_gameroom.mp3`, `autumn_gameplay.mp3` | a confirmar pelo mantenedor | a confirmar |

> Pendente: registrar a ferramenta/autor de origem e a licenca de cada
> mestre. Faixa nova so entra com origem e licenca preenchidas aqui (musica
> gerada ja licenciada ou CC0), respeitando a meta de peso de W14-01.

### Mapeamento intencional tema -> trilha (W16-04)

Nao ha uma faixa por tema: cada tema toca um dos tres loops de proposito.
Fonte de verdade: `THEME_TRACK_MAP` em `src/core/audio/audio.ts` (teste em
`audio.test.ts` garante que todo tema esta mapeado).

| Tema | Trilha | Por que |
| --- | --- | --- |
| `cosmic` | Cosmic | tema padrao, faixa original |
| `liquid-glass` | Autumn | paleta quente e suave |
| `material3` | Spring | claro e pastel |
| `light-mode` | Spring | claro |
| `dark-mode` | Cosmic | escuro e calmo |
| `high-contrast` | Cosmic | escuro; sem distracao |
| `halloween` | Autumn | outono, abobora |
| `festive` | Cosmic | noite de inverno, luzes |

## Arte

Tudo abaixo foi desenhado para o projeto como SVG inline ou arquivo SVG, sem
uso de bibliotecas de terceiros alem dos icones `lucide-react` (licenca ISC).

- Mascote (`src/app/screens/Mascot.tsx`): derivado do rosto de `icon.svg`.
- Avatares (`src/app/screens/AvatarArt.tsx`) e `player-default.svg`.
- Arte de categoria (`src/app/screens/CategoryArt.tsx`): icones `lucide-react`
  sobre gradiente proprio.
- Medalhas (`src/app/screens/Medal.tsx`).
- Fundos sazonais `src/assets/background/{halloween,festive}_bg.svg`.
- Fundos webp dos temas: mestres em `art-source/background/` (origem a
  confirmar pelo mantenedor, junto com a musica).
