# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [v3.0.0] - UNRELEASED

rlp v3 is a breaking release with several important updates. Special thanks to [@paulmillr](https://github.com/paulmillr) for the majority of this work in PR [#90](https://github.com/ethereumjs/rlp/pull/90).

### Dependencies

bn.js was removed in favor of BigInt support so the package now contains zero dependencies.

### Default export

A new default export `RLP` now contains `encode` and `decode`.

You can now import and use RLP like this:

```javascript
import RLP from 'rlp'
RLP.encode(1)
```

### Uint8Array

Buffers were replaced in favor of using Uint8Arrays for improved performance and greater compatibility with browsers.

When upgrading from rlp v2 to v3, you must convert your Buffers to Uint8Arrays before passing in. To help, two new utility methods were added to `ethereumjs-util v7.1.4`: `arrToBufArr` and `bufArrToArr`. These will recursively step through your arrays to replace Buffers with Uint8Arrays, or vise versa.

Example:

```typescript
// Old, rlp v2
import * as rlp from 'rlp'
const bufArr = [Buffer.from('123', 'hex'), Buffer.from('456', 'hex')]
const encoded = rlp.encode(bufArr)
const decoded = rlp.decode(encoded)

// New, rlp v3
import RLP from 'rlp'
const encoded: Uint8Array = RLP.encode(bufArrToArr(bufArr))
const encodedAsBuffer = Buffer.from(encoded)
const decoded: Uint8Array[] = RLP.decode(encoded)
const decodedAsBuffers = arrToBufArr(decoded)
```

### Invalid RLPs

Increased strictness has been added to ensure invalid RLPs are not decoded, see PR [#101](https://github.com/ethereumjs/rlp/pull/101).

---

PRs included in this release:

- Fix karma, readme updates, combine source to one file, PR [#109](https://github.com/ethereumjs/rlp/pull/109)
- Add browser support, remove dependencies, PR [#90](https://github.com/ethereumjs/rlp/pull/90)
- Readme and typedoc updates, normalize source error messages to capital RLP, PR [#108](https://github.com/ethereumjs/rlp/pull/108)
- Improve cli interface, PR [#95](https://github.com/ethereumjs/rlp/pull/95)
- Ensure we do not decode invalid RLPs, PR [#101](https://github.com/ethereumjs/rlp/pull/101)

[v3.0.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@2.2.7...rlp@3.0.0

## [v2.2.7] - 2021-10-06

- Performance: Avoid creating new array when checking first two chars, PR [#100](https://github.com/ethereumjs/rlp/pull/100)
- Update BN from require to import, PR [#99](https://github.com/ethereumjs/rlp/pull/99)
- Update dependencies to latest and add browser build, PR [#102](https://github.com/ethereumjs/rlp/pull/102)

#### Included Source Files

Source files from the `src` folder are now included in the distribution build, see PR [#97](https://github.com/ethereumjs/rlp/pull/97). This allows for a better debugging experience in debug tools like Chrome DevTools by having working source map references to the original sources available for inspection.

[v2.2.7]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@2.2.6...rlp@2.2.7

## [v2.2.6] - 2020-07-17

- Fixed a few edge-cases in decoding long strings that previously could cause
  OOM (Out of Memory) crash,
  PR [#91](https://github.com/ethereumjs/rlp/pull/91)
- Updated GitHub `actions/checkout` to v2,
  PR [#92](https://github.com/ethereumjs/rlp/pull/92)

[v2.2.6]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@2.2.5...rlp@2.2.6

## [v2.2.5] - 2020-05-25

- Added `BigInt` as an accepted encoding type,
  PR [#85](https://github.com/ethereumjs/rlp/pull/85)
- Added support/testing for Node 10, 12, 13, 14, moved from Travis to GitHub Actions,
  PR [#87](https://github.com/ethereumjs/rlp/pull/87)
- Formatting and config cleanups,
  PRs [#86](https://github.com/ethereumjs/rlp/pull/86) and
  [#88](https://github.com/ethereumjs/rlp/pull/88)

[v2.2.5]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@2.2.4...rlp@2.2.5

## [v2.2.4] - 2019-11-02

- Removed unused `Dictionary` `Input` type for `RLP.encode()` and `RLP.decode()`,
  PR [#74](https://github.com/ethereumjs/rlp/pull/74)
- Removed unused `safe-buffer` dependency,
  PR [#80](https://github.com/ethereumjs/rlp/pull/80)

[v2.2.4]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@2.2.3...rlp@2.2.4

## [v2.2.3] - 2019-03-19

- More robust `Array` type checking in `RLP.encode()` function,
  PR [#70](https://github.com/ethereumjs/rlp/pull/70)
- Library now throws an error when trying to encode negative integer
  values (e.g. `RLP.encode(-1)`),
  PR [#71](https://github.com/ethereumjs/rlp/pull/70)

[v2.2.3]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@2.2.2...rlp@2.2.3

## [v2.2.2] - 2019-01-15

- Added `bn.js` dependency to fix module resolution bug when require the module after
  clean install, PR [#64](https://github.com/ethereumjs/rlp/pull/64)
- Use local version of official tests, fixed testing issue, PR [#66](https://github.com/ethereumjs/rlp/pull/66)

[v2.2.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@2.2.1...rlp@2.2.2

## [v2.2.1] - 2018-12-20

- Fixed a bug introduced in `v2.2.0` causing the CLI `bin/rlp` command not to
  work, see PR [#60](https://github.com/ethereumjs/rlp/pull/60)
- Additional exports of types used by `decode` and `encode`
  (PR [#59](https://github.com/ethereumjs/rlp/pull/59)):
  - `Input`: input type for `encode()`
  - `Dictionary` and `List`: interfaces for possible `Input` values
  - `Decoded`: interface for `decode()` return type
- Additional test structure and new integration tests for distribution and
  `bin/rlp` CLI command, see PR [#57](https://github.com/ethereumjs/rlp/pull/57)

[v2.2.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@2.2.0...rlp@2.2.1

## [v2.2.0] - 2018-12-17

[DEPRECATED] Please update to `v2.2.1`, release contains a broken CLI `bin/rlp`
command!

First `TypeScript` based release of `EthereumJS` libraries, thanks @krzkaczor,
@GrandSchtroumpf, @whymarrh, @holgerd77 for the great work on this!

This release doesn't introduce any main new features but will serve as a basis
for further `TypeScript` transitions coming along with greater type safety
for `EthereumJS` libraries. If you are developing in `TypeScript` you can
further already benefit from the `RLP` type declarations published from now on
along new releases.

See PR [#37](https://github.com/ethereumjs/rlp/pull/37) and subsequent PRs merged
towards the associated `typescript` branch to get an overview on the changes.
The release also comes along with the introduction of a new repo
[ethereumjs-config](https://github.com/ethereumjs/ethereumjs-config) centralizing
configuration for `EthereumJS` libraries on `TypeScript` itself as well as
linting, formatting and testing.

This release passes all existing unit tests and other checks. If you nevertheless
experience problems please report on the `EthereumJS`
[Gitter](https://gitter.im/ethereum/ethereumjs) channel.

Other changes:

- Added `LICENSE` file for `MPL2.0`, see PR [#31](https://github.com/ethereumjs/rlp/pull/31)

[v2.2.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@2.1.0...rlp@2.2.0

## [v2.1.0] - 2018-06-28

- Updated supported Node versions, PR [#13](https://github.com/ethereumjs/rlp/pull/13)
- Switched to `safe-buffer` for backwards compatibility, PR [#18](https://github.com/ethereumjs/rlp/pull/18)
- Increased test coverage, PR [#22](https://github.com/ethereumjs/rlp/pull/22)
- Example code tweaks, PR [#12](https://github.com/ethereumjs/rlp/pull/12)
- Fix test runs on Windows, Issue [#7](https://github.com/ethereumjs/rlp/issues/7)
- Added code coverage, PR [#8](https://github.com/ethereumjs/rlp/pull/8)

[v2.1.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@2.0.0...rlp@2.1.0

## [2.0.0] - 2015-09-23

- User `Buffer` values as input for encoding

[2.0.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@1.1.2...rlp@2.0.0

## [1.1.2] - 2015-09-22

- Fix zero encoding

[1.1.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@1.1.1...rlp@1.1.2

## [1.1.1] - 2015-09-21

- Fixes for `bin`

[1.1.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@1.1.0...rlp@1.1.1

## [1.1.0] - 2015-09-21

- Added `getLength()` method
- Added hex prefix stripping (`isHexPrefix()` / `stripHexPrefix()`)
- Code formatting clean-ups

[1.1.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@1.0.1...rlp@1.1.0

## [1.0.1] - 2015-06-27

- Code formatting clean-ups

[1.0.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@1.0.0...rlp@1.0.1

## [1.0.0] - 2015-06-06

- Added check for invalid 0
- Hardened rlp

[1.0.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@0.0.14...rlp@1.0.0

## Older releases:

- [0.0.14](https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@0.0.13...rlp@0.0.14) - 2015-03-31
- [0.0.13](https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@0.0.12...rlp@0.0.13) - 2015-03-30
- [0.0.12](https://github.com/ethereumjs/ethereumjs-monorepo/compare/rlp@0.0.11...rlp@0.0.12) - 2014-12-26
