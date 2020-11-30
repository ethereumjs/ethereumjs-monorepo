# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [3.0.3] - 2020-09-29

- Moved `TypeScript` type packages for `lru-cache` and `bl` from `devDependencies` to
  `dependencies`, PR [#90](https://github.com/ethereumjs/ethereumjs-devp2p/pull/90)

[3.0.3]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v3.0.2...v3.0.3

## [3.0.2] - 2020-09-28

- Fixed `TypeScript` import issue causing problems when integrating the library in a
  `TypeScript` project, PR [#88](https://github.com/ethereumjs/ethereumjs-devp2p/pull/88)
- Updated `k-bucket` library to `v5`, added types from new `@types/k-bucket` package from
  @tomonari-t, PR [#88](https://github.com/ethereumjs/ethereumjs-devp2p/pull/88)

[3.0.2]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v3.0.1...v3.0.2

## [3.0.1] - 2020-06-10

This release focuses on improving the [debugging](https://github.com/ethereumjs/ethereumjs-devp2p#debugging)
capabilities of the library. PR [#72](https://github.com/ethereumjs/ethereumjs-devp2p/pull/72)
reduces the **verbosity** of the log output to cut on noise on everyday debugging. There is a new `verbose`
logger to retain the more verbose output (e.g. with full message bodies) which can be used like this:

```shell
DEBUG=devp2p:*,verbose node -r ts-node/register ./examples/peer-communication.ts
```

**Other Logging Improvements**

Relevant PRs [#75](https://github.com/ethereumjs/ethereumjs-devp2p/pull/75) and
[#73](https://github.com/ethereumjs/ethereumjs-devp2p/pull/73):

- Added number of peers to `refillConnections()` debug message
- Replaced try/catch logic for EIP-8 auth check to avoid side-effects and get rid of misleading _wrong-ecies-header_ debug output
- Moved debug output in `BanList.add()` after the set operation to get the correct size output
- Added debug message for `DISCONNECT` reason from peer (this was always some constant re-debug reason, and at the end it's mostly `TOO_MANY_PEERS`)
- Internalize detached logger output from the `devp2p:util` logger

**Other Changes**

- Refactored `Peer` class for better code readability, PR [#77](https://github.com/ethereumjs/ethereumjs-devp2p/pull/77)

There has also been a new [high-level diagram](https://github.com/ethereumjs/ethereumjs-devp2p#api) added to the `README` which can be used to get an overview on the structure, available loggers and the event flow of the library (PR [#76](https://github.com/ethereumjs/ethereumjs-devp2p/pull/76)).

[3.0.1]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v3.0.0...v3.0.1

## [3.0.0] - 2020-05-25

First `TypeScript` release of the library, see PR [#56](https://github.com/ethereumjs/ethereumjs-devp2p/pull/56) for all the changes and associated discussion.

All source parts of the library have been ported to `TypeScript` and working with the library should now therefore be much more reliable due to the additional type safety features provided by the `TypeScript` language. The API of the library remains unchanged in a `JavaScript` context.

**Noteworthy Changes from PR [#56](https://github.com/ethereumjs/ethereumjs-devp2p/pull/56):**

- Type additions for all method signatures and class members of all protocol components (`dpt`, `eth`, `les`, `rlpx`)
- Addition of various structuring interfaces (like [PeerInfo](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/dpt/message.ts#L10) for `DPT` message input) and `enum` constructs (like [MESSAGE_CODES](https://github.com/ethereumjs/ethereumjs-devp2p/blob/master/src/eth/index.ts#L186) from the `ETH` protocol)
- Port of the [examples](https://github.com/ethereumjs/ethereumjs-devp2p/tree/master/examples) to `TypeScript`
- Port of all the [test cases](https://github.com/ethereumjs/ethereumjs-devp2p/tree/master/test) to `TypeScript`
- Integration of the library into the common [ethereumjs-config](https://github.com/ethereumjs/ethereumjs-config) EthereumJS configuration setup (`standard` -> `TSLint` linting, docs with `TypeDoc`, `TypeScript` compilation, `Prettier` formatting rules)
- Lots of code cleanups and code part modernizations

Thanks @dryajov for all the great work on this! ❤

**Other Updates:**

- Added Node 12,13 support, upgrade from Travis to GitHub actions, PR [#57](https://github.com/ethereumjs/ethereumjs-devp2p/pull/57)
- Updated `ethereumjs-common` dependency to `v1.5.1` for a bootnode update, PR [#67](https://github.com/ethereumjs/ethereumjs-devp2p/pull/67)
- Removed Node 6, 8 support, updated `secp256k1` dependency to from `v3.1.0` to `v4.0.1`, PR [#68](https://github.com/ethereumjs/ethereumjs-devp2p/pull/68)
- Updated `keccak` dependency to `v3.0.0`, PR [#64](https://github.com/ethereumjs/ethereumjs-devp2p/pull/64)
- Some dependency cleanup, PRs [#62](https://github.com/ethereumjs/ethereumjs-devp2p/pull/62), [#65](https://github.com/ethereumjs/ethereumjs-devp2p/pull/65), [#58](https://github.com/ethereumjs/ethereumjs-devp2p/pull/58)

[3.0.0]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.5.1...v3.0.0

## [2.5.1] - 2018-12-12

- Fix connection error by ignoring `RLPX` peers with missing tcp port, PR [#45](https://github.com/ethereumjs/ethereumjs-devp2p/pull/45)

[2.5.1]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.5.0...v2.5.1

## [2.5.0] - 2018-03-22

- Light client protocol (`LES/2`) implementation, PR [#21](https://github.com/ethereumjs/ethereumjs-devp2p/pull/21)
- `LES/2` usage example, see: `examples/peer-communication-les.js`
- Better test coverage for upper-layer protocols (`ETH`, `LES/2`), PR [#34](https://github.com/ethereumjs/ethereumjs-devp2p/pull/34)

[2.5.0]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.4.0...v2.5.0

## [2.4.0] - 2018-02-28

- First release providing a reliable `ETH` connection
- Fix Parity `DPT` ping echo hash bug preventing the library to connect
  to Parity clients, PR [#32](https://github.com/ethereumjs/ethereumjs-devp2p/pull/32)
- Fixed a bug not setting weHello in peer after sent `HELLO` msg

[2.4.0]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.3.0...v2.4.0

## [2.3.0] - 2018-02-27

- Fix critical `RLPX` bug leading to not processing incoming `EIP-8` `Auth` or `Ack` messages, PR [#26](https://github.com/ethereumjs/ethereumjs-devp2p/pull/26)
- Fix bug not forwarding `k-bucket` remove event through `DPT` (so `peer:removed` from
  `DPT` was not working), PR [#27](https://github.com/ethereumjs/ethereumjs-devp2p/pull/27)
- Fix updating `ingressMac` with wrong `Auth` msg leading to diverging `Mac` hashes, PR [#29](https://github.com/ethereumjs/ethereumjs-devp2p/pull/29)
- Fix bug not let first `ETH` `status` message emit a `message` event, PR [#30](https://github.com/ethereumjs/ethereumjs-devp2p/pull/30)
- Large rework of the test setup, additional `DPT`, `RLPX` and `ETH` simulator tests,
  improving test coverage from 48% to 84%, PR [#25](https://github.com/ethereumjs/ethereumjs-devp2p/pull/25)

[2.3.0]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.2.0...v2.3.0

## [2.2.0] - 2017-12-07

- `EIP-8` compatibility
- Improved debug messages
- Fixes a bug on DPT ping timeout being triggered even if pong message is received
- Only send connect event after both HELLO msgs are exchanged (fixes unreliable upper-protocol communication start)
- Connection reliability improvements for `peer-communication` example
- API documentation

[2.2.0]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.1.3...v2.2.0

## [2.1.3] - 2017-11-09

- Dependency updates
- Improved README documentation

[2.1.3]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.1.2...v2.1.3

## Older releases:

- [2.1.2](https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.1.1...v2.1.2) - 2017-05-16
- [2.1.1](https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.1.0...v2.1.1) - 2017-04-27
- [2.1.0](https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.0.0...v2.1.0) - 2016-12-11
- [2.0.0](https://github.com/ethereumjs/ethereumjs-devp2p/compare/v1.0.0...v2.0.0) - 2016-11-14
- 1.0.0 - 2016-10-18
