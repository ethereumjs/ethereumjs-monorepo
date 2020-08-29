# ethereumjs-wallet

[![NPM Package](https://img.shields.io/npm/v/ethereumjs-wallet.svg)](https://www.npmjs.org/package/ethereumjs-wallet)
[![Actions Status](https://github.com/ethereumjs/ethereumjs-wallet/workflows/Build/badge.svg)](https://github.com/ethereumjs/ethereumjs-wallet/actions)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/ethereumjs-wallet.svg)](https://coveralls.io/r/ethereumjs/ethereumjs-wallet)
[![Discord][discord-badge]][discord-link]

A lightweight wallet implementation. At the moment it supports key creation and conversion between various formats.

It is complemented by the following packages:

- [ethereumjs-tx](https://github.com/ethereumjs/ethereumjs-tx) to sign transactions
- [ethereumjs-icap](https://github.com/ethereumjs/ethereumjs-icap) to manipulate ICAP addresses
- [store.js](https://github.com/marcuswestin/store.js) to use browser storage

Motivations are:

- be lightweight
- work in a browser
- use a single, maintained version of crypto library (and that should be in line with `ethereumjs-util` and `ethereumjs-tx`)
- support import/export between various wallet formats
- support BIP32 HD keys

Features not supported:

- signing transactions
- managing storage (neither in node.js or the browser)

## Wallet API

For information about the Wallet's API, please go to [./docs/classes/wallet.md](./docs/classes/wallet.md).

You can import the `Wallet` class like this

Node.js / ES5:

```js
const { Wallet } = require('ethereumjs-wallet')
```

ESM / TypeScript:

```js
import { Wallet } from 'ethereumjs-wallet'
```

## Thirdparty API

Importing various third party wallets is possible through the `thirdparty` submodule:

Node.js / ES5:

```js
const { thirdparty } = require('ethereumjs-wallet')
```

ESM / TypeScript:

```js
import { thirdparty } from 'ethereumjs-wallet'
```

Please go to [./docs/README.md](./docs/README.md) for more info.

## HD Wallet API

To use BIP32 HD wallets, first include the `hdkey` submodule:

Node.js / ES5:

```js
const { hdkey } = require('ethereumjs-wallet')
```

ESM / TypeScript:

```js
import { hdkey } from 'ethereumjs-wallet'
```

Please go to [./docs/classes/ethereumhdkey.md](./docs/classes/ethereumhdkey.md) for more info.

## Provider Engine

Provider Engine is
[not very actively maintained](https://github.com/MetaMask/web3-provider-engine#web3-providerengine)
and support has been removed along `v1.0.0` release, see
issue [#115](https://github.com/ethereumjs/ethereumjs-wallet/issues/115) for context.

You can use the the old `src/provider-engine.ts` code (see associated PR) as some boilerplate
for your own integration if needed.

## Remarks about `toV3`

The `options` is an optional object hash, where all the serialization parameters can be fine tuned:

- uuid - UUID. One is randomly generated.
- salt - Random salt for the `kdf`. Size must match the requirements of the KDF (key derivation function). Random number generated via `crypto.getRandomBytes` if nothing is supplied.
- iv - Initialization vector for the `cipher`. Size must match the requirements of the cipher. Random number generated via `crypto.getRandomBytes` if nothing is supplied.
- kdf - The key derivation function, see below.
- dklen - Derived key length. For certain `cipher` settings, this must match the block sizes of those.
- cipher - The cipher to use. Names must match those of supported by `OpenSSL`, e.g. `aes-128-ctr` or `aes-128-cbc`.

Depending on the `kdf` selected, the following options are available too.

For `pbkdf2`:

- `c` - Number of iterations. Defaults to 262144.
- `prf` - The only supported (and default) value is `hmac-sha256`. So no point changing it.

For `scrypt`:

- `n` - Iteration count. Defaults to 262144.
- `r` - Block size for the underlying hash. Defaults to 8.
- `p` - Parallelization factor. Defaults to 1.

The following settings are favoured by the Go Ethereum implementation and we default to the same:

- `kdf`: `scrypt`
- `dklen`: `32`
- `n`: `262144`
- `r`: `8`
- `p`: `1`
- `cipher`: `aes-128-ctr`

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

## License

MIT License

Copyright (C) 2016 Alex Beregszaszi

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
