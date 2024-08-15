# @ethereumjs/evm

[![NPM Package][evm-npm-badge]][evm-npm-link]
[![GitHub Issues][evm-issues-badge]][evm-issues-link]
[![Actions Status][evm-actions-badge]][evm-actions-link]
[![Code Coverage][evm-coverage-badge]][evm-coverage-link]
[![Discord][discord-badge]][discord-link]

| TypeScript implementation of the Ethereum EVM. |
| ---------------------------------------------- |

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/evm
```

This package provides the core Ethereum Virtual Machine (EVM) implementation which is capable of executing EVM-compatible bytecode. The package has been extracted from the [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm) package along the VM `v6` release.

**Note:** Starting with the Dencun hardfork `EIP-4844` related functionality will become an integrated part of the EVM functionality with the activation of the point evaluation precompile. It is therefore strongly recommended to _always_ run the EVM with a KZG library installed and initialized, see [KZG Setup](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx/README.md#kzg-setup) for instructions.

## Usage

### Basic

With the v2 release (Summer 2023) the EVM/VM packages have been further decoupled and it now possible to run the EVM package in isolation with reasonable defaults.

The following is the simplest example for an EVM instantiation:

```ts
// ./examples/simple.ts

import { hexToBytes } from '@ethereumjs/util'
import { EVM } from '@ethereumjs/evm'

const main = async () => {
  const evm = await EVM.create()
  const res = await evm.runCode({ code: hexToBytes('0x6001') }) // PUSH1 01 -- simple bytecode to push 1 onto the stack
  console.log(res.executionGasUsed) // 3n
}

main()
```

Note: with the switch from v2 to v3 the old direct `new EVM()` constructor usage has been deprecated and an `EVM` now has to be instantiated with the async static `EVM.create()` constructor.

### Blockchain, State and Events

If the EVM should run on a certain state an `@ethereumjs/statemanager` is needed. An `@ethereumjs/blockchain` instance can be passed in to provide access to external interface information like a blockhash:

```ts
// ./examples/withBlockchain.ts

import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EVM } from '@ethereumjs/evm'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { bytesToHex } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
  const stateManager = new DefaultStateManager()
  const blockchain = await Blockchain.create()

  const evm = await EVM.create({
    common,
    stateManager,
    blockchain,
  })

  const STOP = '00'
  const ADD = '01'
  const PUSH1 = '60'

  // Note that numbers added are hex values, so '20' would be '32' as decimal e.g.
  const code = [PUSH1, '03', PUSH1, '05', ADD, STOP]

  evm.events.on('step', function (data) {
    // Note that data.stack is not immutable, i.e. it is a reference to the vm's internal stack object
    console.log(`Opcode: ${data.opcode.name}\tStack: ${data.stack}`)
  })

  const results = await evm.runCode({
    code: Buffer.from(code.join(''), 'hex'),
    gasLimit: BigInt(0xffff),
  })

  console.log(`Returned: ${bytesToHex(results.returnValue)}`)
  console.log(`gasUsed: ${results.executionGasUsed.toString()}`)
}

void main()
```

Additionally this usage example shows the use of events to listen on the inner workings and procedural updates
(`step` event) of the EVM.

### Precompiles

This library support all EVM precompiles up to the `Prague` hardfork.

The following code allows to run precompiles in isolation, e.g. for testing purposes:

```ts
// ./examples/precompile.ts

import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EVM, getActivePrecompiles } from '@ethereumjs/evm'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Prague })

  // Taken from test/eips/precompiles/bls/add_G1_bls.json
  const data = hexToBytes(
    '0x0000000000000000000000000000000017f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb0000000000000000000000000000000008b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e100000000000000000000000000000000112b98340eee2777cc3c14163dea3ec97977ac3dc5c70da32e6e87578f44912e902ccef9efe28d4a78b8999dfbca942600000000000000000000000000000000186b28d92356c4dfec4b5201ad099dbdede3781f8998ddf929b4cd7756192185ca7b8f4ef7088f813270ac3d48868a21'
  )
  const gasLimit = BigInt(5000000)

  const evm = await EVM.create({ common })
  const precompile = getActivePrecompiles(common).get('000000000000000000000000000000000000000b')!

  const callData = {
    data,
    gasLimit,
    common,
    _EVM: evm,
  }
  const result = await precompile(callData)
  console.log(`Precompile result:${bytesToHex(result.returnValue)}`)
}

