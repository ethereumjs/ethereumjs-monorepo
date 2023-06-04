# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 3.1.2 - 2023-04-20

- Schedule Shanghai block on mainnet, PR [#2591](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2591)
- Remove and replace some EF bootnodes for `mainnet`, PR [#2576](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2576)
- Bump `@ethereumjs/util` `@chainsafe/ssz` dependency to 0.11.1 (no WASM, native SHA-256 implementation, ES2019 compatible, explicit imports), PRs [#2622](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2622), [#2564](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2564) and [#2656](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2656)

## 3.1.1 - 2023-02-27

- Pinned `@ethereumjs/util` `@chainsafe/ssz` dependency to `v0.9.4` due to ES2021 features used in `v0.10.+` causing compatibility issues, PR [#2555](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2555)

## 3.1.0 - 2023-02-21

**DEPRECATED**: Release is deprecated due to broken dependencies, please update to the subsequent bugfix release version.

### Functional Shanghai Support

This release fully supports all EIPs included in the [Shanghai](https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/shanghai.md) feature hardfork scheduled for early 2023. Note that a `timestamp` to trigger the `Shanghai` fork update is only added for the `sepolia` testnet and not yet for `goerli` or `mainnet`.

You can instantiate a Shanghai-enabled Common instance with:

```typescript
import { Common, Chain, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
```

#### Changes

- Added final Shanghai EIPs to HF file, PR [#2459](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2459)
- Added `timestamp` and `forkHash` for the Sepolia Shanghai HF, PR [#2527](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2527)
- Updated `forkHash` calculation for timebased hardforks, PR [#2458](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2458)
- Updated `setForkHashes()` to update timebased hardfork `forkHash` values, PR [#2461](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2461)

### Experimental EIP-4844 Shard Blob Transactions Support

This release supports an experimental version of [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) Shard Blob Transactions as being specified in the [01d3209](https://github.com/ethereum/EIPs/commit/01d320998d1d53d95f347b5f43feaf606f230703) EIP version from February 8, 2023 and deployed along `eip4844-devnet-4` (January 2023), see PR [#2349](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2349).

You can instantiate an `EIP-4844` enabled Common instance with:

```typescript
import { Common, Chain, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai, eips: [4844] })
```

### Other Changes and Bugfixes

- Added `eips` option to `Common.fromGethGenesis()` constructor options, PR [#2469](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2469)
- Set alternative default HF in `Common.fromGethGenesis()` if `mergeForkBlock` not present, PR [#2414](https://github.com/ethereumjs/ethereumjs-monorepo/issues/2414)
- Fixed some minor custom chain bugs, PR [#2448](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2448)
- Allow genesis to be post merge in `Common.fromGethGenesis()`, PR [#2530](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2530)

## 3.0.2 - 2022-12-09

### Experimental EIP-4895 Beacon Chain Withdrawals Support

This release comes with experimental [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) beacon chain withdrawals support, see PR [#2353](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2353) for the plain implementation and PR [#2401](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2401) for updated calls for the CL/EL engine API. Also note that there is a new helper module in [@ethereumjs/util](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util) with a new dedicated `Withdrawal` class together with additional TypeScript types to ease withdrawal handling.

Withdrawals support can be activated by initializing a respective `Common` object:

```typescript
import { Common, Chain } from '@ethereumjs/common'
const common = new Common({ chain: Chain.Mainnet, eips: [4895] })
```

### Hardfork-By-Time Support

The Common library now supports setting and retrieving hardforks which are triggered by timestamp instead of a specific block number, see PR [#2437](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2437). This mechanism will be first applied for the upcoming `Shanghai` HF. The methods `getHardforkByBlockNumber()`, `setHardforkByBlockNumber()` and `paramByBlock()` have been altered to take in an additional `timestamp` value, method naming remains for now for backwards compatibility. There are two new utility methods `hardforkTimestamp()` and `nextHardforkBlockOrTimestamp()`.

### Other Changes

- Support for initialization with Arbitrum One Chain ID, PR [#2426](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2426)
- Post-Merge hardfork fix in `Common.fromGethGenesis()` static constructor, PR [#2427](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2427)
- Fixed minor custom chain bugs, PR [#2448](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2448)

## 3.0.1 - 2022-10-18

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

- Fixed `Common.getHardforkByBlockNumber()` for certain post-Merge TTD/block number combinations, PR [#2313](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2313)
- Added Merge HF block numbers for `mainnet`, `goerli` and `sepolia`, PR [#2324](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2324)
- Fixed `forkhash` calculation to ignore the Merge hardfork even if it might have block number assigned, PR [#2324](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2324)
- Fixed HF-change based property selections (like consensus type) for TTD/block number based non-deterministic HF order, PR [#2331](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2331)
- Updated status of `EIP-3675` to `Final`, PR [#2351](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2351)

## 3.0.0 - 2022-09-06

Final release - tada 🎉 - of a wider breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2, Beta 3 and Release Candidate (RC) 1 release notes for notes on some additional changes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/CHANGELOG.md)).

### Changes

- Internal refactor: removed ambiguous boolean checks within conditional clauses, PR [#2255](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2255)

## 3.0.0-rc.1 - 2022-08-29

Release candidate 1 for the upcoming breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2 and 3 release notes for notes on some additional changes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/CHANGELOG.md)).

### Fixed Mainnet Merge HF Default

Since this bug was so severe it gets its own section: `mainnet` in Common (`Chain.Mainnet`) was accidentally not updated yet to default to the `merge` HF (`Hardfork.Merge`) by an undiscovered overwrite back to `london`.

This has been fixed in PR [#2206](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2206) and `mainnet` now default to the `merge` as well.

### Other Changes

- Mainnet Merge `TTD` `58750000000000000000000` has been added to the `mainnet` chain configuration, PR [#2185](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2185)
- **Eventually breaking:** `Common` now throws on instantiation if a passed-in chain configuration has a HF defined with `block` set to `undefined` (use `null` for non-applied HFs), PR [#2228](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2228)
- The `Kovan` `PoA` testnet chain is EOL and has been removed from the chain configuration, [#2206](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2206)

### Maintenance Updates

- Added `engine` field to `package.json` limiting Node versions to v14 or higher, PR [#2164](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2164)
- Replaced `nyc` (code coverage) configurations with `c8` configurations, PR [#2192](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2192)
- Code formats improvements by adding various new linting rules, see Issue [#1935](https://github.com/ethereumjs/ethereumjs-monorepo/issues/1935)

## 3.0.0-beta.3 - 2022-08-10

Beta 3 release for the upcoming breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2 release notes for notes on some additional changes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/CHANGELOG.md)).

### Merge Hardfork Default

Since the Merge HF is getting close we have decided to directly jump on the `Merge` HF (before: `Istanbul`) as default for the Common library and skip the `London` default HF as we initially intended to set (see Beta 1 CHANGELOG), see PR [#2087](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2087).

If you want instantiate the library with an explicit HF set you can do:

```typescript
import { Common, Chain, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
```

## Other Changes

- **Breaking:** renamed `td` (terminal total difficulty for the Merge HF) HF parameter in HF JSON files to `ttd`, PR [#2075](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2075)
- **Breaking:** renamed `hardforkTD()` method to `hardforkTTD()`, PR [#2075](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2075)
- **Breaking:** renamed `td` parameter in `HardforkConfig` interface to `ttd`, PR [#2075](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2075)
- Set `goerli` Merge TTD to 10790000, PR [#2079](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2079)
- Update `mergeForkIdTransition` Merge transition HF (separate "artificial" HF construct only for networking layer) for `sepolia`, PR [#2098](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2098)

## 3.0.0-beta.2 - 2022-07-15

Beta 2 release for the upcoming breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/CHANGELOG.md)) for the main change set description.

### Removed Default Exports

The change with the biggest effect on UX since the last Beta 1 releases is for sure that we have removed default exports all accross the monorepo, see PR [#2018](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2018), we even now added a new linting rule that completely disallows using.

Default exports were a common source of error and confusion when using our libraries in a CommonJS context, leading to issues like Issue [#978](https://github.com/ethereumjs/ethereumjs-monorepo/issues/978).

Now every import is a named import and we think the long term benefits will very much outweigh the one-time hassle of some import adoptions.

#### Import Updates

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

## Other Changes

- Added `ESLint` strict boolean expressions linting rule, PR [#2030](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2030)
- Added `sepolia` DNS discovery config, PR [#2034](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2034)

## 3.0.0-beta.1 - 2022-06-30

This release is part of a larger breaking release round where all [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries (VM, Tx, Trie, other) get major version upgrades. This round of releases has been prepared for a long time and we are really pleased with and proud of the result, thanks to all team members and contributors who worked so hard and made this possible! 🙂 ❤️

We have gotten rid of a lot of technical debt and inconsistencies and removed unused functionality, renamed methods, improved on the API and on TypeScript typing, to name a few of the more local type of refactoring changes. There are also broader structural changes like a full transition to native JavaScript `BigInt` values as well as various somewhat deep-reaching refactorings, both within a single package as well as some reaching beyond the scope of a single package. Also two completely new packages - `@ethereumjs/evm` (in addition to the existing `@ethereumjs/vm` package) and `@ethereumjs/statemanager` - have been created, leading to a more modular Ethereum JavaScript VM.

We are very much confident that users of the libraries will greatly benefit from the changes being introduced. However - along the upgrade process - these releases require some extra attention and care since the changeset is both so big and deep reaching. We highly recommend to closely read the release notes, we have done our best to create a full picture on the changes with some special emphasis on delicate code and API parts and give some explicit guidance on how to upgrade and where problems might arise!

So, enjoy the releases (this is a first round of Beta releases, with final releases following a couple of weeks after if things go well)! 🎉

The EthereumJS Team

### London Hardfork Default

The `@ethereumjs/common` library is the base library for various upper-level EthereumJS libraries (like the VM or Transaction library), providing a common and shared view on the network and hardfork state.

A typical usage looks like this:

```typescript
import VM from '@ethereumjs/vm'
import Common, { Chain, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Merge })
const vm = await VM.create({ common })
```

With the `v3` release the default `Common` hardfork changes from `Istanbul` to `London`, see PR [#1749](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1749).

**Breaking:** Please check your upper-level library instantiations (e.g. for Tx, VM,...) where you use an implicit default Common (so: do not explicitly pass in a Common instance).

### BigInt Introduction / ES2020 Build Target

With this round of breaking releases the whole EthereumJS library stack removes the [BN.js](https://github.com/indutny/bn.js/) library and switches to use native JavaScript [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) values for large-number operations and interactions.

This makes the libraries more secure and robust (no more BN.js v4 vs v5 incompatibilities) and generally comes with substantial performance gains for the large-number-arithmetic-intense parts of the libraries (particularly the VM).

Our build target has been updated to [ES2020](https://262.ecma-international.org/11.0/) to allow for BigInt support. We feel that some still remaining browser compatibility issues on the edges (old Safari versions e.g.) are justified by the substantial gains this step brings along.

See [#1671](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1671) and [#1771](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1771) for the core `BigInt` transition PRs.

### Disabled esModuleInterop and allowSyntheticDefaultImports TypeScript Compiler Options

The above TypeScript options provide some semantic sugar like allowing to write an import like `import React from "react"` instead of `import * as React from "react"`, see [esModuleInterop](https://www.typescriptlang.org/tsconfig#esModuleInterop) and [allowSyntheticDefaultImports](https://www.typescriptlang.org/tsconfig#allowSyntheticDefaultImports) docs for some details.

While this is convenient it deviates from the ESM specification and forces downstream users into these options which might not be desirable, see [this TypeScript Semver docs section](https://www.semver-ts.org/#module-interop) for some more detailed argumentation.

Along the breaking releases we have therefore deactivated both of these options and you might therefore need to adopt some import statements accordingly. Note that you still have got the possibility to activate these options in your bundle and/or transpilation pipeline (but now you also have the option to _not_ do which you didn't have before).

### General and BigInt-Related API Changes

Various methods have been renamed and various method signatures have been changed along with the `BigInt` transition.

#### Method Renamings/Signature Changes

See PRs [#1709](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1709), [#1854](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1854) for the related code changeset.

`number` -> `bigint` and `BNLike` to `BigIntLike` changes:

- `static isSupportedChainId(chainId: bigint): boolean`
- `setChain(chain: string | number | Chain | bigint | object): ChainConfig`
- `getHardforkByBlockNumber(blockNumber: BigIntLike, td?: BigIntLike): string`
- `setHardforkByBlockNumber(blockNumber: BigIntLike, td?: BigIntLike): string`
- `param(topic: string, name: string): bigint`
- `paramByHardfork(topic: string, name: string, hardfork: string | Hardfork): bigint`
- `paramByEIP(topic: string, name: string, eip: number): bigint | undefined`
- `paramByBlock(topic: string, name: string, blockNumber: BigIntLike, td?: BigIntLike): bigint`
- `hardforkIsActiveOnBlock(hardfork: string | Hardfork | null, blockNumber: BigIntLike): boolean`
- `activeOnBlock(blockNumber: BigIntLike): boolean`
- `hardforkBlock(hardfork?: string | Hardfork): bigint | null`
- `hardforkTD(hardfork?: string | Hardfork): bigint | null`
- `isHardforkBlock(blockNumber: BigIntLike, hardfork?: string | Hardfork): boolean`
- `nextHardforkBlock(hardfork?: string | Hardfork): bigint | null`
- `isNextHardforkBlock(blockNumber: BigIntLike, hardfork?: string | Hardfork): boolean`
- `chainId(): bigint`
- `networkId(): bigint`

Renamings:

**Breaking:** So actually: most of the methods affected, lots of numbers going in and out particularly in this library. 😋 Please check on the method names and update accordingly.

#### Method Removals

Following methods have been removed, see PRs [#1698](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1698) and [#1709](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1709).

- `Common.forCustomChain()` (use newer simplified `Common.custom()` method instead)
- All temporary `BN`-appended method names, e.g. `nextHardforkBlockBN()` (search for "BN(" e.g.))
- `supportedHardforks` constructor argument

Also, there is no notion of `active` HFs in Common anymore in the sense that HFs could be added to a chain file which would then not "activate" (e.g. the `DAO` HF for `Rinkeby`). The previous behavior/semantics had no practical benefit and chain files should now be updated to only include the HFs which would/will at some point activate on a chain.

Following methods have been removed accordingly:

- `hardforkIsActiveOnChain()`
- `activeHardforks()`
- `activeHardfork()`

**Breaking:** Check on method and constructor argument usages from above.

#### Type Changes

There are a few new types e.g. for configuration files (e.g. `CliqueConfig`) to get rid of some last `any` types in the package, see PR [#1906](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1906). Eventually related problems should be seen early on in your TypeScript setup though and it should also be possile to easily attribute and fix.

#### New File Structue

The file structure of the package has been aligned with other libraries and there is now a dedicated `common.ts` file for the main source code with `index.ts` re-exporting functionality and types, see PR [#1915](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1915). Some misplaced types have been moved to `types.ts` and enums (like `Chain` or `Hardfork`) have been (internally) moved to an `enum.ts` file. You should generally use the root import from `index.ts`, if you are not doing and some imports broke this should be easily fixable though.

### Genesis Handling Refactor

We have completely refactored all our genesis (block) handling and moved the code and logic higher up the stack to the `Blockchain` library which is a more natural fit for this, see PR [#1916](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1916) This freed us up to remove the large genesis state files - especially the `mainnet` one - from `Common`.

The most imminent benefit from this is a **dramatically reduced bundle size for the library, going down from a packed ~9 MB to something about 50 KB (!)**.

**Breaking:** See if you use `Common` genesis state functionality, e.g. by accessing pre-defined state with the `genesisState()` function (now removed) or by adding custom state with the `customChain` constructor (genesis-extended data format removed) and see description for `Block` and `Blockchain` breaking releases for context and how to replace the functionality. There are now also no `stateRoot` and `hash` configuration paramters in the `JSON` chain files any more, inclusion was a blocker for a clean refactor and this also wasn't compatible with the Geth genesis file format (these values can be calculated on an upper-library level). So you should remove these from your (custom) chain config files as well.

### Other Changes

- New experimental EIP `EIP-3074`: Authcall, PR [#1789](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1789)

## 2.6.4 - 2022-04-14

### EIP-3651: Warm COINBASE

Small EIP - see [EIP-3651](https://eips.ethereum.org/EIPS/eip-3651) considered for inclusion (CFI) in Shanghai to address an initially overpriced `COINBASE` access, PR [#1814](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1814).

### EIP-1153: Transient Storage Opcodes

Experimental implementation of [EIP-1153](https://eips.ethereum.org/EIPS/eip-1153), see PR [#1768](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1768), thanks to [Mark Tyneway](https://github.com/tynes) from Optimism for the implementation! ❤️

The EIP adds opcodes for manipulating state that behaves identically to storage but is discarded after every transaction. This makes communication via storage (`SLOAD`/`SSTORE`) more efficient and would allow for significant gas cost reductions for various use cases.

Hardfork inclusion of the EIP was extensively discussed during [ACD 135, April 1 2022](https://github.com/ethereum/pm/issues/500).

### Other Changes

- Fixed non-option passing on `custom()` method, PR [#1851](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1851)
- `PreMerge` hardfork renamed to `MergeForkIdTransition` for increased clarity, PR [#1856](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1856)

## 2.6.3 - 2022-03-15

### Merge Kiln v2 Testnet Support

This release fully supports the Merge [Kiln](https://kiln.themerge.dev/) testnet `v2` complying with the latest Merge [specs](https://hackmd.io/@n0ble/kiln-spec). The release is part of an [@ethereumjs/client](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/client) `v0.4` release which can be used to sync with the testnet, combining with a suited consensus client (e.g. the Lodestar client). See [Kiln](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/client/kiln) instructions to get things going! 🚀

- [EIP-4399](https://eips.ethereum.org/EIPS/eip-4399) Support: Supplant DIFFICULTY opcode with PREVRANDAO, PR [#1565](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1565)
- Added new `preMerge` hardfork to fork off non-upgraded clients in `@ethereumjs/client` (in the very most cases this somewhat "artificial" HF should not be used directly), PR [#1565](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1565)
- Better documentation and integration of complex genesis state custom chain initialization (with (system) contracts and storage values), PR [#1757](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1757)

### EIP-3540: EVM Object Format (EOF) v1 / EIP-3670: EOF - Code Validation

This release supports [EIP-3540](https://eips.ethereum.org/EIPS/eip-3540) and [EIP-3670](https://eips.ethereum.org/EIPS/eip-3670) in an experimental state. Both EIPs together define a container format EOF for the VM in v1 which allows for more flexible EVM updates in the future and allows for improved EVM bytecode validation, see PR [#1719](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1719).

See the associated VM release `v5.8.0` for more in-depth information on this.

### Other Changes

- Fixed a bug on `Common.copy()` taking over existing event listeners (leading to unwanted side effects), PR [#1799](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1799)

# 2.6.2 - 2022-02-4

- Adds support for [EIP-3607](https://eips.ethereum.org/EIPS/eip-3607) (Reject transactions from senders with deployed code), PR [#1691](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1691)

## 2.6.1 - 2022-02-01

- Added support for [EIP-3855](https://eips.ethereum.org/EIPS/eip-3855) `push0` opcode, PR [#1616](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1616)
- Added support for the new [Sepolia](https://sepolia.ethdevops.io/) (`Chain.Sepolia`) test network (PoW network replacing `ropsten`), PR [#1581](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1581)
- Added `berlin` and `london` HF block numbers and fork hashes to `kovan`, PR [#1577](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1577)

## 2.6.0 - 2021-11-09

### ArrowGlacier HF Support

This release adds support for the upcoming [ArrowGlacier HF](https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/arrow-glacier.md) (see PR [#1527](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1527)) targeted for December 2021. The only included EIP is [EIP-4345](https://eips.ethereum.org/EIPS/eip-4345) which delays the difficulty bomb to June/July 2022.

Please note that for backwards-compatibility reasons Common is still instantiated with `istanbul` by default.

An ArrowGlacier Common can be instantiated with:

```typescript
import Common, { Chain, Hardfork } from '@ethereumjs/common'
const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.ArrowGlacier })
```

### Optimism L2 Support

There is now a better Optimism L2 chain integration in Common (PR [#1554](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1554)) allowing to directly instantiate an Optimism chain with the `Common.custom()` constructor. Note that this only sets the correct chain ID (and e.g. _not_ corresponding HF blocks or similar) and is therefore only suitable for a limited set of use cases (e.g. sending a tx to an Optimism chain).

Following Optimism chains are now integrated:

- `CustomChain.OptimisticEthereum`
- `CustomChain.OptimisticKovan`

A Common with Optimism can be instantiated with:

```typescript
const common = Common.custom(CustomChain.OptimisticEthereum)
```

### Other Changes

- Support for starting a (custom) chain on a `london` or later hardfork by allowing to set a `baseFeePerGas` value for the genesis block, PR [#1512](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1512)
- Support for adding code accounts (e.g. with a "system" contract like the deposit contract) to a (custom) genesis file, PR [#1530](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1530)

## 2.5.0 - 2021-09-24

### Common with custom Genesis State

In addition to initializing Common with a custom chain configuration it is now also possible to provide a custom genesis state JSON file, which completes the Common custom chain functionality. The format follows our genesis state file definitions for the built-in chains (see e.g. `src/genesisStates/goerli.json`) and can be used to initialize a Common instance like:

```typescript
import myCustomChain1 from '[PATH_TO_MY_CHAINS]/myCustomChain1.json'
import chain1GenesisState from '[PATH_TO_GENESIS_STATES]/chain1GenesisState.json'
const common = new Common({
  chain: 'myCustomChain1',
  customChains: [[myCustomChain1, chain1GenesisState]],
})
```

Accessing the genesis state is now integrated into the `Common` class and can be accessed in a much more natural way by doing:

```typescript
const genesisState = common.genesisState()
```

This now also provides direct access to custom genesis states passed into `Common` as described above. The old Common-separate `genesisStateByName()` and `genesisStateById()` functions are now `deprecated` and usage should be avoided.

### Experimental Merge HF Support / HF by Total Difficulty

The Merge HF has been added as a new HF and can be used with `Hardfork.Merge`, also [EIP-3675](https://eips.ethereum.org/EIPS/eip-3675) as the core HF EIP has been added as an EIP JSON config file, see #1393. Note that all Merge HF related functionality is still considered `experimental`.

See e.g. the following HF definition in one of our test chain files:

```json
{
  "name": "merge",
  "block": null,
  "td": 5000
}
```

There is also a new `consensusType` `pos` which can be set along a HF file (see `src/hardforks/merge.json`) or directly in a chain file (like `src/chains/mainnet.json`) to create a pure PoS chain (note that the creation of pure PoS chains is still untested). To reference this new consensus type `ConsensusType.ProofOfStake` from the `ConsensusType` enum dict can be used.

To allow a HF switch by total difficulty (TD) - which is planned for the Merge - the chain file type has been updated to now also accept a `td` value as an alternative (respectively also: in addition) to the `block` number value, see PR [#1473](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1473). Along the `getHardforkByBlockNumber()` and `setHardforkByBlockNumber()` function signatures have been expanded to also allow for setting/getting a HF by the total difficulty value:

- -> `getHardforkByBlockNumber(blockNumber: BNLike, td?: BNLike): string`
- -> `setHardforkByBlockNumber(blockNumber: BNLike, td?: BNLike): string`

There is a new `hardforkTD(hardfork?: string | Hardfork): BN | null` function to get the TD value for a HF switch (so primarily: for the `merge` HF) if a total difficulty HF switch is configured.

### Improved Typing for Hardfork, Chain and Genesis releated API Calls

In the Common library all functionality returning hardfork, chain or genesis parameters has previously been under-typed respectively just returned `any` in most cases. This has been improved along PR [#1480](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1480) and is now finding its way into a release.

Improved Signature Types:

- -> `activeHardforks(blockNumber?: BNLike | null, opts: hardforkOptions = {}): HardforkParams[]`
- -> `genesis(): GenesisBlock`
- -> `hardforks(): HardforkParams[]`
- -> `bootstrapNodes(): BootstrapNode[]`
- -> `dnsNetworks(): string[]`

**Potentially TypeScript Breaking**: Note while this is not strictly `TypeScript` breaking this might cause problems e.g. in the combination of using custom chain files with incomplete (but previously unused) parameters. So it is recommended to be a bit careful here.

### Changed Null Semantics for Hardfork Block Numbers in Chain Files

From this release onwards we will work with a tightened semantics using `null` for hardforks in the chain files. Up to this release `null` was used both for 1. HFs from the past which were not applied on a particular chain (e.g. the `dao` HF on `goerli`) as well as 2. HFs which are known to take place in the future but do not have a block number yet (e.g. the `shanghai` HF).

We have removed all type 1. HF usages (so mainly `dao` HF inclusions) with PR [#1344](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1344) and HF block number `null` values are now strictly reserved for type 2..

If you have got left over type 1. `dao` HF inclusions in your custom chain files we encourage you to remove since this might cause problems along future releases.

### Bug Fixes

- **TypeScript Breaking**: Fixed `hardforkBlockBN()` to correctly return `null` for unscheduled hardforks, note that this changes the `TypeScript` function signature and might break your development setup (sorry for this, but this bugfix was nevertheless necessary), PR [#1329](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1329)
- Always pre-compute the HF `forkHash` values if not hardcoded in the chain files, PR [#1423](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1423)

### Maintenance

- Removed `calaveras` ephemeral testnet, PR [#1430](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1430)
- Added browser tests to `Common`, PR [#1380](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1380)

**Dependencies, CI and Docs**

## 2.4.0 - 2021-07-08

### Finalized London HF Support

This release integrates the `london` HF blocks for all networks including `mainnet` and is therefore the first release with finalized London HF support.

### Reworked Custom Chain Instantation / Supported Custom Chains (Polygon / Arbitrum / xDaiChain)

This release introduces a new `Common.custom()` static constructor which replaces the now deprecated `Common.forCustomChain()` constructor and allows for an easier instantiation of a Common instance with somewhat adopted chain parameters, with the main use case to adopt on instantiating with a deviating chain ID. Instantiating a custom common instance with its own chain ID and inheriting all other parameters from `mainnet` can now be as easily done as:

```typescript
const common = Common.custom({ chainId: 1234 })
```

Along this refactoring work the `custom()` method now alternatively also takes a string as a first input (instead of a dictionary). This can be used in combination with the new `CustomChain` enum dict which allows for the selection of predefined supported custom chains for an easier `Common` setup of these supported chains:

```typescript
const common = Common.custom(CustomChain.ArbitrumRinkebyTestnet)
```

`Common` instances created with this simplified `custom()` constructor can't be used in all usage contexts (the HF configuration is very likely not matching the actual chain) but can be useful for specific use cases, e.g. for sending a tx with `@ethereumjs/tx` to an L2 network (see the `Tx` library [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/tx) for a complete usage example).

### Chain & Hardfork Enums

This `Common` release comes with two new enums `Chain` and `Hardfork`. These contain the currently supported chains and hardforks by the library and can be used for both instantiation and calling various methods where a chain or a hardfork is requested as a parameter, see PR [#1322](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1322).

```typescript
import Common, { Chain, Hardfork } from '@ethereumjs/common'
const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })

common.hardforkIsActiveOnBlock(Hardfork.Berlin, 5) // false
```

### Included Source Files

Source files from the `src` folder are now included in the distribution build, see PR [#1301](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1301). This allows for a better debugging experience in debug tools like Chrome DevTools by having working source map references to the original sources available for inspection.

### Other Changes

- Removed retired dev networks (`yolov3`, `aleut` and `baikal`), PR [#1296](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1296)

## 2.3.1 - 2021-06-11

Small feature release.

- Added static helper method `Common.isSupportedChainId()`to check if a chain is natively supported by the Common version installed, PR [#1281](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1281)
- Added support for the `calaveras` ephemeral developer test network (preparing for the `london` HF), PR [#1286](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1286)

## 2.3.0 - 2021-05-26

### Functional London HF Support (no finalized HF blocks yet)

This `Common` release comes with full functional support for the `london` hardfork (all EIPs are finalized and integrated and `london` HF can be activated, there are no final block numbers for the HF integrated though yet). Please note that the default HF is still set to `istanbul`. You therefore need to explicitly set the `hardfork` parameter for instantiating a `Common` instance with a `london` HF activated:

```typescript
import Common from '@ethereumjs/common'
const common = new Common({ chain: 'mainnet', hardfork: 'london' })
```

### London HF Changes

Common now supports settings for the following additional EIPs:

- [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559): Fee market change for ETH 1.0 chain, PR [#1148](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1148)
- [EIP-3198](https://eips.ethereum.org/EIPS/eip-3198): BASEFEE opcode, PR [#1148](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1148)
- [EIP-3529](https://eips.ethereum.org/EIPS/eip-3529): Reduction in refunds, PR [#1239](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1239)
- [EIP-3541](https://eips.ethereum.org/EIPS/eip-3541): Reject new contracts starting with the 0xEF byte, PR [#1240](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1240)
- [EIP-3554](https://eips.ethereum.org/EIPS/eip-3554): Difficulty Bomb Delay to December 2021 (only PoW networks), PR [#1245](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1245)

All new EIPs have their dedicated EIP configuration file and can also be activated spearately with the `eips` parameter (and the so-created `common` instance can then e.g. be used within the VM):

```typescript
import Common from '@ethereumjs/common'
const common = new Common({ chain: 'mainnet', hardfork: 'berlin', eips: [3529] })
```

### Bug Fixes

- Fixed a bug for `Common.hardforkGteHardfork()` and `Common.gteHardfork()` now evaluating to `true` if the HF provided as the `gteHardfork` part is not known by the chain, PR [#1148](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1148)
- Fixed `mainnet` berlin fork hash `0xeb440f6` -> `0x0eb440f6`, PR [#1148](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1148)
- Fixed fork hash calculation in `Common._calcForkHash()` for fork hashes with a leading zero, PR [#1148](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1148)

### Other Changes

- Added `london` HF option, PR [#1148](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1148)
- Added `baikal` test network (preparatory `london` network), PR [#1249](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1249)
- Added `aleut` test network (preparatory `london` network, retired), PR [#1221](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1221)

## 2.2.0 - 2021-03-18

### Berlin HF Support

This `Common` release comes with full support for the `berlin` hardfork. Please note that the default HF is still set to `istanbul`. You therefore need to explicitly set the `hardfork` parameter for instantiating a `Common` instance with a `berlin` HF activated:

```typescript
import Common from '@ethereumjs/common'
const common = new Common({ chain: 'mainnet', hardfork: 'berlin' })
```

**Berlin HF Changes**

- Added final list of `berlin` EIPs (`EIP-2565`, `EIP-2929`, `EIP-2718`, `EIP-2930`), PR [#1124](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1124) and PR [#1048](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1048)
- Corrected base gas costs for `EIP-2929` related opcodes, PR [#1124](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1124)
- New EIP configuration files for `EIP-2718` (typed txs) and `EIP-2930` (optional access lists), PR [#1048](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1048)
- Added `berlin` hardfork block numbers for `mainnet`, `ropsten`, `rinkeby` and `goerli`, PR [#1142](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1142)

### BN Support for high Chain IDs and Block Numbers

The library has been updated to support very high chain IDs and block numbers exceeding the `Number.MAX_SAFE_INTEGER` limit (9007199254740991).

Methods with a respective input parameter now allow for a `BNLike` input (`number` (as before), `Buffer`, (Hex)`String` or `BN`). The following function signatures have been updated:

- `chain` constructor parameter now additionally allowing `BN`
- `setChain(chain: string | number | object)` -> `setChain(chain: string | number | BN | object)`
- `getHardforkByBlockNumber(blockNumber: BNLike): string`
- `setHardforkByBlockNumber(blockNumber: BNLike): string`
- `paramByBlock(topic: string, name: string, blockNumber: BNLike): any`
- `hardforkIsActiveOnBlock(hardfork: string | null, blockNumber: BNLike, opts?: hardforkOptions): boolean`
- `activeOnBlock(blockNumber: BNLike, opts?: hardforkOptions): boolean`
- `activeHardforks(blockNumber?: BNLike | null, opts: hardforkOptions = {}): Array<any>`
- `activeHardfork(blockNumber?: BNLike | null, opts: hardforkOptions = {}): string`
- `isHardforkBlock(blockNumber: BNLike, hardfork?: string): boolean`
- `isNextHardforkBlock(blockNumber: BNLike, hardfork?: string): boolean`

For methods with a respective `number` return value corresponding [METHOD_NAME]BN methods have been added:

- `hardforkBlockBN(hardfork?: string): BN`
- `nextHardforkBlockBN(hardfork?: string): BN | null`
- `chainIdBN(): BN`
- `networkIdBN(): BN`

Note that in the next major release these methods will be unified again by switching to use the original version names for the new BN-output functions.

### Other Changes

- Added chain config and genesis file for `yolov3` testnet, PR [#1129](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1129)
- New `Common.copy()` function to easily receive a deep copy of a `Common` instance, PR [#1144](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1144)

## 2.1.0 - 2021-02-22

### Clique/PoA Support

This release completes on Clique/PoA support (see also Clique/PoA related changes in `v2.0.0`), see PR [#1032](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1032). The chain configuration files (e.g. `chains/goerli.json`) are extended by a consensus algorithm-specific config parameter section, here is a sample `consensus` parameter section, note that the `config` parameter dict must be named after the consensus algorithm:

```json
{
  "consensus": {
    "type": "poa",
    "algorithm": "clique",
    "clique": {
      "period": 15,
      "epoch": 30000
    }
  }
}
```

For now this is done in a backwards-compatible way and the `consensus` parameter section is still marked as optional. You nevertheless might want to add this section already to your custom chain files - even if you don't make usage of the parameters - to remain compatible in the future.

The new parameter section is complemented by a new `Common.consensusConfig()` function to request these parameters in addition to the `Common.consensusType()` and `Common.consensusAlgorithm()` methods introduced in `v2.0.0`.

### Custom Chain File Support

There is now a more convenient and flexible way to integrate custom chains into Common instances complementing the existing `Common.fromCustomChain()` static constructor, see PR [#1034](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1034).

This new way adds a new `customChains` constructor option and can be used as following:

```typescript
import myCustomChain1 from './[PATH]/myCustomChain1.json'
import myCustomChain2 from './[PATH]/myCustomChain2.json'
// Add two custom chains, initial mainnet activation
const common1 = new Common({ chain: 'mainnet', customChains: [myCustomChain1, myCustomChain2] })
// Somewhat later down the road...
common1.setChain('customChain1')
// Add two custom chains, activate customChain1
const common1 = new Common({
  chain: 'customChain1',
  customChains: [myCustomChain1, myCustomChain2],
})
```

The [README section](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/common#working-with-privatecustom-chains) on working with custom chains has been significantly expanded along the way and is a recommended read if you use common for custom chain initialization.

### New EIPs

#### EIP-1459 DNS Peer Discovery

[EIP-1459](https://eips.ethereum.org/EIPS/eip-1459) introduces a way to discover nodes for an Ethereum network connection via DNS. This release adds a new optional chain config file parameter `dnsNetworks` and an associated method `Common.dnsNetworks()` to request DNS networks for a chain.

#### EIP-2565 ModExp Precompile Gas Costs

[EIP-2565](https://eips.ethereum.org/EIPS/eip-2565) introduces a new algorithm for ModExp precompile gas cost calculation. A new EIP file `eips/2565.json` has been added along the work on PR [#1026](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1026) with respective parameter updates.

### Other Changes

- `Common` is now implemented as an `EventEmitter` and emits a `hardforkChanged` event upon a HF change, PR [#1112](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1112)
- New `Common.isActivatedEIP()` method, PR [#1125](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1125)
- Updated `Goerli` bootnodes, PR [#1031](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1031)

## 2.0.0 - 2020-11-24

### New Package Name

**Attention!** This new version is part of a series of EthereumJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `ethereumjs-common` -> `@ethereumjs/common`

Please update your library references accordingly or install with:

```shell
npm i @ethereumjs/common
```

### New constructor

**Breaking**: The constructor has been changed to require an options dict to be passed, PR [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863)

Example:

```typescript
import Common from '@ethereumjs/common'
const common = new Common({ chain: 'mainnet', hardfork: 'muirGlacier' })
```

### EIP Support

EIPs are now native citizens within the `Common` library, see PRs [#856](https://github.com/ethereumjs/ethereumjs-monorepo/pull/856), [#869](https://github.com/ethereumjs/ethereumjs-monorepo/pull/869) and [#872](https://github.com/ethereumjs/ethereumjs-monorepo/pull/872). Supported EIPs have their own configuration file like the [eips/2537.json](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/eips/2537.json) file for the BLS precompile EIP and EIP settings can be activated by passing supported EIP numbers to the constructor:

```typescript
const c = new Common({ chain: 'mainnet', eips: [2537] })
```

The following EIPs are initially supported within this release:

- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2315) BLS Precompiles
- [EIP-2315](https://eips.ethereum.org/EIPS/eip-2315) EVM Subroutines (PR [#876](https://github.com/ethereumjs/ethereumjs-monorepo/pull/876))

EIPs provided are then activated and parameters requested with `Common.param()` being present in these EIPs take precedence over the setting from the latest hardfork.

There are two new utility functions which return hardfork and EIP values respectively:

- `Common.paramByHardfork()`
- `Common.paramByEIP()`

**Breaking**: It is now not possible any more to pass a dedicated HF setting to `Common.param()`. Please update your code to explicitly use `Common.paramByHardfork()` for requesting a parameter for a HF deviating from the HF currently set within your `Common` instance.

For setting and requesting active EIPs there is `Common.setEIPs()` and `Common.eips()` added to the mix.

There is also a new EIP-based hardfork file format which delegates parameter definition to dedicated EIP files (see PR [#876](https://github.com/ethereumjs/ethereumjs-monorepo/pull/876)). This is in preparation for an upcoming `Yolo v2` testnet integration.

Side note: with this new structural setup it gets now possible for all EIPs still implicitly contained within the hardfork files to be extracted as an EIP parameter set within its own dedicated EIP file (which can then be activated via the `eip` parameter on initialization) without loosing on functionality. If you have a need there feel free to open a PR!

### Gas Parameter Completeness for all Hardforks

Remaining gas base fees which still resided in the VM have been moved over to `Common` along PR [#806](https://github.com/ethereumjs/ethereumjs-monorepo/pull/806).

Gas fees for all hardforks up to `MuirGlacier` are now completely present within the `Common` library.

### Eth/64 Forkhash Support

There is a new `Common.forkHash()` method returning pre-calculated Forkhash values or alternatively use the internal `Common._calcForkHash()` implementation to calculate a forkhash on the fly.

Forkhashes are used to uniquely identify a set of hardforks passed to be able to better differentiate between different dedicated chains. This is used for the `Eth/64` devp2p protocol update and specificed in [EIP-2124](https://eips.ethereum.org/EIPS/eip-2124) to help improve the devp2p networking stack.

### New Block/Hardfork related Utility Functions

The following block and hardfork related utility functions have been added with PRs [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863) and [#805](https://github.com/ethereumjs/ethereumjs-monorepo/pull/805) respectively:

- `setHardforkByBlockNumber()` - Sets the hardfork determined by the block number passed
- `nextHardforkBlock()` - Returns the next HF block for a HF provided or set
- `isNextHardforkBlock()` - Some convenience additional utility method, matching the existing `hardforkBlock()` / `isHardforkBlock()` method setup
- `hardforkForForkHash()` - Returns the data available for a HF given a specific forkHash

### Default Hardfork

The default hardfork has been added as an accessible readonly property `DEFAULT_HARDFORK`, PR [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863). This setting is used starting with the latest major releases of the monorepo libraries like the VM to keep the HF setting in sync across the different libraries.

Current default hardfork is set to `istanbul`, PR [#906](https://github.com/ethereumjs/ethereumjs-monorepo/pull/906).

### Dual ES5 and ES2017 Builds

We significantly updated our internal tool and CI setup along the work on PR [#913](https://github.com/ethereumjs/ethereumjs-monorepo/pull/913) with an update to `ESLint` from `TSLint` for code linting and formatting and the introduction of a new build setup.

Packages now target `ES2017` for Node.js builds (the `main` entrypoint from `package.json`) and introduce a separate `ES5` build distributed along using the `browser` directive as an entrypoint, see PR [#921](https://github.com/ethereumjs/ethereumjs-monorepo/pull/921). This will result in performance benefits for Node.js consumers, see [here](https://github.com/ethereumjs/merkle-patricia-tree/pull/117) for a releated discussion.

### Other Changes

**Changes and Refactoring**

- Added consensus information to chains, new functions `Common.consensusType()` for consensus type access ("pow" or "poa") and `Common.consensusAlgorithm()` to get the associated algorithm or protocol (e.g. "ethash" PoW algorithm or "clique" PoA protocol), see PR [#937](https://github.com/ethereumjs/ethereumjs-monorepo/pull/937)
- Removed old `consensus` and `finality` fields, PR [#758](https://github.com/ethereumjs/ethereumjs-monorepo/pull/758)
- Removed old `casper` and `sharding` fields, PR [#762](https://github.com/ethereumjs/ethereumjs-monorepo/pull/762)
- Updated `ethereumjs-util` to v7, PR [#748](https://github.com/ethereumjs/ethereumjs-monorepo/pull/748)

## 2.0.0-rc.1 2020-11-19

This is the first release candidate towards a final library release, see [beta.2](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fcommon%402.0.0-beta.2) and especially [beta.1](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fcommon%402.0.0-beta.1) release notes for an overview on the full changes since the last publicly released version.

No changes since `beta.2` release.

## 2.0.0-beta.2 - 2020-11-12

This is the second beta release towards a final library release, see [beta.1 release notes](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fcommon%402.0.0-beta.1) for an overview on the full changes since the last publicly released version.

- Added consensus information to chains, new functions `Common.consensusType()` for consensus type access ("pow" or "poa") and `Common.consensusAlgorithm()` to get the associated algorithm or protocol (e.g. "ethash" PoW algorithm or "clique" PoA protocol), see PR [#937](https://github.com/ethereumjs/ethereumjs-monorepo/pull/937)

## 2.0.0-beta.1 - 2020-10-22

### New Package Name

**Attention!** This new version is part of a series of EthereumJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `ethereumjs-common` -> `@ethereumjs/common`

Please update your library references accordingly or install with:

```shell
npm i @ethereumjs/common
```

### New constructor

**Breaking**: The constructor has been changed to require an options dict to be passed, PR [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863)

Example:

```typescript
import Common from '@ethereumjs/common'
const common = new Common({ chain: 'mainnet', hardfork: 'muirGlacier' })
```

### EIP Support

EIPs are now native citizens within the `Common` library, see PRs [#856](https://github.com/ethereumjs/ethereumjs-monorepo/pull/856), [#869](https://github.com/ethereumjs/ethereumjs-monorepo/pull/869) and [#872](https://github.com/ethereumjs/ethereumjs-monorepo/pull/872). Supported EIPs have their own configuration file like the [eips/2537.json](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/eips/2537.json) file for the BLS precompile EIP and EIP settings can be activated by passing supported EIP numbers to the constructor:

```typescript
const c = new Common({ chain: 'mainnet', eips: [2537] })
```

The following EIPs are initially supported within this release:

- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2315) BLS Precompiles
- [EIP-2315](https://eips.ethereum.org/EIPS/eip-2315) EVM Subroutines (PR [#876](https://github.com/ethereumjs/ethereumjs-monorepo/pull/876))

EIPs provided are then activated and parameters requested with `Common.param()` being present in these EIPs take precedence over the setting from the latest hardfork.

There are two new utility functions which return hardfork and EIP values respectively:

- `Common.paramByHardfork()`
- `Common.paramByEIP()`

**Breaking**: It is now not possible any more to pass a dedicated HF setting to `Common.param()`. Please update your code to explicitly use `Common.paramByHardfork()` for requesting a parameter for a HF deviating from the HF currently set within your `Common` instance.

For setting and requesting active EIPs there is `Common.setEIPs()` and `Common.eips()` added to the mix.

There is also a new EIP-based hardfork file format which delegates parameter definition to dedicated EIP files (see PR [#876](https://github.com/ethereumjs/ethereumjs-monorepo/pull/876)). This is in preparation for an upcoming `Yolo v2` testnet integration.

Side note: with this new structural setup it gets now possible for all EIPs still implicitly contained within the hardfork files to be extracted as an EIP parameter set within its own dedicated EIP file (which can then be activated via the `eip` parameter on initialization) without loosing on functionality. If you have a need there feel free to open a PR!

### Gas Parameter Completeness for all Hardforks

Remaining gas base fees which still resided in the VM have been moved over to `Common` along PR [#806](https://github.com/ethereumjs/ethereumjs-monorepo/pull/806).
Gas fees for all hardforks up to `MuirGlacier` are now completely present within the `Common` library.

### Eth/64 Forkhash Support

There is a new `Common.forkHash()` method returning pre-calculated Forkhash values or alternatively use the internal `Common._calcForkHash()` implementation to calculate a forkhash on the fly.

Forkhashes are used to uniquely identify a set of hardforks passed to be able to better differentiate between different dedicated chains. This is used for the `Eth/64` devp2p protocol update and specificed in [EIP-2124](https://eips.ethereum.org/EIPS/eip-2124) to help improve the devp2p networking stack.

### New Block/Hardfork related Utility Functions

The following block and hardfork related utility functions have been added with PRs [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863) and [#805](https://github.com/ethereumjs/ethereumjs-monorepo/pull/805) respectively:

- `setHardforkByBlockNumber()` - Sets the hardfork determined by the block number passed
- `nextHardforkBlock()` - Returns the next HF block for a HF provided or set
- `isNextHardforkBlock()` - Some convenience additional utility method, matching the existing `hardforkBlock()` / `isHardforkBlock()` method setup
- `hardforkForForkHash()` - Returns the data available for a HF given a specific forkHash

### Default Hardfork

The default hardfork has been added as an accessible readonly property `DEFAULT_HARDFORK`, PR [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863). This setting is used starting with the latest major releases of the monorepo libraries like the VM to keep the HF setting in sync across the different libraries.

Current default hardfork is set to `istanbul`, PR [#906](https://github.com/ethereumjs/ethereumjs-monorepo/pull/906).

### Dual ES5 and ES2017 Builds

We significantly updated our internal tool and CI setup along the work on
PR [#913](https://github.com/ethereumjs/ethereumjs-monorepo/pull/913) with an update to `ESLint` from `TSLint`
for code linting and formatting and the introduction of a new build setup.

Packages now target `ES2017` for Node.js builds (the `main` entrypoint from `package.json`) and introduce
a separate `ES5` build distributed along using the `browser` directive as an entrypoint, see
PR [#921](https://github.com/ethereumjs/ethereumjs-monorepo/pull/921). This will result
in performance benefits for Node.js consumers, see [here](https://github.com/ethereumjs/merkle-patricia-tree/pull/117) for a releated discussion.

### Other Changes

**Changes and Refactoring**

- Removed old `consensus` and `finality` fields,
  PR [#758](https://github.com/ethereumjs/ethereumjs-monorepo/pull/758)
- Removed old `casper` and `sharding` fields,
  PR [#762](https://github.com/ethereumjs/ethereumjs-monorepo/pull/762)
- Updated `ethereumjs-util` to v7,
  PR [#748](https://github.com/ethereumjs/ethereumjs-monorepo/pull/748)

## 1.5.2 - 2020-07-26

This is a maintenance release.

- Updates Goerli chain ID, PR [#792](https://github.com/ethereumjs/ethereumjs-monorepo/pull/792).

## [1.5.1] - 2020-05-04

This is a maintenance release.

- Updated bootnode definitions, and more strict checking for their values.
  PR [#718](https://github.com/ethereumjs/ethereumjs-monorepo/pull/718)

[1.5.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%401.5.0...%40ethereumjs%2Fcommon%401.5.1

## [1.5.0] - 2019-12-10

Support for the `MuirGlacier` HF
([EIP-2387](https://eips.ethereum.org/EIPS/eip-2387)) scheduled for January 2020
delaying the difficulty bomb.

Changes:

- Implemented [EIP-2384](https://eips.ethereum.org/EIPS/eip-2384) Difficulty
  Bomb Delay, PR [#75](https://github.com/ethereumjs/ethereumjs-common/pull/75)
- Consistent genesis account balance format, converted from decimal to hex
  where necessary, PR [#73](https://github.com/ethereumjs/ethereumjs-common/pull/73)

[1.5.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%401.4.0...%40ethereumjs%2Fcommon%401.5.0

## [1.4.0] - 2019-11-05

First release with full `Istanbul` support regarding parameter introductions/updates
and HF block numbers set for supported chains.

Relevant PRs:

- Added `Istanbul` block numbers for `mainnet`, `goerli` and `rinkeby`,
  PR [#68](https://github.com/ethereumjs/ethereumjs-common/pull/68)
- Added `Petersburg` and `Constantinople` fork blocks to `rinkeby`,
  PR [#71](https://github.com/ethereumjs/ethereumjs-common/pull/71)
- Added `EIP-2200` (rebalance net-metered SSTORE gas costs) parameters for `Istanbul`,
  PR [#65](https://github.com/ethereumjs/ethereumjs-common/pull/65)

Other noteworthy changes:

- Adding forks (including `Istanbul`) for `kovan`,
  PR [#70](https://github.com/ethereumjs/ethereumjs-common/pull/70)
- Fixed `kovan` genesis state,
  PR [#66](https://github.com/ethereumjs/ethereumjs-common/pull/66)

[1.4.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%401.3.2...%40ethereumjs%2Fcommon%401.4.0

## [1.3.2] - 2019-09-04

**Istanbul** Updates:

- Added gas parameters for `EIP-2200` (rebalanced net-metered SSTORE
  gas costs), PR [#65](https://github.com/ethereumjs/ethereumjs-common/pull/65)
- Renamed hardfork `blake2bRound` (-> `blake2Round`) parameter,
  PR [#63](https://github.com/ethereumjs/ethereumjs-common/pull/63)

Other Changes:

- Fixed `Kovan` genesis state,
  PR [#66](https://github.com/ethereumjs/ethereumjs-common/pull/66)

[1.3.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%401.3.1...%40ethereumjs%2Fcommon%401.3.2

## [1.3.1] - 2019-08-08

Added missing **Istanbul** gas costs for:

- ChainID opcode (EIP-1344, as base param in `hardforks/chainstart.json`)
- Blake2b precompile (EIP-2129/152)
- Calldata gas cost reduction (EIP-2028)

See PR [#58](https://github.com/ethereumjs/ethereumjs-common/pull/58).

[1.3.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%401.3.0...%40ethereumjs%2Fcommon%401.3.1

## [1.3.0] - 2019-06-18

- Add a static factory method `Custom.forCustomChain` to make working with
  custom/private chains easier.

[1.3.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%401.2.1...%40ethereumjs%2Fcommon%401.3.0

## [1.2.1] - 2019-06-03

- Added `Istanbul` HF candidate [EIP-1108](https://eips.ethereum.org/EIPS/eip-1108)
  (`DRAFT`) updated `alt_bn128` precompile gas costs (see `hardforks/istanbul.json`)

[1.2.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%401.2.0...%40ethereumjs%2Fcommon%401.2.1

## [1.2.0] - 2019-05-27

**DRAFT Istanbul Hardfork Support**

Draft support for the upcoming `Istanbul` hardfork planned for October 2019,
use `istanbul` as constructor `hardfork` parameter to activate. Parameters
relevant to new EIPs accepted for the HF will be added along subsequent `1.2.x`
releases, the finalized HF version will be released along a subsequent `1.x.0`
release (likely `1.3.0`).

See new `hardforks/istanbul.json` file as well as PR
[#51](https://github.com/ethereumjs/ethereumjs-common/pull/51).

[1.2.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%401.1.0...%40ethereumjs%2Fcommon%401.2.0

## [1.1.0] - 2019-02-04

**Petersburg Hardfork Support**

This release now supports the new `Petersburg` (aka
`constantinopleFix`) HF removing support for [EIP 1283](https://eips.ethereum.org/EIPS/eip-1283). `Petersburg` is conceptualized
within the library as a separate delta-containing HF, only removing `EIP 1283`
support and containing nothing else. It should therefore always be applied
together with the `Constantinople` HF, either by using the same block number to
update on both (`mainnet` scenario) or applying subsequently on subsequent
block numbers (`ropsten` scenario).

HF related changes (from PR [#44](https://github.com/ethereumjs/ethereumjs-common/pull/44)):

- New `hardforks/petersburg.json` HF file
- `constantinople` and `petersburg` block numbers for `ropsten` and `mainnet`
- Updated tests, new `petersburg` related tests

**Launched/Final Goerli Configuration Support**

The release now supports the final [Goerli](https://github.com/goerli/testnet)
cross-client testnet configuration.

Goerli related changes (from PR [#48](https://github.com/ethereumjs/ethereumjs-common/pull/48)):

- Updated `chains/goerli.json` configuration file (`chainId` -> 5,
  `networkId` -> 5, genesis parameters)
- HF block numbers up to `petersburg` hardfork
- Updated bootstrap nodes
- Updated `genesisStates/goerli.json` genesis state
- Test updates

**Other Changes**

- Fixed a bug in `hardforkGteHardfork()` where non-active hardforks were considered equal to `chainstart` when `onlyActive` is passed, see
  PR [#44](https://github.com/ethereumjs/ethereumjs-common/pull/44)
- Use CLI scripts from ethereumjs-config in package.json, PR
  [#43](https://github.com/ethereumjs/ethereumjs-common/pull/43)

[1.1.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%401.0.0...%40ethereumjs%2Fcommon%401.1.0

## [1.0.0] - 2019-01-23

First `TypeScript` based release of the library (for details see
PR [#38](https://github.com/ethereumjs/ethereumjs-common/pull/38)),
so release coming with type declaration files and additional type safety! 😄

### Breaking Changes

**Library Import**

`TypeScript` handles `ES6` transpilation
[a bit differently](https://github.com/Microsoft/TypeScript/issues/2719) (at the
end: cleaner) than `babel` so `require` syntax of the library slightly changes to:

```javascript
const Common = require('ethereumjs-common').default
```

**Genesis State Import/Usage**

Import path and usage API of genesis state has changed, see also the
[docs](https://github.com/ethereumjs/ethereumjs-common#genesis-states) on this,
PR [#39](https://github.com/ethereumjs/ethereumjs-common/pull/39):

```javascript
const mainnetGenesisState = require('ethereumjs-common/dist/genesisStates/mainnet')
```

Or by accessing dynamically:

```javascript
const genesisStates = require('ethereumjs-common/dist/genesisStates')
const mainnetGenesisState = genesisStates.genesisStateByName('mainnet')
const mainnetGenesisState = genesisStates.genesisStateById(1) // alternative via network Id
```

**Removed `hybridCasper` (draft) hardfork**

Not likely that anyone has used this, but just in case:
The once anticipated `hybridCasper` (draft) hardfork has been removed from the
list of hardforks, see PR [#37](https://github.com/ethereumjs/ethereumjs-common/pull/37)

[1.0.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%400.6.1...%40ethereumjs%2Fcommon%401.0.0

## [0.6.1] - 2018-11-28

- Experimental support for the [Goerli](https://github.com/goerli/testnet) cross-client `PoA` testnet (`chains/goerli.json`), see PR [#31](https://github.com/ethereumjs/ethereumjs-common/pull/31)
- Unified hex-prefixing (so always prefixing with `0x`) of account addresses in genesis files (fixes an issue with state root computation on other libraries), see PR [#32](https://github.com/ethereumjs/ethereumjs-common/issues/32)

[0.6.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%400.6.0...%40ethereumjs%2Fcommon%400.6.1

## [0.6.0] - 2018-10-11

Parameter support for the `Constantinople` hardfork (see `hardforks/constantinople.json`):

- Added `SSTORE` gas/refund prices (`EIP-1283`), PR [#27](https://github.com/ethereumjs/ethereumjs-common/pull/27)
- Added Block Reward Adjustment (`EIP-1234`), PR [#26](https://github.com/ethereumjs/ethereumjs-common/pull/26)

[0.6.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%400.5.0...%40ethereumjs%2Fcommon%400.6.0

## [0.5.0] - 2018-08-27

- Introduces **support for private chains** by allowing to pass a custom dictionary as the `chain` parameter
  in the constructor or the `setChain()` method as an alternative to just passing one of the predefined
  `chain` `String` names (e.g. `mainnet`, `ropsten`), PR [#24](https://github.com/ethereumjs/ethereumjs-common/pull/24)

[0.5.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%400.4.1...%40ethereumjs%2Fcommon%400.5.0

## [0.4.1] - 2018-08-13

- Added `timestamp` field to genesis definitions in chain files, set for `Rinkeby` and `null` for other chains, PR [#21](https://github.com/ethereumjs/ethereumjs-common/pull/21)
- Updated `Ropsten` bootstrap nodes, PR [#20](https://github.com/ethereumjs/ethereumjs-common/pull/20)

[0.4.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%400.4.0...%40ethereumjs%2Fcommon%400.4.1

## [0.4.0] - 2018-06-20

- Remove leftover ...Gas postfix for some gas prices (e.g. `ecAddGas` -> `ecAdd`) to
  be consistent with overall gas price naming

[0.4.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%400.3.1...%40ethereumjs%2Fcommon%400.4.0

## [0.3.1] - 2018-05-28

- Added two alias functions `activeOnBlock()` and `gteHardfork()` when hardfork is set for convenience, PR [#15](https://github.com/ethereumjs/ethereumjs-common/pull/15)
- Added option to dynamically choose genesis state (see `README`), PR [#15](https://github.com/ethereumjs/ethereumjs-common/pull/15)

[0.3.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%400.3.0...%40ethereumjs%2Fcommon%400.3.1

## [0.3.0] - 2018-05-25

- Allow functions like `hardforkIsActiveOnBlock()` - where hardfork is provided as param - also to be run on hardfork set for greater flexibility/comfort, PR [#13](https://github.com/ethereumjs/ethereumjs-common/pull/13)
- New `hardforkGteHardfork()` method for HF order comparisons, PR [#13](https://github.com/ethereumjs/ethereumjs-common/pull/13)

[0.3.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%400.2.0...%40ethereumjs%2Fcommon%400.3.0

## [0.2.0] - 2018-05-14

- New optional initialization parameter `allowedHardforks`, this allows for cleaner client
  library implementations by preventing undefined behaviour, PR [#10](https://github.com/ethereumjs/ethereumjs-common/pull/10)
- Added `activeHardfork()` function to get latest active HF for chain or block, PR [#11](https://github.com/ethereumjs/ethereumjs-common/pull/11)

[0.2.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%400.1.1...%40ethereumjs%2Fcommon%400.2.0

## [0.1.1] - 2018-05-09

- Remove dynamic require to prevent browserify issue, PR [#8](https://github.com/ethereumjs/ethereumjs-common/pull/8)

[0.1.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%400.1.0...%40ethereumjs%2Fcommon%400.1.1

## [0.1.0] - 2018-05-09

- Initial version, this library succeeds the [ethereum/common](https://github.com/ethereumjs/common/issues/12)
  library, being more future-proof through a better structured design

Features:

- Easy chain-/HF-based parameter access
- No parameter changes on library updates (`c.param('gasPrices', 'ecAddGas', 'byzantium')` will always return the same value)
- Ease experimentation/research by allowing to include future HF parameters (already included as draft: `constantinople` and `hybridCasper`) without breaking current installations
- Improved structure for parameter access (mainly through topics like `gasPrices`, `pow`, `sharding`) for better readability/developer overview
- See [README](https://github.com/ethereumjs/ethereumjs-common) and [API Docs](https://github.com/ethereumjs/ethereumjs-common/blob/master/docs/index.md) for a more in-depth feature overview and usage instructions

[0.1.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fcommon%406d0df...%40ethereumjs%2F..v0.1.0
