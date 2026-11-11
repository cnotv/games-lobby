# cnotv games

Multiplayer browser games at [games.cnotv.xyz](https://games.cnotv.xyz): a lobby with chat,
presence and rooms, and ten games played peer to peer with no sign-up and no game server:
Pictionary, Wordle, Squares, Minigolf, Bubbles, Rhythm, Marbles, Marble Builder, Rock Runner
and Word Runner. Built with Vue 3, Three.js and the
[`@webgamekit`](https://www.npmjs.com/org/webgamekit) packages.

[![Performance](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/cnotv/games-lobby/badges/badges/lighthouse-performance.json)](https://games.cnotv.xyz/)
[![Accessibility](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/cnotv/games-lobby/badges/badges/lighthouse-accessibility.json)](https://games.cnotv.xyz/)
[![SEO](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/cnotv/games-lobby/badges/badges/lighthouse-seo.json)](https://games.cnotv.xyz/)

## Related sites

| Site                                           | Repository                                                                |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| [cnotv.xyz](https://cnotv.xyz)                 | [cnotv/cnotv-portfolio](https://github.com/cnotv/cnotv-portfolio)         |
| [strudel.cnotv.xyz](https://strudel.cnotv.xyz) | [cnotv/strudel-node-editor](https://github.com/cnotv/strudel-node-editor) |
| [lab.cnotv.xyz](https://lab.cnotv.xyz)         | [cnotv/generative-art](https://github.com/cnotv/generative-art)           |

## Run it

```bash
pnpm install
```

```bash
pnpm dev --port 5317 --strictPort
```

Checks: `pnpm lint`, `pnpm lint:css`, `pnpm test:unit`, `pnpm build`. The games' journey docs
and the multiplayer guides live in generative-art's
[documentation](https://cnotv.github.io/generative-art/docs/docs/guides/adding-game-to-lobby).
