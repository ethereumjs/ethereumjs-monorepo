# @ethereumjs/common `v10`

[![NPM Package][common-npm-badge]][common-npm-link]
[![GitHub Issues][common-issues-badge]][common-issues-link]
[![Actions Status][common-actions-badge]][common-actions-link]
[![Code Coverage][common-coverage-badge]][common-coverage-link]
[![Discord][discord-badge]][discord-link]

| Resources common to all EthereumJS implementations. |
| --------------------------------------------------- |

`Common` holds the **chain configuration**, **active hardfork**, **EIP set**, and **protocol parameters** shared across the EthereumJS libraries. Instantiate one `Common` per network context and pass it to `tx`, `block`, `evm`, `vm`, and related packages.

Runnable examples live in [`examples/`](./examples/).

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Chain Presets](#chain-presets)
- [Hardfork Selection](#hardfork-selection)
- [Parameter Access](#parameter-access)
- [Blob Gas Schedule](#blob-gas-schedule)
- [EIP Activation](#eip-activation)
- [Events](#events)
- [Custom and Private Chains](#custom-and-private-chains)
- [Custom Cryptography (WASM / KZG)](#custom-cryptography-wasm--kzg)
- [Browser](#browser)
- [API](#api)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

```shell
npm install @ethereumjs/common
```

## Getting Started

### import / require

import (ESM, TypeScript):

```ts
import { Chain, Common, Hardfork, Mainnet } from '@ethereumjs/common'
```

require (CommonJS, Node.js):

```ts
const { Common, Hardfork, Mainnet } = require('@ethereumjs/common')
```

### Instantiate `Common`

Pick a built-in chain preset (`Mainnet`, `Sepolia`, …) and optionally pin a hardfork. When omitted, the chain's `defaultHardfork` is used (`Hardfork.Prague` on Mainnet today).

```ts
// ./examples/instantiation.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const withHardfork = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
const withDefault = new Common({ chain: Mainnet })

console.log(`Explicit hardfork: ${withHardfork.hardfork()}`)
console.log(
  `Default hardfork: ${withDefault.hardfork()} (DEFAULT_HARDFORK=${withDefault.DEFAULT_HARDFORK})`,
)
```

## Chain Presets

Built-in presets: `Mainnet`, `Sepolia`, `Holesky`, `Hoodi`. Each exposes `chainId()`, `genesis()`, `hardforks()`, `bootstrapNodes()`, `dnsNetworks()`, and consensus metadata.

```ts
// ./examples/testnetChains.ts

import { Common, Holesky, Hoodi, Mainnet, Sepolia } from '@ethereumjs/common'

for (const chain of [Mainnet, Sepolia, Holesky, Hoodi]) {
  const common = new Common({ chain })
  console.log(
    `${common.chainName()}: chainId=${common.chainId()} hardfork=${common.hardfork()} bootstrapNodes=${common.bootstrapNodes().length}`,
  )
}
```

Chain fields are defined in [`chains.ts`](./src/chains.ts) and the `ChainConfig` type in [`types.ts`](./src/types.ts).

## Hardfork Selection

### Pin at construction

Set `hardfork` in the constructor when you know the fork up front (tests, single-fork tooling).

### Resolve from block headers

For block replay, syncing, or VM runs, use `getHardforkBy()` / `setHardforkBy()`. Pre-merge forks use **block number**; post-merge forks need **timestamp** (and typically block number as well).

```ts
// ./examples/hardforkByBlock.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const common = new Common({ chain: Mainnet })

// Pre-merge: block number alone determines the active hardfork
console.log(`HF at block 12_965_000 (London): ${common.getHardforkBy({ blockNumber: 12_965_000n })}`)
common.setHardforkBy({ blockNumber: 12_965_000n })
console.log(`After setHardforkBy: ${common.hardfork()}`)

// Post-merge: pass timestamp (and block number) for timestamp-based forks
common.setHardforkBy({ blockNumber: 19_000_000n, timestamp: 1_710_338_135n })
console.log(`HF at Cancun timestamp: ${common.hardfork()}`)

common.setHardforkBy({ blockNumber: 19_000_000n, timestamp: 1_746_612_311n })
console.log(`HF at Prague timestamp: ${common.hardfork()}`)
console.log(`Prague active on block 19M: ${common.hardforkIsActiveOnBlock(Hardfork.Prague, 19_000_000n)}`)
```

This mirrors what `@ethereumjs/vm` does when executing a block.

### Supported hardforks

Past and upcoming hardforks include `chainstart` through `osaka`, plus in-development `amsterdam`. `Hardfork.Prague` is the current Mainnet default; `Hardfork.Amsterdam` is experimental — see the [canonical Amsterdam overview](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#amsterdam-hardfork-experimental) in `@ethereumjs/vm` for release ↔ spec tracking.

## Parameter Access

Hardfork and EIP parameters (gas costs, limits, rewards, …) are read with `param()`, `paramByHardfork()`, and `paramByBlock()`. Parameter definitions live in [`hardforks.ts`](./src/hardforks.ts) and [`eips.ts`](./src/eips.ts).

```ts
// ./examples/paramAccess.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

// Hardfork-local params (defined on the BPO hardfork schedule)
const bpo = new Common({ chain: Mainnet, hardfork: Hardfork.Bpo1 })
console.log(`BPO target blob count: ${bpo.param('target')}`)

// Downstream packages ship default EIP param sets; inject manually on standalone Common
const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
common.updateParams({ 1559: { initialBaseFee: 1_000_000_000 } })
console.log(`London initialBaseFee: ${common.param('initialBaseFee')}`)

// paramByBlock() picks the hardfork active at a block (then reads the param)
console.log(`HF at block 12_965_000: ${common.getHardforkBy({ blockNumber: 12_965_000n })}`)
console.log(
  `initialBaseFee at block 12_965_000: ${common.paramByBlock('initialBaseFee', 12_965_000n)}`,
)
```

Downstream packages may supply extra param dictionaries (e.g. `@ethereumjs/tx` `paramsTx` for tx-specific EIP params). Pass them via the constructor `params` option when needed.

## Blob Gas Schedule

EIP-4844 blob gas limits and EIP-7892 BPO schedule changes are exposed through `getBlobGasSchedule()`. BPO hardforks (`Bpo1`, …) carry `target` / `max` on the hardfork definition; earlier forks need EIP-4844 params (merged automatically when using `@ethereumjs/vm` / `@ethereumjs/evm`, or via `updateParams()` on standalone `Common`).

```ts
// ./examples/blobGasSchedule.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const blob4844Params = {
  targetBlobGasPerBlock: 393216,
  maxBlobGasPerBlock: 786432,
  blobGasPriceUpdateFraction: 3338477,
  blobGasPerBlob: 131072,
}

// Pre-BPO: EIP-4844 param names
const cancun = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })
cancun.updateParams({ 4844: blob4844Params })
const cancunSchedule = cancun.getBlobGasSchedule()
console.log(
  `Cancun: target=${cancunSchedule.targetBlobGasPerBlock} max=${cancunSchedule.maxBlobGasPerBlock}`,
)

// BPO hardforks: target/max counts are on the HF; multiply by blobGasPerBlob
for (const hardfork of [Hardfork.Bpo1, Hardfork.Bpo2]) {
  const common = new Common({ chain: Mainnet, hardfork })
  common.updateParams({ 4844: { blobGasPerBlob: blob4844Params.blobGasPerBlob } })
  const schedule = common.getBlobGasSchedule()
  console.log(
    `${hardfork}: target=${schedule.targetBlobGasPerBlock} max=${schedule.maxBlobGasPerBlock} updateFraction=${schedule.blobGasPriceUpdateFraction}`,
  )
}
```

## EIP Activation

EIPs activate through the hardfork schedule and/or the constructor `eips` array. Query with `isActivatedEIP()`.

```ts
// ./examples/activateEIPs.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

// Default-on via hardfork schedule (Prague ships EIP-7702)
const prague = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
console.log(`EIP-7702 on Prague: ${prague.isActivatedEIP(7702)}`)

// Opt-in before schedule: activate on an earlier hardfork via constructor `eips`
const early7702 = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })
console.log(`EIP-7702 forced on Cancun: ${early7702.isActivatedEIP(7702)}`)

// Experimental Amsterdam fork (in development) — full bundle via Hardfork.Amsterdam
const amsterdam = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
console.log(`EIP-7928 BAL on Amsterdam: ${amsterdam.isActivatedEIP(7928)}`)
console.log(`EIP-7708 transfer logs: ${amsterdam.isActivatedEIP(7708)}`)
console.log(`EIP-8037 two-dimensional gas: ${amsterdam.isActivatedEIP(8037)}`)
console.log(`EIP-7843 SLOTNUM / slotNumber: ${amsterdam.isActivatedEIP(7843)}`)
```

### Supported EIPs

The following EIPs are currently supported (sorted by EIP number):

- [EIP-1153](https://eips.ethereum.org/EIPS/eip-1153) - Transient storage opcodes (Cancun)
- [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) - Fee market change for ETH 1.0 chain
- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - Precompile for BLS12-381 curve operations (Prague)
- [EIP-2565](https://eips.ethereum.org/EIPS/eip-2565) - ModExp gas cost
- [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718) - Transaction Types
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - Gas cost increases for state access opcodes
- [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930) - Optional access list tx type
- [EIP-2935](https://eips.ethereum.org/EIPS/eip-2935) - Serve historical block hashes in state (Prague)
- [EIP-3198](https://eips.ethereum.org/EIPS/eip-3198) - Base fee opcode
- [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529) - Reduction in refunds
- [EIP-3541](https://eips.ethereum.org/EIPS/eip-3541) - Reject new contracts starting with the 0xEF byte
- [EIP-3554](https://eips.ethereum.org/EIPS/eip-3554) - Difficulty Bomb Delay to December 2021 (only PoW networks)
- [EIP-3607](https://eips.ethereum.org/EIPS/eip-3607) - Reject transactions from senders with deployed code
- [EIP-3651](https://eips.ethereum.org/EIPS/eip-3651) - Warm COINBASE (Shanghai)
- [EIP-3675](https://eips.ethereum.org/EIPS/eip-3675) - Upgrade consensus to Proof-of-Stake
- [EIP-3855](https://eips.ethereum.org/EIPS/eip-3855) - PUSH0 opcode (Shanghai)
- [EIP-3860](https://eips.ethereum.org/EIPS/eip-3860) - Limit and meter initcode (Shanghai)
- [EIP-4345](https://eips.ethereum.org/EIPS/eip-4345) - Difficulty Bomb Delay to June 2022
- [EIP-4399](https://eips.ethereum.org/EIPS/eip-4399) - Supplant DIFFICULTY opcode with PREVRANDAO (Merge)
- [EIP-4788](https://eips.ethereum.org/EIPS/eip-4788) - Beacon block root in the EVM (Cancun)
- [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) - Shard Blob Transactions (Cancun)
- [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) - Beacon chain push withdrawals as operations (Shanghai)
- [EIP-5133](https://eips.ethereum.org/EIPS/eip-5133) - Delaying Difficulty Bomb to mid-September 2022 (Gray Glacier)
- [EIP-5656](https://eips.ethereum.org/EIPS/eip-5656) - MCOPY - Memory copying instruction (Cancun)
- [EIP-6110](https://eips.ethereum.org/EIPS/eip-6110) - Supply validator deposits on chain (Prague)
- [EIP-6780](https://eips.ethereum.org/EIPS/eip-6780) - SELFDESTRUCT only in same transaction (Cancun)
- [EIP-7002](https://eips.ethereum.org/EIPS/eip-7002) - Execution layer triggerable exits (Prague)
- [EIP-7251](https://eips.ethereum.org/EIPS/eip-7251) - Increase the MAX_EFFECTIVE_BALANCE (Prague)
- [EIP-7516](https://eips.ethereum.org/EIPS/eip-7516) - BLOBBASEFEE opcode (Cancun)
- [EIP-7594](https://eips.ethereum.org/EIPS/eip-7594) - PeerDAS blob transactions (Osaka)
- [EIP-7623](https://eips.ethereum.org/EIPS/eip-7623) - Increase calldata cost (Prague)
- [EIP-7685](https://eips.ethereum.org/EIPS/eip-7685) - General purpose execution layer requests (Prague)
- [EIP-7691](https://eips.ethereum.org/EIPS/eip-7691) - Blob throughput increase (Prague)
- [EIP-7692](https://eips.ethereum.org/EIPS/eip-7692) - EVM Object Format (EOF) v1 (experimental)
- [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) - Set EOA account code (Prague)
- [EIP-7708](https://eips.ethereum.org/EIPS/eip-7708) - ETH transfers emit a log (Amsterdam, experimental)
- [EIP-7709](https://eips.ethereum.org/EIPS/eip-7709) - Read BLOCKHASH from storage and update cost (Verkle, experimental)
- [EIP-7778](https://eips.ethereum.org/EIPS/eip-7778) - Block-level gas accounting without refunds (Amsterdam, experimental)
- [EIP-7823](https://eips.ethereum.org/EIPS/eip-7823) - Set upper bounds for MODEXP (Osaka)
- [EIP-7825](https://eips.ethereum.org/EIPS/eip-7825) - Transaction gas limit cap (Osaka)
- [EIP-7843](https://eips.ethereum.org/EIPS/eip-7843) - SLOTNUM opcode (Amsterdam, experimental)
- [EIP-7864](https://eips.ethereum.org/EIPS/eip-7864) - Ethereum state using a unified binary tree (experimental)
- [EIP-7883](https://eips.ethereum.org/EIPS/eip-7883) - ModExp gas cost increase (Osaka)
- [EIP-7918](https://eips.ethereum.org/EIPS/eip-7918) - Blob base fee bounded by execution cost (Osaka)
- [EIP-7928](https://eips.ethereum.org/EIPS/eip-7928) - Block Level Access Lists (Amsterdam, experimental)
- [EIP-7934](https://eips.ethereum.org/EIPS/eip-7934) - RLP Execution Block Size Limit (Osaka)
- [EIP-7939](https://eips.ethereum.org/EIPS/eip-7939) - Count leading zeros (CLZ) opcode (Osaka)
- [EIP-7951](https://eips.ethereum.org/EIPS/eip-7951) - Precompile for secp256r1 curve support (Osaka)
- [EIP-7954](https://eips.ethereum.org/EIPS/eip-7954) - Increase max contract and initcode size (Amsterdam, experimental)
- [EIP-7976](https://eips.ethereum.org/EIPS/eip-7976) - Increase calldata floor cost (Amsterdam, experimental)
- [EIP-7981](https://eips.ethereum.org/EIPS/eip-7981) - Access list data pricing (Amsterdam, experimental)
- [EIP-7997](https://eips.ethereum.org/EIPS/eip-7997) - Deterministic CREATE2 factory predeploy (Amsterdam, experimental)
- [EIP-8024](https://eips.ethereum.org/EIPS/eip-8024) - DUPN, SWAPN and EXCHANGE instructions (Amsterdam, experimental)
- [EIP-8037](https://eips.ethereum.org/EIPS/eip-8037) - State creation gas cost increase (Amsterdam, experimental)
- [EIP-8038](https://eips.ethereum.org/EIPS/eip-8038) - State access gas cost increase (Amsterdam, experimental)
- [EIP-8246](https://eips.ethereum.org/EIPS/eip-8246) - SELFDESTRUCT no burn (Amsterdam, experimental)
- [EIP-8282](https://eips.ethereum.org/EIPS/eip-8282) - Builder execution requests (Amsterdam, experimental)

Annotations:

- Hardfork labels (e.g. `(Prague)`) indicate default activation on that fork
- `(Amsterdam, experimental)` and `(experimental)` mark unstable specs; behaviour may change on patch releases
- Release ↔ spec tracking: [canonical Amsterdam overview](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#amsterdam-hardfork-experimental) in `@ethereumjs/vm`

## Events

`common.events` is an [EventEmitter3](https://github.com/primus/eventemitter3) instance:

| Event             | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `hardforkChanged` | Emitted when `setHardfork()` changes the active hardfork   |

```ts
// ./examples/hardforkEvents.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })

common.events.on('hardforkChanged', (hardfork) => {
  console.log(`hardforkChanged event: ${hardfork}`)
})

common.setHardfork(Hardfork.Prague)
```

## Custom and Private Chains

`createCustomCommon()` adjusts a base preset or supplies a full `ChainConfig`. Use it for L2 chain IDs, devnets, and PoA networks.

### Chain ID override (L2 pattern)

```ts
// ./examples/customChainId.ts

import { Mainnet, createCustomCommon } from '@ethereumjs/common'

// Keep Mainnet params but override chainId — typical for L2 / private networks
const l2Common = createCustomCommon({ chainId: 42161 }, Mainnet)

console.log(`chainId=${l2Common.chainId()} name=${l2Common.chainName()}`)
console.log(`Hardfork schedule inherited (${l2Common.hardforks().length} entries)`)
```

See the [`@ethereumjs/tx` README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx) for signing with a custom `Common`.

### Full custom `ChainConfig`

```ts
// ./examples/customChain.ts

import { Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'
import { customChainConfig } from '@ethereumjs/testdata'

const common = createCustomCommon(customChainConfig, Mainnet)

console.log(`Chain ${common.chainName()} (chainId=${common.chainId()})`)
console.log(`Hardfork at block 4: ${common.getHardforkBy({ blockNumber: 4n })}`)
console.log(`Bootstrap nodes: ${common.bootstrapNodes().length}`)

common.setHardfork(Hardfork.Byzantium)
console.log(`Active hardfork on custom chain: ${common.hardfork()}`)
```

### PoA / Clique consensus metadata

```ts
// ./examples/consensusConfig.ts

import { Common, Hardfork } from '@ethereumjs/common'
import { testnetMergeChainConfig } from '@ethereumjs/testdata'

const common = new Common({ chain: testnetMergeChainConfig, hardfork: Hardfork.London })

console.log(`consensusType: ${common.consensusType()}`)
console.log(`consensusAlgorithm: ${common.consensusAlgorithm()}`)

const clique = common.consensusConfig()
console.log(`clique period=${clique.period}s epoch=${clique.epoch} blocks`)
```

### From Geth genesis JSON

For devnets and testnets, derive `Common` from a Geth `genesis.json` (chain config + alloc):

```ts
// ./examples/fromGethGenesis.ts

import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { postMergeGethGenesis } from '@ethereumjs/testdata'
import { hexToBytes } from '@ethereumjs/util'

const genesisHash = hexToBytes('0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a')
const common = createCommonFromGethGenesis(postMergeGethGenesis, {
  chain: 'customChain',
  genesisHash,
})
// Defer genesisHash when unknown at init time — set later after computing the genesis block hash
common.setForkHashes(genesisHash)

console.log(`Hardfork is ${common.hardfork()} chainId=${common.chainId()}`)
console.log(`Paris fork hash: ${common.forkHash('paris')}`)
```

## Custom Cryptography (WASM / KZG)

By default, EthereumJS uses audited pure-JS crypto from `ethereum-cryptography`. For performance or blob/KZG support, pass replacements on `customCrypto` ([`types.ts`](./src/types.ts)).

Note: WASM backends add supply-chain and audit surface. Evaluate before enabling in production.

### keccak256 (WASM example)

```ts
// ./examples/customCrypto.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { keccak256, waitReady } from '@polkadot/wasm-crypto'

const main = async () => {
  await waitReady()

  const common = new Common({ chain: Mainnet, customCrypto: { keccak256 } })
  const block = createBlock({}, { common })

  // Downstream calls on objects sharing this `common` use the custom hash
  console.log(block.hash())
}

void main()
```

### KZG for EIP-4844 / PeerDAS

KZG is required for blob transactions (EIP-4844) and cell proofs (EIP-7594). Wire any library implementing the [`KZG` interface](./src/types.ts); the example below uses `micro-eth-signer`:

```ts
// ./examples/initKZG.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })
  console.log(common.customCrypto.kzg !== undefined)
}

void main()
```

## Browser

Hybrid ESM/CJS builds ship with v10; libraries are pure JS by default (no hard-wired WASM). See [`examples/browser.html`](./examples/browser.html) for a local dev-server setup.

## API

Generated TypeDoc: [Documentation](./docs/README.md)

Helper methods include `paramByBlock()`, `hardforkIsActiveOnBlock()`, `forkHash()`, `setForkHashes()`, `copy()`, and `updateParams()` for advanced overrides.

Hybrid CJS/ESM builds: ESM `import` resolves to `dist/esm/`; Node `require` resolves to `dist/cjs/`.

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. See [developer docs](../../DEVELOPER.md) and [code of conduct](../../CODE_OF_CONDUCT.md).

## License

[MIT](https://opensource.org/licenses/MIT)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[common-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/common.svg
[common-npm-link]: https://www.npmjs.com/package/@ethereumjs/common
[common-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20common?label=issues
[common-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+common"
[common-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Common/badge.svg
[common-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Common%22
[common-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=common
[common-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/common
