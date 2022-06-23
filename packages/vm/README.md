# @ethereumjs/vm

[![NPM Package][vm-npm-badge]][vm-npm-link]
[![GitHub Issues][vm-issues-badge]][vm-issues-link]
[![Actions Status][vm-actions-badge]][vm-actions-link]
[![Code Coverage][vm-coverage-badge]][vm-coverage-link]
[![Discord][discord-badge]][discord-link]

| TypeScript implementation of the Ethereum VM. |
| --------------------------------------------- |

# INSTALL

`npm install @ethereumjs/vm`

# USAGE

```typescript
import { BN } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '@ethereumjs/vm'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
const vm = new VM({ common })

const STOP = '00'
const ADD = '01'
const PUSH1 = '60'

// Note that numbers added are hex values, so '20' would be '32' as decimal e.g.
const code = [PUSH1, '03', PUSH1, '05', ADD, STOP]

vm.on('step', function (data) {
  // Note that data.stack is not immutable, i.e. it is a reference to the vm's internal stack object
  console.log(`Opcode: ${data.opcode.name}\tStack: ${data.stack}`)
})

vm.runCode({
  code: Buffer.from(code.join(''), 'hex'),
  gasLimit: new BN(0xffff),
})
  .then((results) => {
    console.log(`Returned: ${results.returnValue.toString('hex')}`)
    console.log(`gasUsed : ${results.gasUsed.toString()}`)
  })
  .catch(console.error)
```

## Example

This projects contain the following examples:

1. [./examples/run-blockchain](./examples/run-blockchain.ts): Loads tests data, including accounts and blocks, and runs all of them in the VM.
1. [./examples/run-code-browser](./examples/run-code-browser.js): Show how to use this library in a browser.
1. [./examples/run-solidity-contract](./examples/run-solidity-contract.ts): Compiles a Solidity contract, and calls constant and non-constant functions.
1. [./examples/decode-opcodes](./examples/decode-opcodes.ts): Decodes a binary EVM program into its opcodes.

All of the examples have their own `README.md` explaining how to run them.

# API

## VM

For documentation on `VM` instantiation, exposed API and emitted `events` see generated [API docs](./docs/README.md).

## StateManager

Documentation on the `StateManager` can be found [here](./docs/classes/_state_statemanager_.defaultstatemanager.md). If you want to provide your own `StateManager` you can implement the dedicated [interface](./docs/interfaces/_state_interface_.statemanager.md) to ensure that your implementation conforms with the current API.

Note: along the `EIP-2929` (Gas cost increases for state access opcodes) implementation released in `v5.2.0` a new `EIP2929StateManager` interface has been introduced inheriting from the base `StateManager` interface. The methods introduced there will be merged into the base state manager on the next breaking release.

# BROWSER

To build the VM for standalone use in the browser, see: [Running the VM in a browser](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm/examples/run-code-browser.js).

# SETUP

## Chain Support

