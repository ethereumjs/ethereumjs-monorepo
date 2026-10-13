# @ethereumjs/evm `v10`

[![NPM Package][evm-npm-badge]][evm-npm-link]
[![GitHub Issues][evm-issues-badge]][evm-issues-link]
[![Actions Status][evm-actions-badge]][evm-actions-link]
[![Code Coverage][evm-coverage-badge]][evm-coverage-link]
[![Discord][discord-badge]][discord-link]

| TypeScript implementation of the Ethereum EVM. |
| ---------------------------------------------- |

Runnable examples live in [`examples/`](./examples/) (including [`precompiles/`](./examples/precompiles/) and [`opcodes/`](./examples/opcodes/) subfolders).

- 🦄 All hardforks up to **Osaka** (**Amsterdam** in development)
- 🌴 Tree-shakeable API
- 👷🏼 Controlled dependency set (7 external + `@Noble` crypto)
- 🧩 Flexible EIP on/off engine
- 🔧 Custom opcodes and precompiles
- 📜 **EIP-7708** Transfer logs and **EIP-8037** state gas (Amsterdam, experimental)
- 🧮 **EIP-8024** stack opcodes and **EIP-7843** `SLOTNUM` (Amsterdam, experimental)
- 🚀 Built-in profiler
- 🪢 User-friendly colored debugging
- 🛵 422KB bundle size (110KB gzipped)
- 🏄🏾‍♂️ WASM-free default + Fully browser ready

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Contract Calls (`runCall`)](#contract-calls-runcall)
- [Amsterdam (experimental)](#amsterdam-experimental)
- [EIP Activation](#eip-activation)
- [Customizing the EVM](#customizing-the-evm)
- [Observability](#observability)
- [Precompiles](#precompiles)
- [Browser](#browser)
- [API](#api)
- [Architecture](#architecture)
- [Supported Hardforks](#supported-hardforks)
- [Supported EIPs](#supported-eips)
- [Development](#development)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/evm
```

**Note:** Starting with the Dencun hardfork, the EIP-4844 point-evaluation precompile (`0x0a`) requires a separate KZG library install — see [KZG Setup](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx/README.md#kzg-setup).

## Getting Started

Use `@ethereumjs/evm` when you need bytecode or message execution without full transaction/block processing. For signed transactions, receipts, and block assembly, use [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm).

| API | Use when |
| --- | --- |
| `runCode()` | Executing raw bytecode (tests, sandboxes, utilities) |
| `runCall()` | Full message path: checkpoints, value transfer, nonce updates |

`createEVM()` returns a standalone instance with a default `SimpleStateManager` and mock blockchain:

```ts
// ./examples/runBytecode.ts

import { createEVM } from '@ethereumjs/evm'
import { hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const evm = await createEVM()
  const res = await evm.runCode({ code: hexToBytes('0x6001') }) // PUSH1 01 -- simple bytecode to push 1 onto the stack
  console.log(res.executionGasUsed) // 3n
}

void main()
```

Pin a hardfork via `Common` when you need rules beyond the default (`prague`):

```ts
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

const evm = await createEVM({
  common: new Common({ chain: Mainnet, hardfork: Hardfork.Prague }),
})
```

## Contract Calls (`runCall`)

`runCall()` runs the full message path. Put contract code on the state manager, then call the address:

```ts
// ./examples/runCallWithState.ts

import { createEVM } from '@ethereumjs/evm'
import { Account, bytesToHex, createAddressFromString, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const evm = await createEVM()
  const caller = createAddressFromString('0x00000000000000000000000000000000000000ee')
  const contract = createAddressFromString('0x00000000000000000000000000000000000000c0')

  // PUSH1 03 PUSH1 05 ADD — store 8 at memory[0], RETURN 32 bytes
  const code = hexToBytes('0x600360050160005260206000F3')
  await evm.stateManager.putCode(contract, code)
  await evm.stateManager.putAccount(caller, new Account(0n, 1_000_000_000_000n))

  const result = await evm.runCall({
    caller,
    to: contract,
    gasLimit: 100_000n,
  })

  console.log(`Return value: ${bytesToHex(result.execResult.returnValue)}`)
  console.log(`Gas used: ${result.execResult.executionGasUsed}`)
}

void main()
```

**State and blockchain.** Pass a `@ethereumjs/statemanager` instance for persistent accounts and storage; an optional `@ethereumjs/blockchain` provides `BLOCKHASH` access. See [`withBlockchain.ts`](./examples/withBlockchain.ts) for wiring with `MerkleStateManager`. WASM crypto backends can replace the default JavaScript implementations — see [@ethereumjs/common](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common) for `customCrypto` setup.

For async event listeners on `runCall`, see [Events](#events).

## Amsterdam (experimental)

Amsterdam is the current development hardfork. Behaviour is unstable — expect further `10.1.x` releases as the spec evolves. Release ↔ spec tracking and the full EIP bundle live in the [canonical Amsterdam overview](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#amsterdam-hardfork-experimental) in `@ethereumjs/vm`.

**Activation:** `new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })`.

| EIP | EVM-layer summary | Detail |
| --- | --- | --- |
| [8024](https://eips.ethereum.org/EIPS/eip-8024) | `DUPN`, `SWAPN`, `EXCHANGE` stack opcodes | [below](#eip-8024-stack-opcodes-amsterdam) |
| [7843](https://eips.ethereum.org/EIPS/eip-7843) | `SLOTNUM` opcode + `slotNumber` header field | [below](#eip-7843-slotnum-opcode-amsterdam) |
| [7954](https://eips.ethereum.org/EIPS/eip-7954) | Raised max contract / initcode size | [below](#eip-7954-contract-and-initcode-size-limits-amsterdam) |
| [7708](https://eips.ethereum.org/EIPS/eip-7708) | Synthetic `Transfer` logs on value-bearing calls | [below](#eip-7708-eth-transfer-logs-amsterdam) |
| [8037](https://eips.ethereum.org/EIPS/eip-8037) / [8038](https://eips.ethereum.org/EIPS/eip-8038) | Two-dimensional state gas reservoir | [below](#eip-8037-state-creation-gas-amsterdam) |
| [7928](https://eips.ethereum.org/EIPS/eip-7928) | Block Level Access Lists | [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#eip-7928-block-level-access-lists-amsterdam) — accumulates on `evm.blockLevelAccessList` |
| [8246](https://eips.ethereum.org/EIPS/eip-8246) | SELFDESTRUCT no longer burns ETH | Journal / `SELFDESTRUCT` behaviour |
| [8282](https://eips.ethereum.org/EIPS/eip-8282) | Builder execution requests | [@ethereumjs/vm EIP-8282](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#eip-8282-builder-execution-requests-amsterdam) |

Tx-level Amsterdam rules (intrinsic gas, calldata floor, access-list pricing): [@ethereumjs/tx Amsterdam Validation](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#amsterdam-validation).

### EIP-8024 stack opcodes (Amsterdam)

[EIP-8024](https://eips.ethereum.org/EIPS/eip-8024) adds three backward-compatible stack manipulation opcodes, each with a single-byte immediate operand:

| Opcode | Byte | Effect |
| --- | --- | --- |
| `DUPN` | `0xe6` | Duplicate the stack item at depth `n` (immediate encodes `n`) |
| `SWAPN` | `0xe7` | Swap the top item with the item at depth `n` |
| `EXCHANGE` | `0xe8` | Exchange items at depths `x` and `y` (pair immediate) |

The opcodes are active on `Hardfork.Amsterdam` and validated at decode time (invalid immediates trap). Gas costs: `dupnGas`, `swapnGas`, `exchangeGas` (default 3 each). They are supported in legacy bytecode and in EOF containers.

Runnable walkthrough: [`examples/opcodes/eip8024StackOpcodes.ts`](./examples/opcodes/eip8024StackOpcodes.ts). See also [CLZ (EIP-7939)](./examples/opcodes/eip7939ClzOpcode.ts) (Osaka) and [SLOTNUM (EIP-7843)](#eip-7843-slotnum-opcode-amsterdam).

### EIP-7843 SLOTNUM opcode (Amsterdam)

[EIP-7843](https://eips.ethereum.org/EIPS/eip-7843) adds `SLOTNUM` (`0x4b`), which pushes the executing block's consensus `slotNumber` onto the stack. Pass a block header that sets the field. A stand-alone `runCode()` without a block uses a mock header with `slotNumber: 0n`:

```ts
// ./examples/opcodes/eip7843SlotnumOpcode.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

const SLOTNUM = 0x4b
const STOP = 0x00

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const evm = await createEVM({ common })

  const slotNumber = 42n
  const block = createBlock(
    { header: { slotNumber, gasLimit: 30_000_000n } },
    { common, skipConsensusFormatValidation: true },
  )

  const res = await evm.runCode({
    code: Uint8Array.from([SLOTNUM, STOP]),
    block,
    gasLimit: 100_000n,
  })

  const [top] = res.runState!.stack.peek(1)
  console.log(`SLOTNUM read consensus slot ${top} (header.slotNumber=${slotNumber})`)
  console.log(`Gas used: ${res.executionGasUsed}`)
}

void main()
```

Header construction: [`@ethereumjs/block` slot number](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/block#eip-7843-slot-number).

### EIP-7954 contract and initcode size limits (Amsterdam)

[EIP-7954](https://eips.ethereum.org/EIPS/eip-7954) raises the EVM size limits when active on `Hardfork.Amsterdam`:

| Parameter | Pre-7954 | Post-7954 |
| --- | --- | --- |
| `maxCodeSize` | 24 KiB (24576) | 64 KiB (65536) |
| `maxInitCodeSize` | 48 KiB (49152) | 128 KiB (131072) |

These are `Common` parameters — after `createEVM()` merges `paramsEVM`, read them with `evm.common.param('maxCodeSize')` and `evm.common.param('maxInitCodeSize')`. No separate API beyond selecting the Amsterdam hardfork. `@ethereumjs/tx` rejects initcode above `maxInitCodeSize` at construction time; the EVM enforces the same limit on `CREATE` / `CREATE2` and caps deployed runtime code at `maxCodeSize`.

Runnable walkthrough: [`examples/eip7954MaxCodeSize.ts`](./examples/eip7954MaxCodeSize.ts) — compares Prague vs Amsterdam limits and deploys a 24577-byte contract (one byte above the legacy cap). Prague fails with `code size to deposit exceeds maximum code size`; Amsterdam succeeds (large deploys need generous `gasLimit` under EIP-8037 state-gas). For the transaction path use `@ethereumjs/vm` `runTx()`.

### EIP-7708 ETH transfer logs (Amsterdam)

[EIP-7708](https://eips.ethereum.org/EIPS/eip-7708) emits a system-address `Transfer(address,address,uint256)` log on value-bearing `CALL`/`CREATE`. `runCall()` returns it on `execResult.logs` even when the recipient has no code. Use `decodeEIP7708TransferLog()` to pick Transfer logs out of mixed opcode logs.

`Burn` logs are created in `@ethereumjs/vm` `runTx()` finalization, not by a stand-alone `runCall()`. For receipts see the [`runTxTransferLogs`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm/examples/runTxTransferLogs.ts) example.

```ts
// ./examples/eip7708TransferLog.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM, decodeEIP7708TransferLog } from '@ethereumjs/evm'
import { bytesToHex, createAccount, createAddressFromString } from '@ethereumjs/util'

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
  const evm = await createEVM({ common })

  const caller = createAddressFromString('0x00000000000000000000000000000000000000ee')
  const recipient = createAddressFromString('0x00000000000000000000000000000000000000aa')
  await evm.stateManager.putAccount(caller, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  // Value-bearing CALL with no bytecode still emits a system-address Transfer log.
  const result = await evm.runCall({
    caller,
    to: recipient,
    value: 1n,
    gasLimit: 300_000n,
  })

  const logs = result.execResult.logs ?? []
  console.log(`runCall emitted ${logs.length} log(s)`)
  for (const [index, log] of logs.entries()) {
    const formatted = formatLog(log)
    console.log(`  log[${index}] emitter=${formatted.address}`)
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

### EIP-8037 state-creation gas (Amsterdam)

[EIP-8037](https://eips.ethereum.org/EIPS/eip-8037) splits gas into **regular** and **state** dimensions. State-touching opcodes draw from `evm.stateGasReservoir` first; overflow spills into `gas_left`. `runTx()` sizes the reservoir from the tx budget. A stand-alone `runCall()` starts at `0` unless you set it.

Inner `CREATE` / `CREATE2` charges new-account state gas unless the target already has nonce or code. A create collision burns the 63/64 stipend without a child frame.

Helpers (used by `@ethereumjs/vm`, available for custom runners):

| Helper | Role |
| --- | --- |
| `computeIntrinsicGasDimensions8037()` | Intrinsic gas is regular-only under current v7 rules (`intrinsicState` is `0`) |
| `txExceedsAvailableBlockGas8037()` | Per-tx block inclusion: regular bound is `min(TX_MAX, tx.gas)`, state bound is full `tx.gas` |
| `activeCostPerStateByte()` | `costPerStateByte` from `Common` |

[EIP-8038](https://eips.ethereum.org/EIPS/eip-8038) (same fork) raises state-access costs and charges SSTORE access **before** the implicit storage read (`max(access cost, stipend + 1)`).

Transaction results, header `gasUsed = max(regular, state)`, and wallet `gasLimit` guidance: [@ethereumjs/vm EIP-8037](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#eip-8037-state-creation-gas-cost-increase-amsterdam).

## EIP Activation

Activate individual EIPs on top of a hardfork via `Common` `eips`:

```ts
// ./examples/activateEIP7702.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })
  const evm = await createEVM({ common })
  console.log(
    `EIP 7702 is active in isolation on top of the Cancun HF - ${evm.common.isActivatedEIP(7702)}`,
  )
}

void main()
```

See [Supported EIPs](#supported-eips) for the full index. Opcode-focused samples: [`examples/opcodes/`](./examples/opcodes/) ([EIP-8024](./examples/opcodes/eip8024StackOpcodes.ts), [EIP-7843 SLOTNUM](./examples/opcodes/eip7843SlotnumOpcode.ts), [EIP-7939 CLZ](./examples/opcodes/eip7939ClzOpcode.ts)).

## Customizing the EVM

The `EVM` is customized through `createEVM` / `EVMOpts`:

- **Custom opcodes** — `customOpcodes`: add, override, or remove opcodes by number (handler + gas function).
- **Custom precompiles** — `customPrecompiles`: add or override a precompile at an address.
- **Custom state manager** — `stateManager`: any `StateManagerInterface`. Default is `SimpleStateManager`.
- **Custom `Common`** — hardfork / EIP gating and parameter resolution.
- **Custom parameters** — `params`: override `paramsEVM` values (for example a gas cost) without forking the package.
- **Custom crypto backends** — `bls` / `bn254`: native BLS12-381 / BN254 for the relevant precompiles.

### Custom Opcodes

Add, override, or remove opcodes via `customOpcodes` on `createEVM()`:

```ts
// ./examples/customOpcode.ts

import { createEVM } from '@ethereumjs/evm'
import { hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const evm = await createEVM({
    customOpcodes: [
      {
        opcode: 0x21,
        opcodeName: 'PUSH_ONE',
        baseFee: 3,
        gasFunction(_runState, gas) {
          return gas
        },
        logicFunction(runState) {
          runState.stack.push(1n)
        },
      },
    ],
  })

  const res = await evm.runCode({
    code: hexToBytes('0x21'),
    gasLimit: 100_000n,
  })

  const [top] = res.runState!.stack.peek(1)
  console.log(`Stack top after custom opcode: ${top}`)
  console.log(`Gas used: ${res.executionGasUsed}`)
}

void main()
```

Pass `{ opcode: 0x01 }` (no handler) to delete a built-in opcode for that EVM instance.

### Custom Precompiles

Register custom precompiles at arbitrary addresses — add new ones, override built-ins, or delete by address only:

```ts
// ./examples/precompiles/customPrecompile.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'
import {
  bigIntToBytes,
  bytesToBigInt,
  bytesToHex,
  createAddressFromString,
  setLengthLeft,
} from '@ethereumjs/util'

import type { ExecResult, PrecompileInput } from '@ethereumjs/evm'

// Custom precompile that adds two 32-byte big-endian unsigned integers (mod 2^256).
const ADDITION_GAS = 15n

function additionPrecompile(input: PrecompileInput): ExecResult {
  const a = bytesToBigInt(input.data.subarray(0, 32))
  const b = bytesToBigInt(input.data.subarray(32, 64))
  const sum = (a + b) % 2n ** 256n
  return {
    executionGasUsed: ADDITION_GAS,
    returnValue: setLengthLeft(bigIntToBytes(sum), 32),
  }
}

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
  const ADDRESS = '0x000000000000000000000000000000000000ff01'

  // Register the custom precompile with a hex string address
  const evm = await createEVM({
    common,
    customPrecompiles: [{ address: ADDRESS, function: additionPrecompile }],
  })

  // Verify it is registered
  const fn = evm.getPrecompile(ADDRESS)
  console.log(`Precompile registered at ${ADDRESS}: ${fn !== undefined}`)

  // Build call data: two 32-byte values (7 + 35)
  const a = setLengthLeft(bigIntToBytes(7n), 32)
  const b = setLengthLeft(bigIntToBytes(35n), 32)
  const callData = new Uint8Array(64)
  callData.set(a, 0)
  callData.set(b, 32)

  // Execute via runCall
  const result = await evm.runCall({
    to: createAddressFromString(ADDRESS),
    gasLimit: BigInt(30000),
    data: callData,
  })

  console.log('--------------------------------')
  console.log('Custom Addition Precompile')
  console.log(`Input    : 7 + 35`)
  console.log(
    `Result   : ${bytesToBigInt(result.execResult.returnValue)} (${bytesToHex(result.execResult.returnValue)})`,
  )
  console.log(`Gas used : ${result.execResult.executionGasUsed}`)
  console.log('--------------------------------')
}

void main()
```

Use `evm.getPrecompile(address)` to retrieve built-in or custom precompiles. Override by registering at the same address; delete with `{ address: '0x...' }` only.

More precompile demos: [`examples/precompiles/`](./examples/precompiles/) (MODEXP, BLS12-381, P256 verify, …).

### Opcode table

Inspect the opcode table for a hardfork with `getOpcodesForHF()` — see [`examples/decodeOpcodes.ts`](./examples/decodeOpcodes.ts) for a minimal disassembly walkthrough.

## Observability

### Events

The EVM emits events via [EventEmitter3](https://github.com/primus/eventemitter3). Subscribe to `beforeMessage`, `afterMessage`, `step`, and `newContract`. Async listeners receive a `resolve` callback that must be called when finished:

```ts
// ./examples/eventListener.ts

import { createEVM } from '@ethereumjs/evm'
import { createAddressFromString, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const evm = await createEVM()

  evm.events.on('beforeMessage', (event) => {
    console.log('synchronous listener to beforeMessage', event)
  })
  evm.events.on('afterMessage', (event, resolve) => {
    console.log('asynchronous listener to afterMessage', event)
    // we need to call resolve() to avoid the event listener hanging
    resolve?.()
  })
  const res = await evm.runCall({
    to: createAddressFromString('0x0000000000000000000000000000000000000000'),
    value: 0n,
    data: hexToBytes('0x6001'), // PUSH1 01 -- simple bytecode to push 1 onto the stack
  })
  console.log(res.execResult.executionGasUsed) // 0n
}

void main()
```

If an exception is thrown from an async handler, it bubbles into the EVM and may corrupt state — avoid that in production tracing.

For opcode-level `step` tracing with state and blockchain wired in, see [`withBlockchain.ts`](./examples/withBlockchain.ts).

### Event Logs

The EVM records contract events as **logs** — a compact tuple reused across `@ethereumjs/evm`, `@ethereumjs/vm`, and (with field renaming) JSON-RPC:

```ts
type Log = [address: Uint8Array, topics: Uint8Array[], data: Uint8Array]
//            emitter            indexed fields   unindexed payload
```

Both `runCode()` and `runCall()` return an [`ExecResult`](./docs/interfaces/ExecResult.md) with an optional `logs` array. Nested calls append logs in execution order; a reverted top-level execution clears them. For transaction receipts and block blooms, use `@ethereumjs/vm`.

Bytecode `LOG*` emission: [`examples/emitLogs.ts`](./examples/emitLogs.ts). Native ETH `Transfer` logs on Amsterdam: [EIP-7708](#eip-7708-eth-transfer-logs-amsterdam).

### Debug logging

Hierarchically structured debug loggers use the [debug](https://github.com/visionmedia/debug) library. Activate on the CLI with `DEBUG=ethjs,[Logger Selection]`:

![EthereumJS EVM Debug Logger](./debug.png?raw=true)

| Logger                             | Description                                         |
| ---------------------------------- | --------------------------------------------------- |
| `evm:evm`                          |  EVM control flow, CALL or CREATE message execution |
| `evm:gas`                          |  EVM gas logger                                     |
| `evm:precompiles`                  |  EVM precompiles logger                             |
| `evm:journal`                      |  EVM journal logger                                 |
| `evm:ops`                          |  Opcode traces                                      |
| `evm:ops:[Lower-case opcode name]` | Traces on a specific opcode                         |

Examples:

```shell
DEBUG=ethjs,evm tsx test.ts
DEBUG=ethjs,evm:*,evm:*:* tsx test.ts
DEBUG=ethjs,evm,evm:ops:sstore,evm:*:gas tsx test.ts
```

`ethjs` **must** be included in the `DEBUG` environment variables to enable **any** logs.

### Profiling the EVM

Built-in profiling detects performance bottlenecks. The profiler is most useful when run through the EthereumJS [client](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/client) for realistic tx and state sizes.

Sync the client on mainnet or a larger testnet to the desired block, then run without sync using `--executeBlocks` and `--vmProfileBlocks` (or `--vmProfileTxs`):

```shell
npm run client:start -- --sync=none --vmProfileBlocks --executeBlocks=962720
```

![EthereumJS EVM Profiler](./profiler.png?raw=true)

The `total (ms)` column shows where time is spent relative to call count. Optimize for `Mgas/s` (gas processed per second). With a 30 Mio gas limit and 12 sec slot time, a rough minimum is `30M / 12 sec ≈ 2.5 Mgas/s`.

Note: profiler results for some opcodes (notably `SSTORE`) are distorted because checkpoint commit cost is not attributed to the opcode.

## Precompiles

This library supports all EVM precompiles up to the `Osaka` hardfork. The [`examples/precompiles/`](./examples/precompiles/) folder provides a `runPrecompile()` helper for direct runs.

BLS12_G1ADD example:

```ts
// ./examples/precompiles/bls12G1AddPrecompile.ts

import { runPrecompile } from './util.ts'

const main = async () => {
  // BLS12_G1ADD precompile (address 0xb)
  // Data taken from test/eips/precompiles/bls/add_G1_bls.json
  // Input: G1 and G2 points (each 128 bytes = 256 hex characters)
  const g1Point =
    '0000000000000000000000000000000017f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb0000000000000000000000000000000008b3f481e3aaa0f1a09e30ed741d8ae4fcf5e095d5d00af600db18cb2c04b3edd03cc744a2888ae40caa232946c5e7e1'
  const g2Point =
    '00000000000000000000000000000000112b98340eee2777cc3c14163dea3ec97977ac3dc5c70da32e6e87578f44912e902ccef9efe28d4a78b8999dfbca942600000000000000000000000000000000186b28d92356c4dfec4b5201ad099dbdede3781f8998ddf929b4cd7756192185ca7b8f4ef7088f813270ac3d48868a21'
  const data = `0x${g1Point}${g2Point}`

  await runPrecompile('BLS12_G1ADD', '0xb', data)
}

void main()

```

### EIP-2537 BLS Precompiles (Prague)

Starting with `v10` the EVM supports the BLS precompiles introduced with [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537). These run natively using [@noble/curves](https://github.com/paulmillr/noble-curves).

An alternative WASM implementation (using [bls-wasm](https://github.com/herumi/bls-wasm)) can be optionally used for performance:

```ts
import { EVM, MCLBLS } from '@ethereumjs/evm'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Prague })
await mcl.init(mcl.BLS12_381)
const mclbls = new MCLBLS(mcl)
const evm = await createEVM({ common, bls })
```

### EIP-7823/EIP-7883 MODEXP Precompile (Osaka)

The Osaka hardfork introduces behavioral changes with [EIP-7823](https://eips.ethereum.org/EIPS/eip-7823) and a gas cost increase for MODEXP with [EIP-7883](https://eips.ethereum.org/EIPS/eip-7883):

```ts
// ./examples/precompiles/modexpPrecompile.ts

import { Hardfork } from '@ethereumjs/common'
import { runPrecompile } from './util.ts'

const main = async () => {
  // MODEXP precompile (address 0x05)
  // Calculate: 2^3 mod 5 = 8 mod 5 = 3
  //
  // Input format:
  // - First 32 bytes: base length (0x01 = 1 byte)
  // - Next 32 bytes: exponent length (0x01 = 1 byte)
  // - Next 32 bytes: modulus length (0x01 = 1 byte)
  // - Next 1 byte: base value (0x02 = 2)
  // - Next 1 byte: exponent value (0x03 = 3)
  // - Next 1 byte: modulus value (0x05 = 5)

  const baseLen = '0000000000000000000000000000000000000000000000000000000000000001' // 1 byte
  const expLen = '0000000000000000000000000000000000000000000000000000000000000001' // 1 byte
  const modLen = '0000000000000000000000000000000000000000000000000000000000000001' // 1 byte
  const base = '02' // 2
  const exponent = '03' // 3
  const modulus = '05' // 5

  const data = `0x${baseLen}${expLen}${modLen}${base}${exponent}${modulus}`

  await runPrecompile('MODEXP', '0x05', data)
  await runPrecompile('MODEXP', '0x05', data, Hardfork.Cancun)
}

void main()

```

### EIP-7951 Precompile for secp256r1 Curve Support (Osaka)

The Osaka hardfork introduces secp256r1 curve support with [EIP-7951](https://eips.ethereum.org/EIPS/eip-7951). See [`p256VerifyPrecompile.ts`](./examples/precompiles/p256VerifyPrecompile.ts). Input values can be generated with Noble Curves [v2.0.0](https://github.com/paulmillr/noble-curves/releases/tag/2.0.0) or later.

For custom precompile registration, see [Custom Precompiles](#custom-precompiles).

## Browser

We provide hybrid ESM/CJS builds for all our libraries. With the v10 breaking release round from Spring 2025, all libraries are "pure-JS" by default and we have eliminated all hard-wired WASM code. Additionally we have substantially lowered the bundle sizes, reduced the number of dependencies, and cut out all usages of Node.js-specific primitives (like the Node.js event emitter).

It is easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

### Docs

For documentation on `EVM` instantiation, exposed API and emitted `events` see generated [API docs](./docs/README.md).

### Hybrid CJS/ESM Builds

With the breaking releases from Summer 2023 we have started to ship our libraries with both CommonJS (`cjs` folder) and ESM builds (`esm` folder), see `package.json` for the detailed setup.

If you use an ES6-style `import` in your code files, the ESM build will be used:

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

This package contains the inner Ethereum Virtual Machine core functionality which was included in the [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm) package up to v5 and has been extracted along the v6 release. A customized EVM can be passed as an optional argument to the outer `VM` instance.

Monorepo context: [ARCHITECTURE.md](../../ARCHITECTURE.md).

### Layout

`createEVM()` / `runCall()` / `runCode()` sit on the `EVM` class. Bytecode runs in the interpreter; opcodes and precompiles are hardfork-gated tables.

| Area | Role |
| --- | --- |
| `evm.ts` | Message dispatch (`runCall`, `runCode`), checkpoints, precompile dispatch |
| `interpreter.ts` | Fetch-decode-execute loop, gas, `step` events |
| `opcodes/`, `precompiles/` | Opcode and precompile handlers |
| `journal.ts` | Checkpoint / commit / revert onto `StateManagerInterface` |
| `eof/` | EOF container parse and verify |
| `params.ts` | `paramsEVM`, merged into `Common` |

Per-frame stack/memory, the `Message` object, and EIP-7864 witnesses live next to those files. `createEVM` and public option types are in `constructors.ts` / `types.ts`.

### Internal Structure

**`runCall`** — message execution (calls and creates): checkpoint state, set execution environment, handle value transfer and nonce updates, delegate to `_executeCall` / `_executeCreate` (both call `runInterpreter`), commit or revert, emit `beforeMessage` / `afterMessage`.

**`runCode`** — direct bytecode helper: minimal message context, calls `runInterpreter` without full message handling.

**Interpreter** — fetch-decode-execute loop: jump analysis, gas (static + dynamic), opcode handlers, `step` events. `CALL` / `CREATE` / `DELEGATECALL` re-enter `runCall`.

**Journal** — checkpointing and reversion; transient storage (EIP-1153) has its own checkpoint mechanism.

## Supported Hardforks

The EthereumJS EVM implements all hardforks from `Frontier` (`chainstart`) through **Osaka**, plus **Amsterdam** (experimental, in development).

| Range | Hardforks |
| --- | --- |
| Early | `chainstart` through `istanbul`, `muirGlacier` (mainnet only) |
| Berlin → Merge | `berlin`, `london`, `arrowGlacier` (mainnet only), `merge` |
| Recent | `shanghai`, `cancun`, `prague` (default), `osaka`, `amsterdam` (experimental) |

Default: `prague` (`Common.DEFAULT_HARDFORK`). Activate a ruleset by passing `hardfork` on the `Common` instance to `createEVM()` or the outer `@ethereumjs/vm`.

## Supported EIPs

Individual EIP activation is shown in [EIP Activation](#eip-activation). Amsterdam how-tos: [Amsterdam (experimental)](#amsterdam-experimental). Release ↔ spec tracking: [@ethereumjs/vm Amsterdam overview](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#amsterdam-hardfork-experimental).

Hardfork labels indicate default activation on that fork. `(Amsterdam, experimental)` and `(experimental)` mark unstable specs.

### Shanghai / Merge

- [EIP-3651](https://eips.ethereum.org/EIPS/eip-3651) - Warm COINBASE (Shanghai)
- [EIP-3675](https://eips.ethereum.org/EIPS/eip-3675) - Upgrade consensus to Proof-of-Stake
- [EIP-3855](https://eips.ethereum.org/EIPS/eip-3855) - PUSH0 opcode (Shanghai)
- [EIP-3860](https://eips.ethereum.org/EIPS/eip-3860) - Limit and meter initcode (Shanghai)
- [EIP-4399](https://eips.ethereum.org/EIPS/eip-4399) - Supplant DIFFICULTY opcode with PREVRANDAO (Merge)
- [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) - Beacon chain push withdrawals as operations (Shanghai)

### Cancun

- [EIP-1153](https://eips.ethereum.org/EIPS/eip-1153) - Transient storage opcodes
- [EIP-4788](https://eips.ethereum.org/EIPS/eip-4788) - Beacon block root in the EVM
- [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) - Shard Blob Transactions (`BLOBHASH`, point eval precompile `0x0a`)
- [EIP-5656](https://eips.ethereum.org/EIPS/eip-5656) - MCOPY
- [EIP-6780](https://eips.ethereum.org/EIPS/eip-6780) - SELFDESTRUCT only in same transaction
- [EIP-7516](https://eips.ethereum.org/EIPS/eip-7516) - BLOBBASEFEE opcode

### Prague

- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles
- [EIP-2935](https://eips.ethereum.org/EIPS/eip-2935) - Serve historical block hashes in state
- [EIP-6110](https://eips.ethereum.org/EIPS/eip-6110) - Supply validator deposits on chain
- [EIP-7002](https://eips.ethereum.org/EIPS/eip-7002) - Execution layer triggerable exits
- [EIP-7251](https://eips.ethereum.org/EIPS/eip-7251) - Increase the MAX_EFFECTIVE_BALANCE
- [EIP-7623](https://eips.ethereum.org/EIPS/eip-7623) - Increase calldata cost
- [EIP-7685](https://eips.ethereum.org/EIPS/eip-7685) - General purpose execution layer requests
- [EIP-7691](https://eips.ethereum.org/EIPS/eip-7691) - Blob throughput increase
- [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) - Set EOA account code

### Osaka

- [EIP-7594](https://eips.ethereum.org/EIPS/eip-7594) - PeerDAS blob transactions
- [EIP-7823](https://eips.ethereum.org/EIPS/eip-7823) - Set upper bounds for MODEXP
- [EIP-7825](https://eips.ethereum.org/EIPS/eip-7825) - Transaction gas limit cap
- [EIP-7883](https://eips.ethereum.org/EIPS/eip-7883) - ModExp gas cost increase
- [EIP-7918](https://eips.ethereum.org/EIPS/eip-7918) - Blob base fee bounded by execution cost
- [EIP-7934](https://eips.ethereum.org/EIPS/eip-7934) - RLP Execution Block Size Limit
- [EIP-7939](https://eips.ethereum.org/EIPS/eip-7939) - Count leading zeros (CLZ) opcode
- [EIP-7951](https://eips.ethereum.org/EIPS/eip-7951) - Precompile for secp256r1 curve support

### Amsterdam (experimental)

- [EIP-2780](https://eips.ethereum.org/EIPS/eip-2780) - Reduce intrinsic transaction gas — [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#amsterdam-validation)
- [EIP-7708](https://eips.ethereum.org/EIPS/eip-7708) - ETH transfers emit a log — [notes](#eip-7708-eth-transfer-logs-amsterdam)
- [EIP-7778](https://eips.ethereum.org/EIPS/eip-7778) - Block-level gas accounting without refunds — [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#eip-7778-block-gas-accounting-amsterdam)
- [EIP-7843](https://eips.ethereum.org/EIPS/eip-7843) - SLOTNUM opcode — [notes](#eip-7843-slotnum-opcode-amsterdam)
- [EIP-7928](https://eips.ethereum.org/EIPS/eip-7928) - Block Level Access Lists — [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#eip-7928-block-level-access-lists-amsterdam)
- [EIP-7954](https://eips.ethereum.org/EIPS/eip-7954) - Increase max contract and initcode size — [notes](#eip-7954-contract-and-initcode-size-limits-amsterdam)
- [EIP-7976](https://eips.ethereum.org/EIPS/eip-7976) - Increase calldata floor cost — [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#amsterdam-validation)
- [EIP-7981](https://eips.ethereum.org/EIPS/eip-7981) - Access list data pricing — [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#amsterdam-validation)
- [EIP-8024](https://eips.ethereum.org/EIPS/eip-8024) - DUPN, SWAPN and EXCHANGE instructions — [notes](#eip-8024-stack-opcodes-amsterdam)
- [EIP-8037](https://eips.ethereum.org/EIPS/eip-8037) - State creation gas cost increase — [notes](#eip-8037-state-creation-gas-amsterdam)
- [EIP-8038](https://eips.ethereum.org/EIPS/eip-8038) - State access gas cost increase — [notes](#eip-8037-state-creation-gas-amsterdam)
- [EIP-8246](https://eips.ethereum.org/EIPS/eip-8246) - SELFDESTRUCT no burn
- [EIP-8282](https://eips.ethereum.org/EIPS/eip-8282) - Builder execution requests — [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#eip-8282-builder-execution-requests-amsterdam)

### Experimental / cross-layer

- [EIP-7692](https://eips.ethereum.org/EIPS/eip-7692) - EVM Object Format (EOF) v1
- [EIP-7709](https://eips.ethereum.org/EIPS/eip-7709) - Read BLOCKHASH from storage (Verkle)
- [EIP-7864](https://eips.ethereum.org/EIPS/eip-7864) - Ethereum state using a unified binary tree

### Legacy / primarily tx or chain layer

- [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559), [EIP-2565](https://eips.ethereum.org/EIPS/eip-2565), [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718), [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929), [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930), [EIP-3198](https://eips.ethereum.org/EIPS/eip-3198), [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529), [EIP-3541](https://eips.ethereum.org/EIPS/eip-3541), [EIP-3554](https://eips.ethereum.org/EIPS/eip-3554), [EIP-3607](https://eips.ethereum.org/EIPS/eip-3607), [EIP-4345](https://eips.ethereum.org/EIPS/eip-4345), [EIP-5133](https://eips.ethereum.org/EIPS/eip-5133)

## Development

See [@ethereumjs/vm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm) README.

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

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
