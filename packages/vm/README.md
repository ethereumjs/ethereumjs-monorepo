# @ethereumjs/vm `v10`

[![NPM Package][vm-npm-badge]][vm-npm-link]
[![GitHub Issues][vm-issues-badge]][vm-issues-link]
[![Actions Status][vm-actions-badge]][vm-actions-link]
[![Code Coverage][vm-coverage-badge]][vm-coverage-link]
[![Discord][discord-badge]][discord-link]

| Execution Context for the Ethereum EVM Implementation. |
| ------------------------------------------------------ |

Ethereum `mainnet` compatible execution context for
[@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm)
to build and run blocks and txs and update state.

- 🦄 All hardforks up till **Pectra**
- 🌴 Tree-shakeable API
- 👷🏼 Controlled dependency set (7 external + `@Noble` crypto)
- 🧩 Flexible EIP on/off engine
- 📲 **EIP-7702** ready
- 📬 Flexible state retrieval (Merkle, RPC,...)
- 🔎 Passes official #Ethereum tests
- 🛵 668KB bundle size (170KB gzipped)
- 🏄🏾‍♂️ WASM-free default + Fully browser ready

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Browser](#browser)
- [API](#api)
- [Architecture](#architecture)
- [Setup](#setup)
- [Supported EIPs](#supported-eips)
- [Events](#events)
- [Understanding the VM](#understanding-the-vm)
- [Internal Structure](#internal-structure)
- [Development](#development)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/vm
```

**Note:** Starting with the Dencun hardfork `EIP-4844` related functionality has become an integrated part of the EVM functionality with the activation of the point evaluation precompile. For this precompile to work a separate installation of the KGZ library is necessary (we decided not to bundle due to large bundle sizes), see [KZG Setup](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx/README.md#kzg-setup) for instructions.

## Usage

### Running a Transaction

```ts
// ./examples/runTx.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { createZeroAddress } from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai })
  const vm = await createVM({ common })

  const tx = createLegacyTx({
    gasLimit: BigInt(21000),
    gasPrice: BigInt(1000000000),
    value: BigInt(1),
    to: createZeroAddress(),
    v: BigInt(37),
    r: BigInt('62886504200765677832366398998081608852310526822767264927793100349258111544447'),
    s: BigInt('21948396863567062449199529794141973192314514851405455194940751428901681436138'),
  })
  const res = await runTx(vm, { tx, skipBalance: true })
  console.log(res.totalGasSpent) // 21000n - gas cost for simple ETH transfer
}

void main()
```

Additionally to the `VM.runTx()` method there is an API method `VM.runBlock()` which allows to run the whole block and execute all included transactions along.

### Building a Block

The VM package can also be used to construct a new valid block by executing and then integrating txs one-by-one.

The following non-complete example gives some illustration on how to use the Block Builder API:

```ts
// ./examples/buildBlock.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { Account, bytesToHex, createAddressFromPrivateKey, hexToBytes } from '@ethereumjs/util'
import { buildBlock, createVM } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet })
  const vm = await createVM({ common })

  const parentBlock = createBlock(
    { header: { number: 1n } },
    { skipConsensusFormatValidation: true },
  )
  const headerData = {
    number: 2n,
  }
  const blockBuilder = await buildBlock(vm, {
    parentBlock, // the parent @ethereumjs/block Block
    headerData, // header values for the new block
    blockOpts: {
      calcDifficultyFromHeader: parentBlock.header,
      freeze: false,
      skipConsensusFormatValidation: true,
      putBlockIntoBlockchain: false,
    },
  })

  const pk = hexToBytes('0x26f81cbcffd3d23eace0bb4eac5274bb2f576d310ee85318b5428bf9a71fc89a')
  const address = createAddressFromPrivateKey(pk)
  const account = new Account(0n, 0xfffffffffn)
  await vm.stateManager.putAccount(address, account) // create a sending account and give it a big balance
  const tx = createLegacyTx({ gasLimit: 0xffffff, gasPrice: 75n }).sign(pk)
  await blockBuilder.addTransaction(tx)

  // Add more transactions

  const { block } = await blockBuilder.build()
  console.log(`Built a block with hash ${bytesToHex(block.hash())}`)
}

void main()

```

### WASM Crypto Support

This library by default uses JavaScript implementations for the basic standard crypto primitives like hashing or signature verification (for included txs). See `@ethereumjs/common` [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common) for instructions on how to replace with e.g. a more performant WASM implementation by using a shared `common` instance.

## Examples

See the [examples](./examples/) folder for different meaningful examples on how to use the VM package and invoke certain aspects of it, e.g. running a complete block, a certain tx or using event listeners, among others. Some noteworthy examples to point out:

1. [./examples/run-blockchain](./examples/run-blockchain.ts): Loads tests data, including accounts and blocks, and runs all of them in the VM.
2. [./examples/run-solidity-contract](./examples/run-solidity-contract.ts): Compiles a Solidity contract, and calls constant and non-constant functions.

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js-specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

### Docs

For documentation on `VM` instantiation, exposed API and emitted `events` see generated [API docs](./docs/README.md).

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

## Architecture

### VM/EVM Relation

Starting with the `VM` v6 version the inner Ethereum Virtual Machine core previously included in this library has been extracted to an own package [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm).

It is still possible to access all `EVM` functionality through the `evm` property of the initialized `vm` object, e.g.:

```ts
vm.evm.runCode()
vm.evm.events.on('step', function (data) {
  console.log(`Opcode: ${data.opcode.name}\tStack: ${data.stack}`)
})
```

Note that it's now also possible to pass in an own or customized `EVM` instance by using the optional `evm` constructor option.

### State and Blockchain Information

With `VM` v7 a previously needed EEI interface for EVM/VM communication is not needed any more and the API has been simplified, also see the respective EVM README section. Most of the EEI related logic is now either handled internally or more generic functionality being taken over by the `@ethereumjs/statemanager` package, with the `EVM` now taking in both an (optional) `stateManager` and `blockchain` argument for the constructor (which the `VM` passes over by default).

With `VM` v6 the previously included `StateManager` has been extracted to its own package [@ethereumjs/statemanager](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/statemanager). The `StateManager` package provides a unified state interface and it is now also possible to provide a modified or custom `StateManager` to the VM via the optional `stateManager` constructor option.

## Setup

### Chains
Beside the default Proof-of-Stake setup coming with the `Common` library default, the VM also support the execution of  both `Ethash/PoW` and `Clique/PoA` blocks and transactions to allow to re-execute blocks from older hardforks or testnets.

### Hardforks

For hardfork support see the [Hardfork Support](../evm#hardfork-support) section from the underlying `@ethereumjs/evm` instance.

An explicit HF in the `VM` - which is then passed on to the inner `EVM` - can be set with:

```ts
// ./examples/runTx.ts#L1-L8

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { createZeroAddress } from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai })
  const vm = await createVM({ common })
```

### Custom Genesis State

For initializing a custom genesis state you can use the `genesisState` constructor option in the `Blockchain` and `VM` library in a similar way this had been done in the `Common` library before.

```ts
// ./examples/vmWithGenesisState.ts

import { Chain } from '@ethereumjs/common'
import { getGenesis } from '@ethereumjs/genesis'
import { createAddressFromString } from '@ethereumjs/util'
import { createVM } from '@ethereumjs/vm'

const main = async () => {
  const genesisState = getGenesis(Chain.Mainnet)

  const vm = await createVM()
  await vm.stateManager.generateCanonicalGenesis!(genesisState)
  const account = await vm.stateManager.getAccount(
    createAddressFromString('0x000d836201318ec6899a67540690382780743280'),
  )

  if (account === undefined) {
    throw new Error('Account does not exist: failed to import genesis state')
  }

  console.log(
    `This balance for account 0x000d836201318ec6899a67540690382780743280 in this chain's genesis state is ${Number(
      account?.balance,
    )}`,
  )
}
void main()
```

Genesis state can be configured to contain both EOAs as well as (system) contracts with initial storage values set.

## Supported EIPs

It is possible to individually activate EIP support in the VM by instantiate the `Common` instance passed
with the respective EIPs, e.g.:

```ts
// ./examples/vmWithEIPs.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createVM } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })
  const vm = await createVM({ common })
  console.log(`EIP 7702 is active in isolation on top of the Cancun HF - ${vm.common.isActivatedEIP(7702)}`)
}
void main()
```

For a list with supported EIPs see the [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm) documentation.

### EIP-4844 Shard Blob Transactions Support (Cancun)

This library supports the blob transaction type introduced with [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844). EIP-4844 comes with a dedicated opcode `BLOBHASH` and has added a new point evaluation precompile at address `0x0a`.

**Note:** Usage of the point evaluation precompile needs a manual KZG library installation and global initialization, see [KZG Setup](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx/README.md#kzg-setup) for instructions.

### EIP-7702 EAO Code Transactions Support (Prague)

This library support the execution of [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) EOA code transactions (see tx library for full documentation) with `runTx()` or the wrapping `runBlock()` execution methods, see [this test setup](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/test/api/EIPs/eip-7702.spec.ts) for a more complete example setup on how to run code from an EOA.

### EIP-7685 Requests Support (Prague)

This library supports blocks including [EIP-7685](https://eips.ethereum.org/EIPS/eip-7685) requests to the consensus layer.

### EIP-2935 Serve Historical Block Hashes from State (Prague)

Starting with `v8.1.0` the VM supports [EIP-2935](https://eips.ethereum.org/EIPS/eip-2935) which stores the latest 8192 block hashes in the storage of a system contract.

Note that this EIP has no effect on the resolution of the `BLOCKHASH` opcode, which will be a separate activation taking place by the integration of [EIP-7709](https://eips.ethereum.org/EIPS/eip-7709) in a respective Verkle/Stateless hardfork.

## Events

### Tracing Events

Our `TypeScript` VM emits events that support async listeners (using [EventEmitter3](https://github.com/primus/eventemitter3)).

You can subscribe to the following events:

- `beforeBlock`: Emits a `Block` right before running it.
- `afterBlock`: Emits `AfterBlockEvent` right after running a block.
- `beforeTx`: Emits a `Transaction` right before running it.
- `afterTx`: Emits a `AfterTxEvent` right after running a transaction.

Note, if subscribing to events with an async listener, specify the second parameter of your listener as a `resolve` function that must be called once your listener code has finished.

```ts
// ./examples/eventListener.ts#L10-L19

// Setup an event listener on the `afterTx` event
vm.events.on('afterTx', (event, resolve) => {
  console.log('asynchronous listener to afterTx', bytesToHex(event.transaction.hash()))
  // we need to call resolve() to avoid the event listener hanging
  resolve?.()
})

vm.events.on('afterTx', (event) => {
  console.log('synchronous listener to afterTx', bytesToHex(event.transaction.hash()))
})
```

Please note that there are additional EVM-specific events in the [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm) package.

### Asynchronous event handlers

You can perform asynchronous operations from within an event handler
and prevent the VM to keep running until they finish.

In order to do that, your event handler has to accept two arguments.
The first one will be the event object, and the second one a function.
The VM won't continue until you call this function.

If an exception is passed to that function, or thrown from within the
handler or a function called by it, the exception will bubble into the
VM and interrupt it, possibly corrupting its state. It's strongly
recommended not to do that.

### Synchronous event handlers

If you want to perform synchronous operations, you don't need
to receive a function as the handler's second argument, nor call it.

Note that if your event handler receives multiple arguments, the second
one will be the continuation function, and it must be called.

If an exception is thrown from within the handler or a function called
by it, the exception will bubble into the VM and interrupt it, possibly
corrupting its state. It's strongly recommended not to throw from within
event handlers.

## Understanding the VM

If you want to understand your VM runs we have added a hierarchically structured list of debug loggers for your convenience which can be activated in arbitrary combinations. We also use these loggers internally for development and testing. These loggers use the [debug](https://github.com/visionmedia/debug) library and can be activated on the CL with `DEBUG=ethjs,[Logger Selection] node [Your Script to Run].js` and produce output like the following:

![EthereumJS VM Debug Logger](./debug.png?raw=true)

The following loggers are currently available:

| Logger      | Description                                                        |
| ----------- | ------------------------------------------------------------------ |
| `vm:block`  | Block operations (run txs, generating receipts, block rewards,...) |
| `vm:tx`     |  Transaction operations (account updates, checkpointing,...)       |
| `vm:tx:gas` |  Transaction gas logger                                            |
| `vm:state`  | StateManager logger                                                |

Note that there are additional EVM-specific loggers in the [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm) package.

Here are some examples for useful logger combinations.

Run one specific logger:

```shell
DEBUG=ethjs,vm:tx tsx test.ts
```

Run all loggers currently available:

```shell
DEBUG=ethjs,vm:*,vm:*:* tsx test.ts
```

Run only the gas loggers:

```shell
DEBUG=ethjs,vm:*:gas tsx test.ts
```

Excluding the state logger:

```shell
DEBUG=ethjs,vm:*,vm:*:*,-vm:state tsx test.ts
```

Run some specific loggers including a logger specifically logging the `SSTORE` executions from the VM (this is from the screenshot above):

```shell
DEBUG=ethjs,vm:tx,vm:evm,vm:ops:sstore,vm:*:gas tsx test.ts
```

## Internal Structure

The VM processes state changes at many levels.

- **runBlockchain**
  - for every block, runBlock
- **runBlock**
  - for every tx, runTx
  - pay miner and uncles
- **runTx**
  - check sender balance
  - check sender nonce
  - runCall
  - transfer gas charges

TODO: this section likely needs an update.

## Development

Developer documentation - currently mainly with information on testing and debugging - can be found [here](./DEVELOPER.md).

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[vm-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/vm.svg
[vm-npm-link]: https://www.npmjs.com/package/@ethereumjs/vm
[vm-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20vm?label=issues
[vm-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+vm"
[vm-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/VM/badge.svg
[vm-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22VM%22
[vm-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=vm
[vm-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm
