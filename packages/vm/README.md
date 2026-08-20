# @ethereumjs/vm `v10`

[![NPM Package][vm-npm-badge]][vm-npm-link]
[![GitHub Issues][vm-issues-badge]][vm-issues-link]
[![Actions Status][vm-actions-badge]][vm-actions-link]
[![Code Coverage][vm-coverage-badge]][vm-coverage-link]
[![Discord][discord-badge]][discord-link]

| Execution Context for the Ethereum EVM Implementation. |
| ------------------------------------------------------ |

Runnable examples live in [`examples/`](./examples/) (helpers and bundled block fixtures under [`examples/data/`](./examples/data/)).

Ethereum `mainnet` compatible execution context for
[@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm)
to build and run blocks and txs and update state.

- 🦄 All hardforks up till **Osaka** (**Amsterdam** in development)
- 🌴 Tree-shakeable API
- 👷🏼 Controlled dependency set (7 external + `@Noble` crypto)
- 🧩 Flexible EIP on/off engine
- 📲 **EIP-7702** ready
- 📋 **EIP-7928** Block Level Access Lists (Amsterdam, experimental)
- 📬 Flexible state retrieval (Merkle, RPC,...)
- 🔎 Passes official #Ethereum tests
- 🛵 668KB bundle size (170KB gzipped)
- 🏄🏾‍♂️ WASM-free default + Fully browser ready

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Run a Block](#run-a-block)
- [Build a Block](#build-a-block)
- [Receipts and Event Logs](#receipts-and-event-logs)
- [Amsterdam Gas Dimensions](#amsterdam-gas-dimensions)
- [Events](#events)
- [Genesis State](#genesis-state)
- [EIP Activation](#eip-activation)
- [RPC Mainnet Block](#rpc-mainnet-block)
- [Offline Mainnet Block](#offline-mainnet-block)
- [Browser](#browser)
- [API](#api)
- [Architecture](#architecture)
- [Setup](#setup)
- [Supported EIPs](#supported-eips)
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

**Note:** Starting with the Dencun hardfork, EIP-4844 point-evaluation precompile (`0x0a`) requires a separate KZG library install — see [KZG Setup](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx/README.md#kzg-setup).

## Getting Started

Use `createVM()` and `runTx()` to execute a signed transaction against an in-memory state:

```ts
// ./examples/runTx.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { createAccount, createAddressFromPrivateKey, createZeroAddress, hexToBytes } from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai })
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  const tx = createLegacyTx({
    gasLimit: 21000n,
    gasPrice: 1_000_000_000n,
    value: 1n,
    to: createZeroAddress(),
  }).sign(senderKey)

  const res = await runTx(vm, { tx })
  console.log(res.totalGasSpent) // 21000n - gas cost for simple ETH transfer
}

void main()
```

`runBlock()` executes every transaction in a block (rewards, withdrawals, requests, receipts). Access the inner EVM via `vm.evm` — see [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm).

## Run a Block

Replay a bundled PoA block fixture offline (no RPC):

```ts
// ./examples/runPoABlockFromTestdata.ts

import { createBlock } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { goerliBlocks, goerliChainConfig } from '@ethereumjs/testdata'
import { bytesToHex } from '@ethereumjs/util'
import { createVM, runBlock } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: goerliChainConfig, hardfork: 'london' })
  const vm = await createVM({ common })

  const block = createBlock(goerliBlocks[0], { common })
  const result = await runBlock(vm, { block, generate: true, skipHeaderValidation: true }) // we skip header validation since we are running a block without the full Ethereum history available
  console.log(`The state root for the block is ${bytesToHex(result.stateRoot)}`)
}

void main()
```

For multi-block replay with a local `@ethereumjs/blockchain`, see [`examples/runBlockchain.ts`](./examples/runBlockchain.ts).

## Build a Block

Use `buildBlock()` to execute transactions incrementally and assemble a valid block header:

```ts
// ./examples/buildBlock.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { Account, bytesToHex, createAddressFromPrivateKey, hexToBytes } from '@ethereumjs/util'
import { buildBlock, createVM } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
  const vm = await createVM({ common })

  const parentBlock = createBlock(
    { header: { number: 1n } },
    { common, skipConsensusFormatValidation: true },
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

On `Hardfork.Amsterdam`, `buildBlock()` also writes `blockAccessListHash` and defaults `slotNumber` from the parent when unset — see [`buildBlockBAL.ts`](./examples/buildBlockBAL.ts). Header `gasUsed` is `max(regular, state)` ([EIP-8037](#eip-8037-state-creation-gas-cost-increase-amsterdam)), matching `runBlock()`.

## Receipts and Event Logs

`runTx()` and `runBlock()` surface logs through transaction receipts using the same [`Log`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#event-logs) tuple as `@ethereumjs/evm`:

```ts
type Log = [address: Uint8Array, topics: Uint8Array[], data: Uint8Array]
```

| API | Where to read logs |
| --- | --- |
| `runTx()` | `result.receipt.logs` |
| `runBlock()` | `result.results[i].receipt.logs` and `result.receipts[i].logs` |
| Block header bloom | `result.logsBloom` on `RunBlockResult` |

On Amsterdam, [EIP-7708](#eip-7708-eth-transfer-and-burn-logs-amsterdam) adds synthetic `Transfer` / `Burn` logs for native ETH movement. Reverted transactions produce receipts with empty `logs` (Byzantium+ `status: 0`).

```ts
// ./examples/runTxTransferLogs.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { decodeEIP7708TransferLog } from '@ethereumjs/evm'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  bytesToHex,
  createAccount,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'

import type { Log } from '@ethereumjs/evm'

/** Pretty-print a Log tuple for console output (not an RPC formatter). */
function formatLog(log: Log) {
  const [address, topics, data] = log
  return {
    address: bytesToHex(address),
    topics: topics.map((topic) => bytesToHex(topic)),
    data: bytesToHex(data),
  }
}

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  const block = createBlock(
    { header: { number: 1n, gasLimit: 30_000_000n, baseFeePerGas: 1n } },
    { common, skipConsensusFormatValidation: true },
  )

  const tx = createLegacyTx(
    {
      gasLimit: 300_000n,
      gasPrice: 10n,
      value: 1_000_000_000_000_000n,
      to: createZeroAddress(),
    },
    { common },
  ).sign(senderKey)

  const result = await runTx(vm, { tx, block })
  const logs = result.receipt.logs

  console.log(`Receipt contains ${logs.length} log(s)`)
  for (const [index, log] of logs.entries()) {
    const formatted = formatLog(log)
    console.log(`  log[${index}] address=${formatted.address}`)
    console.log(`           topics=${formatted.topics.join(', ')}`)
    console.log(`           data=${formatted.data}`)

    const transfer = decodeEIP7708TransferLog(log)
    if (transfer !== undefined) {
      console.log(
        `           → EIP-7708 Transfer from ${transfer.from} to ${transfer.to} value=${transfer.value} wei`,
      )
    }
  }
}

void main()
```

For bytecode-level `LOG*` emission see [`@ethereumjs/evm` emitLogs example](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm/examples/emitLogs.ts). For EVM-layer Transfer logs from `runCall()` (no receipt) see [`eip7708TransferLog.ts`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm/examples/eip7708TransferLog.ts).

## Amsterdam Gas Dimensions

[EIP-8037](https://eips.ethereum.org/EIPS/eip-8037) splits execution into **regular** and **state** gas. A 1-wei transfer to a fresh account still costs 21_000 regular gas — and about 183_600 state gas (`120 × 1530`) for the new account. `runTx()` reports both dimensions plus what the sender pays vs what the block counts ([EIP-7778](https://eips.ethereum.org/EIPS/eip-7778)):

```ts
// ./examples/runTxGasDimensions.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  createAccount,
  createAddressFromPrivateKey,
  createAddressFromString,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, estimateTxGasDimensions, runTx } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  const recipient = createAddressFromString('0x00000000000000000000000000000000000000aa')
  const block = createBlock(
    { header: { number: 1n, gasLimit: 30_000_000n, baseFeePerGas: 1n } },
    { common, skipConsensusFormatValidation: true },
  )

  const tx = createLegacyTx(
    {
      gasLimit: 300_000n,
      gasPrice: 10n,
      value: 1n,
      to: recipient,
    },
    { common },
  ).sign(senderKey)

  const estimate = await estimateTxGasDimensions(vm, tx)
  console.log(`Estimate regular/floor: ${estimate.minimumGasLimit}`)
  console.log(`Estimate first-touch state: ${estimate.estimatedStateGas}`)
  console.log(`Recommended gasLimit: ${estimate.recommendedGasLimit}`)

  const res = await runTx(vm, { tx, block })

  console.log(`Sender paid (totalGasSpent):     ${res.totalGasSpent}`)
  console.log(`Block counts (blockGasSpent):    ${res.blockGasSpent}`)
  console.log(`Regular dimension (txRegularGas): ${res.txRegularGas}`)
  console.log(`State dimension (txStateGas):     ${res.txStateGas}`)
}

void main()
```

Wallets that still assume "21_000 covers a transfer" will OOG on first-touch recipients. Set `gasLimit` to cover **both** dimensions. `estimateTxGasDimensions(vm, tx)` reads current state and returns a recommended limit without executing. See [EIP-8037](#eip-8037-state-creation-gas-cost-increase-amsterdam) for the full field table.

## Events

Subscribe to `beforeBlock`, `afterBlock`, `beforeTx`, and `afterTx`. Async listeners receive a `resolve` callback:

```ts
// ./examples/eventListener.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  bytesToHex,
  createAccount,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai })
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  vm.events.on('afterTx', (event, resolve) => {
    console.log('asynchronous listener to afterTx', bytesToHex(event.transaction.hash()))
    resolve?.()
  })

  vm.events.on('afterTx', (event) => {
    console.log('synchronous listener to afterTx', bytesToHex(event.transaction.hash()))
  })

  const tx = createLegacyTx({
    gasLimit: 21000n,
    gasPrice: 1_000_000_000n,
    value: 1n,
    to: createZeroAddress(),
  }).sign(senderKey)

  const res = await runTx(vm, { tx })
  console.log(res.totalGasSpent)
}

void main()
```

EVM-level events (`step`, `beforeMessage`, …) are on `vm.evm.events` — see [@ethereumjs/evm Events](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#events).

## Genesis State

Load canonical genesis allocations via `@ethereumjs/genesis`:

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
  const accountAddress = '0x000d836201318ec6899a67540690382780743280'
  const account = await vm.stateManager.getAccount(createAddressFromString(accountAddress))

  if (account === undefined) {
    throw new Error('Account does not exist: failed to import genesis state')
  }

  console.log(
    `This balance for account ${accountAddress} in this chain's genesis state is ${Number(
      account?.balance,
    )}`,
  )
}

void main()
```

## EIP Activation

Toggle individual EIPs on top of a hardfork via `Common` `eips`:

```ts
// ./examples/vmWithEIPs.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createVM } from '@ethereumjs/vm'

const main = async () => {
  const commonCancun = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })
  const vm = await createVM({ common: commonCancun })
  console.log(`EIP-4844 active on Cancun: ${vm.common.isActivatedEIP(4844)}`)

  const common7702 = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })
  const vm7702 = await createVM({ common: common7702 })
  console.log(
    `EIP-7702 active in isolation on Cancun: ${vm7702.common.isActivatedEIP(7702)}`,
  )
}

void main()
```

See [Supported EIPs](#supported-eips) and [@ethereumjs/evm Supported EIPs](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#supported-eips). WASM crypto backends: [@ethereumjs/common](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common).

## RPC Mainnet Block

Fetch a live mainnet block via JSON-RPC and execute it with [`RPCStateManager`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/statemanager) (on-demand account/storage fetches). See [`examples/runBlockWithRPC.ts`](./examples/runBlockWithRPC.ts).

> **Note:** Recent mainnet blocks trigger **thousands of RPC requests**. Mind rate limits and quotas.

```sh
npx tsx examples/runBlockWithRPC.ts <providerUrl> <blockNumber>
```

Skips cleanly in CI when no RPC URL is provided.

## Offline Mainnet Block

Replay bundled mainnet block fixtures from [`examples/data/`](./examples/data/) — no network required. Defaults to block `24476000` when run without arguments:

```sh
npx tsx examples/runMainnetBlock.ts [blockNumber]
```

Bundled blocks with verified offline gas match: `24476000`, `24476001`, `24476003`, `24476004`, `24476005`, `24476009`.

Additional examples: [`runSolidityContract.ts`](./examples/runSolidityContract.ts) (compile + deploy + call), [`runBlockBALGenerate.ts`](./examples/runBlockBALGenerate.ts) / [`runBlockBALValidate.ts`](./examples/runBlockBALValidate.ts) / [`buildBlockBAL.ts`](./examples/buildBlockBAL.ts) (EIP-7928 BAL), [`runBlockchain.ts`](./examples/runBlockchain.ts) (multi-block mock chain).

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

### Layout

The VM is a thin orchestration layer that drives the `EVM` at the transaction and block level. Processing functions are free-standing (`runX(vm, opts)`), not methods. Step-by-step `runBlock` flow: [Internal Structure](#internal-structure).

| Module | Role |
| --- | --- |
| `vm.ts` | Holds `evm`, `stateManager`, `blockchain`, `common`, `events` |
| `runBlock.ts` | Block processing (tx loop, withdrawals, requests, rewards, post-state) |
| `runTx.ts` | Tx rules, `runCall`, refunds, receipts |
| `buildBlock.ts` | Incremental block construction |
| `requests.ts` | EIP-7685 request extraction |

Receipts bloom, `paramsVM`, and `createVM` live in `bloom/`, `params.ts`, and `constructors.ts`.

### Extension Points

The `VM` is customized through `createVM` / `VMOpts`; most behaviour is delegated to injectable collaborators:

- **Custom `EVM`** — `evm` (or `evmOpts`): pass an `EVM` you configured (for example with custom opcodes or precompiles — see the [EVM extension points](../evm/README.md#extension-points)). If omitted, the VM creates one.
- **Custom state manager** — `stateManager`: any `StateManagerInterface`.
- **Custom blockchain** — supplies block-hash lookups for `BLOCKHASH` / `BLOBHASH`; defaults to a minimal mock.
- **Custom `Common`** — chain / hardfork / EIP configuration, shared with the inner `EVM`.
- **Custom parameters** — `params`: override `paramsVM` values.
- **Lifecycle hooks** — subscribe to `vm.events` (`beforeBlock`, `afterBlock`, `beforeTx`, `afterTx`) and `vm.evm.events` (`step`, `beforeMessage`, …) for tracing.

## Setup

### Chains
Beside the default Proof-of-Stake setup coming with the `Common` library default, the VM also support the execution of  both `Ethash/PoW` and `Clique/PoA` blocks and transactions to allow to re-execute blocks from older hardforks or testnets.

### Hardforks

Pass `hardfork` on `Common` when creating the VM — see [Getting Started](#getting-started). Full hardfork list: [@ethereumjs/evm Supported Hardforks](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#supported-hardforks).

### Custom Genesis State

See [Genesis State](#genesis-state) for loading canonical allocations. Genesis state can include EOAs and system contracts with initial storage.

## Supported EIPs

Individual EIP activation is shown in [EIP Activation](#eip-activation). For the full EIP list see [@ethereumjs/evm Supported EIPs](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#supported-eips).

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

### Amsterdam hardfork (experimental)

This section is the **canonical overview** for experimental Amsterdam support: which library release maps to which spec snapshot, and where to read more. Amsterdam remains unstable — expect further `10.1.x` releases as the spec and testnets evolve.

**Release ↔ spec tracking**

| Release | Summary | EST fixtures | Testnet |
| --- | --- | --- | --- |
| `v10.1.2` | First experimental Amsterdam release: full 9-EIP `Hardfork.Amsterdam` bundle, BAL builder/validator APIs (7928), two-dimensional block gas (8037); passes v700 mixed EST slice. | [tests-bal@v7.1.0](https://github.com/ethereum/execution-specs/releases/tag/tests-bal@v7.1.0) | [BAL devnet-7](https://notes.ethereum.org/@ethpandaops/bal-devnet-7) |

Master currently tracks [tests-glamsterdam-devnet@v7.2.1](https://github.com/ethereum/execution-specs/releases/tag/tests-glamsterdam-devnet%40v7.2.1) for the mixed Amsterdam tree. Tx-level intrinsic vs calldata floor: [@ethereumjs/tx Amsterdam Validation](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#amsterdam-validation). Runtime new-account state gas: [EIP-8037 section](#eip-8037-state-creation-gas-cost-increase-amsterdam) below.

The `Hardfork.Amsterdam` bundle activates the following EIPs. Amsterdam test fixtures and execution-spec tests typically enable the full set together rather than individual EIPs in isolation.

| EIP | Summary | Documentation |
| --- | --- | --- |
| [2780](https://eips.ethereum.org/EIPS/eip-2780) | Intrinsic includes recipient/value extras; floor anchored on that base | [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#amsterdam-validation) |
| [7708](https://eips.ethereum.org/EIPS/eip-7708) | ETH transfers and burns emit logs | [EVM](#eip-7708-eth-transfer-and-burn-logs-amsterdam) (below), receipts from `runTx()` / `runBlock()` |
| [7843](https://eips.ethereum.org/EIPS/eip-7843) | `SLOTNUM` opcode + `slotNumber` header field | [@ethereumjs/block](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/block#blocks-with-eip-7843-slot-number) |
| [7778](https://eips.ethereum.org/EIPS/eip-7778) | Block gas accounting without refund subtraction | [EIP-7778 note](#eip-7778-block-gas-accounting-amsterdam) (below) |
| [7928](https://eips.ethereum.org/EIPS/eip-7928) | Block Level Access Lists | [EIP-7928 section](#eip-7928-block-level-access-lists-amsterdam) (below) |
| [7954](https://eips.ethereum.org/EIPS/eip-7954) | Raised max contract / initcode size | [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#eip-7954-contract-and-initcode-size-limits-amsterdam) |
| [7976](https://eips.ethereum.org/EIPS/eip-7976) | Uniform calldata floor pricing | [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#amsterdam-validation) |
| [7981](https://eips.ethereum.org/EIPS/eip-7981) | Access-list byte floor pricing | [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#amsterdam-validation) |
| [7997](https://eips.ethereum.org/EIPS/eip-7997) | Deterministic CREATE2 factory predeploy | Catalog only — clients must not inject at the fork boundary |
| [8024](https://eips.ethereum.org/EIPS/eip-8024) | `DUPN`, `SWAPN`, `EXCHANGE` stack opcodes | [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#eip-8024-stack-opcodes-amsterdam) |
| [8037](https://eips.ethereum.org/EIPS/eip-8037) | Two-dimensional block gas + state-gas reservoir | [EIP-8037 section](#eip-8037-state-creation-gas-cost-increase-amsterdam) (below) |
| [8038](https://eips.ethereum.org/EIPS/eip-8038) | State-access gas; SSTORE access cost before implicit read | [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#eip-8037-state-creation-gas-amsterdam) |
| [8246](https://eips.ethereum.org/EIPS/eip-8246) | SELFDESTRUCT no longer burns ETH | EVM `SELFDESTRUCT` + journal; no burn log under EIP-7708 |
| [8282](https://eips.ethereum.org/EIPS/eip-8282) | Builder deposit/exit request predeploys (v7 mined addresses) | `runBlock()` / `accumulateRequests`; addresses in `packages/vm/src/params.ts` |

**Activation:** `new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })`. See [Release ↔ spec tracking](#amsterdam-hardfork-experimental) above for supported spec snapshots; behaviour may change on patch releases.

### EIP-7928 Block Level Access Lists (Amsterdam)

[EIP-7928](https://eips.ethereum.org/EIPS/eip-7928) adds a block-level access list (BAL) committed via `blockAccessListHash` in the block header. When EIP-7928 is active, the VM accumulates state accesses automatically during `runBlock()` / `runTx()` — no extra opt-in flag is required. See [Release ↔ spec tracking](#amsterdam-hardfork-experimental) above for the EST / testnet snapshot this release targets.

**Activation:** use `Hardfork.Amsterdam` (experimental).

**Block builder flow (`generate: true`):** execute the block, read `RunBlockResult.blockLevelAccessList`, and use the returned block from the `afterBlock` event — its header includes `blockAccessListHash` (set from `bal.hash()`).

```ts
// ./examples/runBlockBALGenerate.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  Account,
  bytesToHex,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, runBlock } from '@ethereumjs/vm'

import type { AfterBlockEvent } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, new Account(0n, BigInt(1e18)))

  const parentBlock = createBlock(
    { header: { number: 1n } },
    { common, skipConsensusFormatValidation: true },
  )
  const tx = createLegacyTx({
    gasLimit: 21000n,
    gasPrice: 10n,
    value: 1n,
    to: createZeroAddress(),
  }).sign(senderKey)

  const block = createBlock(
    {
      header: { number: 2n, gasLimit: 30_000_000n, baseFeePerGas: 1n },
      transactions: [tx],
    },
    {
      common,
      skipConsensusFormatValidation: true,
      calcDifficultyFromHeader: parentBlock.header,
    },
  )

  let afterBlock: AfterBlockEvent | undefined
  vm.events.once('afterBlock', (event) => {
    afterBlock = event
  })

  const result = await runBlock(vm, {
    block,
    generate: true,
    skipBlockValidation: true,
  })

  const bal = result.blockLevelAccessList!
  console.log(`BAL accounts: ${bal.toJSON().length}`)
  console.log(`blockAccessListHash: ${bytesToHex(afterBlock!.block.header.blockAccessListHash!)}`)
  console.log(`hash matches result: ${bytesToHex(bal.hash())}`)
}

void main()

```

**Block validator flow:** pass the BAL from an execution payload via `RunBlockOpts.blockAccessList` (JSON, RLP bytes, or a `BlockLevelAccessList` instance). `runBlock()` validates structure and header hash before execution and checks equality against the generated list afterward.

```ts
// ./examples/runBlockBALValidate.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  Account,
  bytesToHex,
  createAddressFromPrivateKey,
  createZeroAddress,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, runBlock } from '@ethereumjs/vm'

import type { Block } from '@ethereumjs/block'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })

const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = createAddressFromPrivateKey(senderKey)

async function fundSender(vm: Awaited<ReturnType<typeof createVM>>) {
  await vm.stateManager.putAccount(sender, new Account(0n, BigInt(1e18)))
}

function createTransferBlock() {
  const parentBlock = createBlock(
    { header: { number: 1n } },
    { common, skipConsensusFormatValidation: true },
  )
  const tx = createLegacyTx({
    gasLimit: 21000n,
    gasPrice: 10n,
    value: 1n,
    to: createZeroAddress(),
  }).sign(senderKey)

  return createBlock(
    {
      header: { number: 2n, gasLimit: 30_000_000n, baseFeePerGas: 1n },
      transactions: [tx],
    },
    {
      common,
      skipConsensusFormatValidation: true,
      calcDifficultyFromHeader: parentBlock.header,
    },
  )
}

const main = async () => {
  const vm = await createVM({ common })
  await fundSender(vm)

  let sealedBlock: Block | undefined
  vm.events.once('afterBlock', (event) => {
    sealedBlock = event.block
  })

  const generated = await runBlock(vm, {
    block: createTransferBlock(),
    generate: true,
    skipBlockValidation: true,
  })

  const balJson = generated.blockLevelAccessList!.toJSON()
  console.log(`Generated BAL with ${balJson.length} account(s)`)
  console.log(`blockAccessListHash: ${bytesToHex(sealedBlock!.header.blockAccessListHash!)}`)

  const vm2 = await createVM({ common })
  await fundSender(vm2)

  await runBlock(vm2, {
    block: sealedBlock!,
    blockAccessList: balJson,
    skipBlockValidation: true,
  })

  console.log('Provided blockAccessList validated successfully against execution')
}

void main()

```

**Offline parsing / validation:** see the [@ethereumjs/util BAL module](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util#module-bal) for `BlockLevelAccessList`, JSON/RLP helpers, and validation utilities. To apply a BAL onto state without executing the block, use `stateManager.consumeBAL(bal)` from `@ethereumjs/statemanager`.

**Notes:**

- Amsterdam test fixtures often bundle additional EIPs (e.g. EIP-8037); use `Hardfork.Amsterdam` rather than activating EIP-7928 in isolation.
- `buildBlock()` writes `blockAccessListHash` from the accumulated BAL and defaults `slotNumber` to `parent.slotNumber + 1` when the field is omitted. `runBlock({ generate: true })` still does not invent a consensus slot number.

### EIP-8037 State creation gas cost increase (Amsterdam)

See [Release ↔ spec tracking](#amsterdam-hardfork-experimental) above for the supported Amsterdam spec snapshot.

[EIP-8037](https://eips.ethereum.org/EIPS/eip-8037) splits block gas into **regular** and **state** dimensions. `runBlock()`, `runTx()`, and `buildBlock()` apply this automatically. Header `gasUsed` is `max(block_regular_gas, block_state_gas)`. For a first-touch transfer that reports both dimensions, see [Amsterdam Gas Dimensions](#amsterdam-gas-dimensions).

**Charging (v7 fixtures):**

- Intrinsic gas and the calldata floor are **regular** and computed on `@ethereumjs/tx` (`getMinimumGasLimit()`). See [Amsterdam Validation](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#amsterdam-validation). `txRegularGas` is `max(raw_regular, floor)`.
- New-account state gas and 7702 `ACCOUNT_WRITE` are charged at top-frame access (pre-state). `ACCOUNT_WRITE` counts toward receipt `totalGasSpent`.
- Block inclusion (`txExceedsAvailableBlockGas8037()` in `@ethereumjs/evm`): remaining regular vs `min(TX_MAX, tx.gas)`, remaining state vs `tx.gas`.

**`RunTxResult` fields (EIP-8037 active):**

| Field | Meaning |
| --- | --- |
| `txRegularGas` | Regular-dimension total (`max(raw_regular, calldata_floor)` per EIP-7623 / EIP-7976) |
| `txStateGas` | State-dimension total (execution state gas, net of create / selfdestruct refunds) |
| `blockGasSpent` | Amount counted toward block gas (see EIP-7778 below) |
| `totalGasSpent` | Amount paid by the sender (refunds subtracted) |

Opcode-level reservoir behaviour and CREATE charging: [@ethereumjs/evm EIP-8037](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#eip-8037-state-creation-gas-amsterdam).

**Dependency:** EIP-8037 requires [EIP-7825](https://eips.ethereum.org/EIPS/eip-7825) (`maxTransactionGasLimit`) — both are active on `Hardfork.Amsterdam`.

### EIP-7778 Block gas accounting (Amsterdam)

See [Release ↔ spec tracking](#amsterdam-hardfork-experimental) above for the supported Amsterdam spec snapshot.

[EIP-7778](https://eips.ethereum.org/EIPS/eip-7778) changes how gas refunds affect block-level accounting. `RunTxResult.totalGasSpent` is what the sender pays (refunds subtracted). `RunTxResult.blockGasSpent` is what counts toward the block header's `gasUsed` — under EIP-7778 this **does not** subtract tx-level refunds (`blockGasSpent = max(totalGasSpent, floorCost)`). Receipt `cumulativeGasUsed` still uses the pre-7778 refund semantics via a separate accumulator inside `runBlock()`.

### EIP-7708 ETH transfer and burn logs (Amsterdam)

See [Release ↔ spec tracking](#amsterdam-hardfork-experimental) above for the supported Amsterdam spec snapshot.

[EIP-7708](https://eips.ethereum.org/EIPS/eip-7708) adds synthetic logs for native ETH transfers and balance burns. When active, value-bearing `CALL`/`CREATE` paths and certain `SELFDESTRUCT`/account-removal flows append logs from the system address (`0xfff…fff`) with `Transfer(address,address,uint256)` or `Burn(address,uint256)` topics. These appear in `RunTxResult.receipt.logs` like any other log — no VM API changes are needed beyond using `Hardfork.Amsterdam`. See [Receipts and Event Logs](#receipts-and-event-logs). For a stand-alone `runCall()` Transfer (no receipt) see the [`@ethereumjs/evm` EIP-7708 example](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm/examples/eip7708TransferLog.ts).

## Understanding the VM

If you want to understand your VM runs we have added a hierarchically structured list of debug loggers for your convenience which can be activated in arbitrary combinations. We also use these loggers internally for development and testing. These loggers use the [debug](https://github.com/visionmedia/debug) library and can be activated on the CL with `DEBUG=ethjs,[Logger Selection] node [Your Script to Run].js` and produce output like the following:

![EthereumJS VM Debug Logger](./debug.png?raw=true)

The following loggers are currently available:

| Logger      | Description                                                        |
| ----------- | ------------------------------------------------------------------ |
| `vm:block`  | Block operations (run txs, generating receipts, block rewards,...) |
| `vm:tx`     |  Transaction operations (account updates, checkpointing,...)       |
| `vm:tx:gas` |  Transaction gas logger                                            |
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

The VM processes state changes at several levels:

- **[`runBlock`](./src/runBlock.ts)**: Processes a single block.
  - Performs initial setup: Validates hardfork compatibility, sets the state root (if provided), applies DAO fork logic if necessary.
  - Manages state checkpoints before and after processing.
  - Iterates through transactions within the block:
    - For each transaction, calls `runTx`.
  - Processes withdrawals (post-Shanghai/EIP-4895).
  - Calculates and assigns block rewards to the miner (and uncles, pre-Merge).
  - Finalizes the block state (state root, receipts root, logs bloom).
  - Commits or reverts state changes based on success.
- **[`runTx`](./src/runTx.ts)**: Processes a single transaction.
  - Performs pre-execution checks: Sender balance sufficient for gas+value, sender nonce validity, transaction gas limit against block gas limit, EIP activations (e.g., 2930 Access Lists, 1559 Fee Market, 4844 Blobs).
  - Warms up state access based on Access Lists (EIP-2929/2930).
  - Pays intrinsic gas cost.
  - Executes the transaction code using `vm.evm.runCall` (or specific logic for contract creation).
  - Calculates gas used and refunds remaining gas.
  - Transfers gas fees to the fee recipient (recipient receives all pre EIP-1559, base fee is burned post EIP-1559).
  - Generates a transaction receipt.
  - Manages state checkpoints and commits/reverts changes for the transaction.
- **[`vm.evm.runCall`](../evm/src/evm.ts)** (within `@ethereumjs/evm`): Executes the EVM code for a transaction (message call or contract creation).
  - Steps through EVM opcodes.
  - Manages memory, stack, and storage changes.
  - Handles exceptions and gas consumption during execution.

Note: The process of iterating through the blockchain (block by block) is typically managed by components outside the core VM package, such as `@ethereumjs/blockchain` or a full client implementation, which then utilize the VM's `runBlock` method.

## Development

Developer documentation - currently mainly with information on testing and debugging - can be found [here](./DEVELOPER.md).

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

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