main()
```

### EIP-2537 BLS Precompiles (Prague)

Starting with `v3.1.0` the EVM support the BLS precompiles introduced with [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537). These precompiles run natively using the [@noble/curves](https://github.com/paulmillr/noble-curves) library (❤️ to `@paulmillr`!).

An alternative WASM implementation (using [bls-wasm](https://github.com/herumi/bls-wasm)) can be optionally used like this if needed for performance reasons:

```ts
import { EVM, MCLBLS } from '@ethereumjs/evm'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Prague })
await mcl.init(mcl.BLS12_381)
const mclbls = new MCLBLS(mcl)
const evm = await EVM.create({ common, bls })
```

## Examples

This projects contain the following examples:

1. [./examples/decode-opcodes](./examples/decode-opcodes.ts): Decodes a binary EVM program into its opcodes.
1. [./examples/runCode](./examples/runCode.ts): Show how to use this library in a browser.

All of the examples have their own `README.md` explaining how to run them.

## Browser

With the breaking release round in Summer 2023 we have added hybrid ESM/CJS builds for all our libraries (see section below) and have eliminated many of the caveats which had previously prevented a frictionless browser usage.

It is now easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

### Docs

For documentation on `EVM` instantiation, exposed API and emitted `events` see generated [API docs](./docs/README.md).

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

Starting with v1 the usage of [BN.js](https://github.com/indutny/bn.js/) for big numbers has been removed from the library and replaced with the usage of the native JS [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) data type (introduced in `ES2020`).

Please note that number-related API signatures have changed along with this version update and the minimal build target has been updated to `ES2020`.

## Architecture

### VM/EVM Relation

This package contains the inner Ethereum Virtual Machine core functionality which was included in the [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm) package up till v5 and has been extracted along the v6 release.

This will make it easier to customize the inner EVM, which can now be passed as an optional argument to the outer `VM` instance.

### State and Blockchain Information

For the EVM to properly work it needs access to a respective execution environment (to e.g. request on information like block hashes) as well as the connection to an outer account and contract state.

With the v2 release EVM, VM and StateManager have been substantially reworked in this regard, see PR [#2649](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2649/) and PR [#2702](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2702) for further deepening context.

The interfaces (in a non-TypeScript sense) between these packages have been simplified and the `EEI` package has been completely removed. Most of the EEI related logic is now either handled internally or more generic functionality being taken over by the `@ethereumjs/statemanager` package.

This allows for both a standalone EVM instantiation with reasonable defaults as well as for a simplified EVM -> VM passing if a customized EVM is needed.

## Setup

### Hardfork Support

The EthereumJS EVM implements all hardforks from `Frontier` (`chainstart`) up to the latest active mainnet hardfork.

Currently the following hardfork rules are supported:

- `chainstart` (a.k.a. Frontier)
- `homestead`
- `tangerineWhistle`
- `spuriousDragon`
- `byzantium`
- `constantinople`
- `petersburg`
- `istanbul`
- `muirGlacier` (only `mainnet`)
- `berlin` (`v5.2.0`+)
- `london` (`v5.4.0`+)
- `arrowGlacier` (only `mainnet`) (`v5.6.0`+)
- `merge`
- `shanghai` (`v2.0.0`+)
- `cancun` (`v2.0.0`+)

Default: `shanghai` (taken from `Common.DEFAULT_HARDFORK`)

A specific hardfork EVM ruleset can be activated by passing in the hardfork
along the `Common` instance to the outer `@ethereumjs/vm` instance.

### EIP Support

If you want to activate an EIP not currently active on the hardfork your `common` instance is set to, it is possible to individually activate EIP support in the EVM by specifying the desired EIPs using the `eips` property in your `CommonOpts` setup, e.g.:

```ts
// ./examples/eips.ts

import { Chain, Common } from '@ethereumjs/common'
import { EVM } from '@ethereumjs/evm'

const main = async () => {
  const common = new Common({ chain: Chain.Mainnet, eips: [3074] })
  const evm = await EVM.create({ common })
  console.log(`EIP 3074 is active - ${evm.common.isActivatedEIP(3074)}`)
}

