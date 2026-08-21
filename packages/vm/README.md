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
- ⛽ **EIP-8037** two-dimensional gas + `estimateTxGasDimensions` (Amsterdam, experimental)
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
- [Amsterdam hardfork (experimental)](#amsterdam-hardfork-experimental)
- [Receipts and Event Logs](#receipts-and-event-logs)
- [Genesis and chains](#genesis-and-chains)
- [EIP Activation](#eip-activation)
- [Block replay](#block-replay)
- [Observability](#observability)
- [Browser](#browser)
- [API](#api)
- [Architecture](#architecture)
- [Supported EIPs](#supported-eips)
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

Use `@ethereumjs/vm` for signed transactions, block replay, receipts, and state updates. For raw bytecode or message execution without transaction rules, use [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm).

| API | Use when |
| --- | --- |
| `runTx()` | Execute a signed transaction (gas rules, receipts, refunds) |
| `runBlock()` | Replay or validate every transaction in a block |
| `buildBlock()` | Incrementally execute txs and assemble a block header |

`createVM()` and `runTx()` execute a signed transaction against an in-memory state:

```ts
// ./examples/runTx.ts

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { createAccount, createAddressFromPrivateKey, createZeroAddress, hexToBytes } from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
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

Access the inner EVM via `vm.evm` — see [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm).

## Run a Block

Replay a bundled block fixture offline (no RPC):

```ts
// ./examples/runPoABlockFromTestdata.ts

import { createBlock } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { mainnetBlocks } from '@ethereumjs/testdata'
import { bytesToHex } from '@ethereumjs/util'
import { createVM, runBlock } from '@ethereumjs/vm'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: 'chainstart' })
  const vm = await createVM({ common })

  const block = createBlock(mainnetBlocks[0], { common })
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

On `Hardfork.Amsterdam`, `buildBlock()` also writes `blockAccessListHash` and defaults `slotNumber` from the parent when unset — see [EIP-7928](#eip-7928-block-level-access-lists-amsterdam). Header `gasUsed` is `max(regular, state)` ([EIP-8037](#eip-8037-state-creation-gas-cost-increase-amsterdam)), matching `runBlock()`.

## Amsterdam hardfork (experimental)

This section is the **canonical overview** for experimental Amsterdam support: which library release maps to which spec snapshot, and where to read more. Amsterdam remains unstable — expect further `10.1.x` releases as the spec and testnets evolve.

**Release ↔ spec tracking**

| Release | Summary | EST fixtures | Date | Testnet |
| --- | --- | --- | --- | --- |
| `v10.1.2` (npm) | First experimental Amsterdam release: full 9-EIP `Hardfork.Amsterdam` bundle, BAL builder/validator APIs (7928), two-dimensional block gas (8037); passes v700 mixed EST slice. | [tests-bal@v7.1.0](https://github.com/ethereum/execution-specs/releases/tag/tests-bal@v7.1.0) | 2026-05-13 | [BAL devnet-7](https://notes.ethereum.org/@ethpandaops/bal-devnet-7) |
| `master` (unreleased) | Development branch: full Amsterdam EIP mix on `Hardfork.Amsterdam`; work toward the next `10.1.x` patch. | [tests-glamsterdam-devnet@v8.1.0](https://github.com/ethereum/execution-specs/releases/tag/tests-glamsterdam-devnet%40v8.1.0) | 2026-08-05 | glamsterdam-devnet-8 |

Tx-level intrinsic vs calldata floor: [@ethereumjs/tx Amsterdam Validation](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#amsterdam-validation). Opcode-level reservoir behaviour: [@ethereumjs/evm Amsterdam](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#amsterdam-experimental).

The `Hardfork.Amsterdam` bundle activates the following EIPs. Amsterdam test fixtures and execution-spec tests typically enable the full set together rather than individual EIPs in isolation.

| EIP | Summary | Documentation |
| --- | --- | --- |
| [2780](https://eips.ethereum.org/EIPS/eip-2780) | Intrinsic includes recipient/value extras; floor anchored on that base | [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#amsterdam-validation) |
| [7708](https://eips.ethereum.org/EIPS/eip-7708) | ETH transfers and burns emit logs | [EIP-7708](#eip-7708-eth-transfer-and-burn-logs-amsterdam), [Receipts](#receipts-and-event-logs) |
| [7843](https://eips.ethereum.org/EIPS/eip-7843) | `SLOTNUM` opcode + `slotNumber` header field | [@ethereumjs/block](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/block#eip-7843-slot-number) |
| [7778](https://eips.ethereum.org/EIPS/eip-7778) | Block gas accounting without refund subtraction | [EIP-7778](#eip-7778-block-gas-accounting-amsterdam) |
| [7928](https://eips.ethereum.org/EIPS/eip-7928) | Block Level Access Lists | [EIP-7928](#eip-7928-block-level-access-lists-amsterdam) |
| [7954](https://eips.ethereum.org/EIPS/eip-7954) | Raised max contract / initcode size | [@ethereumjs/evm EIP-7954](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#eip-7954-contract-and-initcode-size-limits-amsterdam) ([`eip7954MaxCodeSize.ts`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm/examples/eip7954MaxCodeSize.ts)) |
| [7976](https://eips.ethereum.org/EIPS/eip-7976) | Uniform calldata floor pricing | [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#amsterdam-validation) |
| [7981](https://eips.ethereum.org/EIPS/eip-7981) | Access-list byte floor pricing | [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#amsterdam-validation) |
| [7997](https://eips.ethereum.org/EIPS/eip-7997) | Deterministic CREATE2 factory at fixed address | [EIP-7997](#eip-7997-deterministic-create2-factory-amsterdam) ([`eip7997Create2Factory.ts`](./examples/eip7997Create2Factory.ts)) |
| [8024](https://eips.ethereum.org/EIPS/eip-8024) | `DUPN`, `SWAPN`, `EXCHANGE` stack opcodes | [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#eip-8024-stack-opcodes-amsterdam) |
| [8037](https://eips.ethereum.org/EIPS/eip-8037) | Two-dimensional block gas + state-gas reservoir | [EIP-8037](#eip-8037-state-creation-gas-cost-increase-amsterdam) |
| [8038](https://eips.ethereum.org/EIPS/eip-8038) | State-access gas; SSTORE access cost before implicit read | [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#eip-8037-state-creation-gas-amsterdam) |
| [8246](https://eips.ethereum.org/EIPS/eip-8246) | SELFDESTRUCT no longer burns ETH | EVM `SELFDESTRUCT` + journal; no burn log under EIP-7708 |
| [8282](https://eips.ethereum.org/EIPS/eip-8282) | Builder deposit/exit request contracts (v7 mined addresses) | [EIP-8282](#eip-8282-builder-execution-requests-amsterdam) ([`eip8282BuilderRequests.ts`](./examples/eip8282BuilderRequests.ts)) |

**Activation:** `new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })`.

### Amsterdam gas dimensions

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

### EIP-7928 Block Level Access Lists (Amsterdam)

[EIP-7928](https://eips.ethereum.org/EIPS/eip-7928) adds a block-level access list (BAL) committed via `blockAccessListHash` in the block header. When EIP-7928 is active, the VM accumulates state accesses automatically during `runBlock()` / `runTx()` — no extra opt-in flag is required.

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

**Block validator flow:** pass the BAL from an execution payload via `RunBlockOpts.blockAccessList` (JSON, RLP bytes, or a `BlockLevelAccessList` instance). See [`runBlockBALValidate.ts`](./examples/runBlockBALValidate.ts).

**Offline parsing / validation:** see the [@ethereumjs/util BAL module](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util#module-bal) for `BlockLevelAccessList`, JSON/RLP helpers, and validation utilities. To apply a BAL onto state without executing the block, use `stateManager.consumeBAL(bal)` from `@ethereumjs/statemanager`.

**Notes:**

- Amsterdam test fixtures often bundle additional EIPs (e.g. EIP-8037); use `Hardfork.Amsterdam` rather than activating EIP-7928 in isolation.
- `buildBlock()` writes `blockAccessListHash` from the accumulated BAL and defaults `slotNumber` to `parent.slotNumber + 1` when the field is omitted. `runBlock({ generate: true })` still does not invent a consensus slot number.

### EIP-8282 Builder execution requests (Amsterdam)

[EIP-8282](https://eips.ethereum.org/EIPS/eip-8282) adds builder deposit and exit CL requests at the end of each block. When EIP-7685 is active (Prague+), `runBlock()` and `buildBlock()` call `accumulateRequests()` automatically — builder requests are appended after deposit / withdrawal / consolidation requests when EIP-8282 is active on `Hardfork.Amsterdam`.

| Request | `CLRequestType` | Contract param |
| --- | --- | --- |
| Builder deposit | `3` (`BuilderDeposit`) | `builderDepositContractAddress` |
| Builder exit | `4` (`BuilderExit`) | `builderExitContractAddress` |

Glamsterdam-devnet v7 mined addresses live in `packages/vm/src/params.ts`. Each request is produced by a **checked system call** from the system address to the corresponding system contract. When **validating** a block, a missing or codeless contract (or a reverting call) makes the block invalid. When **building** (`generate: true`), a missing or failing contract yields an empty request instead — same pattern as withdrawal / consolidation accumulators.

Custom Amsterdam state must include both builder request contracts before validating blocks. EST fixtures and devnets ship full contract bytecode; for local demos a `STOP` contract is enough to satisfy the checked call and return empty request data.

Runnable walkthrough: [`examples/eip8282BuilderRequests.ts`](./examples/eip8282BuilderRequests.ts). Builder stubs are also seeded in [`runBlockBALValidate.ts`](./examples/runBlockBALValidate.ts) because Amsterdam BAL validation runs the same system calls.

### EIP-7997 Deterministic CREATE2 factory (Amsterdam)

[EIP-7997](https://eips.ethereum.org/EIPS/eip-7997) catalogues the well-known CREATE2 factory at `0x4e59b44847b379578588920ca78fbf26c0b4956c` (Nick's deployer). The factory expects calldata `salt (32 bytes) || initcode`, forwards the call's ETH value to `CREATE2`, and returns the 20-byte deployed address on success.

EthereumJS activates EIP-7997 on `Hardfork.Amsterdam` but **does not inject** the factory at the fork boundary — per the EIP, client software must not check or deploy it automatically. Seed the account yourself (`nonce: 1`, runtime code from the EIP) in genesis or test pre-state, as execution-spec tests do.

Runnable walkthrough: [`examples/eip7997Create2Factory.ts`](./examples/eip7997Create2Factory.ts) — manual factory setup and a CREATE2 deploy via `runTx()`.

### EIP-8037 State creation gas cost increase (Amsterdam)

[EIP-8037](https://eips.ethereum.org/EIPS/eip-8037) splits block gas into **regular** and **state** dimensions. `runBlock()`, `runTx()`, and `buildBlock()` apply this automatically. Header `gasUsed` is `max(block_regular_gas, block_state_gas)`. For a first-touch transfer that reports both dimensions, see [Amsterdam gas dimensions](#amsterdam-gas-dimensions).

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

[EIP-7778](https://eips.ethereum.org/EIPS/eip-7778) changes how gas refunds affect block-level accounting. `RunTxResult.totalGasSpent` is what the sender pays (refunds subtracted). `RunTxResult.blockGasSpent` is what counts toward the block header's `gasUsed` — under EIP-7778 this **does not** subtract tx-level refunds (`blockGasSpent = max(totalGasSpent, floorCost)`). Receipt `cumulativeGasUsed` still uses the pre-7778 refund semantics via a separate accumulator inside `runBlock()`.

### EIP-7708 ETH transfer and burn logs (Amsterdam)

[EIP-7708](https://eips.ethereum.org/EIPS/eip-7708) adds synthetic logs for native ETH transfers and balance burns. When active, value-bearing `CALL`/`CREATE` paths and certain `SELFDESTRUCT`/account-removal flows append logs from the system address (`0xfff…fff`) with `Transfer(address,address,uint256)` or `Burn(address,uint256)` topics. These appear in `RunTxResult.receipt.logs` like any other log — no VM API changes are needed beyond using `Hardfork.Amsterdam`. See [Receipts and Event Logs](#receipts-and-event-logs). For a stand-alone `runCall()` Transfer (no receipt) see the [`@ethereumjs/evm` EIP-7708 example](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm/examples/eip7708TransferLog.ts).

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

Full receipt walkthrough: [`examples/runTxTransferLogs.ts`](./examples/runTxTransferLogs.ts). For bytecode-level `LOG*` emission see [`@ethereumjs/evm` emitLogs example](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm/examples/emitLogs.ts).

## Genesis and chains

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

Beside the default Proof-of-Stake setup from `Common`, the VM supports `Ethash/PoW` and `Clique/PoA` blocks for replaying older hardforks or testnets. Pass `hardfork` on `Common` when creating the VM. Full hardfork list: [@ethereumjs/evm Supported Hardforks](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#supported-hardforks).

Genesis state can include EOAs and system contracts with initial storage. For custom state managers (Merkle, RPC, …) see [@ethereumjs/statemanager](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/statemanager).

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

## Block replay

### RPC mainnet block

Fetch a live mainnet block via JSON-RPC and execute it with [`RPCStateManager`](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/statemanager) (on-demand account/storage fetches). See [`examples/runBlockWithRPC.ts`](./examples/runBlockWithRPC.ts).

> **Note:** Recent mainnet blocks trigger **thousands of RPC requests**. Mind rate limits and quotas.

```sh
npx tsx examples/runBlockWithRPC.ts <providerUrl> <blockNumber>
```

Skips cleanly in CI when no RPC URL is provided.

### Offline mainnet block

Replay bundled mainnet block fixtures from [`examples/data/`](./examples/data/) — no network required. Defaults to block `24476000` when run without arguments:

```sh
npx tsx examples/runMainnetBlock.ts [blockNumber]
```

Bundled blocks with verified offline gas match: `24476000`, `24476001`, `24476003`, `24476004`, `24476005`, `24476009`.

Additional examples: [`runSolidityContract.ts`](./examples/runSolidityContract.ts) (compile + deploy + call), [`runBlockBALValidate.ts`](./examples/runBlockBALValidate.ts) / [`buildBlockBAL.ts`](./examples/buildBlockBAL.ts) (EIP-7928 BAL), [`runBlockchain.ts`](./examples/runBlockchain.ts) (multi-block mock chain).

## Observability

### Events

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
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
  const vm = await createVM({ common })

  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  await vm.stateManager.putAccount(sender, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  // Setup an event listener on the `afterTx` event
  vm.events.on('afterTx', (event, resolve) => {
    console.log('asynchronous listener to afterTx', bytesToHex(event.transaction.hash()))
    // we need to call resolve() to avoid the event listener hanging
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
  console.log(res.totalGasSpent) // 21000n - gas cost for simple ETH transfer
}

void main()
```

EVM-level events (`step`, `beforeMessage`, …) are on `vm.evm.events` — see [@ethereumjs/evm Events](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#events). Opcode profiling: [@ethereumjs/evm Profiling](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#profiling-the-evm).

### Understanding the VM

Hierarchically structured debug loggers use the [debug](https://github.com/visionmedia/debug) library. Activate on the CLI with `DEBUG=ethjs,[Logger Selection]`:

![EthereumJS VM Debug Logger](./debug.png?raw=true)

| Logger      | Description                                                        |
| ----------- | ------------------------------------------------------------------ |
| `vm:block`  | Block operations (run txs, generating receipts, block rewards,...) |
| `vm:tx`     |  Transaction operations (account updates, checkpointing,...)       |
| `vm:tx:gas` |  Transaction gas logger                                            |
| `vm:state`  | StateManager logger                                                |

Additional EVM-specific loggers: [@ethereumjs/evm Observability](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#observability).

Examples:

```shell
DEBUG=ethjs,vm:tx tsx test.ts
DEBUG=ethjs,vm:*,vm:*:* tsx test.ts
DEBUG=ethjs,vm:tx,vm:evm,vm:ops:sstore,vm:*:gas tsx test.ts
```

`ethjs` **must** be included in the `DEBUG` environment variables to enable **any** logs.

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

Starting with `VM` v6 the inner EVM was extracted to [@ethereumjs/evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm). Access EVM functionality through `vm.evm`, or pass a customized `EVM` via the optional `evm` constructor option.

Monorepo context: [ARCHITECTURE.md](../../ARCHITECTURE.md).

### Layout

The VM is a thin orchestration layer that drives the `EVM` at the transaction and block level. Processing functions are free-standing (`runX(vm, opts)`), not methods.

| Module | Role |
| --- | --- |
| `vm.ts` | Holds `evm`, `stateManager`, `blockchain`, `common`, `events` |
| `runBlock.ts` | Block processing (tx loop, withdrawals, requests, rewards, post-state) |
| `runTx.ts` | Tx rules, `runCall`, refunds, receipts |
| `buildBlock.ts` | Incremental block construction |
| `requests.ts` | EIP-7685 request extraction |

Receipts bloom, `paramsVM`, and `createVM` live in `bloom/`, `params.ts`, and `constructors.ts`.

### Extension Points

The `VM` is customized through `createVM` / `VMOpts`:

- **Custom `EVM`** — `evm` (or `evmOpts`): pass an `EVM` you configured (custom opcodes/precompiles — see [Customizing the EVM](../evm/README.md#customizing-the-evm)). If omitted, the VM creates one.
- **Custom state manager** — `stateManager`: any `StateManagerInterface`.
- **Custom blockchain** — supplies block-hash lookups for `BLOCKHASH` / `BLOBHASH`; defaults to a minimal mock.
- **Custom `Common`** — chain / hardfork / EIP configuration, shared with the inner `EVM`.
- **Custom parameters** — `params`: override `paramsVM` values.
- **Lifecycle hooks** — subscribe to `vm.events` and `vm.evm.events` for tracing — see [Observability](#observability).

### Internal Structure

**[`runBlock`](./src/runBlock.ts)** — processes a single block: validates hardfork, checkpoints state, runs each tx via `runTx`, processes withdrawals and rewards, finalizes state root/receipts/bloom, commits or reverts.

**[`runTx`](./src/runTx.ts)** — processes a single transaction: balance/nonce checks, intrinsic gas, access-list warmup, `vm.evm.runCall`, refunds, fee transfer, receipt generation, checkpoint commit/revert.

**[`vm.evm.runCall`](../evm/src/evm.ts)** — executes EVM bytecode (delegated to `@ethereumjs/evm`).

Block-by-block chain iteration lives in `@ethereumjs/blockchain` or client code, which calls `runBlock`.

## Supported EIPs

Individual EIP activation is shown in [EIP Activation](#eip-activation). Amsterdam how-tos and release tracking: [Amsterdam hardfork (experimental)](#amsterdam-hardfork-experimental). Full opcode/precompile catalog: [@ethereumjs/evm Supported EIPs](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#supported-eips).

### Cancun

- [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) — Blob transactions (`BLOBHASH`, point eval precompile `0x0a`; KZG setup in [Installation](#installation))

### Prague

- [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) — EOA code transactions — see [@ethereumjs/tx](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx#eip-7702-set-code-transactions) and [test setup](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/test/api/EIPs/eip-7702.spec.ts)
- [EIP-7685](https://eips.ethereum.org/EIPS/eip-7685) — Consensus layer requests in blocks
- [EIP-2935](https://eips.ethereum.org/EIPS/eip-2935) — Historical block hashes in state (does not change `BLOCKHASH` opcode resolution until EIP-7709)

### Amsterdam (experimental)

See the [Amsterdam hardfork (experimental)](#amsterdam-hardfork-experimental) section for the full EIP bundle, release ↔ spec tracking, and VM-layer how-tos.

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