Starting with `v5.1.0` the VM supports running both `Ethash/PoW` and `Clique/PoA` blocks and transactions. Clique support has been added along the work on PR [#1032](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1032) and follow-up PRs and (block) validation checks and the switch of the execution context now happens correctly.

### Ethash/PoW Chains

`@ethereumjs/blockchain` validates the PoW algorithm with `@ethereumjs/ethash` and validates blocks' difficulty to match their canonical difficulty.

### Clique/PoA Chains

The following is a simple example for a block run on `Goerli`:

```typescript
import VM from '@ethereumjs/vm'
import Common, { Chain } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Goerli })
const hardforkByBlockNumber = true
const vm = new VM({ common, hardforkByBlockNumber })

const serialized = Buffer.from('f901f7a06bfee7294bf4457...', 'hex')
const block = Block.fromRLPSerializedBlock(serialized, { hardforkByBlockNumber })
const result = await vm.runBlock(block)
```

## Hardfork Support

The EthereumJS VM implements all hardforks from `Frontier` (`chainstart`) up to the latest active mainnet hardfork.

Currently the following hardfork rules are supported:

- `chainstart` (a.k.a. Frontier)
- `homestead`
- `tangerineWhistle`
- `spuriousDragon`
- `byzantium`
- `constantinople`
- `petersburg`
- `istanbul`
- `muirGlacier` (only `mainnet` and `ropsten`)
- `berlin` (`v5.2.0`+)
- `london` (`v5.4.0`+)
- `arrowGlacier` (only `mainnet`) (`v5.6.0`+)
- `grayGlacier` (only `mainnet`) (`5.9.3`+)

Default: `istanbul` (taken from `Common.DEFAULT_HARDFORK`)

A specific hardfork VM ruleset can be activated by passing in the hardfork
along the `Common` instance:

```typescript
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '@ethereumjs/vm'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin })
const vm = new VM({ common })
```

## Custom genesis state support

If you want to create a new instance of the VM and add your own genesis state, you can do it by passing a `Common`
instance with [custom genesis state](../common/README.md#initialize-using-customchains-array) and passing the flag `activateGenesisState` in `VMOpts`, e.g.:

```typescript
import Common from '@ethereumjs/common'
import VM from '@ethereumjs/vm'
import myCustomChain1 from '[PATH_TO_MY_CHAINS]/myCustomChain1.json'
import chain1GenesisState from '[PATH_TO_GENESIS_STATES]/chain1GenesisState.json'

const common = new Common({
  chain: 'myCustomChain1',
  customChains: [[myCustomChain1, chain1GenesisState]],
})
const vm = new VM({ common, activateGenesisState: true })
```

Genesis state can be configured to contain both EOAs as well as (system) contracts with initial storage values set.

## EIP Support

It is possible to individually activate EIP support in the VM by instantiate the `Common` instance passed
with the respective EIPs, e.g.:

```typescript
import Common, { Chain } from '@ethereumjs/common'
import VM from '@ethereumjs/vm'

const common = new Common({ chain: Chain.Mainnet, eips: [2537] })
const vm = new VM({ common })
```

Currently supported EIPs:

- [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) - Fee Market (`london` EIP)
- [EIP-2315](https://eips.ethereum.org/EIPS/eip-2315) - Simple subroutines (`experimental`)
- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS precompiles (`experimental`)
- [EIP-2565](https://eips.ethereum.org/EIPS/eip-2565) - ModExp gas cost (`berlin` EIP)
- [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718) - Typed transactions (`berlin` EIP)
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929) - Gas cost increases for state access opcodes (`berlin` EIP)
- [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930) - Optional Access Lists Typed Transactions (`berlin` EIP)
- [EIP-3198](https://eips.ethereum.org/EIPS/eip-3198) - BASEFEE opcode (`london` EIP)
- [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529) - Reduction in refunds (`london` EIP)
- [EIP-3540](https://eips.ethereum.org/EIPS/eip-3541) - EVM Object Format (EOF) v1 (`experimental`)
- [EIP-3541](https://eips.ethereum.org/EIPS/eip-3541) - Reject new contracts starting with the 0xEF byte (`london` EIP)
- [EIP-3670](https://eips.ethereum.org/EIPS/eip-3670) - EOF - Code Validation (`experimental`)
- [EIP-3855](https://eips.ethereum.org/EIPS/eip-3855) - PUSH0 instruction (`experimental`)
- [EIP-3860](https://eips.ethereum.org/EIPS/eip-3860) - Limit and meter initcode (`experimental`)
- [EIP-4399](https://eips.ethereum.org/EIPS/eip-4399) - Supplant DIFFICULTY opcode with PREVRANDAO (Merge) (`experimental`)
- [EIP-5133](https://eips.ethereum.org/EIPS/eip-5133) - Delaying Difficulty Bomb to mid-September 2022

## Tracing Events

Our `TypeScript` VM is implemented as an [AsyncEventEmitter](https://github.com/ahultgren/async-eventemitter) and events are submitted along major execution steps which you can listen to.

You can subscribe to the following events:

- `beforeBlock`: Emits a `Block` right before running it.
- `afterBlock`: Emits `AfterBlockEvent` right after running a block.
- `beforeTx`: Emits a `Transaction` right before running it.
- `afterTx`: Emits a `AfterTxEvent` right after running a transaction.
- `beforeMessage`: Emits a `Message` right after running it.
- `afterMessage`: Emits an `EVMResult` right after running a message.
- `step`: Emits an `InterpreterStep` right before running an EVM step.
- `newContract`: Emits a `NewContractEvent` right before creating a contract. This event contains the deployment code, not the deployed code, as the creation message may not return such a code.

An example for the `step` event can be found in the initial usage example in this `README`.

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

If an exception is thrown from withing the handler or a function called
by it, the exception will bubble into the VM and interrupt it, possibly
corrupting its state. It's strongly recommended not to throw from withing
event handlers.

# Understanding the VM

If you want to understand your VM runs we have added a hierarchically structured list of debug loggers for your convenience which can be activated in arbitrary combinations. We also use these loggers internally for development and testing. These loggers use the [debug](https://github.com/visionmedia/debug) library and can be activated on the CL with `DEBUG=[Logger Selection] node [Your Script to Run].js` and produce output like the following:

![EthereumJS VM Debug Logger](./debug.png?raw=true)

The following loggers are currently available:

| Logger                            | Description                                                        |
| --------------------------------- | ------------------------------------------------------------------ |
| `vm:block`                        | Block operations (run txs, generating receipts, block rewards,...) |
| `vm:tx`                           |  Transaction operations (account updates, checkpointing,...)       |
| `vm:tx:gas`                       |  Transaction gas logger                                            |
| `vm:evm`                          |  EVM control flow, CALL or CREATE message execution                |
| `vm:evm:gas`                      |  EVM gas logger                                                    |
| `vm:eei:gas`                      |  EEI gas logger                                                    |
| `vm:state`                        | StateManager logger                                                |
| `vm:ops`                          |  Opcode traces                                                     |
| `vm:ops:[Lower-case opcode name]` | Traces on a specific opcode                                        |

Here are some examples for useful logger combinations.

Run one specific logger:

```shell
DEBUG=vm:tx ts-node test.ts
```

Run all loggers currently available:

```shell
DEBUG=vm:*,vm:*:* ts-node test.ts
```

Run only the gas loggers:

```shell
DEBUG=vm:*:gas ts-node test.ts
```

Excluding the state logger:

```shell
DEBUG=vm:*,vm:*:*,-vm:state ts-node test.ts
```

Run some specific loggers including a logger specifically logging the `SSTORE` executions from the VM (this is from the screenshot above):

```shell
DEBUG=vm:tx,vm:evm,vm:ops:sstore,vm:*:gas ts-node test.ts
```

# Internal Structure

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

# DEVELOPMENT

Developer documentation - currently mainly with information on testing and debugging - can be found [here](./DEVELOPER.md).

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

# LICENSE

[MPL-2.0](https://www.mozilla.org/MPL/2.0/)

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
