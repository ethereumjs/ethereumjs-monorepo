# @ethereumjs/beacon-light `v10`

[![NPM Package][beacon-light-npm-badge]][beacon-light-npm-link]

| Ethereum consensus light-client sync committee and SSZ Merkle verifier (offline). |
| ----------------------------------------------------------------------------------- |

Verifies Altair+ **sync committee BLS12-381** signatures and **SHA-256 generalized-index Merkle branches** against `@ethereumjs/common` Beacon metadata. Live Beacon REST transport and the standalone CLI are planned in the next release (Ethy WP-05b).

## Installation

```shell
npm i @ethereumjs/beacon-light
```

## Usage

```ts
// ./examples/verifyUpdate.ts

import { Common, Sepolia } from '@ethereumjs/common'

import { createBeaconLightClient } from '@ethereumjs/beacon-light'

const client = createBeaconLightClient({ common: new Common({ chain: Sepolia }) })
// Bootstrap and apply updates from untrusted Light Client REST JSON (WP-05b transport).
```

## EthereumJS

See the [monorepo README](../../README.md) for package map and release policy.

## License

MIT

[beacon-light-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/beacon-light.svg
[beacon-light-npm-link]: https://www.npmjs.com/package/@ethereumjs/beacon-light
