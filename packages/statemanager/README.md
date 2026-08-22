# @ethereumjs/statemanager `v10`

[![NPM Package][statemanager-npm-badge]][statemanager-npm-link]
[![GitHub Issues][statemanager-issues-badge]][statemanager-issues-link]
[![Actions Status][statemanager-actions-badge]][statemanager-actions-link]
[![Code Coverage][statemanager-coverage-badge]][statemanager-coverage-link]
[![Discord][discord-badge]][discord-link]

| Library to provide high level access to Ethereum State |
| ------------------------------------------------------ |

- 🫧 Transparent state access from EVM/VM
- 🌴 Tree-shakeable API
- 👷🏼 Controlled dependency set (5 external + `@Noble` crypto)
- ⏳ Checkpoints + Diff-based Caches
- 🔌 Unified interface (for custom SMs)
- 🎁 4 SMs included (Merkle / Simple / RPC / Binary Tree)
- 🛵 233KB bundle size (for Merkle SM) (63KB gzipped)
- 🏄🏾‍♂️ WASM-free default + Fully browser ready

Runnable examples live in [`examples/`](./examples/).

## Table of Contents

- [Installation](#installation)
- [Overview](#overview)
- [MerkleStateManager](#merklestatemanager)
- [SimpleStateManager](#simplestatemanager)
- [RPCStateManager](#rpcstatemanager)
- [Binary Tree State Manager (experimental)](#binary-tree-state-manager-experimental)
- [Architecture](#architecture)
- [Browser](#browser)
- [API](#api)
- [Development](#development)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

```shell
npm install @ethereumjs/statemanager
```

## Overview

The `StateManager` interface (defined in `@ethereumjs/common`) exposes account, code, and storage access for `@ethereumjs/evm` and `@ethereumjs/vm`. This package ships four implementations:

| Implementation | Backing store | Use when |
| --- | --- | --- |
| `MerkleStateManager` | `@ethereumjs/mpt` tries | Production, proofs, state roots |
| `SimpleStateManager` | In-memory maps | Lightweight EVM runs, tests |
| `RPCStateManager` | JSON-RPC provider | Fork/mainnet replay without local state |
| `StatefulBinaryTreeStateManager` | `@ethereumjs/binarytree` | EIP-7864 research (experimental) |

All implementations support nested `checkpoint()` / `commit()` / `revert()` for revertible execution.

## MerkleStateManager

Production state manager used by `@ethereumjs/client` and `@ethereumjs/vm`. Backed by account and storage Merkle Patricia Tries.

```ts
// ./examples/basicUsage.ts

import { MerkleStateManager } from '@ethereumjs/statemanager'
import { Account, Address, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const stateManager = new MerkleStateManager()
  const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
  const account = new Account(BigInt(0), BigInt(1000))
  await stateManager.checkpoint()
  await stateManager.putAccount(address, account)
  await stateManager.commit()
  await stateManager.flush()

  console.log(
    `Account at address ${address.toString()} has balance ${
      (await stateManager.getAccount(address))?.balance
    }`,
  )
}
void main()
```

### Checkpoints

```ts
// ./examples/checkpointRevert.ts

import { MerkleStateManager } from '@ethereumjs/statemanager'
import { Account, Address, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const sm = new MerkleStateManager()
  const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))

  await sm.checkpoint()
  await sm.putAccount(address, new Account(0n, 1000n))
  await sm.revert()
  console.log(`After revert: ${(await sm.getAccount(address))?.balance ?? 'none'}`)

  await sm.checkpoint()
  await sm.putAccount(address, new Account(0n, 2000n))
  await sm.commit()
  await sm.flush()
  console.log(`After commit: ${(await sm.getAccount(address))?.balance}`)
}

void main()
```

### Code and storage

```ts
// ./examples/storageAndCode.ts

import { MerkleStateManager } from '@ethereumjs/statemanager'
import { Account, Address, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const sm = new MerkleStateManager()
  const address = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
  const storageKey = hexToBytes(
    '0x0000000000000000000000000000000000000000000000000000000000000001',
  )
  const code = hexToBytes('0x60016001600155')

  await sm.putAccount(address, new Account(0n, 0n))
  await sm.putCode(address, code)
  await sm.putStorage(address, storageKey, hexToBytes('0x01'))

  console.log(`Code length: ${(await sm.getCode(address)).length} bytes`)
  const slot = await sm.getStorage(address, storageKey)
  console.log(`Storage value: ${slot[0]}`)
}

void main()
```

### EIP-1186 proofs

Build partial state from merkle proofs with `getMerkleStateProof()`, `fromMerkleStateProof()`, and `addMerkleStateProofData()`:

```ts
// ./examples/fromProofInstantiation.ts

import {
  MerkleStateManager,
  addMerkleStateProofData,
  fromMerkleStateProof,
  getMerkleStateProof,
} from '@ethereumjs/statemanager'
import { Address, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const stateManager = new MerkleStateManager()
  const contractAddress = new Address(hexToBytes('0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
  const byteCode = hexToBytes('0x67ffffffffffffffff600160006000fb')
  const storageKey1 = hexToBytes(
    '0x0000000000000000000000000000000000000000000000000000000000000001',
  )
  const storageKey2 = hexToBytes(
    '0x0000000000000000000000000000000000000000000000000000000000000002',
  )
  const storageValue1 = hexToBytes('0x01')
  const storageValue2 = hexToBytes('0x02')

  await stateManager.putCode(contractAddress, byteCode)
  await stateManager.putStorage(contractAddress, storageKey1, storageValue1)
  await stateManager.putStorage(contractAddress, storageKey2, storageValue2)

  const proof = await getMerkleStateProof(stateManager, contractAddress)
  const proofWithStorage = await getMerkleStateProof(stateManager, contractAddress, [
    storageKey1,
    storageKey2,
  ])
  const partialStateManager = await fromMerkleStateProof(proof)

  await addMerkleStateProofData(partialStateManager, proofWithStorage)
  console.log(await partialStateManager.getCode(contractAddress))
  console.log(await partialStateManager.getStorage(contractAddress, storageKey1), storageValue1)
  console.log(await partialStateManager.getStorage(contractAddress, storageKey2), storageValue2)

  const accountFromNewSM = await partialStateManager.getAccount(contractAddress)
  const accountFromOldSM = await stateManager.getAccount(contractAddress)
  console.log(accountFromNewSM, accountFromOldSM)
}
void main()
```

## SimpleStateManager

Minimal in-memory implementation — no trie, no state root, no proofs. Default for lightweight `@ethereumjs/evm` usage.

```ts
// ./examples/simpleStateManager.ts

import { SimpleStateManager } from '@ethereumjs/statemanager'
import { Account, createAddressFromPrivateKey, randomBytes } from '@ethereumjs/util'

const main = async () => {
  const sm = new SimpleStateManager()
  const address = createAddressFromPrivateKey(randomBytes(32))
  const account = new Account(0n, 0xfffffn)
  await sm.putAccount(address, account)
  const read = await sm.getAccount(address)
  console.log(`Account balance: ${read?.balance}`)
}

void main()
```

## RPCStateManager

Sources state from a JSON-RPC provider. Requires a fixed block number — not `latest`/`pending`.

```ts
// ./examples/rpcStateManager.ts

import { RPCStateManager } from '@ethereumjs/statemanager'
import { createAddressFromString } from '@ethereumjs/util'

const main = async () => {
  try {
    const provider = 'https://path.to.my.provider.com'
    const stateManager = new RPCStateManager({ provider, blockTag: 500000n })
    const vitalikDotEth = createAddressFromString('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
    const account = await stateManager.getAccount(vitalikDotEth)
    console.log('Vitalik has a current ETH balance of ', account?.balance)
  } catch (e) {
    console.log(e.message)
  }
}
void main()
```

Pair with `RPCBlockChain` for `BLOCKHASH` opcode support — see [`evm.ts`](./examples/evm.ts).

## Binary Tree State Manager (experimental)

[`StatefulBinaryTreeStateManager`](./src/statefulBinaryTreeStateManager.ts) uses [@ethereumjs/binarytree](../binarytree/) (EIP-7864):

```ts
// ./examples/binaryTreeStateManager.ts

import { Common, Mainnet } from '@ethereumjs/common'
import { StatefulBinaryTreeStateManager } from '@ethereumjs/statemanager'
import { Account, createAddressFromString } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Mainnet, eips: [7864] })
  const sm = new StatefulBinaryTreeStateManager({ common })
  const address = createAddressFromString('0x9e5ef720fa2cdfa5291eb7e711cfd2e62196f4b3')

  await sm.putAccount(address, new Account(1n, 1000n))
  const account = await sm.getAccount(address)
  console.log(`Binary tree SM balance: ${account?.balance}`)
}

void main()
```

Not production-ready.

## Architecture

All implementations satisfy `StateManagerInterface` from `@ethereumjs/common`. Custom implementations can implement that interface directly.

Optional `consumeBAL(bal, expectedStateRoot?)` applies an [EIP-7928](https://eips.ethereum.org/EIPS/eip-7928) block-level access list onto state without EVM execution (last post-balance / nonce / code / storage; EIP-161 empty-account deletes). Every implementation in this package forwards to a shared `consumeBAL()` helper.

## Browser

Hybrid ESM/CJS builds are provided. See [./examples/browser.html](./examples/browser.html).

## API

Generated TypeDoc [documentation](./docs/README.md).

## Development

See [DEVELOPER.md](./DEVELOPER.md).

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

## License

[MPL-2.0](<https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2)>)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[statemanager-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/statemanager.svg
[statemanager-npm-link]: https://www.npmjs.com/package/@ethereumjs/statemanager
[statemanager-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20statemanager?label=issues
[statemanager-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+statemanager"
[statemanager-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/StateManager/badge.svg
[statemanager-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Statemanager%22
[statemanager-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=statemanager
[statemanager-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/statemanager
