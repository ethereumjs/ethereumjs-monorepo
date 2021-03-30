<p align="center">
  <img src="https://user-images.githubusercontent.com/47108/78779352-d0839500-796a-11ea-9468-fd2a0b3fe1ef.png" width=280>
</p>

# EthereumJS Monorepo

[![Code Coverage][coverage-badge]][coverage-link]
[![Discord][discord-badge]][discord-link]

This was originally the EthereumJS VM repository. On Q1 2020 we brought some of its building blocks together to simplify development. Below you can find the packages included in this repository.

🚧 Please note that the `master` branch is updated on a daily basis, and to inspect code related to a specific package version, refer to the [tags](https://github.com/ethereumjs/ethereumjs-monorepo/tags).

| package                                     | npm                                                         | issues                                                                  | tests                                                                  | coverage                                                                |
| ------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [@ethereumjs/block][block-package]           | [![NPM Package][block-npm-badge]][block-npm-link]           | [![Block Issues][block-issues-badge]][block-issues-link]                | [![Actions Status][block-actions-badge]][block-actions-link]           | [![Code Coverage][block-coverage-badge]][block-coverage-link]           |
| [@ethereumjs/blockchain][blockchain-package] | [![NPM Package][blockchain-npm-badge]][blockchain-npm-link] | [![Blockchain Issues][blockchain-issues-badge]][blockchain-issues-link] | [![Actions Status][blockchain-actions-badge]][blockchain-actions-link] | [![Code Coverage][blockchain-coverage-badge]][blockchain-coverage-link] |
| [@ethereumjs/client][client-package]           | [![NPM Package][client-npm-badge]][client-npm-link]           | [![Client Issues][client-issues-badge]][client-issues-link]                | [![Actions Status][client-actions-badge]][client-actions-link]           | [![Code Coverage][client-coverage-badge]][client-coverage-link]           |
| [@ethereumjs/common][common-package]         | [![NPM Package][common-npm-badge]][common-npm-link]         | [![Common Issues][common-issues-badge]][common-issues-link]             | [![Actions Status][common-actions-badge]][common-actions-link]         | [![Code Coverage][common-coverage-badge]][common-coverage-link]         |
| [@ethereumjs/devp2p][devp2p-package]         | [![NPM Package][devp2p-npm-badge]][devp2p-npm-link]         | [![Devp2p Issues][devp2p-issues-badge]][devp2p-issues-link]             | [![Actions Status][devp2p-actions-badge]][devp2p-actions-link]         | [![Code Coverage][devp2p-coverage-badge]][devp2p-coverage-link] 
| [@ethereumjs/ethash][ethash-package]         | [![NPM Package][ethash-npm-badge]][ethash-npm-link]         | [![Ethash Issues][ethash-issues-badge]][ethash-issues-link]             | [![Actions Status][ethash-actions-badge]][ethash-actions-link]         | [![Code Coverage][ethash-coverage-badge]][ethash-coverage-link]         |
| [merkle-patricia-tree][trie-package]                 | [![NPM Package][trie-npm-badge]][trie-npm-link]                 | [![Trie Issues][trie-issues-badge]][trie-issues-link]                         | [![Actions Status][trie-actions-badge]][trie-actions-link]                 | [![Code Coverage][trie-coverage-badge]][trie-coverage-link] 
| [@ethereumjs/tx][tx-package]                 | [![NPM Package][tx-npm-badge]][tx-npm-link]                 | [![Tx Issues][tx-issues-badge]][tx-issues-link]                         | [![Actions Status][tx-actions-badge]][tx-actions-link]                 | [![Code Coverage][tx-coverage-badge]][tx-coverage-link]                 |
| [ethereumjs-util][util-package]                 | [![NPM Package][util-npm-badge]][util-npm-link]                 | [![Util Issues][util-issues-badge]][util-issues-link]                         | [![Actions Status][util-actions-badge]][util-actions-link]                 | [![Code Coverage][util-coverage-badge]][util-coverage-link] 
| [@ethereumjs/vm][vm-package]                 | [![NPM Package][vm-npm-badge]][vm-npm-link]                 | [![VM Issues][vm-issues-badge]][vm-issues-link]                         | [![Actions Status][vm-actions-badge]][vm-actions-link]                 | [![Code Coverage][vm-coverage-badge]][vm-coverage-link]                 |

## Coverage report

Detailed version can be seen on [Codecov.io][coverage-link]

[![Code Coverage](https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graphs/icicle.svg)][coverage-link]

## Package dependency relationship

<p align="center">
 <img width="500" alt="diagram" src="https://mermaid.ink/svg/eyJjb2RlIjoiZ3JhcGggVERcbiAgdm17dm19XG4gIGNsaWVudHtjbGllbnR9XG4gIGV0aGFzaCAtLT4gYmxvY2tjaGFpblxuICBkZXZwMnAgLS0-IGNsaWVudFxuICBibG9jayAtLT4gYmxvY2tjaGFpblxuICBibG9jayAtLT4gY2xpZW50XG4gIGJsb2NrIC0tPiB2bVxuICBibG9ja2NoYWluIC0tPiBjbGllbnRcbiAgYmxvY2tjaGFpbiAtLT4gdm1cbiAgdHJpZSAtLT4gY2xpZW50XG4gIHRyaWUgLS0-IHZtXG4gIHRyaWUgLS0-IGJsb2NrXG4gIGNvbW1vbiAtLT4gYmxvY2tcbiAgY29tbW9uIC0tPiBibG9ja2NoYWluXG4gIGNvbW1vbiAtLT4gdHhcbiAgY29tbW9uIC0tPiB2bVxuICBjb21tb24gLS0-IGNsaWVudFxuICBjb21tb24gLS0-IGRldnAycFxuICB0eCAtLT4gYmxvY2tcbiAgdHggLS0-IHZtXG4gIHZtIC0tPiBjbGllbnQiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCIsInRoZW1lVmFyaWFibGVzIjp7ImJhY2tncm91bmQiOiJ3aGl0ZSIsInByaW1hcnlDb2xvciI6IiNFQ0VDRkYiLCJzZWNvbmRhcnlDb2xvciI6IiNmZmZmZGUiLCJ0ZXJ0aWFyeUNvbG9yIjoiaHNsKDgwLCAxMDAlLCA5Ni4yNzQ1MDk4MDM5JSkiLCJwcmltYXJ5Qm9yZGVyQ29sb3IiOiJoc2woMjQwLCA2MCUsIDg2LjI3NDUwOTgwMzklKSIsInNlY29uZGFyeUJvcmRlckNvbG9yIjoiaHNsKDYwLCA2MCUsIDgzLjUyOTQxMTc2NDclKSIsInRlcnRpYXJ5Qm9yZGVyQ29sb3IiOiJoc2woODAsIDYwJSwgODYuMjc0NTA5ODAzOSUpIiwicHJpbWFyeVRleHRDb2xvciI6IiMxMzEzMDAiLCJzZWNvbmRhcnlUZXh0Q29sb3IiOiIjMDAwMDIxIiwidGVydGlhcnlUZXh0Q29sb3IiOiJyZ2IoOS41MDAwMDAwMDAxLCA5LjUwMDAwMDAwMDEsIDkuNTAwMDAwMDAwMSkiLCJsaW5lQ29sb3IiOiIjMzMzMzMzIiwidGV4dENvbG9yIjoiIzMzMyIsIm1haW5Ca2ciOiIjRUNFQ0ZGIiwic2Vjb25kQmtnIjoiI2ZmZmZkZSIsImJvcmRlcjEiOiIjOTM3MERCIiwiYm9yZGVyMiI6IiNhYWFhMzMiLCJhcnJvd2hlYWRDb2xvciI6IiMzMzMzMzMiLCJmb250RmFtaWx5IjoiXCJ0cmVidWNoZXQgbXNcIiwgdmVyZGFuYSwgYXJpYWwiLCJmb250U2l6ZSI6IjE2cHgiLCJsYWJlbEJhY2tncm91bmQiOiIjZThlOGU4Iiwibm9kZUJrZyI6IiNFQ0VDRkYiLCJub2RlQm9yZGVyIjoiIzkzNzBEQiIsImNsdXN0ZXJCa2ciOiIjZmZmZmRlIiwiY2x1c3RlckJvcmRlciI6IiNhYWFhMzMiLCJkZWZhdWx0TGlua0NvbG9yIjoiIzMzMzMzMyIsInRpdGxlQ29sb3IiOiIjMzMzIiwiZWRnZUxhYmVsQmFja2dyb3VuZCI6IiNlOGU4ZTgiLCJhY3RvckJvcmRlciI6ImhzbCgyNTkuNjI2MTY4MjI0MywgNTkuNzc2NTM2MzEyOCUsIDg3LjkwMTk2MDc4NDMlKSIsImFjdG9yQmtnIjoiI0VDRUNGRiIsImFjdG9yVGV4dENvbG9yIjoiYmxhY2siLCJhY3RvckxpbmVDb2xvciI6ImdyZXkiLCJzaWduYWxDb2xvciI6IiMzMzMiLCJzaWduYWxUZXh0Q29sb3IiOiIjMzMzIiwibGFiZWxCb3hCa2dDb2xvciI6IiNFQ0VDRkYiLCJsYWJlbEJveEJvcmRlckNvbG9yIjoiaHNsKDI1OS42MjYxNjgyMjQzLCA1OS43NzY1MzYzMTI4JSwgODcuOTAxOTYwNzg0MyUpIiwibGFiZWxUZXh0Q29sb3IiOiJibGFjayIsImxvb3BUZXh0Q29sb3IiOiJibGFjayIsIm5vdGVCb3JkZXJDb2xvciI6IiNhYWFhMzMiLCJub3RlQmtnQ29sb3IiOiIjZmZmNWFkIiwibm90ZVRleHRDb2xvciI6ImJsYWNrIiwiYWN0aXZhdGlvbkJvcmRlckNvbG9yIjoiIzY2NiIsImFjdGl2YXRpb25Ca2dDb2xvciI6IiNmNGY0ZjQiLCJzZXF1ZW5jZU51bWJlckNvbG9yIjoid2hpdGUiLCJzZWN0aW9uQmtnQ29sb3IiOiJyZ2JhKDEwMiwgMTAyLCAyNTUsIDAuNDkpIiwiYWx0U2VjdGlvbkJrZ0NvbG9yIjoid2hpdGUiLCJzZWN0aW9uQmtnQ29sb3IyIjoiI2ZmZjQwMCIsInRhc2tCb3JkZXJDb2xvciI6IiM1MzRmYmMiLCJ0YXNrQmtnQ29sb3IiOiIjOGE5MGRkIiwidGFza1RleHRMaWdodENvbG9yIjoid2hpdGUiLCJ0YXNrVGV4dENvbG9yIjoid2hpdGUiLCJ0YXNrVGV4dERhcmtDb2xvciI6ImJsYWNrIiwidGFza1RleHRPdXRzaWRlQ29sb3IiOiJibGFjayIsInRhc2tUZXh0Q2xpY2thYmxlQ29sb3IiOiIjMDAzMTYzIiwiYWN0aXZlVGFza0JvcmRlckNvbG9yIjoiIzUzNGZiYyIsImFjdGl2ZVRhc2tCa2dDb2xvciI6IiNiZmM3ZmYiLCJncmlkQ29sb3IiOiJsaWdodGdyZXkiLCJkb25lVGFza0JrZ0NvbG9yIjoibGlnaHRncmV5IiwiZG9uZVRhc2tCb3JkZXJDb2xvciI6ImdyZXkiLCJjcml0Qm9yZGVyQ29sb3IiOiIjZmY4ODg4IiwiY3JpdEJrZ0NvbG9yIjoicmVkIiwidG9kYXlMaW5lQ29sb3IiOiJyZWQiLCJsYWJlbENvbG9yIjoiYmxhY2siLCJlcnJvckJrZ0NvbG9yIjoiIzU1MjIyMiIsImVycm9yVGV4dENvbG9yIjoiIzU1MjIyMiIsImNsYXNzVGV4dCI6IiMxMzEzMDAiLCJmaWxsVHlwZTAiOiIjRUNFQ0ZGIiwiZmlsbFR5cGUxIjoiI2ZmZmZkZSIsImZpbGxUeXBlMiI6ImhzbCgzMDQsIDEwMCUsIDk2LjI3NDUwOTgwMzklKSIsImZpbGxUeXBlMyI6ImhzbCgxMjQsIDEwMCUsIDkzLjUyOTQxMTc2NDclKSIsImZpbGxUeXBlNCI6ImhzbCgxNzYsIDEwMCUsIDk2LjI3NDUwOTgwMzklKSIsImZpbGxUeXBlNSI6ImhzbCgtNCwgMTAwJSwgOTMuNTI5NDExNzY0NyUpIiwiZmlsbFR5cGU2IjoiaHNsKDgsIDEwMCUsIDk2LjI3NDUwOTgwMzklKSIsImZpbGxUeXBlNyI6ImhzbCgxODgsIDEwMCUsIDkzLjUyOTQxMTc2NDclKSJ9fSwidXBkYXRlRWRpdG9yIjpmYWxzZX0">
</p>

<!-- CREATED WITH MERMAID
https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbiAgdm17dm19XG4gIGNsaWVudHtjbGllbnR9XG4gIGV0aGFzaCAtLT4gYmxvY2tjaGFpblxuICBkZXZwMnAgLS0-IGNsaWVudFxuICBibG9jayAtLT4gYmxvY2tjaGFpblxuICBibG9jayAtLT4gY2xpZW50XG4gIGJsb2NrIC0tPiB2bVxuICBibG9ja2NoYWluIC0tPiBjbGllbnRcbiAgYmxvY2tjaGFpbiAtLT4gdm1cbiAgdHJpZSAtLT4gY2xpZW50XG4gIHRyaWUgLS0-IHZtXG4gIHRyaWUgLS0-IGJsb2NrXG4gIGNvbW1vbiAtLT4gYmxvY2tcbiAgY29tbW9uIC0tPiBibG9ja2NoYWluXG4gIGNvbW1vbiAtLT4gdHhcbiAgY29tbW9uIC0tPiB2bVxuICBjb21tb24gLS0-IGNsaWVudFxuICBjb21tb24gLS0-IGRldnAycFxuICB0eCAtLT4gYmxvY2tcbiAgdHggLS0-IHZtXG4gIHZtIC0tPiBjbGllbnQiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCIsInRoZW1lVmFyaWFibGVzIjp7ImJhY2tncm91bmQiOiJ3aGl0ZSIsInByaW1hcnlDb2xvciI6IiNFQ0VDRkYiLCJzZWNvbmRhcnlDb2xvciI6IiNmZmZmZGUiLCJ0ZXJ0aWFyeUNvbG9yIjoiaHNsKDgwLCAxMDAlLCA5Ni4yNzQ1MDk4MDM5JSkiLCJwcmltYXJ5Qm9yZGVyQ29sb3IiOiJoc2woMjQwLCA2MCUsIDg2LjI3NDUwOTgwMzklKSIsInNlY29uZGFyeUJvcmRlckNvbG9yIjoiaHNsKDYwLCA2MCUsIDgzLjUyOTQxMTc2NDclKSIsInRlcnRpYXJ5Qm9yZGVyQ29sb3IiOiJoc2woODAsIDYwJSwgODYuMjc0NTA5ODAzOSUpIiwicHJpbWFyeVRleHRDb2xvciI6IiMxMzEzMDAiLCJzZWNvbmRhcnlUZXh0Q29sb3IiOiIjMDAwMDIxIiwidGVydGlhcnlUZXh0Q29sb3IiOiJyZ2IoOS41MDAwMDAwMDAxLCA5LjUwMDAwMDAwMDEsIDkuNTAwMDAwMDAwMSkiLCJsaW5lQ29sb3IiOiIjMzMzMzMzIiwidGV4dENvbG9yIjoiIzMzMyIsIm1haW5Ca2ciOiIjRUNFQ0ZGIiwic2Vjb25kQmtnIjoiI2ZmZmZkZSIsImJvcmRlcjEiOiIjOTM3MERCIiwiYm9yZGVyMiI6IiNhYWFhMzMiLCJhcnJvd2hlYWRDb2xvciI6IiMzMzMzMzMiLCJmb250RmFtaWx5IjoiXCJ0cmVidWNoZXQgbXNcIiwgdmVyZGFuYSwgYXJpYWwiLCJmb250U2l6ZSI6IjE2cHgiLCJsYWJlbEJhY2tncm91bmQiOiIjZThlOGU4Iiwibm9kZUJrZyI6IiNFQ0VDRkYiLCJub2RlQm9yZGVyIjoiIzkzNzBEQiIsImNsdXN0ZXJCa2ciOiIjZmZmZmRlIiwiY2x1c3RlckJvcmRlciI6IiNhYWFhMzMiLCJkZWZhdWx0TGlua0NvbG9yIjoiIzMzMzMzMyIsInRpdGxlQ29sb3IiOiIjMzMzIiwiZWRnZUxhYmVsQmFja2dyb3VuZCI6IiNlOGU4ZTgiLCJhY3RvckJvcmRlciI6ImhzbCgyNTkuNjI2MTY4MjI0MywgNTkuNzc2NTM2MzEyOCUsIDg3LjkwMTk2MDc4NDMlKSIsImFjdG9yQmtnIjoiI0VDRUNGRiIsImFjdG9yVGV4dENvbG9yIjoiYmxhY2siLCJhY3RvckxpbmVDb2xvciI6ImdyZXkiLCJzaWduYWxDb2xvciI6IiMzMzMiLCJzaWduYWxUZXh0Q29sb3IiOiIjMzMzIiwibGFiZWxCb3hCa2dDb2xvciI6IiNFQ0VDRkYiLCJsYWJlbEJveEJvcmRlckNvbG9yIjoiaHNsKDI1OS42MjYxNjgyMjQzLCA1OS43NzY1MzYzMTI4JSwgODcuOTAxOTYwNzg0MyUpIiwibGFiZWxUZXh0Q29sb3IiOiJibGFjayIsImxvb3BUZXh0Q29sb3IiOiJibGFjayIsIm5vdGVCb3JkZXJDb2xvciI6IiNhYWFhMzMiLCJub3RlQmtnQ29sb3IiOiIjZmZmNWFkIiwibm90ZVRleHRDb2xvciI6ImJsYWNrIiwiYWN0aXZhdGlvbkJvcmRlckNvbG9yIjoiIzY2NiIsImFjdGl2YXRpb25Ca2dDb2xvciI6IiNmNGY0ZjQiLCJzZXF1ZW5jZU51bWJlckNvbG9yIjoid2hpdGUiLCJzZWN0aW9uQmtnQ29sb3IiOiJyZ2JhKDEwMiwgMTAyLCAyNTUsIDAuNDkpIiwiYWx0U2VjdGlvbkJrZ0NvbG9yIjoid2hpdGUiLCJzZWN0aW9uQmtnQ29sb3IyIjoiI2ZmZjQwMCIsInRhc2tCb3JkZXJDb2xvciI6IiM1MzRmYmMiLCJ0YXNrQmtnQ29sb3IiOiIjOGE5MGRkIiwidGFza1RleHRMaWdodENvbG9yIjoid2hpdGUiLCJ0YXNrVGV4dENvbG9yIjoid2hpdGUiLCJ0YXNrVGV4dERhcmtDb2xvciI6ImJsYWNrIiwidGFza1RleHRPdXRzaWRlQ29sb3IiOiJibGFjayIsInRhc2tUZXh0Q2xpY2thYmxlQ29sb3IiOiIjMDAzMTYzIiwiYWN0aXZlVGFza0JvcmRlckNvbG9yIjoiIzUzNGZiYyIsImFjdGl2ZVRhc2tCa2dDb2xvciI6IiNiZmM3ZmYiLCJncmlkQ29sb3IiOiJsaWdodGdyZXkiLCJkb25lVGFza0JrZ0NvbG9yIjoibGlnaHRncmV5IiwiZG9uZVRhc2tCb3JkZXJDb2xvciI6ImdyZXkiLCJjcml0Qm9yZGVyQ29sb3IiOiIjZmY4ODg4IiwiY3JpdEJrZ0NvbG9yIjoicmVkIiwidG9kYXlMaW5lQ29sb3IiOiJyZWQiLCJsYWJlbENvbG9yIjoiYmxhY2siLCJlcnJvckJrZ0NvbG9yIjoiIzU1MjIyMiIsImVycm9yVGV4dENvbG9yIjoiIzU1MjIyMiIsImNsYXNzVGV4dCI6IiMxMzEzMDAiLCJmaWxsVHlwZTAiOiIjRUNFQ0ZGIiwiZmlsbFR5cGUxIjoiI2ZmZmZkZSIsImZpbGxUeXBlMiI6ImhzbCgzMDQsIDEwMCUsIDk2LjI3NDUwOTgwMzklKSIsImZpbGxUeXBlMyI6ImhzbCgxMjQsIDEwMCUsIDkzLjUyOTQxMTc2NDclKSIsImZpbGxUeXBlNCI6ImhzbCgxNzYsIDEwMCUsIDk2LjI3NDUwOTgwMzklKSIsImZpbGxUeXBlNSI6ImhzbCgtNCwgMTAwJSwgOTMuNTI5NDExNzY0NyUpIiwiZmlsbFR5cGU2IjoiaHNsKDgsIDEwMCUsIDk2LjI3NDUwOTgwMzklKSIsImZpbGxUeXBlNyI6ImhzbCgxODgsIDEwMCUsIDkzLjUyOTQxMTc2NDclKSJ9fSwidXBkYXRlRWRpdG9yIjpmYWxzZX0
-->

## Development quick start

First, make sure you have the `ethereum-tests` git submodule, by running: 

```sh
git submodule init
git submodule update
```

This monorepo uses [Lerna](https://lerna.js.org/). It links the local packages together, making development a lot easier.

TLDR: Setup
```sh
npm install
npm run build
```

TLDR: To update dependencies and (re-)link packages
```sh
npm run bootstrap
npm run build
```

Above is the quickest way to set you up. Going down the road, there are two sets of commands: *project* and *package-specific* commands. You can find them at `./package.json` and `./packages/*/package.json`, respectively. Here's a breakdown:

### Project scripts — run from repository root

#### `npm install`
Adds dependencies listed in the root package. Also, it executes the `bootstrap` script described below, installing all sub-packages dependencies.

#### `npm run bootstrap`

Installs dependencies for all sub-packages, and links them to create an integrated development environment.

#### `npm run build`

Builds all monorepo packages by default. If a scope is provided, it will only build that particular package.

Scoped example, that will only build the VM package: 
  npm run build -- --scope @ethereumjs/vm


#### `npm run build:tree -- --scope @ethereumjs/blockchain`

Builds all local packages that the provided package depends on (e.g.: @ethereumjs/blockchain), and builds itself. 

If no scope is provided, `npm run build:tree`, will build all sub-packages.

#### `npm run clean`

Removes root and packages `node_modules` directories, and other generated files, like `coverage`, `dist` and others. This is useful to run after changing branches, to have a clean slate to work with.

#### `npm run lint` and `npm run lint:fix`

These scripts execute `lint` and `lint:fix` respectively, to all monorepo packages. Worth noting that there is a git hook in place that runs `npm run lint` for every `git push`. This check can be skipped using `git push [command] --no-verify`.

### Package scripts — run from `./packages/<name>`

 **⚠️ Important: if you run `npm install` from the package directory, it will remove all links to the local packages, pulling all dependencies from npm. Run `npm install` from the root only.**
 
There's a set of rather standardized commands you will find in each package of this repository.

#### `npm run build`

Uses TypeScript compiler to build source files. The resulting files can be found at `packages/<name>/dist`.

#### `npm run coverage`

Runs whatever is on `npm run test` script, capturing testing coverage information. By the end, it displays a coverage table. Additional reports can be found at `packages/<name>/coverage/`.

#### `npm run docs:build`

Generates package documentation and saves them to `./packages/<name>/docs`.

#### `npm run lint`

Checks code style according to the rules defined in [ethereumjs-config](https://github.com/ethereumjs/ethereumjs-config).

#### `npm run lint:fix`

Fixes code style according to the rules. Differently from `npm run lint`, this command actually writes to files.

#### `npm run test`

Runs the package tests. 

_Note that the VM has several test scopes - refer to [packages/vm/package.json](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/package.json) for more info._

### Going further

As this project is powered by Lerna, you can install it globally to enjoy lots more options. Refer to [Lerna docs](https://github.com/lerna/lerna/tree/master/commands/run) for additional commands.

- `npm install -g lerna`
- `lerna run`
- `lerna exec`

#### Cleaning `node_modules`

Hoisting is enabled so dependencies are moved to the root `node_modules`. `lerna clean` [does not remove the root `node_modules`](https://github.com/lerna/lerna/issues/1304) so for convenience you can use the project script `npm run clean`.

### Testing packages locally on other projects

There are some ways you can link this repository packages to other projects before publishing. You can symlink dependencies with [`npm link <package>`](https://docs.npmjs.com/cli/link), or install packages from the filesystem using [`npm install <folder>`](https://docs.npmjs.com/cli/install). But they are subject to some externalities and most importantly with how your package manager handles the lifecycle of packages during installs. 

_Note: Git references do not work with monorepo setups out of the box due to the lack of directory traversal on the syntax. E.g.:_

  npm install git@github.com:ethereumjs/ethereumjs-monorepo.git

_One way to fetch packages remotely from GitHub before publishing is using [gitpkg.now.sh](https://gitpkg.now.sh/)._

But there's a cleaner way to manage your dependencies using Verdaccio. 

#### Install Verdaccio

Verdaccio is an npm registry and proxy that can be of great help to test packages locally. Check out their [Getting Started guide](https://github.com/verdaccio/verdaccio#get-started).

#### Installs, hoists dependencies and builds packages
npm install

#### Publish monorepo packages to Verdaccio
lerna exec "npm publish --registry http://localhost:4873 --ignore-scripts"

#### Unpublish all monorepo packages from Verdaccio
lerna exec "npm unpublish \$LERNA_PACKAGE_NAME --registry http://localhost:4873 --force"

#### Setup @ethereumjs scope to local Verdaccio server
  npm config set @ethereumjs:registry http://localhost:4873

#### Teardown @ethereumjs scope to local Verdaccio server
  npm config delete @ethereumjs:registry

### E2E testing in CI

Verdaccio is also set up in the `e2e_tests` CI workflow and provides a way to install @ethereumjs
packages at an arbitrary commit in an external real-world project and run their unit
tests with it. This testing strategy is borrowed from ethereum/solidity which checks latest Solidity
against OpenZeppelin and others to keep abreast of how local changes might affect critical projects
downstream from them.

Tests like this are:
+ a pre-publication sanity check that discovers how @ethereumjs performs in the wild
+ useful for catching problems which are difficult to anticipate
+ exposed to failure for reasons outside of @ethereumjs's control, ex: when fixes here surface bugs
  in the target.

E2E tests are constructed by cloning a real world target and using npm or yarn to replace its
existing @ethereumjs dependencies with the versions published to CI's ephemeral private npm registry.

In practice, complex projects might have several versions of @ethereumjs packages nested in
their dependency tree. It's important to coerce all of them to the virtually published versions
for the test to be valid. This can be done using Yarn's selective dependency resolutions feature.
The verdaccio publication step writes a json map of @ethereumjs package names and their
virtually published versions to `resolutions.json` in the root directory. This object can be
injected into the E2E target's package.json under the `resolutions` key and Yarn will install
new versions everywhere as expected.

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

# LICENSE

[MIT](https://opensource.org/licenses/MIT)

[coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg
[coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo
[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[stackexchange-badge]: https://img.shields.io/badge/ethereumjs-stackexchange-brightgreen
[stackexchange-link]: https://ethereum.stackexchange.com/questions/tagged/ethereumjs
[block-package]: ./packages/block
[block-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/block.svg
[block-npm-link]: https://www.npmjs.com/package/@ethereumjs/block
[block-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20block?label=issues
[block-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+block"
[block-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Block/badge.svg
[block-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Block%22
[block-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=block
[block-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/block
[blockchain-package]: ./packages/blockchain
[blockchain-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/blockchain.svg
[blockchain-npm-link]: https://www.npmjs.com/package/@ethereumjs/blockchain
[blockchain-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20blockchain?label=issues
[blockchain-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+blockchain"
[blockchain-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Blockchain/badge.svg
[blockchain-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Blockchain%22
[blockchain-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=blockchain
[blockchain-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/blockchain
[client-package]: ./packages/client
[client-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/client.svg
[client-npm-link]: https://www.npmjs.com/package/@ethereumjs/client
[client-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20client?label=issues
[client-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+client"
[client-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Client/badge.svg
[client-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Client%22
[client-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=client
[client-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/client
[common-package]: ./packages/common
[common-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/common.svg
[common-npm-link]: https://www.npmjs.com/package/@ethereumjs/common
[common-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20common?label=issues
[common-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+common"
[common-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Common/badge.svg
[common-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Common%22
[common-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=common
[common-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/common
[devp2p-package]: ./packages/devp2p
[devp2p-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/devp2p.svg
[devp2p-npm-link]: https://www.npmjs.com/package/@ethereumjs/devp2p
[devp2p-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20devp2p?label=issues
[devp2p-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+devp2p"
[devp2p-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Devp2p/badge.svg
[devp2p-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Devp2p%22
[devp2p-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=devp2p
[devp2p-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/devp2p
[ethash-package]: ./packages/ethash
[ethash-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/ethash.svg
[ethash-npm-link]: https://www.npmjs.org/package/@ethereumjs/ethash
[ethash-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20ethash?label=issues
[ethash-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+ethash"
[ethash-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Ethash/badge.svg
[ethash-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Ethash%22
[ethash-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=ethash
[ethash-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/ethash
[tx-package]: ./packages/tx
[tx-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/tx.svg
[tx-npm-link]: https://www.npmjs.com/package/@ethereumjs/tx
[tx-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20tx?label=issues
[tx-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+tx"
[tx-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Tx/badge.svg
[tx-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Tx%22
[tx-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=tx
[tx-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx
[trie-package]: ./packages/trie
[trie-npm-badge]: https://img.shields.io/npm/v/merkle-patricia-tree.svg
[trie-npm-link]: https://www.npmjs.com/package/merkle-patricia-tree
[trie-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20trie?label=issues
[trie-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+trie"
[trie-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Trie/badge.svg
[trie-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Trie%22
[trie-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=trie
[trie-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/trie
[util-package]: ./packages/util
[util-npm-badge]: https://img.shields.io/npm/v/ethereumjs-util.svg
[util-npm-link]: https://www.npmjs.org/package/ethereumjs-util
[util-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20util?label=issues
[util-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+util"
[util-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Util/badge.svg
[util-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Util%22
[util-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=util
[util-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/util
[vm-package]: ./packages/vm
[vm-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/vm.svg
[vm-npm-link]: https://www.npmjs.com/package/@ethereumjs/vm
[vm-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20vm?label=issues
[vm-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+vm"
[vm-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/VM/badge.svg
[vm-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22VM%22
[vm-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=vm
[vm-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm
