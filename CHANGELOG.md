# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2020-09-25

- Fixed a browser issue in `Wallet.fromV3()` and `Wallet.toV3()` triggered when using web bundlers using Buffer v4 shim (Webpack 4),
  see PR [#135](https://github.com/ethereumjs/ethereumjs-wallet/pull/135)

[1.0.1]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v1.0.0...v1.0.1

## [1.0.0] - 2020-06-23

This is the first `TypeScript` release on the library (thanks @the-jackalope for the rewrite! ❤️), see PR [#93](https://github.com/ethereumjs/ethereumjs-wallet/pull/93) for the main PR here. The release comes with various breaking changes.

### Libray Import / API Documentation

The way submodules are exposed has been changed along the `TypeScript` rewrite and you will likely have to update your imports. Here is an example for the `hdkey` submodule:

Node.js / ES5:

```js
const { hdkey } = require('ethereumjs-wallet')
```

ESM / TypeScript:

```js
import { hdkey } from 'ethereumjs-wallet'
```

See [README](https://github.com/ethereumjs/ethereumjs-wallet#wallet-api) for examples on the other submodules.

Together with the switch to `TypeScript` the previously static documentation has been automated to now being generated with `TypeDoc` to reflect all latest changes, see PR [#98](https://github.com/ethereumjs/ethereumjs-wallet/pull/98). See the new [docs](https://github.com/ethereumjs/ethereumjs-wallet/blob/master/docs/README.md) for an overview on the `TypeScript` based API.

### API Changes

The API of the library hasn't been changed intentionally but has become more strict on type input by the explcit type definitions from the `TypeScript` code in function signatures together with the introduction of the `ethereumjs-util` [v7](https://github.com/ethereumjs/ethereumjs-util/releases) library within the `Wallet` library, which behaves more strict on type input on the various utility functions.

This leads to cases where some input - while not having been the intended way to use the library - might have been worked before through implicit type conversion and is now not possible any more.

One example for this is the `Wallet.fromPublicKey()` function, here is the old code of the function:

```js
Wallet.fromPublicKey = function(pub, nonStrict) {
  if (nonStrict) {
    pub = ethUtil.importPublic(pub)
  }
  return new Wallet(null, pub)
}
```

and here the new `TypeScript` code:

```typescript
public static fromPublicKey(publicKey: Buffer, nonStrict: boolean = false): Wallet {
  if (nonStrict) {
    publicKey = importPublic(publicKey)
  }
  return new Wallet(undefined, publicKey)
}
```

This function worked in the `v0.6.x` version also with passing in a string, since the `ethereumjs-util` `v6` `importPublic` method converted the input implicitly to a `Buffer`, the `v1.0.0` version now directly enforces the `fromPublicKey` input to be a `Buffer` first hand.

There will likely be more cases like this in the code since the type input of the library hasn't been documented in the older version. So we recommend here to go through all your function signature usages and see if you uses the correct input types. While a bit annoying this is a one-time task you will never have to do again since you can now profit from the clear `TypeScript` input types being both documented and enforced by the `TypeScript` compiler.

### Pure JS Crypto Dependencies

This library now uses pure JS crypto dependencies which doesn't bring in the need for native compilation on installation. For `scrypt` key derivation [scrypt-js](https://github.com/ricmoo/scrypt-js) from @ricmoo is used (see PR [#125](https://github.com/ethereumjs/ethereumjs-wallet/pull/125)).

For BIP-32 key derivation the new [ethereum-cryptography](https://github.com/ethereum/js-ethereum-cryptography) library is used which is a new Ethereum Foundation backed and formally audited libray to provide pure JS cryptographic primitives within the Ethereum ecosystem (see PR [#128](https://github.com/ethereumjs/ethereumjs-wallet/pull/128)).

### Removed ProviderEngine

Support for Provider Engine has been removed for security reasons, since the package is not very actively maintained and superseded by [`json-rpc-engine`](https://github.com/MetaMask/web3-provider-engine#web3-providerengine).

If you need the removed functionality, it should be relatively easily possible to do this integration by adopting the code from [provider-engine.ts](https://github.com/ethereumjs/ethereumjs-wallet/blob/v0.6.x/src/provider-engine.js).

See also: PR [#117](https://github.com/ethereumjs/ethereumjs-wallet/pull/117)

### Other Changes

#### Bug Fixes

- Fixes a bug where `salt`, `iv` and/or `uuid` options - being supplied as strings to `Wallet.toV3()` - could lead to errors during encryption and/or output that could not be decrypted,
  PR [#95](https://github.com/ethereumjs/ethereumjs-wallet/pull/95)

#### Refactoring & Maintenance

- `ES6` class rewrite,
  PR [#93](https://github.com/ethereumjs/ethereumjs-wallet/pull/93) (`TypeScript` PR)
- Added support for Node 12, 13, and 14, upgraded CI provider to use GH Actions in place of Travis,
  PR [#120](https://github.com/ethereumjs/ethereumjs-wallet/pull/120)
- Updated `ethereumjs-util` dependency from `v6` to
  [v7.0.2](https://github.com/ethereumjs/ethereumjs-util/releases/tag/v7.0.2 (stricter types),
  PR [#126](https://github.com/ethereumjs/ethereumjs-wallet/pull/126)
- Refactored `Wallet.deciperBuffer()`,
  PR [#82](https://github.com/ethereumjs/ethereumjs-wallet/pull/82)

#### Development & CI

- Integrated the `ethereumjs-config` EthereumJS developer configuration standards,
  PR [#93](https://github.com/ethereumjs/ethereumjs-wallet/pull/93) (`TypeScript` PR)
- Added org links and Git hooks,
  PR [#88](https://github.com/ethereumjs/ethereumjs-wallet/pull/88)

[0.6.4]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.6.3...v1.0.0

## [0.6.4] - 2020-05-01

This is the last release from the `v0.6.x` release series. It adds Node 12 compatibility while maintaining compatibility
down to Node 6. To be able to do so the `scrypt.js` key derivation library is exchanged with `scryptsy`. While this solution is backwards-compatible the changed library only provides a pure JS implementation and no native bindings. If you need native performance pin your dependency to `v0.6.3` or update to the `v1.0.0` library version to be released shortly after this release.

Change Summary:

- v0.6.x back patch: added node v12 support, switched to `scryptsy` key derivation library (pure JS implementation),
  PR [#114](https://github.com/ethereumjs/ethereumjs-wallet/pull/114)
- Updated `hdkey` to `v1.1.1`,
  PR [#87](https://github.com/ethereumjs/ethereumjs-wallet/pull/87)
- Refactored `decipherBuffer()`,
  PR [#82](https://github.com/ethereumjs/ethereumjs-wallet/pull/82)
- Added more tests for `Wallet.fromEthSale()`,
  PR [#80](https://github.com/ethereumjs/ethereumjs-wallet/pull/80)

[0.6.4]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.6.3...v0.6.4

## [0.6.3] - 2018-12-19

- Fixed installation errors for certain packaging tools, PR [#67](https://github.com/ethereumjs/ethereumjs-wallet/pull/67)
- Remove dependency on `crypto.randomBytes` and use `randombytes` package instead, PR [#63](https://github.com/ethereumjs/ethereumjs-wallet/pull/63)
- Add comprehensive test coverage for `fromV3`, PR [#62](https://github.com/ethereumjs/ethereumjs-wallet/pull/62)
- Remove excess parameter from `decipherBuffer` usage, PR [#77](https://github.com/ethereumjs/ethereumjs-wallet/pull/77)
- Update dependencies, including a fixed `scrypt.js`, which should resolve more installation issues, PR [#78](https://github.com/ethereumjs/ethereumjs-wallet/pull/78)

[0.6.3]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.6.2...v0.6.3

## [0.6.2] - 2018-08-08

- [PLEASE UPDATE!] Fixes a critical import bug introduced in `v0.6.1` accidentally
  changing the import path for the different submodules, see PR [#65](https://github.com/ethereumjs/ethereumjs-wallet/pull/65)

[0.6.2]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.6.1...v0.6.2

## [0.6.1] - 2018-07-28 [DEPRECATED]

- Added support for vanity address generation, PR [#5](https://github.com/ethereumjs/ethereumjs-wallet/pull/5)
- Fixed typo in provider-engine, PR [#16](https://github.com/ethereumjs/ethereumjs-wallet/pull/16)
- Accept the true range of addresses for ICAP direct, PR [#6](https://github.com/ethereumjs/ethereumjs-wallet/pull/6)
- Switched to babel ES5 build, PR [#37](https://github.com/ethereumjs/ethereumjs-wallet/pull/37)
- Improve test coverage (at 88% now), PR [#27](https://github.com/ethereumjs/ethereumjs-wallet/pull/27)
- Various dependency updates, PR [#25](https://github.com/ethereumjs/ethereumjs-wallet/pull/25)

[0.6.1]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.6.0...v0.6.1

## [0.6.0] - 2016-04-27

- Added provider-engine integration, PR [#7](https://github.com/ethereumjs/ethereumjs-wallet/pull/7)

[0.6.0]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.5.2...v0.6.0

## [0.5.2] - 2016-04-25

- Dependency updates

[0.5.2]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.5.1...v0.5.2

## [0.5.1] - 2016-03-26

- Bugfix for `EthereumHDKey.privateExtendedKey()`
- Added travis and coveralls support
- Documentation and test improvements

[0.5.1]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.5.0...v0.5.1

## [0.5.0] - 2016-03-23

- Support HD keys using `cryptocoinjs/hdkey`
- Ensure private keys are valid according to the curve
- Support instantation with public keys
- Support importing BIP32 xpub/xpriv
- Only support Ethereum keys internally, non-strict mode for importing compressed ones
- Thirdparty API doc improvements

[0.5.0]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.4.0...v0.5.0

## Older releases:

- [0.4.0](https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.3.0...v0.4.0) - 2016-03-16
- [0.3.0](https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.2.1...v0.3.0) - 2016-03-09
- [0.2.1](https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.2.0...v0.2.1) - 2016-03-07
- [0.2.0](https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.1.0...v0.2.0) - 2016-03-07
- 0.1.0 - 2016-02-23
