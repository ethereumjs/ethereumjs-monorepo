# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 0.7.1 - 2023-04-20

### Features

- New `numBlocksPerIteration` option to allow to set the number of blocks executed in bulk, other UX optimizations, PR [#2586](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2586)

### Bugfixes / Maintenance

- Stability and reorg improvements regarding safe and finalized blocks, PR [#2585](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2585)
- Beacon sync fixes, PR [#2584](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2584)
- Engine API timestamp checks, PR [#2579](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2579)
- Ensure safe/finalized blocks are part of the canonical chain on Engine API `forkchoiceUpdated`, PR [#2577](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2577)
- Engine API: ensure invalid blockhash status gets reported correctly, PR [#2583](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2583)
- Turn off libp2p transport by default, PR [#2557](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2557)

## 0.7.0 - 2023-02-16

This client release comes with finalized `Shanghai` hardfork support, fully integrates with a (non final) version of `EIP-4844` and allows to setup and run respective testnets, substantially improves on post-Merge UX and comes with a ton of bugfixes and (robustness) improvements being done during January 2023 core dev interop in Austria. So we felt this to be worth a minor version bump! 🙂 🎉 ❤️

### Functional Shanghai Support

This release fully supports all EIPs included in the [Shanghai](https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/shanghai.md) feature hardfork scheduled for early 2023. Note that a `timestamp` to trigger the `Shanghai` fork update is only added for the `sepolia` testnet and not yet for `goerli` or `mainnet`.

To run the client on the Sepolia network do:

```shell
ethereumjs --network=sepolia
```

#### Related Changes

- Change withdrawal amount representation from Wei to Gwei, PR [#2483](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2483)
- Fix forkchoiceUpdateV2 shanghai, PR [#2502](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2502)
- Engine-api-validators, newPayloadV2 and newPayloadV3 updates, PR [#2504](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2504)
- Add new shanghai engine apis (getCapabilties, getPayloadBodiesByHashV1, getPayloadBodiesByRangeV1), PR [#2509](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2509)
- getPayloadBodiesByRange fixes, PR [#2518](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2518)
- Changes engine_forkchoiceUpdatedV2 withdrawals parameter to `optional` to ensure we return the correct error message if a preShanghai payload is sent, PR [#2533](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2533)

### EIP-4844 Shard Blob Transactions Support (experimental)

This release supports an experimental version of the blob transaction type introduced with [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) as being specified in the [01d3209](https://github.com/ethereum/EIPs/commit/01d320998d1d53d95f347b5f43feaf606f230703) EIP version from February 8, 2023 and deployed along `eip4844-devnet-4` (January 2023), see PR [#2349](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2349) as well as PRs [#2522](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2522) and [#2526](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2526).

See Interop EIP-4844 Tracking Issue [#2494](https://github.com/ethereumjs/ethereumjs-monorepo/issues/2494) for information on how to run the client in the context of an EIP-4844 testnet.

#### Related Changes

- Add checks for replacement data gas too low for blob txs, PR [#2503](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2503)
- 4844 Engine API Fixes, PR [#2508](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2508)

### Post-Merge UX Improvements

The post-Merge client log flow where the EthereumJS client serves as a responsive execution client in combination with a consensus layer client like Lodestar has been completely overhauled, see PRs [#2497](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2497), [#2506](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2506) and [#2510](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2510).

Log output is now a lot more concise and adequate to the respective client post-Merge state, aggregating beacon sync logs when still in sync and giving a more detailed output when the client is synced to the chain and just following along the chain head when getting updated from the consensus layer.

### General Fixes

- Clean stop sync and execution to allow client shutdown, PR [#2477](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2477)
- Update Dockerfiles to use node 18, PR [#2487](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2487)
- New client ci run, PR [#2515](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2515)
- Add and use execHardfork while running a tx, PR [#2505](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2505)
- Hive withdrawal and general client fixes, PR [#2529](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2529)
- Use client ID from Client for client HELLO message exchange (previously devp2p default ID was used), PR [#2538](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2538)
- Fixed the fetcher errored property colliding with Readable class (broke client on error handling), PR [#2541](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2541)
- Support receipts when mining/sealing blocks, PR [#2544](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2544)
- Total difficulty related HF switch fixes, PR [#2545](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2545)

### Block Building / Tx Pool

- Build block fixes, PR [#2452](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2452)
- Apply correct hf to peer fetched txs as well as filter and remove mismatching hf txs while building blocks, PR [#2486](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2486)
- Adds some caching logic for pending payloads so as to prune pending block payloads once one is built and provided to the CL, PR [#2533](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2533)

### CLI

- **Breaking**: Reuse jwt-token from default path, PR [#2474](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2474)
- **Breaking**: Validate CLI args (client start with non-existing argument now fails), PR [#2490](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2490)
- **Breaking**: Change client CLI params to camelCase, PR [#2495](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2495)
- Fixed `--startBlock` option bug, PR [#2540](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2540)

### Sync Fixes and Improvements

- Handle withdrawal bodies in the blockfetcher and skeleton sync fixes, PR [#2462](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2462)
- Fix client's sync state on startup or while mining or single node (test) runs, PR [#2519](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2519)
- Allow genesis to be post merge, PR [#2530](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2530)
- New `--loadBlocksFromRlp` CLI parameter (mainly for testing purposes), PR [#2532](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2532)
- Better handling of reorgs that go pre-merge, PR [#2532](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2532)
- Fixed invalid head block reset bug, PR [#2550](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2550)

### Engine API

- Add `blockValue` to the `getPayload` response, PR [#2457](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2457)
- Fix engine-auth and engine-exchange-capabilities hive test, PR [#2531](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2531)

## 0.6.6 - 2022-12-09

This releases includes various bug fixes and optimizations discovered and applied along the run of the [Shandong](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2316) Pre-Shanghai testnet (https://github.com/ethereumjs/ethereumjs-monorepo/pull/2316) (now being deprecated) as well as new RPC methods implemented along the way.

Furthermore this client release can now run chain including blocks with `EIP-4895` beacon chain withdrawals respectively execute on EIP-4895 activating hardforks, see PRs [#2353](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2353) and [#2401](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2401).

### New RPC Methods

- `eth_getBlockTransactionCountByNumber`, PR [#2379](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2379)
- `eth_getTransactionByBlockHashAndIndex`, PR [#2443](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2443)
- `eth_gasPrice`, PR [#2396](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2396)
- `txpool_content`, PR [#2410](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2410)
- `debug_traceTransaction`, PR [#2444](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2444)
- Miscellaneous tx related fixes, PR [#2411](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2411)

### Hardfork-By-Time Support

The Client is now ready to work with hardforks triggered by timestamp, which will first be applied along the `Shanghai` HF, see PR [#2437](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2437). This is achieved by integrating a new timestamp supporting `@ethereumjs/common` library version.

### Other Changes and Bug Fixes

- Enhanced skeleton sync to process batches of new payloads and fcUs, PR [#2309](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2309)
- Various tx pool fixes, PR [#2382](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2382)
- Fixed skeleton reset scenario when head announced before subchain 0 tail, PR [#2408](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2408)
- Handle genesis and genesis extention properly for skeleton, PR [#2420](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2420)
- Fixed enode to ip4 and write the same to disk, PR [#2407](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2407)
- Fixed sendTransactions peer loop and enchance txpool logs, PR [#2412](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2412)
- Used unpadded int/bigint to buffer in net protocols (bug), PR [#2409](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2409)
- Fixed handling of post-merge genesis blocks, PR [#2427](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2427)
- Fixed logic bug in txPool.validate, PR [#2441](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2441)

## 0.6.5 - 2022-10-19

- Fixes broken release v0.6.4 (wrong @ethereumjs/util dependency)

## 0.6.4 - 2022-10-18

[ BROKEN] (wrong @ethereumjs/util dependency)

- Fixed reorg handling in the underlying `@ethereumjs/blockchain` library `iterator()` function, PR [#2308](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2308)
- Fixed a bug leading to exclusion of subsequent transactions build on top of previous ones, PR [#2333](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2333)
- Fixed a bug in the `eth_estimateGas` RPC call where the parameter logic was being applied to an optional parameter when the optional parameter didn't exist, PR [#2358](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2358)

## 0.6.3 - 2022-09-06

This is the official Merge-ready release for the EthereumJS client! 🎉 Note that it is not possible yet to run EthereumJS client on mainnet though. This release nevertheless implements all final Merge specifications and includes Merge-related configuration parameters and is ready for current (`Sepolia`) and future Merge related testnets and development networks.

This release also updates the underlying EthereumJS libraries to the final breaking versions.

## 0.6.2 - 2022-08-29

This release updates the underlying EthereumJS libraries to the newly released RC 1 versions.

### Fixed Hardfork Issues in Beacon Sync

This release mainly fixes various hardfork issues in beacon sync discovered after the `goerli` testnet merge, see PR [#2230](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2230):

- Engine's assemble block was not using correct fork
- Skeleton's call to getBlockHeaders wasn't resulting in correct block and hence the block bodies were also not correct because of which skeleton backfill was breaking
- Reverse block fetcher sync was picking up a peer which seemed to be providing `london` blocks instead of merge causing the fetcher to break again and again instead of just banning that peer.
- Skeleton's getBlock was not using the correct hardfork

This will make beacon sync on Goerli and other Merge-activated chains more robust.

### Other Changes

- Mainnet Merge `TTD` `58750000000000000000000` has been added to the `mainnet` chain configuration of the underlying `Common` library, PR [#2185](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2185)

## 0.6.1 - 2022-08-11

This release updates the underlying EthereumJS libraries to the newly released Beta 3 versions.

### Other Changes

- More robust beacon sync (additional recovery and reorg scenarios handled), PR [#1968](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1968)
- Allow `eth_call` RPC call without providing the `to` parameter, PR [#2084](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2084)
- Bring back client browser support from a non-working to an experimental state, PR [#2091](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2091)
- Set `goerli` Merge TTD to 10790000 (underlying `@ethereumjs/common library), PR [#2079](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2079)
- Update `sepolia` `mergeForkIdTransition` Merge transition HF (separate "artificial" HF construct only for networking layer) (underlying `@ethereumjs/common library), PR [#2098](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2098)

## 0.6.0 - 2022-07-15

### Sepolia Merge Support

This is the first client release which supports the Merge transition in conjunction with a consensus layer client (we recommend [Lodestar](https://github.com/ChainSafe/lodestar)), but are excited to see other combinations being tested too) on one of the official public Ethereum testnets, with [Sepolia](https://sepolia.dev/) being a good candidate here since the network is relatively new and has not yet grown so extensively.

Client instructions have been updated accordingly [here](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/client/merge) and you can use these instructions to start-up both clients, see them syncing first both the separate networks and then joining forces at Sepolia Merge block [1450409](https://sepolia.etherscan.io/block/1450409)! 🐼 ❤️

### EthereumJS Beta Releases Integration

This is the first client release which works with the next generation EthereumJS libraries being published as [Beta releases](https://github.com/ethereumjs/ethereumjs-monorepo/releases) right now. The client is a first test bed for these releases which include heavy structural changes (e.g. the VM separated into three different packages VM, EVM and StateManager). In return the client benefits directly from some of the integrations being done, e.g. the complete switch to native JavaScript BigInts which leads to a substantially better VM execution performance.

### DB Format Changes

Note that DB format has changed along with this release and it is therefore necessary to delete the old chain and state data directories. If this is causing you substantial hazzle please ask in our monorepo or Discord server on a migration script. While this will cause us some extra work it might actually be possible to provide one if there is some demand.

## Default Receipt Saving

With the transition to PoS chains running the client in a CL/EL setup the activation of receipt saving often gets necessary, since some CL clients (e.g. Lodestar) rely on the `eth_getLogs` RPC call to be activated to be able to properly work with the EthereumJS client.

Since the EthereumJS client is still mainly used in not-that-much-grown testnets and environments (so the additional disk space requirements are not that grave) we have therefore decided to turn the respective option `--saveReceipts` on by default, see PR [#2040](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2040).

You can use `--saveReceipts=false` if you would rather want to deactive again.

### Other Changes

- Miscellaneous fixes for beacon sync in reverseblockfetcher, skeleton, merge forkhash, PR [#1951](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1951)
- The underlying blockchain (chain) and Trie (state) databases have been upgraded from Level 6 to Level 8, PR [#1949](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1949)
- Activated Sepolia DNS discovery, PR [#2034](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2034)

## 0.5.0 - 2022-06-02

### Merge: Kiln v2.1 Support

This client release comes with various last specification updates for the Merge to conform with the execution engine API spec as defined in the "Ballast" [v1.0.0-alpha.9](https://github.com/ethereum/execution-apis/releases/tag/v1.0.0-alpha.9) pre-release of the execution API, also see the general Merge (aka "Paris" HF) [execution specs](https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/paris.md).

- Various `eth_` methods are now available on the engine API endpoint as of Kiln spec v2.1, PR [#1855](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1855)
- Small engine API updates and fixes, PR [#1902](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1902)
- Subsume engine's `INVALID_TERMINAL_BLOCK` into `INVALID` response, PR [#1919](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1919)

### Merge: Optimistic (Beacon) Sync

The client now supports [optimistic](https://github.com/ethereum/consensus-specs/blob/dev/sync/optimistic.md) (Beacon) sync where blocks are downloaded in reverse from the announced trusted head. This allows for a practically viable sync process in combination with a consensus client when running the client in an execution-consensus-client-combination setup on a Merge test network.

See PR [#1878](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1878) for the implementation and PR [#1858](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1858), PR [#1861](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1861) and PR [#1863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1863) which prepare the ground with some (larger scale) preparator refactor for the implementation.

### TxPool Validation

With this release our tx pool grows into a still simple but full-grown and base-feature-complete pool by adding all sorts of validation checks to ensure validity with consensus, see PR [#1852](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1852). This is another substantial step towards fullfilling the requirements for acting as an active block-producing client in an Ethereum network. Validation checks - like e.g. "tx nonce is greater than sender's current nonce" - are now run early on when a tx is send via RPC `eth_sendRawTransaction` and feedback (and eventual rejection of the tx) is provided at the point of submission. This allows for building valid blocks when acting as a block producer.

### Fixes

- Execution API: Added missing tx fields to `getBlockByHash` RPC method, PR [#1881](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1881)

## 0.4.1 - 2022-04-14

- Allow `forkchoiceUpdated` method to properly work on a reorg if a previous block was sent as `headBlockHash`, PR [#1820](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1820)
- Fix to have `newPayload` properly handle already existing payload, PR [#1824](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1824)
- client/engine: add ability to add blocks to blockchain without setting the head (faster engine calls!), PR [#1827](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1827)
- chain: safer closing to not cause db corruption during shutdown while handling engine requests, PR [#1827](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1827)
- CLConnectionManager: starts on first `updateStatus` in case `MergeForkIdTransition` isn't reached before merge (Goerli shadow fork scenario), PR [#1827](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1827)
- `eth_call` bug fix on specific `data` value cases, PR [#1830](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1830)
- engine: Adds `remoteBlocks` to handle storing blocks with unknown parent in case fcU sets head to it when parent is later given to `newPayload`, PR [#1830](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1830)
- Moved the TxPool to `FullEthereumService` (internal refactor for merge preparation), PR [#1853](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1853)

## 0.4.0 - 2022-03-15

### Merge Kiln v2 Testnet Support

This release fully supports the Merge [Kiln](https://kiln.themerge.dev/) testnet `v2` complying with the latest Merge [specs](https://hackmd.io/@n0ble/kiln-spec). You can use this release to sync with the testnet, combining with a suited consensus client (e.g. the Lodestar client). See [Kiln](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/client/kiln) instructions to get things going! 🚀

- New engine API endpoints, PRs [#1565](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1565) and [#1712](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1712)
  - `engine_newPayloadV1` (before: `engine_executePayloadV1`)
  - `engine_forkchoiceUpdatedV1`
  - `engine_getPayloadV1`
- New engine API endpoint, PR [#1750](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1750)
  - `exchangeTransitionConfigurationV1` (sets and returns the transition configuration parameters)
- Engine API (RPC): Renamed `message` to `validationError`, PR [#1565](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1565)
- Engine API (RPC): Allowed ws and http on the same port, PR [#1565](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1565)
- Engine API (RPC): Respect message ordering in forkchoiceUpdated, PR [#1565](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1565)
- Engine API (RPC): Rename `coinbase` to `feeRecipient` as per `v1.0.0-alpha.5` spec, PR [#1565](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1565)
- Engine API (RPC): Support for [jwt](https://jwt.io) based auth through both http/websocket protocols, PR [#1751](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1751)
- Engine API (RPC): Tests for new Engine API endpoints, PR [#1727](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1727)
- Geth genesis files: Use `mergeForkBlock` if provided, PR [#1565](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1565)
- Execution module refactor: decoupling from `FullSync` module to prepare for a post-Merge execution/sync separation, PR [#1663](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1663)
- Added terminal block validation in `newPayload` and `forkchoiceUpdated` methods from Engine API, PR [#1797](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1797)
- Validate block safe hash on `forkchoiceUpdated`, PR [#1804](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1804)
- Validate finalized block hash on `forkchoiceUpdated`, PR [#1803](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1803)
- More explicit Merge and CL connection logging with a proper panda bear icon and stuff, see PRs [#1800](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1800), [#1805](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1805) and [#1808](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1808)

### Features

- RPC Server: Added `rpcCors` option to specify [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) for rpc server, PR [#1762](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1762)
- RPC Server: New default ports for engine (`8551`) (HTTP-RPC and WS) and general RPC (`8545`), PR [#1775](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1775)
- Miner: unlock with file PK (do not use in a production setup for security reasons!), PR [#1790](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1790)
- Various sync stability improvements, PR [#1781](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1781)
- More sophisticated Block/Header fetcher reorg handling, PR [#1792](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1792)
- Added new `--startBlock` CLI option to allow for restarting sync on an older block, PR [#1807](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1807)
- JSON RPC: `eth_getBlockByNumber` method returns array of tx object when asked, PR [#1801](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1801)

### Bug Fixes

- Geth genesis files: Minor `baseFeePerGas` related fix and other improvements, PRs [#1720](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1720) and [#1741](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1741)
- Added `mixHash` to RPC block results (sorry, forgotten 😋), PR [#1791](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1791)
- Fixed frequent `Error handling message` error in tx poo, PR [#1793](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1793)
- Handle partial results in multi-peer safe manner, PR [#1802](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1802)

## 0.3.0 - 2022-02-01

### New RPC Endpoints: eth_getLogs, eth_getTransactionReceipt and eth_getTransactionByHash

This release adds receipt and log saving functionality to the client. There has been a new database infrastructure laid out in PR [#1556](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1556) for data, caching and indexes.

A new `ReceiptsManager` handles receipt and log saving and lookup, along with the `txHash -> [blockHash, txIndex]` index that is limited by `--txLookupLimit` (default = 2350000 blocks = about one year, 0 = entire chain).

Enable with `--saveReceipts` and use with --rpc to enable `eth_getLogs`, `eth_getTransactionReceipt` and `eth_getTransactionByHash` endpoints.

### Sepolia PoW Testnet Support

The client now supports the new [Sepolia](https://sepolia.ethdevops.io/) testnet, which is a PoW network intended to replace the `ropsten` network, see PR [#1581](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1581).

A client connecting to the Sepolia network can be started as follows:

```shell
ethereumjs --network=sepolia
```

### Allow past block numbers in RPC queries

The RPC calls `call`, `getBalance`, `getCode`, `getStorageAt`, `getTransactionCount`, and `estimateGas` up till now only supported being called with the `latest` tag. This has been updated in PR [#1598](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1598) and it is now possible to use past block numbers for the various calls.

### Bug Fixes

- Fixed browser build and libp2p sync, PR [#1588](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1588)
- Fixed error logging stack trace output, PR [#1595](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1595)
- Fixed broken dependency in webpack where node's constants package isn't being polyfilled by webpack 5, PR [#1621](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1621)
- Fixed `mainnet` consensus bug from block `4,993,075` (`byzantium`) where a tx goes OOG but refunds get applied anyways (thanks @LogvinovLeon for reporting! ❤️), PR [#1603](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1603)

## 0.2.0 - 2021-11-09

### Experimental Merge Support

This client release comes with experimental Merge support as specified in `EIP-3675` commit [504954e3](https://github.com/ethereum/EIPs/blob/504954e3bba2b58712d84865966ebc17bd4875f5/EIPS/eip-3675.md) and the Engine API [v1.0.0-alpha.2](https://github.com/ethereum/execution-apis/blob/v1.0.0-alpha.2/src/engine/interop/specification.md). This is the spec snapshot used for the [Merge Interop event](https://hackmd.io/@n0ble/merge-interop-spec) in Greece which happened in October 2021.

For the courageous there are instructions [here](https://hackmd.io/B1nMKhIiRBWRtgP4-d5KHw) on how to connect the EthereumJS client with a Lodestar Eth 2.0 client and produce blocks together. Note that specifications are changing quickly though and a new testnet is already planned, so this is not guaranteed to work.

Merge related work has been done in the following PRs (all pretty extensive):

- PR [#1509](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1509) (first Engine API steps, JSON RPC block parameter alignments, HF-by-TD fixes)
- PR [#1512](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1512) (continued Engine API, `--rpcEngine` CLI option, Taunas testnet, temporary eth_getLogs RPC mockup)
- PR [#1530](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1530) (dedicated Engine API port, Pithos testnet, Docker)

### An Update on Mainnet

The 1,230,833 block consensus bug we had in the `v0.1.0` release has been fixed in the VM dependency (see PR [#1516](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1516) and PR [#1524](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1524)), so sync on `mainnet` will now continue from this block onwards.

The "Mainnet sync" adventure now comes to a halt though around the Shanghai dDoS attacks mainnet blocks ranging from 2,286,910 to 2,717,576 where we realize that our VM is just not optimized enough to hold through these various edge case scenarios.

We'll take this occasion and do some sustainable performance work on the VM, where everyday developer use cases will likely also benefit. This will realistically take some months time though. See Issue [#1536](https://github.com/ethereumjs/ethereumjs-monorepo/issues/1536) and related issues if you are interested or want to join the effort.

### Other Changes

- New `--helprpc` help for CLI to print all available RPC commands, PR [#1505](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1505)
- New `--rpcDebug` option to log complete RPC calls on log level debug (i.e. --loglevel=debug), PR [#1519](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1519)
- Websocket support for the RPC server, PR [#1508](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1508)
- Allow Geth genesis files with code and storage, PR [#1530](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1530)
- New `--extIP` CLI option to set an external RLPx IP, PR [#1530](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1530)
- Logfile and log rotation support (`--logFile`, `--logLevelFile`, `--logRotate` and `--logMaxFiles` options), PR [#1530](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1530)
- New `--executeBlocks` CLI option to re-run blocks already synced (for debugging purposes), PR [#1538](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1538)
- Allow `baseFeePerGas` and `terminalTotalDifficulty` for Geth genesis files, PR [#1509](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1509)
- Improved sync stability in certain cases, PR [#1543](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1543)
- New debug logger for the `Fetcher` for code debugging, can be run with `DEBUG=client:fetcher npm run client:start`, PR [#1544](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1544)
- Sync stabilizing `Fetcher` improvements, PR [#1545](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1545)
- Use `RLP` library exposed by `ethereumjs-util` dependency (deduplication), PR [#1549](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1549)

## 0.1.0 - 2021-09-29

Heydiho, glad you are here! 😀

After over a year of continued development the EthereumJS team is proud to announce that
our client is finally stable, feature-complete (or - let's call it: feature-consistent)
and useful in many regards that we have decided to do a first official release! 🌼

There has been such an extensive amount of work done that it
would be neither useful nor enlightening to list all associated PRs.

So here are just a few milestones, where the ones before November 2020 happened in
the - now archived - standalone `ethereumjs-client` monorepo before we moved the client
to our monorepo
[ethereumjs-monorepo](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/client):

- Full transition to `TypeScript`, PR [#144](https://github.com/ethereumjs/ethereumjs-client/pull/144) and subsequent PRs
- Integration with our monorepo CI config, e.g. PR [#153](https://github.com/ethereumjs/ethereumjs-client/pull/153)
- Full alignment with the latest versions of the `EthereumJS` monorepo libraries (`Block`, `Tx`, `VM`,...), e.g. PR [#158](https://github.com/ethereumjs/ethereumjs-client/pull/158)
- Integration of the `@ethereumjs/vm` to execute on blocks, PR [#1028](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1028)
- EIP-1459: DNS peer recovery, PR [#1070](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1070)
- Following the VM integration: working down various HF bugs like this one from TangerineWhistle (hardening our VM along the way): PR [#1101](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1101)
- Tip-of-the-chain syncing behavior, PR [#1132](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1132)
- A basic transaction pool, PR [#1176](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1176)
- Upgraded `devp2p` `ETH` protocol up to version `ETH/66`, PR [#1331](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1331)
- `LES` protocol v3 and v5 support, PR [#1324](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1324)
- Support for `devp2p` snappy compression (RLPx v5), PR [#1399](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1399)
- A simple miner for PoA/clique, PR [#1444](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1444)
- Finalized on `devp2p` message handling support (e.g. by adding `NEW_BLOCK` rebroadcast capabilities) to serve as a good network citizen, PR [#1458](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1458)
- Added developer capabilities, e.g. by adding a `--dev` flag to auto-start and prefund a miner, PR [#1492](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1492)

And here we are. 🙂

We joined various ephemeral testnets along the way - like `Yolov3` (still remember? 😃) and `Calaveras` - and helped find consensus bugs before they reached `mainnet` in preparation for the latest forks like `london` in conjunction with the other clients.

Now we are ready for the next step and hand this out to you - the community! 🥳

We are eager to see what you will do with this client and how you will use this software, which for the first time in Ethereum's history brings the full Ethereum core protocol stack - complemented by the excellent [Lodestar](https://github.com/ChainSafe/lodestar) client ChainSafe is developing on the Eth2 side - into the hands of Node.js developers.

We have also updated our [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/client/README.md) on the client directly before the release which you should take as a concise reference on the currently implemented client capabilities, some usage instructions complemented by various examples, and developer notes.

**So thanks to the whole EthereumJS team - including some former team members - for the relentless work on this, and some special thanks to Vinay Pulim, who wrote the initial version of this software and therefore provided the ground for all this subsequent work!**

Again: Thank you! ❤️ Exciting times ahead.

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
