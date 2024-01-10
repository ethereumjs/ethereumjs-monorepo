# @ethereumjs/vm

[![NPM Package][vm-npm-badge]][vm-npm-link]
[![GitHub Issues][vm-issues-badge]][vm-issues-link]
[![Actions Status][vm-actions-badge]][vm-actions-link]
[![Code Coverage][vm-coverage-badge]][vm-coverage-link]
[![Discord][discord-badge]][discord-link]

| Execution Context for the Ethereum EVM Implementation. |
| ------------------------------------------------------ |

This package provides an Ethereum `mainnet` compatible execution context for the
[@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm)
EVM implementation.

So beyond bytecode processing this package allows to run or build new Ethereum blocks or single transactions
and update a blockchain state accordingly.

Note that up till `v5` this package also was the bundled package for the EVM implementation itself.

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/vm
```

**Note:** If you want to work with `EIP-4844` related functionality, you will have additional manual installation steps for the **KZG setup**, see related section below.

## Usage

### Running a Transaction

```ts
import { Address } from '@ethereumjs/util'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import { VM } from '@ethereumjs/vm'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
const vm = await VM.create({ common })

const tx = LegacyTransaction.fromTxData({
  gasLimit: BigInt(21000),
  gasPrice: BigInt(1000000000),
  value: BigInt(1),
  to: Address.zero(),
  v: BigInt(37),
  r: BigInt('62886504200765677832366398998081608852310526822767264927793100349258111544447'),
  s: BigInt('21948396863567062449199529794141973192314514851405455194940751428901681436138'),
})
await vm.runTx({ tx, skipBalance: true })
```

Note that there is an additional API method `VM.runBlock()` which allows to run the whole block and execute all included transactions along.

### Building a Block

The VM package can also be used to construct a new valid block by executing and then integrating txs one-by-one.

The following non-complete example gives some illustration on how to use the Block Builder API:

```ts
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import { VM } from '@ethereumjs/vm'

const common = new Common({ chain: Chain.Mainnet })
const vm = await VM.create({ common })

const blockBuilder = await vm.buildBlock({
  parentBlock, // the parent @ethereumjs/block Block
  headerData, // header values for the new block
  blockOpts: { calcDifficultyFromHeader: parentBlock.header, freeze: false },
})

const tx = LegacyTransaction.fromTxData()
await blockBuilder.addTransaction(tx)

// Add more transactions

const block = await blockBuilder.build()
```

## Example

This projects contain the following examples:

1. [./examples/run-blockchain](./examples/run-blockchain.cts): Loads tests data, including accounts and blocks, and runs all of them in the VM.
1. [./examples/run-solidity-contract](./examples/run-solidity-contract.cts): Compiles a Solidity contract, and calls constant and non-constant functions.

All of the examples have their own `README.md` explaining how to run them.

## Browser

With the breaking release round in Summer 2023 we have added hybrid ESM/CJS builds for all our libraries (see section below) and have eliminated many of the caveats which had previously prevented a frictionless browser usage.

It is now easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

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

### Buffer -> Uint8Array

With the breaking releases from Summer 2023 we have removed all Node.js specific `Buffer` usages from our libraries and replace these with [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) representations, which are available both in Node.js and the browser (`Buffer` is a subclass of `Uint8Array`).

We have converted existing Buffer conversion methods to Uint8Array conversion methods in the [@ethereumjs/util](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util) `bytes` module, see the respective README section for guidance.

### BigInt Support

Starting with v6 the usage of [BN.js](https://github.com/indutny/bn.js/) for big numbers has been removed from the library and replaced with the usage of the native JS [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) data type (introduced in `ES2020`).

Please note that number-related API signatures have changed along with this version update and the minimal build target has been updated to `ES2020`.

## Architecture

### VM/EVM Relation

Starting with the `VM` v6 version the inner Ethereum Virtual Machine core previously included in this library has been extracted to an own package [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm).

It is still possible to access all `EVM` functionality through the `evm` property of the initialized `vm` object, e.g.:

```ts
vm.evm.runCode() // or
vm.evm.events.on('step', function (data) {
  console.log(`Opcode: ${data.opcode.name}\tStack: ${data.stack}`)
})
```

Note that it's now also possible to pass in an own or customized `EVM` instance by using the optional `evm` constructor option.

### State and Blockchain Information

With `VM` v7 a previously needed EEI interface for EVM/VM communication is not needed any more and the API has been simplified, also see the respective EVM README section. Most of the EEI related logic is now either handled internally or more generic functionality being taken over by the `@ethereumjs/statemanager` package, with the `EVM` now taking in both an (optional) `stateManager` and `blockchain` argument for the constructor (which the `VM` passes over by default).

With `VM` v6 the previously included `StateManager` has been extracted to its own package [@ethereumjs/statemanager](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/statemanager). The `StateManager` package provides a unified state interface and it is now also possible to provide a modified or custom `StateManager` to the VM via the optional `stateManager` constructor option.

## Setup

### Chain Support

Starting with `v5.1.0` the VM supports running both `Ethash/PoW` and `Clique/PoA` blocks and transactions. Clique support has been added along the work on PR [#1032](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1032) and follow-up PRs and (block) validation checks and the switch of the execution context now happens correctly.

### Ethash/PoW Chains

`@ethereumjs/blockchain` validates the PoW algorithm with `@ethereumjs/ethash` and validates blocks' difficulty to match their canonical difficulty.

### Clique/PoA Chains

The following is a simple example for a block run on `Goerli`:

```ts
import { Chain, Common } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'

