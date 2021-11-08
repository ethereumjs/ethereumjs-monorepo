# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
