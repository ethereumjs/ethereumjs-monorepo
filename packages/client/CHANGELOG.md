# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [UNRELEASED]

**New Features**

- Integrate ETH/64 Protocol into Client, PR [#1020](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1020)
- Upgrade to eth/66 [#1331](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1331)
- Add les v3/v4, PR [#1324](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1324)
- Implement EIP-1459: DNS peer discovery, PR [#1070](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1070)
- Add VM execution, PR [#1028](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1028)
- Add 6 new RPC methods, PR [#1130](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1130)
- "The merge" rpc scaffolding, PR [#1265](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1265)
- eth_chainID and eth_syncing RPC implementations, PR [#1314](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1314)
- Central event bus implementation, PR [#1187](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1187)
- Add node discovery mode flags & define network-based defaults, PR [#1097](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1097)
- Add debugCode CLI option to generate Block execution script, PR [#1091](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1091)
- Local client connections for debugging, PR [#1147](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1147)

**Bug Fixes**

- Clique PoA fixes, PR [#1088](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1088)
- Fix Sync Bugs and Error Messages, PR [#1075](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1075)
- Client Network Improvements and fix `nextForkBlock` bug, PR [#1031](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1031)
- Fix HF switching. Fix TangerineWhistle update bug (Rinkeby: Block 14182), PR [#1101](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1101)
- Fix Goerli Clique Difficulty Bug, PR [#1103](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1103)
- Add fix for kovan nonce, PR [#1334](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1334)

**Maintenance**

- Save node key for consistent enode id, PR [#1067](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1067)
- Refactor VM execution, PR [#1068](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1068)
- Restart rlpx server on peerpool re-bootstrap, PR [#1113](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1113)
- Split CLI transports options for bootnodes and multiaddrs, PR [#1145](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1145)
- Simple message queue to handle unhandled ETH messages during handshake, PR [#1237](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1237)
- bootstrap() extraction, PR [#1222](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1222)
- Await DPT init, PR [#1233](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1233)
- Make fetcher more typesafe, PR [#1023](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1023)

**Dependencies, CI and Docs**

- Upgrade `libp2p` modules to js-libp2p v0.30.7 and associated modules, PR [#1027](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1027)
- Add basic cli test, PR [#1165](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1165)
- Update client diagram [#1005](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1005)
- Fix Fetcher.ts failure on Node v14, PR [#1022](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1022)
- Fix failing node 16 CI, PR [#1346](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1346)

## [0.0.6] - 2020-06-19

### Revival Release 🌻

After a longer period of stalled development this release brings the `EthereumJS` client back
to life respectively a usable state by doing necessary dependency updates and modernizing CI.
It also comes with an updated documentation and user-facing improvements like a more reliable
and better communicated sync mechanism.

Most notable for development is the upgrade of the `ethereumjs-devp2p` dependency to `v3.0.1`.
The devp2p library is now `TypeScript` based and comes with an improved debugging experience
which will be helpful when working on further improving the sync reliability of the client and
hunting for networking bugs.

To ease jumping into the code base there is now a new structure
[diagram](https://github.com/ethereumjs/ethereumjs-client/blob/master/diagram/client.svg)
showing the relations between the main components as well as the initialization and message flow.

## Changes

**Dependencies, CI and Docs**

- Added Node 12, removed Node 8 on CI runs, updated `level` and `ethereumjs-common` dependency,
  PR [#111](https://github.com/ethereumjs/ethereumjs-client/pull/111)
- Upgraded CI provider to GitHub actions,
  PR [#119](https://github.com/ethereumjs/ethereumjs-client/pull/119)
- Updated `ethereumjs-util` to `v7.0.2`,
  PR [#129](https://github.com/ethereumjs/ethereumjs-client/pull/129)
- Added up-to-date version of the `README`, `Outdated` notice for the project summary,
  PR [#114](https://github.com/ethereumjs/ethereumjs-client/pull/114)
- Added `JSON-RPC` documentation to `README`,
  PR [#124](https://github.com/ethereumjs/ethereumjs-client/pull/124)
- New high-level structure diagram,
  PR [#134](https://github.com/ethereumjs/ethereumjs-client/pull/134)

**Bug Fixes and Maintenance**

- Fixed tx initialization bug, PR [#113](https://github.com/ethereumjs/ethereumjs-client/pull/113)
- fix(rpc): Handle rpc request with empty params,
  PR [#122](https://github.com/ethereumjs/ethereumjs-client/pull/122)
- Fixed light sync block init bug,
  PR [#127](https://github.com/ethereumjs/ethereumjs-client/pull/127)
- `RPC` test method cleanup,
  PR [#126](https://github.com/ethereumjs/ethereumjs-client/pull/126)
- Removed old fields `consensus` and `finality`,
  PR [#120](https://github.com/ethereumjs/ethereumjs-client/pull/120)

**New Features**

- Improved sync reliability,
  PR [#133](https://github.com/ethereumjs/ethereumjs-client/pull/133)
- Added `eth_blockNumber` RPC method,
  PR [#131](https://github.com/ethereumjs/ethereumjs-client/pull/131)
- Added `eth_getBlockTransactionCountByHash` RPC method,
  PR [#125](https://github.com/ethereumjs/ethereumjs-client/pull/125)

[0.0.6]: https://github.com/ethereumjs/ethereumjs-client/compare/v0.0.5...v0.0.6

## [0.0.5] - 2019-02-12

- Add support for final [Goerli](https://github.com/goerli/testnet) testnet,
  PR [#89](https://github.com/ethereumjs/ethereumjs-client/pull/89)

[0.0.5]: https://github.com/ethereumjs/ethereumjs-client/compare/v0.0.4...v0.0.5

## [0.0.4] - 2018-12-30

- Add more RPC endpoints, PR [#65](https://github.com/ethereumjs/ethereumjs-client/pull/65), [#69](https://github.com/ethereumjs/ethereumjs-client/pull/69), [#75](https://github.com/ethereumjs/ethereumjs-client/pull/75), [#81](https://github.com/ethereumjs/ethereumjs-client/pull/81)
- Add unit tests, PR [#70](https://github.com/ethereumjs/ethereumjs-client/pull/70)
- Fix error with geth genesis file parser, PR [#71](https://github.com/ethereumjs/ethereumjs-client/pull/71)
- Update `ethereumjs-common` to 0.6.1, PR [#72](https://github.com/ethereumjs/ethereumjs-client/pull/72)
- Fix bug with sender status, PR [#74](https://github.com/ethereumjs/ethereumjs-client/pull/74)
- Add documentation and strict mode to RPC modules, PR [#76](https://github.com/ethereumjs/ethereumjs-client/pull/76)
- Shutdown gracefully on SIGINT, PR [#79](https://github.com/ethereumjs/ethereumjs-client/pull/79)
- Add integration tests, PR [#82](https://github.com/ethereumjs/ethereumjs-client/pull/82)
- Update `ethereumjs-devp2p` to 2.5.1, PR [#84](https://github.com/ethereumjs/ethereumjs-client/pull/84)
- Refactor syncing to use streams, PR [#85](https://github.com/ethereumjs/ethereumjs-client/pull/85)

[0.0.4]: https://github.com/ethereumjs/ethereumjs-client/compare/v0.0.3...v0.0.4

## [0.0.3] - 2018-10-30

- Update libp2p defaults, PR [#63](https://github.com/ethereumjs/ethereumjs-client/pull/63)

[0.0.3]: https://github.com/ethereumjs/ethereumjs-client/compare/v0.0.2...v0.0.3

## [0.0.2] - 2018-10-26

- Update `ethereumjs-blockchain` to 3.3.1, PR [#61](https://github.com/ethereumjs/ethereumjs-client/pull/61)

[0.0.2]: https://github.com/ethereumjs/ethereumjs-client/compare/v0.0.1...v0.0.2

## [0.0.1] - 2018-10-26

- Initial development release

[0.0.1]: https://github.com/ethereumjs/ethereumjs-client/tree/v0.0.1