const common = new Common({ chain: Chain.Goerli })
const vm = await VM.create({ common, setHardfork: true })

const serialized = hexToBytes('0xf901f7a06bfee7294bf4457...')
const block = Block.fromRLPSerializedBlock(serialized, { setHardfork: true })
const result = await vm.runBlock(block)
```

### Hardfork Support

For hardfork support see the [Hardfork Support](../evm#hardfork-support) section from the underlying `@ethereumjs/evm` instance.

An explicit HF in the `VM` - which is then passed on to the inner `EVM` - can be set with:

```ts
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { VM } from '@ethereumjs/vm'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin })
const vm = await VM.create({ common })
```

### Custom genesis state support

#### Genesis in v7 (removed genesis dependency)

Genesis state was huge and had previously been bundled with the `Blockchain` package with the burden going over to the VM, since `Blockchain` is a dependency.

Starting with the v7 release genesis state has been removed from `blockchain` and moved into its own auxiliary package [@ethereumjs/genesis](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/genesis), from which it can be included if needed (for most - especially VM - use cases it is not necessary), see PR [#2844](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2844).

For initializing a custom genesis state you can use the `genesisState` constructor option in the `Blockchain` and `VM` library in a similar way this had been done in the `Common` library before.

```ts
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common } from '@ethereumjs/common'
import { getGenesis } from '@ethereumjs/genesis'
import { VM } from '@ethereumjs/vm'

const genesisState = getGenesis(Chain.Mainnet)

const blockchain = await Blockchain.create({ genesisState })
const vm = await VM.create({ blockchain, genesisState })
```

Genesis state can be configured to contain both EOAs as well as (system) contracts with initial storage values set.

#### Genesis in v6

For the v6 release responsibility for setting up a custom genesis state moved from the [Common](../common/) library to the `Blockchain` package, see PR [#1924](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1924) for some work context.

A genesis state can be set along `Blockchain` creation by passing in a custom `genesisBlock` and `genesisState`. For `mainnet` and the official test networks like `sepolia` or `goerli` genesis is already provided with the block data coming from `@ethereumjs/common`. The genesis state is being integrated in the `Blockchain` library (see `genesisStates` folder).

### EIP Support

It is possible to individually activate EIP support in the VM by instantiate the `Common` instance passed
with the respective EIPs, e.g.:

```ts
import { Chain, Common } from '@ethereumjs/common'
import { VM } from '@ethereumjs/vm'

const common = new Common({ chain: Chain.Mainnet, eips: [2537] })
const vm = await VM.create({ common })
```

For a list with supported EIPs see the [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm) documentation.

### EIP-4844 Shard Blob Transactions Support (experimental)

This library supports an experimental version of the blob transaction type introduced with [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) as being specified in the [01d3209](https://github.com/ethereum/EIPs/commit/01d320998d1d53d95f347b5f43feaf606f230703) EIP version from February 8, 2023 and deployed along `eip4844-devnet-4` (January 2023) starting with `v1.3.0`.

#### Initialization

To run VM/EVM related EIP-4844 functionality you have to active the EIP in the associated `@ethereumjs/common` library:

```ts
import { Common, Chain, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai, eips: [4844] })
```

EIP-4844 comes with a new opcode `DATAHASH` and adds a new point evaluation precompile at address `0x14` in the underlying `@ethereumjs/evm` package.

**Note:** Usage of the point evaluation precompile needs a manual KZG library installation and global initialization, see [KZG Setup](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx/README.md#kzg-setup) for instructions.

### Tracing Events

Our `TypeScript` VM is implemented as an [AsyncEventEmitter](https://github.com/ahultgren/async-eventemitter) and events are submitted along major execution steps which you can listen to.

You can subscribe to the following events:

- `beforeBlock`: Emits a `Block` right before running it.
- `afterBlock`: Emits `AfterBlockEvent` right after running a block.
- `beforeTx`: Emits a `Transaction` right before running it.
- `afterTx`: Emits a `AfterTxEvent` right after running a transaction.

Please note that there are additional EVM-specific events in the [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm) package.

#### Asynchronous event handlers

You can perform asynchronous operations from within an event handler
and prevent the VM to keep running until they finish.

In order to do that, your event handler has to accept two arguments.
The first one will be the event object, and the second one a function.
The VM won't continue until you call this function.

If an exception is passed to that function, or thrown from within the
handler or a function called by it, the exception will bubble into the
VM and interrupt it, possibly corrupting its state. It's strongly
recommended not to do that.

#### Synchronous event handlers

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