main()
```

Currently supported EIPs:

- [EIP-1153](https://eips.ethereum.org/EIPS/eip-1153) - Transient storage opcodes (Cancun)
- [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) - Fee market change for ETH 1.0 chain
- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS precompiles (removed in v4.0.0, see latest v3 release)
- [EIP-2565](https://eips.ethereum.org/EIPS/eip-2565) - ModExp gas cost
- [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718) - Transaction Types
- [EIP-2935](https://eips.ethereum.org/EIPS/eip-2935) - Serve historical block hashes from state (Prague)
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - gas cost increases for state access opcodes
- [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930) - Optional access list tx type
- [EIP-3074](https://eips.ethereum.org/EIPS/eip-3074) - AUTH and AUTHCALL opcodes
- [EIP-3198](https://eips.ethereum.org/EIPS/eip-3198) - Base fee Opcode
- [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529) - Reduction in refunds
- [EIP-3540](https://eips.ethereum.org/EIPS/eip-3540) - EVM Object Format (EOF) v1 (`outdated`)
- [EIP-3541](https://eips.ethereum.org/EIPS/eip-3541) - Reject new contracts starting with the 0xEF byte
- [EIP-3554](https://eips.ethereum.org/EIPS/eip-3554) - Difficulty Bomb Delay to December 2021 (only PoW networks)
- [EIP-3607](https://eips.ethereum.org/EIPS/eip-3607) - Reject transactions from senders with deployed code
- [EIP-3651](https://eips.ethereum.org/EIPS/eip-3651) - Warm COINBASE (Shanghai)
- [EIP-3670](https://eips.ethereum.org/EIPS/eip-3670) - EOF - Code Validation (`outdated`)
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
- [EIP-7002](https://eips.ethereum.org/EIPS/eip-7002) - Execution layer triggerable withdrawals (Prague)
- [EIP-7251](https://eips.ethereum.org/EIPS/eip-7251) - Execution layer triggerable validator consolidations (Prague)
- [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) - EOA code transactions (Prague) (`outdated`)
- [EIP-7709](https://eips.ethereum.org/EIPS/eip-7709) - Read BLOCKHASH from storage and update cost (Osaka)
- [EIP-7516](https://eips.ethereum.org/EIPS/eip-7516) - BLOBBASEFEE opcode (Cancun)
- [EIP-7685](https://eips.ethereum.org/EIPS/eip-7685) - General purpose execution layer requests (Prague)

### WASM Crypto Support

This library by default uses JavaScript implementations for the basic standard crypto primitives like hashing or signature verification (for included txs). See `@ethereumjs/common` [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common) for instructions on how to replace with e.g. a more performant WASM implementation by using a shared `common` instance.

### EIP-4844 Shard Blob Transactions Support

This library supports the blob transaction type introduced with [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844).

#### Initialization

To run EVM related EIP-4844 functionality you have to active the EIP in the associated `@ethereumjs/common` library:

```ts
// ./examples/4844.ts

