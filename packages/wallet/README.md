# @ethereumjs/wallet `v10`

[![NPM Package][npm-badge]][npm-link]
[![GitHub Issues][wallet-issues-badge]][wallet-issues-link]
[![Actions Status][actions-badge]][actions-link]
[![Code Coverage][coverage-badge]][coverage-link]
[![Discord][discord-badge]][discord-link]

| Lightweight Ethereum key and keystore utilities. |
| ------------------------------------------------ |

> **Note:** This package is currently marked **deprecated** (limited maintenance, Ethers/Viem cover most wallet UX). It remains in the monorepo for key import/export, keystore compatibility, and potential future reactivation — bugfixes and example coverage are still maintained.

Runnable examples live in [`examples/`](./examples/).

**Scope:** key creation, BIP32 HD keys, third-party wallet import, Web3 Secret Storage (v3) encrypt/decrypt. Transaction signing is delegated to [@ethereumjs/tx](../tx) via `wallet.getPrivateKey()`.

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Private Key and Address](#private-key-and-address)
- [Keystore (Web3 Secret Storage)](#keystore-web3-secret-storage)
- [Sign with @ethereumjs/tx](#sign-with-ethereumjstx)
- [HD Wallets (BIP32)](#hd-wallets-bip32)
- [Third-Party Import](#third-party-import)
- [Keystore Options](#keystore-options)
- [Browser](#browser)
- [API](#api)
- [EthereumJS](#ethereumjs)
- [License](#license)

## Installation

```shell
npm install @ethereumjs/wallet
```

## Getting Started

```ts
// ./examples/wallet.ts

import { Wallet } from '@ethereumjs/wallet'

const wallet = Wallet.generate()
console.log(wallet.getAddressString())
```

## Private Key and Address

Import from an existing private key or read keys back for signing:

```ts
// ./examples/fromPrivateKey.ts

import { Wallet } from '@ethereumjs/wallet'
import { hexToBytes } from '@ethereumjs/util'

const wallet = Wallet.fromPrivateKey(
  hexToBytes('0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109'),
)
console.log(`Address from private key: ${wallet.getAddressString()}`)
```

Also: `Wallet.fromPublicKey()`, `Wallet.fromExtendedPrivateKey()`, `Wallet.fromExtendedPublicKey()`.

## Keystore (Web3 Secret Storage)

Encrypt to v3 JSON keystore and decrypt back (scrypt by default, Go-Ethereum compatible):

```ts
// ./examples/keystoreV3.ts

import { Wallet } from '@ethereumjs/wallet'

const main = async () => {
  const wallet = Wallet.generate()
  const password = 'test-password'

  const keystore = await wallet.toV3(password)
  const restored = await Wallet.fromV3(keystore, password)

  console.log(`Keystore version: ${keystore.version}`)
  console.log(`Address match: ${restored.getAddressString() === wallet.getAddressString()}`)
}

void main()
```

String variant: `toV3String()` / `Wallet.fromV3(JSON.parse(str), password)`.

## Sign with @ethereumjs/tx

This library does not sign transactions itself — pass the private key to `@ethereumjs/tx`:

```ts
// ./examples/signWithTx.ts

import { Common, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { Wallet } from '@ethereumjs/wallet'

const main = async () => {
  const wallet = Wallet.generate()
  const common = new Common({ chain: Mainnet })

  const tx = createLegacyTx(
    {
      nonce: 0,
      gasPrice: 100n,
      gasLimit: 21_000n,
      to: '0x0000000000000000000000000000000000000000',
      value: 0n,
    },
    { common },
  )

  const signed = tx.sign(wallet.getPrivateKey())
  console.log(`Signer: ${wallet.getAddressString()}`)
  console.log(`Tx hash: ${bytesToHex(signed.hash())}`)
}

void main()
```

## HD Wallets (BIP32)

Mnemonic → BIP32 tree via the `hdkey` submodule:

```ts
// ./examples/hdKey.ts

import { hdkey } from '@ethereumjs/wallet'

const wallet = hdkey.EthereumHDKey.fromMnemonic(
  'clown galaxy face oxygen birth round modify fame correct stumble kind excess',
)
console.log(wallet.getWallet().getAddressString())
```

Derive standard Ethereum paths:

```ts
// ./examples/hdKeyDerivePath.ts

import { hdkey } from '@ethereumjs/wallet'

const root = hdkey.EthereumHDKey.fromMnemonic(
  'clown galaxy face oxygen birth round modify fame correct stumble kind excess',
)
const account0 = root.derivePath("m/44'/60'/0'/0/0").getWallet()
const account1 = root.derivePath("m/44'/60'/0'/0/1").getWallet()

console.log(`Account 0: ${account0.getAddressString()}`)
console.log(`Account 1: ${account1.getAddressString()}`)
```

Also: `fromMasterSeed()`, `fromExtendedKey()`, `deriveChild()`, `privateExtendedKey()`, `publicExtendedKey()`.

## Third-Party Import

Import legacy third-party wallet formats:

```ts
// ./examples/thirdparty.ts

import { thirdparty } from '@ethereumjs/wallet'

const wallet = thirdparty.fromQuorumWallet('mySecretQuorumWalletPassphrase', 'myPublicQuorumUserId')
console.log(wallet.getAddressString())
```

## Keystore Options

`toV3(password, opts?)` accepts fine-grained serialization parameters:

| Option | Description |
| --- | --- |
| `kdf` | `scrypt` (default) or `pbkdf2` |
| `cipher` | Default `aes-128-ctr` |
| `dklen` | Derived key length (default `32`) |
| `salt`, `iv`, `uuid` | Random if omitted |

Scrypt defaults (Go-Ethereum aligned): `n=262144`, `r=8`, `p=1`.

## Browser

Hybrid ESM/CJS builds are provided. See [./examples/browser.html](./examples/browser.html).

Legacy CommonJS examples: [`wallet.cjs`](./examples/wallet.cjs), [`hdKey.cjs`](./examples/hdKey.cjs), [`thirdparty.cjs`](./examples/thirdparty.cjs).

## API

Generated docs: [Wallet](./docs/classes/Wallet.md), [EthereumHDKey](./docs/classes/EthereumHDKey.md).

## EthereumJS

The `EthereumJS` GitHub organization and its repositories are managed by members of the former Ethereum Foundation JavaScript team and the broader Ethereum community. If you want to join for work or carry out improvements on the libraries see the [developer docs](../../DEVELOPER.md) for an overview of current standards and tools and review our [code of conduct](../../CODE_OF_CONDUCT.md).

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (C) 2016 Alex Beregszaszi

[actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/actions/workflows/static-build.yml/badge.svg
[actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions
[coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=wallet
[coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/wallet
[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[npm-badge]: https://img.shields.io/npm/v/@ethereumjs/wallet.svg
[npm-link]: https://www.npmjs.com/package/@ethereumjs/wallet
[wallet-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20wallet?label=issues
[wallet-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+wallet"
