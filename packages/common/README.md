# @ethereumjs/common `v10`

[![NPM Package][common-npm-badge]][common-npm-link]
[![GitHub Issues][common-issues-badge]][common-issues-link]
[![Actions Status][common-actions-badge]][common-actions-link]
[![Code Coverage][common-coverage-badge]][common-coverage-link]
[![Discord][discord-badge]][discord-link]

| Resources common to all EthereumJS implementations. |
| --------------------------------------------------- |

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Custom Cryptography Primitives (WASM)](#custom-cryptography-primitives-wasm)
- [Browser](#browser)
- [API](#api)
- [Events](#events)
- [Chains and Genesis](#chains-and-genesis)
- [Working with Private/Custom Chains](#working-with-privatecustom-chains)
- [Hardfork Support and Usage](#hardfork-support-and-usage)
- [Supported EIPs](#supported-eips)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/common
```

## Getting Started

### import / require

import (ESM, TypeScript):

```ts
import { Chain, Common, Hardfork } from '@ethereumjs/common'
```

require (CommonJS, Node.js):

```ts
const { Common, Chain, Hardfork } = require('@ethereumjs/common')
```

### Parameters

All parameters can be accessed through the `Common` class, instantiated with an object containing either the `chain` (e.g. 'Mainnet') or the `chain` together with a specific `hardfork` provided:

```ts
// ./examples/common.ts#L1-L7

import { Common, Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'

// With enums:
const commonWithEnums = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })

// Instantiate with the chain (and the default hardfork)
let c = new Common({ chain: Mainnet })
```

If no hardfork is provided, the common is initialized with the default hardfork.

Current `DEFAULT_HARDFORK`: `Hardfork.Prague`

Here are some simple usage examples:

```ts
// ./examples/common.ts#L9-L23

// Get bootstrap nodes for chain/network
console.log('Below are the known bootstrap nodes')
console.log(c.bootstrapNodes()) // Array with current nodes

// Instantiate with an EIP activated (with pre-EIP hardfork)
c = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })
console.log(`EIP 7702 is active -- ${c.isActivatedEIP(7702)}`)

// Instantiate common with custom chainID
const commonWithCustomChainId = createCustomCommon({ chainId: 1234 }, Mainnet)
console.log(`The current chain ID is ${commonWithCustomChainId.chainId()}`)
```

## Custom Cryptography Primitives (WASM)

All EthereumJS packages use cryptographic primitives from the audited `ethereum-cryptography` library by default. These primitives, including `keccak256`, `sha256`, and elliptic curve signature methods, are all written in native JavaScript and therefore have the potential downside of being less performant than alternative cryptography modules written in other languages and then compiled to WASM. If cryptography performance is a bottleneck in your usage of the EthereumJS libraries, you can provide your own primitives to the `Common` constructor and they will be used in place of the defaults. Depending on how your preferred primitives are implemented, you may need to write wrapper methods around them so they conform to the interface exposed by the [`common.customCrypto` property](./src/types.ts).

Note: replacing native JS crypto primitives with WASM based libraries comes with new security assumptions (additional external dependencies, unauditability of WASM code). It is therefore recommended to evaluate your usage context before applying!

### Example 1: keccak256 Hashing

The following is an example using the [@polkadot/wasm-crypto](https://github.com/polkadot-js/wasm/tree/master/packages/wasm-crypto) package:

```ts
// ./examples/customCrypto.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { keccak256, waitReady } from '@polkadot/wasm-crypto'

const main = async () => {
  // @polkadot/wasm-crypto specific initialization
  await waitReady()

  const common = new Common({ chain: Mainnet, customCrypto: { keccak256 } })
  const block = createBlock({}, { common })

  // Method invocations within EthereumJS library instantiations where the common
  // instance above is passed will now use the custom keccak256 implementation
  console.log(block.hash())
}

void main()
```

### Example 2: KZG

The KZG library used for EIP-4844 Blob Transactions is initialized by `common` under the `common.customCrypto` property and is then used throughout the `Ethereumjs` stack wherever KZG cryptography is required. Below is an example of how to initialize (assuming you are using the `c-kzg` package as your KZG cryptography library).

```ts
// ./examples/initKzg.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'

const main = async () => {
  const kzg = new microEthKZG(trustedSetup)
  const common = new Common({
    chain: Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: { kzg },
  })
  console.log(common.customCrypto.kzg) // Should print the initialized KZG interface
}

void main()
```

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025 all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies and cut out all usages of Node.js specific primities (like the Node.js event emitter).

It is easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

### Docs

See the API documentation for a full list of functions for accessing specific chain and
depending hardfork parameters. There are also additional helper functions like
`paramByBlock (topic, name, blockNumber)` or `hardforkIsActiveOnBlock (hardfork, blockNumber)`
to ease `blockNumber` based access to parameters.

Generated TypeDoc API [Documentation](./docs/README.md)

### Hybrid CJS/ESM Builds

With the breaking releases from Summer 2023 we have started to ship our libraries with both CommonJS (`cjs` folder) and ESM builds (`esm` folder), see `package.json` for the detailed setup.

If you use an ES6-style `import` in your code files from the ESM build will be used:

```ts
import { EthereumJSClass } from '@ethereumjs/[PACKAGE_NAME]'
```

If you use Node.js specific `require`, the CJS build will be used:

```ts
const { EthereumJSClass } = require('@ethereumjs/[PACKAGE_NAME]')
```

Using ESM will give you additional advantages over CJS beyond browser usage like static code analysis / Tree Shaking which CJS can not provide.

## Events

The `Common` class has a public property `events` which contains an `EventEmitter` (using [EventEmitter3](https://github.com/primus/eventemitter3)). Following events are emitted on which you can react within your code:

| Event             | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `hardforkChanged` | Emitted when a hardfork change occurs in the Common object |

### Chains and Genesis

The `chain` can be set in the constructor like this:

```ts
import { Common, Mainnet } from '@ethereumjs/common'
const common = new Common({ chain: Mainnet })
```

Supported chains:

- `mainnet` (`Mainnet`)
- `sepolia` (`Sepolia`) (`v2.6.1`+)
- `holesky` (`Holesky`) (`v4.1.0`+)
- `hoodi`(`Hoodi`) (`v10+` (new versioning scheme))
- Private/custom chain parameters

The following chain-specific parameters are provided:

- `name`
- `chainId`
- `networkId`
- `consensusType` (e.g. `pow` or `poa`)
- `consensusAlgorithm` (e.g. `ethash` or `clique`)
- `consensusConfig` (depends on `consensusAlgorithm`, e.g. `period` and `epoch` for `clique`)
- `genesis` block header values
- `hardforks` block numbers
- `bootstrapNodes` list
- `dnsNetworks` list ([EIP-1459](https://eips.ethereum.org/EIPS/eip-1459)-compliant list of DNS networks for peer discovery)

To get an overview of the different parameters have a look at one of the chain configurations in the `chains.ts` configuration
file, or to the `Chain` type in [./src/types.ts](./src/types.ts).

### Working with Private/Custom Chains

Starting with the `v10` release series using custom chain configurations has been simplified and consolidated in a single API `createCustomCommon()`. This constructor can be both used to make simple chain ID adjustments and keep the rest of the config conforming to a given "base chain":

```ts
import { createCustomCommon, Mainnet } from '@ethereumjs/common'
 
createCustomCommon({chainId: 123}, Mainnet)
```

See the `Tx` library [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx) for how to use such a `Common` instance in the context of sending txs to L2 networks.

Beyond it is possible to customize to a fully custom chain by passing in a complete configuration object as first parameter:

```ts
// ./examples/customChain.ts

import { Common, Mainnet, createCustomCommon } from '@ethereumjs/common'

import myCustomChain1 from './genesisData/testnet.json'

// Add custom chain config
const common1 = createCustomCommon(myCustomChain1, Mainnet)
console.log(`Common is instantiated with custom chain parameters - ${common1.chainName()}`)
```

#### Initialize using Geth's genesis json

For lots of custom chains (for e.g. devnets and testnets), you might come across a genesis json config which
has both config specification for the chain as well as the genesis state specification. You can derive the
common from such configuration in the following manner:

```ts
// ./examples/fromGeth.ts

import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'

import genesisJSON from './genesisData/post-merge.json'

const genesisHash = hexToBytes('0x3b8fb240d288781d4aac94d3fd16809ee413bc99294a085798a589dae51ddd4a')
// Load geth genesis JSON file into lets say `genesisJSON` and optional `chain` and `genesisHash`
const common = createCommonFromGethGenesis(genesisJSON, { chain: 'customChain', genesisHash })
// If you don't have `genesisHash` while initiating common, you can later configure common (for e.g.
// after calculating it via `blockchain`)
common.setForkHashes(genesisHash)

console.log(`The London forkhash for this custom chain is ${common.forkHash('london')}`)
```

## Hardfork Support and Usage

The `hardfork` can be set in constructor like this:

```ts
// ./examples/common.ts#L1-L4

import { Common, Hardfork, Mainnet, createCustomCommon } from '@ethereumjs/common'

// With enums:
const commonWithEnums = new Common({ chain: Mainnet, hardfork: Hardfork.London })
```

### Active Hardforks

There are currently parameter changes by the following past and future hardfork by the
library supported:

- `chainstart` (`Hardfork.Chainstart`)
- `homestead` (`Hardfork.Homestead`)
- `dao` (`Hardfork.Dao`)
- `tangerineWhistle` (`Hardfork.TangerineWhistle`)
- `spuriousDragon` (`Hardfork.SpuriousDragon`)
- `byzantium` (`Hardfork.Byzantium`)
- `constantinople` (`Hardfork.Constantinople`)
- `petersburg` (`Hardfork.Petersburg`) (aka `constantinopleFix`, apply together with `constantinople`)
- `istanbul` (`Hardfork.Istanbul`)
- `muirGlacier` (`Hardfork.MuirGlacier`)
- `berlin` (`Hardfork.Berlin`) (since `v2.2.0`)
- `london` (`Hardfork.London`) (since `v2.4.0`)
- `merge` (`Hardfork.Merge`) (since `v2.5.0`)
- `shanghai` (`Hardfork.Shanghai`) (since `v3.1.0`)
- `cancun` (`Hardfork.Cancun`) (since `v4.2.0`)
- `prague` (`Hardfork.Prague`) (`DEFAULT_HARDFORK`) (since `v10`)

### Future Hardforks

The next upcoming HF `Hardfork.Osaka` is currently not yet supported by this library.

### Parameter Access

For hardfork-specific parameter access with the `param()` and `paramByBlock()` functions
you can use the following `topics`:

- `gasConfig`
- `gasPrices`
- `vm`
- `pow`
- `sharding`

See one of the hardfork configurations in the `hardforks.ts` file
for an overview. For consistency, the chain start (`chainstart`) is considered an own
hardfork.

## Supported EIPs

EIPs are native citizens within the library and can be activated like this:

```ts
const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })
```

The following EIPs are currently supported:

- [EIP-1153](https://eips.ethereum.org/EIPS/eip-1153) - Transient storage opcodes (Cancun)
- [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) - Fee market change for ETH 1.0 chain
- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - Precompile for BLS12-381 curve operations (Prague)
- [EIP-2565](https://eips.ethereum.org/EIPS/eip-2565) - ModExp gas cost
- [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718) - Transaction Types
- [EIP-2935](https://eips.ethereum.org/EIPS/eip-2935) - Serve historical block hashes in state (Prague)
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - gas cost increases for state access opcodes
- [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930) - Optional access list tx type
- [EIP-3074](https://eips.ethereum.org/EIPS/eip-3074) - AUTH and AUTHCALL opcodes
- [EIP-3198](https://eips.ethereum.org/EIPS/eip-3198) - Base fee Opcode
- [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529) - Reduction in refunds
- [EIP-3541](https://eips.ethereum.org/EIPS/eip-3541) - Reject new contracts starting with the 0xEF byte
- [EIP-3554](https://eips.ethereum.org/EIPS/eip-3554) - Difficulty Bomb Delay to December 2021 (only PoW networks)
- [EIP-3607](https://eips.ethereum.org/EIPS/eip-3607) - Reject transactions from senders with deployed code
- [EIP-3651](https://eips.ethereum.org/EIPS/eip-3651) - Warm COINBASE (Shanghai)
- [EIP-3675](https://eips.ethereum.org/EIPS/eip-3675) - Upgrade consensus to Proof-of-Stake
- [EIP-3855](https://eips.ethereum.org/EIPS/eip-3855) - Push0 opcode (Shanghai)
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
- [EIP-7623](https://eips.ethereum.org/EIPS/eip-7623) - Increase calldata cost (Prague)
- [EIP-7685](https://eips.ethereum.org/EIPS/eip-7685) - General purpose execution layer requests (Prague)
- [EIP-7691](https://eips.ethereum.org/EIPS/eip-7691) - Blob throughput increase (Prague)
- [EIP-7692](https://eips.ethereum.org/EIPS/eip-7692) - EVM Object Format (EOF) v1 (`experimental`)
- [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) - Set EOA account code (Prague)
- [EIP-7709](https://eips.ethereum.org/EIPS/eip-7709) - Read BLOCKHASH from storage and update cost (Verkle)

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

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
