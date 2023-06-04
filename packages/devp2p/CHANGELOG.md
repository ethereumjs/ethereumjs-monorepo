# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 5.1.2 - 2023-04-20

- Update ethereum-cryptography from 1.2 to 2.0 (switch from noble-secp256k1 to noble-curves), PR [#2641](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2641)
- Bump `@ethereumjs/util` `@chainsafe/ssz` dependency to 0.11.1 (no WASM, native SHA-256 implementation, ES2019 compatible, explicit imports), PRs [#2622](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2622), [#2564](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2564) and [#2656](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2656)

## 5.1.1 - 2023-02-27

- Pinned `@ethereumjs/util` `@chainsafe/ssz` dependency to `v0.9.4` due to ES2021 features used in `v0.10.+` causing compatibility issues, PR [#2555](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2555)

## 5.1.0 - 2023-02-21

**DEPRECATED**: Release is deprecated due to broken dependencies, please update to the subsequent bugfix release version.

This release updates the underlying `@ethereumjs/common` dependency version to make the library ready for the upcoming `Shanghai` hardfork (scheduled for early 2023) regarding the `forkHash` related fork switch logic, see PR [#2521](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2521). Note that a `timestamp` to trigger the `Shanghai` fork update is only added to Common for the `sepolia` testnet and not yet for `goerli` or `mainnet`.

You can instantiate a Shanghai-enabled Common instance with:

```typescript
import { Common, Chain, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
```

### Other Changes

- Fixed DNS Discovery ENR record decoding (better connectivity, avoids loosing DNS peer suggestions), PR [#2546](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2546)
- Removed outdated Parity DPT ping/pong hack, PR [#2538](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2538)
- Improved devp2p HELLO logging message (added protocol version and client ID), PR [#2538](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2538)

## 5.0.2 - 2022-12-09

### Hardfork-By-Time Support

The devp2p library is now ready to work with hardforks triggered by timestamp, which will first be applied along the `Shanghai` HF, see PR [#2437](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2437). This is achieved by integrating a new timestamp supporting `@ethereumjs/common` library version.

One specific devp2p change is that the forkid is now calculated based on timestamps for timestamp-based HFs, see [EIP-6122](https://github.com/ethereum/EIPs/pull/6122).

## 5.0.1 - 2022-10-18

### Support for Geth genesis.json Genesis Format

For lots of custom chains (for e.g. devnets and testnets), you might come across a [Geth genesis.json config](https://geth.ethereum.org/docs/interface/private-network) which has both config specification for the chain as well as the genesis state specification.

`Common` now has a new constructor `Common.fromGethGenesis()` - see PRs [#2300](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2300) and [#2319](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2319) - which can be used in following manner to instantiate for example a VM run or a tx with a `genesis.json` based Common:

```typescript
import { Common } from '@ethereumjs/common'
// Load geth genesis json file into lets say `genesisJson` and optional `chain` and `genesisHash`
const common = Common.fromGethGenesis(genesisJson, { chain: 'customChain', genesisHash })
// If you don't have `genesisHash` while initiating common, you can later configure common (for e.g.
// calculating it afterwards by using the `@ethereumjs/blockchain` package)
common.setForkHashes(genesisHash)
```

### Other Changes and Fixes

- Added env check (performance optimization) for DEBUG mode using `debug` package, PR [#2311](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2311)

## 5.0.0 - 2022-09-06

Final release - tada 🎉 - of a wider breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2, Beta 3 and Release Candidate (RC) 1 release notes for notes on some additional changes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/CHANGELOG.md)).

### Changes

- Internal refactor: removed ambiguous boolean checks within conditional clauses, PR [#2254](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2254)

## 5.0.0-rc.1 - 2022-08-29

Release candidate 1 for the upcoming breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2 and 3 release notes for notes on some additional changes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/CHANGELOG.md)).

### Fixed Mainnet Merge HF Default

Since this bug was so severe it gets its own section: `mainnet` in the underlying `@ethereumjs/common` library (`Chain.Mainnet`) was accidentally not updated yet to default to the `merge` HF (`Hardfork.Merge`) by an undiscovered overwrite back to `london`.

This has been fixed in PR [#2206](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2206) and `mainnet` now default to the `merge` as well.

### Maintenance Updates

- Added `engine` field to `package.json` limiting Node versions to v14 or higher, PR [#2164](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2164)
- Replaced `nyc` (code coverage) configurations with `c8` configurations, PR [#2192](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2192)
- Code formats improvements by adding various new linting rules, see Issue [#1935](https://github.com/ethereumjs/ethereumjs-monorepo/issues/1935)

## 5.0.0-beta.3 - 2022-08-10

Beta 3 release for the upcoming breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2 release notes for notes on some additional changes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/CHANGELOG.md)).

### Merge Hardfork Default

Since the Merge HF is getting close we have decided to directly jump on the `Merge` HF (before: `Istanbul`) as default in the underlying `@ethereumjs/common` library and skip the `London` default HF as we initially intended to set (see Beta 1 CHANGELOG), see PR [#2087](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2087).

This change should not directly affect this library but might be relevant since it is not recommended to use different Common library versions between the different EthereumJS libraries.

## 5.0.0-beta.2 - 2022-07-15

Beta 2 release for the upcoming breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/CHANGELOG.md)) for the main change set description.

### Removed Default Exports

The change with the biggest effect on UX since the last Beta 1 releases is for sure that we have removed default exports all accross the monorepo, see PR [#2018](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2018), we even now added a new linting rule that completely disallows using.

Default exports were a common source of error and confusion when using our libraries in a CommonJS context, leading to issues like Issue [#978](https://github.com/ethereumjs/ethereumjs-monorepo/issues/978).

Now every import is a named import and we think the long term benefits will very much outweigh the one-time hassle of some import adoptions.

#### Common Library Import Updates

Since our [@ethereumjs/common](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common) library is used all accross our libraries for chain and HF instantiation this will likely be the one being the most prevalent regarding the need for some import updates.

So Common import and usage is changing from:

```typescript
import Common, { Chain, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Merge })
```

to:

```typescript
import { Common, Chain, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Merge })
```

## SNAP Protocol Support

[Ethereum Snapshot Protocol](https://github.com/ethereum/devp2p/blob/master/caps/snap.md) (SNAP) support has been added in PR [#1883](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1883). This allows to run the SNAP protocol as a side-protocol to the ETH protocol for exchanging state snapshots between peers.

## Other Changes

- Added `ESLint` strict boolean expressions linting rule, PR [#2030](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2030)

## 5.0.0-beta.1 - 2022-06-30

This release is part of a larger breaking release round where all [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries (VM, Tx, Trie, other) get major version upgrades. This round of releases has been prepared for a long time and we are really pleased with and proud of the result, thanks to all team members and contributors who worked so hard and made this possible! 🙂 ❤️

We have gotten rid of a lot of technical debt and inconsistencies and removed unused functionality, renamed methods, improved on the API and on TypeScript typing, to name a few of the more local type of refactoring changes. There are also broader structural changes like a full transition to native JavaScript `BigInt` values as well as various somewhat deep-reaching refactorings, both within a single package as well as some reaching beyond the scope of a single package. Also two completely new packages - `@ethereumjs/evm` (in addition to the existing `@ethereumjs/vm` package) and `@ethereumjs/statemanager` - have been created, leading to a more modular Ethereum JavaScript VM.

We are very much confident that users of the libraries will greatly benefit from the changes being introduced. However - along the upgrade process - these releases require some extra attention and care since the changeset is both so big and deep reaching. We highly recommend to closely read the release notes, we have done our best to create a full picture on the changes with some special emphasis on delicate code and API parts and give some explicit guidance on how to upgrade and where problems might arise!

So, enjoy the releases (this is a first round of Beta releases, with final releases following a couple of weeks after if things go well)! 🎉

The EthereumJS Team

### BigInt Introduction / ES2020 Build Target

With this round of breaking releases the whole EthereumJS library stack removes the [BN.js](https://github.com/indutny/bn.js/) library and switches to use native JavaScript [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) values for large-number operations and interactions.

This makes the libraries more secure and robust (no more BN.js v4 vs v5 incompatibilities) and generally comes with substantial performance gains for the large-number-arithmetic-intense parts of the libraries (particularly the VM).

To allow for BigInt support our build target has been updated to [ES2020](https://262.ecma-international.org/11.0/). We feel that some still remaining browser compatibility issues on the edges (old Safari versions e.g.) are justified by the substantial gains this step brings along.

See [#1671](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1671) and [#1771](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1771) for the core `BigInt` transition PRs.

### Disabled esModuleInterop and allowSyntheticDefaultImports TypeScript Compiler Options

The above TypeScript options provide some semantic sugar like allowing to write an import like `import React from "react"` instead of `import * as React from "react"`, see [esModuleInterop](https://www.typescriptlang.org/tsconfig#esModuleInterop) and [allowSyntheticDefaultImports](https://www.typescriptlang.org/tsconfig#allowSyntheticDefaultImports) docs for some details.

While this is convenient, it deviates from the ESM specification and forces downstream users into using these options, which might not be desirable, see [this TypeScript Semver docs section](https://www.semver-ts.org/#module-interop) for some more detailed argumentation.

Along with the breaking releases we have therefore deactivated both of these options and you might therefore need to adapt some import statements accordingly. Note that you still can activate these options in your bundle and/or transpilation pipeline (but now you also have the option _not_ to, which you didn't have before).

### Other Changes

- Removed Node.js specific `assert` usage, PR [#1924](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1924)
- Deduplicated `keccak` and `secp256k1` library usage in favor of `ethereum-cryptography`, Noble crypto library uses, PR [#1947](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1947)
- Replaced `hi-base32` dependency with `@scure/base` from [@paulmillr](https://github.com/paulmillr) (Noble crypto library author), PR [#1947](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1947)

## 4.2.2 - 2022-04-29

- Solved memory leak "DPT discovers nodes when open_slots = 0", PR [#1816](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1816)
- Fixed per-message debug logging, PR [#1776](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1776)
- ETH-LES class refactor, PR [#1600](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1600)

## 4.2.1 - 2022-02-01

- Dependencies: deduplicated RLP import, PR [#1549](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1549)
- Fixed duplicated debug messages (`DEBUG` logger, see `README`), PR [#1643](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1643)

## 4.2.0 - 2021-09-24

### EIP-706 Snappy Compression (RLPx v5)

This release adds support for RLPx v5 allowing for the compression of RLPx messages with the Snappy compression algorithm as defined in [EIP-706](https://eips.ethereum.org/EIPS/eip-706). If the connecting peer doesn't support v5, the connection falls back to v4 and does the communication without compressing the payload.

See: PRs [#1399](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1399), [#1442](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1442) and [#1484](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1484)

### Improved Per-Message Debugging

Per-message debugging with the `debug` package has been substantially expanded and allow for a much more targeted debugging experience.

There are new debug loggers added to:

- Debug per specific `ETH` or `LES` message (e.g. `devp2p:eth:GET_BLOCK_HEADERS`)
- Debug per disconnect reason (e.g. `devp2p:rlpx:peer:DISCONNECT:TOO_MANY_PEERS`)
- Debug per peer IP address (e.g. `devp2p:3.209.45.79`)
- Debug per first connected peer (`DEBUG=devp2p:FIRST_PEER`)

See: PR [#1449](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1449)

## 4.1.0 - 2021-07-15

### Finalized London HF Support

This release integrates a `Common` library version which provides the `london` HF blocks for all networks including `mainnet` and is therefore the first release with finalized London HF support. For the `devp2p` library this particularly means that the fork hashes for the `london` HF will be correct when using eth/64 or higher.

### Support for eth/66 and les/4

PR [#1331](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1331) added support for eth/66 and [#1324](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1324) for les/4. Be sure to check out the updated peer communication [examples](./examples).

### Included Source Files

Source files from the `src` folder are now included in the distribution build, see PR [#1301](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1301). This allows for a better debugging experience in debug tools like Chrome DevTools by having working source map references to the original sources available for inspection.

### Bug Fixes

- Fixed zero Buffer forkhash bug in case no future fork known, PR #1148 commit [`afd00a8`](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1148/commits/afd00a8bfee1b524352a0f6c79f3bcfe43debe4c)

## 4.0.0 - 2021-04-22

**Attention!** This new version is part of a series of EthereumJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `ethereumjs-devp2p` -> `@ethereumjs/devp2p`

Please update your library references accordingly or install with:

```shell
npm i @ethereumjs/devp2p
```

This is the first-production ready release of this library. During our work on the [EthereumJS Client](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/client) we were finally able to battle-test this library in a real-world environment (so: towards `mainnet`, the main official testnets like `goerli` or `rinkeby` as well as ephemeral testnets like `yolov3`). We fixed a myriad of partly critical bugs along the way (which are extremely hard to reproduce just in a test environment) and can now fully recommend to use this library for `ETH` protocol integrations up to version `ETH/65` in a production setup. Note that the `LES` support in the library is still outdated (but working), an update is planned (let us know if you have demand).

### ETH/64 and ETH/65 Support

The `ETH` protocol support has been updated to now also support versions `64` and `65`. Biggest protocol update here is `ETH/64` introduced with PR [#82](https://github.com/ethereumjs/ethereumjs-devp2p/pull/82) which adds support for selecting peers by fork ID (see associated [EIP-2124](https://eips.ethereum.org/EIPS/eip-2124)). This allows for a much more differentiated chain selection and avoids connecting to peers which are on a different chain but having a shared chain history with the same blocks and the same block hashes.

`ETH/65` implemented in PR [#1159](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1159) adds three new message types `NewPooledTransactionHashes (0x08)`, `GetPooledTransactions (0x09)` and `PooledTransactions (0x0a)` for a more efficient exchange on txs from the tx pool ([EIP-2464](https://eips.ethereum.org/EIPS/eip-2464)).

### DNS Discovery Support

Node discovery via DNS has been added to quickly acquire testnet (or mainnet) peers from the DNS ENR tree per [EIP-1459](https://eips.ethereum.org/EIPS/eip-1459), see PRs [#1070](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1070), [#1097](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1097) and [#1149](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1149). This allows for easier peer discovery especially on the testnets. Peer search is randomized as being recommended in the EIP and the implementation avoids to download the entire DNS tree at once.

DNS discovery can be activated in the `DPT` module with the `shouldGetDnsPeers` option, in addition there is a new `shouldFindNeighbours` option allowing to deactivate the classical v4 discovery process. Both discovery methods can be used in conjunction though. DNS Peer discovery can be customized/configured with additional constructor options `dnsRefreshQuantity`, `dnsNetworks` and `dnsAddress`. See [API section](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/devp2p#api) in the README for a description.

### Other Features / Changes

- Updated `goerli` bootnodes, PR [#1031](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1031)
- `maxPeers`, `dpt`, and `listenPort` are now optional in `RLPxOptions`, PR [#1019](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1019)
- New `DPTOptions` interface, `DPT` type improvements, PR [#1029](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1029)
- Improved `RLPx` disconnect reason debug output, PR [#1031](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1031)
- `LES`: unifiy `ETH` and `LES` `sendMessage()` signature by somewhat change payload semantics and pass in `reqId` along, PR [#1087](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1087)
- `RLPx`: limit connection refill debug logging to a restarted interval log message to not bloat logging too much, PR [#1087](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1087)

### Connection Reliability / Bug Fixes

- Subdivided interval calls to refill `RLPx` peer connections to improve networking distribution and connection reliability, PR [#1036](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1036)
- Fixed an error in `DPT` not properly banning old peers and replacing with a new peer on `KBucket` ping, PR [#1036](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1036)
- Connection reliability: distribute network traffic on `DPT` additions of new neighbour peers, PR [#1036](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1036)
- Fixed a critical peer data processing bug, PR [#1064](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1064)
- Added socket destroyed checks on peer message sending to safeguard against stream-was-destroyed error, PR [#1075](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1075)
- `DPT`: fixed undefined array access in ETH.\_getStatusString() on malformed ETH/64 status msgs, PR [#1029](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1029)

### Maintenance / Testing / CI

- Added dedicated browser build published to `dist.browser` to `package.json`, PR [#1184](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1184)
- Updated `rlp-encoding` dependency to the EthereumJS `rlp` library, PR [#94](https://github.com/ethereumjs/ethereumjs-devp2p/pull/94)
- `RLPx` type improvements, PR [#1036](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1036)
- Switched to `Codecov`, PR [#92](https://github.com/ethereumjs/ethereumjs-devp2p/pull/92)
- Upgraded dev deps (config 2.0, monorepo betas, typedoc), PR [#93](https://github.com/ethereumjs/ethereumjs-devp2p/pull/93)

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