import { Common, Chain, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai, eips: [4844] })
```

EIP-4844 comes with a new opcode `BLOBHASH` (Attention! Renamed from `DATAHASH`) and adds a new point evaluation precompile at address `0x0a`
(moved from `0x14` at some point along spec updates).

**Note:** Usage of the point evaluation precompile needs a manual KZG library installation and global initialization, see [KZG Setup](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx/README.md#kzg-setup) for instructions.

### Tracing Events

The EVM has a public property `events` which instantiates an [AsyncEventEmitter](https://github.com/ahultgren/async-eventemitter) and events are submitted along major execution steps which you can listen to.

You can subscribe to the following events:

- `beforeMessage`: Emits a `Message` right after running it.
- `afterMessage`: Emits an `EVMResult` right after running a message.
- `step`: Emits an `InterpreterStep` right before running an EVM step.
- `newContract`: Emits a `NewContractEvent` right before creating a contract. This event contains the deployment code, not the deployed code, as the creation message may not return such a code.

An example for the `step` event can be found in the initial usage example in this `README`.

#### Asynchronous event handlers

You can perform asynchronous operations from within an event handler
and prevent the EVM to keep running until they finish.

In order to do that, your event handler has to accept two arguments.
The first one will be the event object, and the second one a function.
The EVM won't continue until you call this function.

If an exception is passed to that function, or thrown from within the
handler or a function called by it, the exception will bubble into the
EVM and interrupt it, possibly corrupting its state. It's strongly
recommended not to do that.

#### Synchronous event handlers

If you want to perform synchronous operations, you don't need
to receive a function as the handler's second argument, nor call it.

Note that if your event handler receives multiple arguments, the second
one will be the continuation function, and it must be called.

If an exception is thrown from within the handler or a function called
by it, the exception will bubble into the EVM and interrupt it, possibly
corrupting its state. It's strongly recommended not to throw from within
event handlers.

## Understanding the EVM

If you want to understand your EVM runs we have added a hierarchically structured list of debug loggers for your convenience which can be activated in arbitrary combinations. We also use these loggers internally for development and testing. These loggers use the [debug](https://github.com/visionmedia/debug) library and can be activated on the CL with `DEBUG=ethjs,[Logger Selection] node [Your Script to Run].js` and produce output like the following:

![EthereumJS EVM Debug Logger](./debug.png?raw=true)

The following loggers are currently available:

| Logger                             | Description                                         |
| ---------------------------------- | --------------------------------------------------- |
| `evm`                              |  EVM control flow, CALL or CREATE message execution |
| `evm:gas`                          |  EVM gas logger                                     |
| `evm:eei:gas`                      |  EEI gas logger                                     |
| `evm:ops`                          |  Opcode traces                                      |
| `evm:ops:[Lower-case opcode name]` | Traces on a specific opcode                         |

Here are some examples for useful logger combinations.

Run one specific logger:

```shell
DEBUG=ethjs,evm tsx test.ts
```

Run all loggers currently available:

```shell
DEBUG=ethjs,evm:*,evm:*:* tsx test.ts
```

Run only the gas loggers:

```shell
DEBUG=ethjs,evm:*:gas tsx test.ts
```

Excluding the ops logger:

```shell
DEBUG=ethjs,evm:*,evm:*:*,-evm:ops tsx test.ts
```

Run some specific loggers including a logger specifically logging the `SSTORE` executions from the EVM (this is from the screenshot above):

```shell
DEBUG=ethjs,evm,evm:ops:sstore,evm:*:gas tsx test.ts
```

### Internal Structure

The EVM processes state changes at many levels.

- **runCall**
  - checkpoint state
  - transfer value
  - load code
  - runCode
  - materialize created contracts
  - revert or commit checkpoint
- **runCode**
  - iterate over code
  - run op codes
  - track gas usage
- **OpFns**
  - run individual op code
  - modify stack
  - modify memory
  - calculate fee

The opFns for `CREATE`, `CALL`, and `CALLCODE` call back up to `runCall`.

TODO: this section likely needs an update.

## Profiling the EVM

Starting with the `v2.1.0` release the EVM comes with build-in profiling capabilities to detect performance bottlenecks and to generally support the targeted evolution of the JavaScript EVM performance.

While the EVM now has a dedicated `profiler` setting to activate, the profiler can best and most useful be run through the EthereumJS [client](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/client) since this gives the most realistic conditions providing both real-world txs and a meaningful state size.

To repeatedly run the EVM profiler within the client sync the client on mainnet or a larger testnet to the desired block. Then the profiler should be run without sync (to not distort the results) by using the `--executeBlocks` and the `--vmProfileBlocks` (or `--vmProfileTxs`) flags in conjunction like:

```shell
npm run client:start -- --sync=none --vmProfileBlocks --executeBlocks=962720
```

This will give a profile output like the following:

![EthereumJS EVM Profiler](./profiler.png?raw=true)

The `total (ms)` column gives you a good overview what takes the most significant amount of time, to be put in relation with the number of calls.

The number to optimize for is the `Mgas/s` value. This value indicates how much gas (being a measure for the computational cost for an opcode) can be processed by the second.

A good measure to putting this relation with is by taking both the Ethereum gas limit (the max amount of "computation" per block) and the time/slot into account. With a gas limit of 30 Mio and a 12 sec slot time this leads to a following (very) minimum `Mgas/s` value:

```shell
30M / 12 sec = 2.5 Million gas per second
```

Note that this is nevertheless a very theoretical value but pretty valuable for some first rough orientation though.

Another note: profiler results for at least some opcodes are heavily distorted, first to mention the `SSTORE` opcode where the major "cost" occurs after block execution on checkpoint commit, which is not taken into account by the profiler.

Generally all results should rather encourage and need "self thinking" 😋 and are not suited to be blindedly taken over without a deeper understanding/grasping of the underlying measurement conditions.

Happy EVM Profiling! 🎉 🤩

## Development

See [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm) README.

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[evm-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/evm.svg
[evm-npm-link]: https://www.npmjs.com/package/@ethereumjs/evm
[evm-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20evm?label=issues
[evm-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+evm"
[evm-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/EVM/badge.svg
[evm-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22EVM%22
[evm-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=evm
[evm-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm
