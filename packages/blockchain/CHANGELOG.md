# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 6.2.2 - 2023-04-20

- Update ethereum-cryptography from 1.2 to 2.0 (switch from noble-secp256k1 to noble-curves), PR [#2641](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2641)
- Bump `@ethereumjs/util` `@chainsafe/ssz` dependency to 0.11.1 (no WASM, native SHA-256 implementation, ES2019 compatible, explicit imports), PRs [#2622](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2622), [#2564](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2564) and [#2656](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2656)

## 6.2.1 - 2023-02-27

- Pinned `@ethereumjs/util` `@chainsafe/ssz` dependency to `v0.9.4` due to ES2021 features used in `v0.10.+` causing compatibility issues, PR [#2555](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2555)
- Fixed `kzg` imports, PR [#2552](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2552)

## 6.2.0 - 2023-02-21

**DEPRECATED**: Release is deprecated due to broken dependencies, please update to the subsequent bugfix release version.

### Functional Shanghai Support

This release fully supports all EIPs included in the [Shanghai](https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/shanghai.md) feature hardfork scheduled for early 2023. Note that a `timestamp` to trigger the `Shanghai` fork update is only added for the `sepolia` testnet and not yet for `goerli` or `mainnet`.

You can instantiate a Shanghai-enabled Common instance for your transactions with:

```typescript
import { Common, Chain, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
```

### Experimental EIP-4844 Shard Blob Transactions Support

This release supports an experimental version of the blob transaction type introduced with [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) as being specified in the [01d3209](https://github.com/ethereum/EIPs/commit/01d320998d1d53d95f347b5f43feaf606f230703) EIP version from February 8, 2023 and deployed along `eip4844-devnet-4` (January 2023), see PR [#2349](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2349) as well as PRs [#2522](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2522) and [#2526](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2526).

The blockchain library now allows for blob transactions to be validated and included in a chain where EIP-4844 activated either by hardfork or standalone EIP (see latest tx library release for additional details).

### Block Interface getBlock() Signature Fix

Always a bit tricky, but we felt that we needed to do this. We had a misalignment of our blockchain implementation of the `Blockchain.getBlock()` method and the definition of the associated interface:

- Blockchain class: `async getBlock(blockId: Buffer | number | bigint): Promise<Block>`
- Blockchain interface: `getBlock(blockId: Buffer | number | bigint): Promise<Block | null>`

So the Blockchain interface was - falsely - claiming that there would be the possibility of a `null` value returned in the case of a block not being found while the actual implementation was throwing an error in such a case.

We now fixed this by removing the `null` from the interface return values - see PR [#2524](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2524), after exploring the other way around as well (and the reverting), see PR [#2516](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2516).

While this might lead to breaking code constallations on the TypeScript level if this `null` value is picked up we felt this is the right thing to do since this divergence would otherwise continue to "trick" people into assuming and dealing with `null` values for non-existing-block assumptions in their code and continue to produce eventual bugs (we actually fell over this ourselves).

A bit on the verge of breaking vs. bug fixing, sorry if you are eventually affected, but we just can't do a single breaking release update for a fix on that level.

### Other Changes

- Timestamp-related `Blockchain.createGenesisBlock()` fix, PR [#2529](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2529)
- Allow genesis to be post merge, PR [#2530](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2530)
- Add extra validations for assuming nil bodies in `getBlock()`, PR [#2534](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2534)
- New method `resetCanonicalHead(canonicalHead: bigint)`, PR [#2532](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2532)
- Made `checkAndTransitionHardForkByNumber()` async and public, PR [#2532](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2532)
- Total difficulty related HF switch fixes, PR [#2545](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2545)
- Revert to previous sane heads if block or header put fails, PR [#2548](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2548)

## 6.1.0 - 2022-12-09

### Experimental EIP-4895 Beacon Chain Withdrawals Support

This release comes with experimental [EIP-4895](https://eips.ethereum.org/EIPS/eip-4895) beacon chain withdrawals support, see PR [#2353](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2353) for the plain implementation and PR [#2401](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2401) for updated calls for the CL/EL engine API. Also note that there is a new helper module in [@ethereumjs/util](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/util) with a new dedicated `Withdrawal` class together with additional TypeScript types to ease withdrawal handling.

Withdrawals support can be activated by initializing a respective `Common` object, see [@ethereumjs/block](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/block) library README for an example how to create an Ethereum Block containing withdrawal operations.

```typescript
import { Common, Chain } from '@ethereumjs/common'
```

The Blockchain class now fully supports including/adding withdrawal blocks as well as directly start with a genesis block including withdrawal operations.

### Hardfork-By-Time Support

The Blockchain library is now ready to work with hardforks triggered by timestamp, which will first be applied along the `Shanghai` HF, see PR [#2437](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2437). This is achieved by integrating a new timestamp supporting `@ethereumjs/common` library version.

## 6.0.2 - 2022-10-25

- Updated `@ethereumjs/util` minimal package version to `v8.0.2` to ensure functioning of the library (otherwise the newly exported `Lock` functionality might be missing)

## 6.0.1 - 2022-10-18

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

- New `releaseLockOnCallback` parameter for blockchain iterator (`Blockchain.iterator()` to allow for not locking the blockchain for running the callback (default: `false`), PR [#2308](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2308)
- Fixed reorg handling for blockchain iterator (`Blockchain.iterator()`), PR [#2308](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2308)

## 6.0.0 - 2022-09-06

Final release - tada 🎉 - of a wider breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2, Beta 3 and Release Candidate (RC) 1 release notes for notes on some additional changes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/CHANGELOG.md)).

### Changes

- Internal refactor: removed ambiguous boolean checks within conditional clauses, PR [#2257](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2257)

## 6.0.0-rc.1 - 2022-08-29

Release candidate 1 for the upcoming breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2 and 3 release notes for notes on some additional changes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/CHANGELOG.md)).

### Fixed Mainnet Merge HF Default

Since this bug was so severe it gets its own section: `mainnet` in the underlying `@ethereumjs/common` library (`Chain.Mainnet`) was accidentally not updated yet to default to the `merge` HF (`Hardfork.Merge`) by an undiscovered overwrite back to `london`.

This has been fixed in PR [#2206](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2206) and `mainnet` now default to the `merge` as well.

### Maintenance Updates

- Added `engine` field to `package.json` limiting Node versions to v14 or higher, PR [#2164](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2164)
- Replaced `nyc` (code coverage) configurations with `c8` configurations, PR [#2192](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2192)
- Code formats improvements by adding various new linting rules, see Issue [#1935](https://github.com/ethereumjs/ethereumjs-monorepo/issues/1935)
- Replaced `semaphore-async-await` dependency with smaller implementation, PR [#2222](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2222)
- Renamed `Semaphore` to `Lock`, PR [#2234](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2234)

## 6.0.0-beta.3 - 2022-08-10

Beta 3 release for the upcoming breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes for the main long change set description as well as the Beta 2 release notes for notes on some additional changes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/CHANGELOG.md)).

## Blockchain Interface Changes

The Blockchain interface has been expanded by a few methods and is now guaranteed to work with the VM. The following properties and methods have been added, see PR [#2069](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2069):

- `consensus: Consensus` property (for the consensus implementation)
- `copy(): BlockchainInterface` method
- `validateHeader(header: BlockHeader, height?: bigint): Promise<void>` method

The following methods are added, but are optional to implement:

- `getIteratorHead?(name?: string): Promise<Block>` method
- `getTotalDifficulty?(hash: Buffer, number?: bigint): Promise<bigint>` method
- `genesisState?(): GenesisState` method
- `getCanonicalHeadBlock?(): Promise<Block>` method

## Other Changes

- Update to renamed `hardforkByTTD` (before: `hardforkByTD`) option for Block instantiations, PR [#2075](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2075)

## 6.0.0-beta.2 - 2022-07-15

Beta 2 release for the upcoming breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/CHANGELOG.md)) for the main change set description.

### Removed Default Exports

The change with the biggest effect on UX since the last Beta 1 releases is for sure that we have removed default exports all accross the monorepo, see PR [#2018](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2018), we even now added a new linting rule that completely dissalows using.

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

### Removed Default Imports in this Library

The main `Blockchain` class import has been updated, so import changes from:

```typescript
import Blockchain from '@ethereumjs/blockchain'
```

to:

```typescript
import { Blockchain } from '@ethereumjs/blockchain'
```

## Blockchain Consensus Option

The Blockchain library now has a new optional `consensus` constructor options parameter which can be used to pass in a customized or own consensus class respectively implementation, e.g. a modfifed Ethash version or a Clique implementation with adopted parameters or the like, see PR [#2002](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2002) to get a grasp on the integration.

## Other Changes

- Added `ESLint` strict boolean expressions linting rule, PR [#2030](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2030)

## 6.0.0-beta.1 - 2022-06-30

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

### BigInt-Related and other API Changes

Different methods in the Blockchain library have been renamed for clarity or have a slightly different API due to the BigInt introduction, see PRs [#1822](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1822) and [#1877](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1877):

- `getLatestHeader()` -> `getCanonicalHeadHeader()`
- `getLatestBlock()` -> `getCanonicalHeadBlock()`
- `iterator(name: string, onBlock: OnBlock): Promise<void | number>` -> `iterator(name: string, onBlock: OnBlock): Promise<number>`

The following getters and/or methods have been removed:

- `get meta()`
- `getHead()` (use `getIteratorHead()` instead)
- `setHead()` (use `setIteratorHead()` instead)

### Consensus Encapsulation

Consensus-related functionality in the `Blockchain` package has been reworked and taken out of the main `Blockchain` class, see PR [#1756](https://github.com/ethereumjs/ethereumjs-monorepo/issues/1756).

There is now a dedicated consensus class for each type of supported consensus, `Ethash`, `Clique` and `Casper` (PoS, this one is rather the do-nothing part of `Casper` and letting the respective consensus/beacon client do the hard work! 🙂). Each consensus class adheres to a common interface `Consensus` implementing the following five methods in a consensus-specific way:

- `genesisInit(genesisBlock: Block): Promise<void>`
- `setup(): Promise<void>`
- `validateConsensus(block: Block): Promise<void>`
- `validateDifficulty(header: BlockHeader): Promise<void>`
- `newBlock(block: Block, commonAncestor?: BlockHeader, ancientHeaders?: BlockHeader[]): Promise<void>`

There is now a new `Blockchain` option `consensus`. This makes it very easy to pass in a modified version of an existing consensus implementation or do something totally different and write an own consensus class with consensus rules to follow.

### Added Genesis Functionality

PRs [#1916](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1916) and - as some follow-up work - [#1924](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1924) rework the genesis code throughout the EthereumJS library stack, with benefits on the bundle size of the lower level libraries (like `Block` or `Transaction`).

In return the `Blockchain` class has gotten new responsibilities on handling genesis state. Genesis state and block functionality previously in the `@ethereumjs/common` class has been integrated here, see PR [#1916](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1916).

A genesis state can now be set along `Blockchain` creation by passing in a custom `genesisBlock` and `genesisState`. For `mainnet` and the official test networks like `sepolia` or `goerli` genesis is already provided with the block data still coming from `@ethereumjs/common`, with genesis state now being integrated into the `Blockchain` library directly.

The genesis block from the initialized `Blockchain` can be retrieved via the new `Blockchain.genesisBlock` getter. For creating a genesis block from the params in `@ethereumjs/common`, the new `createGenesisBlock(stateRoot: Buffer): Block` method can be used.

Note that this is a very large refactoring with mainly the lower-level libraries benefitting. If you miss some functionality here let us know, we are happy to discuss!

### Added Validation Methods

The Blockchain class has also gotten new validation methods previously located in the `Block` library (where they required a `Blockchain` to be passed in as a method parameter), see PR [#1959](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1959).

The following methods have been taken out of the `Block` package and moved into `Blockchain`:

- `BlockHeader.validate(blockchain: Blockchain, height?: bigint): Promise<void>` -> `Blockchain.validateHeader(header: BlockHeader, height?: bigint)`
- `BlockHeader.validateDifficulty()`, `BlockHeader.validateCliqueDifficulty()` -> `Blockchain.consensus.validateDifficulty()`
- `Block.validateUncles()` -> to `Blockchain`, kept private (let us know if you need to call into the functionality)

### New File Structue

The file structure of the package has been reworked and aligned with other libraries, see PR [#1986](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1986). There is now a dedicated `blockchain.ts` file for the main source code. The `index.ts` is now re-exporting the `Blockchain` class and `Consensus` implementations as well as the `BlockchainInterface` interface, the `BlockchainOptions` dictionary and types from a dedicated `types.ts` file.

### Level DB Upgrade / Browser Compatibility

The internal Level DB code has been reworked to now be based and work with the latest Level [v8.0.0](https://github.com/Level/level/releases/tag/v8.0.0) major Level DB release, see PR [#1949](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1949). This allows to use ES6-style `import` syntax to import the `Level` instance and allows for better typing when working with Level DB.

Because the usage of `level` and `memory-level` there are now 3 different possible instances of `abstract-level`, all with a consistent interface due to `abstract-level`. These instances are `classic-level`, `browser-level` and `memory-level`. This now makes it a lot easier to use the package in browsers without polyfills for `level`. For some context it is worth to mention that starting with the v8 release, the `level` package is just a proxy for these other packages and has no functionality itself.

## 5.5.2 - 2022-03-15

- Fixed a bug where a delete-operation would be performed on DB but not in the cache leading to inconsistent behavior, PR [#1786](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1786)

## 5.5.1 - 2021-11-15

This patch release contains a bug fix for using the blockchain package in a browser context with tools like browserify, see PR [#1566](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1566).

## 5.5.0 - 2021-11-09

### ArrowGlacier HF Support

This release adds support for the upcoming [ArrowGlacier HF](https://github.com/ethereum/execution-specs/blob/master/network-upgrades/mainnet-upgrades/arrow-glacier.md) (see PR [#1527](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1527)) targeted for December 2021. The only included EIP is [EIP-4345](https://eips.ethereum.org/EIPS/eip-4345) which delays the difficulty bomb to June/July 2022.

Please note that for backwards-compatibility reasons the associated Common is still instantiated with `istanbul` by default.

An ArrowGlacier blockchain object can be instantiated with:

```typescript
import Blockchain from '@ethereumjs/blockchain'
import Common, { Chain, Hardfork } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.ArrowGlacier })
const blockchain = await Blockchain.create({ common })
```

### Other Changes

- Fixed bug in `Blockchain.copy()` not copying the underlying Common instance, PR [#1512](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1512)
- Use `RLP` library exposed by `ethereumjs-util` dependency (deduplication), PR [#1549](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1549)

## 5.4.2 - 2021-09-28

- Fixed a bug not initializing the HF correctly when run on a custom chain with the `london` HF happening on block 0 or 1, PR [#1492](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1492)

## 5.4.1 - 2021-09-24

### Experimental Casper/PoS and Merge Support

This release adds first experimental Casper/PoS respectively Merge HF support by allowing to build a blockchain which switches to Casper/PoS consensus validation at some point triggered by a merge HF occurred. The `Blockchain` library now allows for taking in the respective Casper/PoS conforming blocks (see `@ethereumjs/block` release v3.5.0), do the correct validations and set the HF accordingly (Merge HF-related logic and a new PoS consensus type have been added to the `Common` library along with the v2.5.0 release).

See: PR [#1408](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1408)

### Other Changes

- Added new `Blockchain.cliqueSignerInTurn()` method, PR [#1444](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1444)
- Added new `Blockchain.copy()` method, PR [#1444](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1444)
- Added browser tests, PR [#1380](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1380)

## 5.4.0 - 2021-07-08

### Finalized London HF Support

This release integrates a `Common` library version which provides the `london` HF blocks for all networks including `mainnet` and is therefore the first release with finalized London HF support.

## 5.3.1 - 2021-06-25

### PoA Reorg Fix

This release includes a fix for blockchain's reorg logic when handling PoA chains. PR [#1253](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1253) fixes this to choose the fork with the larger total difficulty and rebuilds the internal clique snapshots accordingly.

### Included Source Files

Source files from the `src` folder are now included in the distribution build, see PR [#1301](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1301). This allows for a better debugging experience in debug tools like Chrome DevTools by having working source map references to the original sources available for inspection.

## 5.3.0 - 2021-05-26

### Functional London HF Support (no finalized HF blocks yet)

This release comes with full functional `london` HF support (all EIPs are finalized and integrated and `london` HF can be activated, there are no final block numbers for the HF integrated though yet) by setting the `Block`, `Tx` and `Common` dependencies to versions which ensure a working set of `london`-enabled library versions. In particular this allows for running a blockchain with EIP-1559 blocks and transactions.

Please note that the default HF is still set to `istanbul`. You therefore need to explicitly set the `hardfork` parameter for instantiating a `Blockchain` instance with a `london` HF activated:

```typescript
import Blockchain from '@ethereumjs/blockchain'
import Common from '@ethereumjs/common'
const common = new Common({ chain: 'mainnet', hardfork: 'london' })
const blockchain = await Blockchain.create({ common })
```

### Other Changes

- New `hardforkByHeadBlockNumber` option to set the HF to the fork determined by the head block and update on head updates (default: `false`), PR [#1148](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1148)

## 5.2.1 - 2021-03-26

- Fixed a bug leading `Blockchain` to fail instantiating with a `common` **custom chain** setup when no `genesisBlock` was provided, PR [#1167](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1167)

## 5.2.0 - 2021-03-18

### Berlin HF Support

This release comes with full `berlin` HF support by setting the `Block`, `Tx` and `Common` dependencies to versions which ensure a working set of `berlin`-enabled library versions. In particular this allows for running a blockchain with blocks containing typed transactions.

Please note that the default HF is still set to `istanbul`. You therefore need to explicitly set the `hardfork` parameter for instantiating a `Blockchain` instance with a `berlin` HF activated:

```typescript
import Blockchain from '@ethereumjs/blockchain'
import Common from '@ethereumjs/common'
const common = new Common({ chain: 'mainnet', hardfork: 'berlin' })
const blockchain = await Blockchain.create({ common })
```

#### EthereumJS Libraries - Typed Transactions Readiness

If you are using this library in conjunction with other EthereumJS libraries make sure to minimally have the following library versions installed for typed transaction support:

- `@ethereumjs/common` `v2.2.0`
- `@ethereumjs/tx` `v3.1.0`
- `@ethereumjs/block` `v3.2.0`
- `@ethereumjs/blockchain` `v5.2.0`
- `@ethereumjs/vm` `v5.2.0`

## 5.1.0 2021-02-22

### Clique/PoA Support

This release introduces Clique/PoA support for the `Blockchain` library, see the main PR [#1032](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1032) as well as the follow-up PRs [#1074](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1074) and PR [#1088](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1088).

The blockchain package now keeps track of the latest signers and votes on new Clique/PoA signers and saves them to DB. Block format validation is now also taking all the Clique/PoA specifics into account (`extraData` format and other formal requirements from the EIP) and consensus validation is now also working for Clique/PoA chains (this verifies the respective block signatures from the corresponding authorized signers) and can be activated with the `validateConsensus` constructor flag. There is a new public method `Blockchain.cliqueActiveSigners()` to get the currently active signer list.

### Other Features/Changes

- Added optional `maxBlocks` parameter to `Blockchain.iterator()` method, PR [#965](https://github.com/ethereumjs/ethereumjs-monorepo/pull/965)
- `Blockchain.iterator()` now returns a `number` (instead of `void`) with the blocks actually iterated (the `Blockchain` interface allows for both for backwards-compatibility reasons for now, `void` is considered deprecated though), PR [#1065](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1065)
- Blocks in the blockchain package are now always created with the `hardforkByBlockNumber` option set to `true` to avoid inconsistencies in block behavior, PR [#1089](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1089)
- New `Blockchain.setHead(tag: string, headHash: Buffer)` method to set a specific iterator head to a certain block, PR [#965](https://github.com/ethereumjs/ethereumjs-monorepo/pull/965)
- Added `debug` logger integration, first `blockchain:clique` debug logger (see README), PR [#1103](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1103)
- Fixed a bug in the validation logic to only validate the block header if a header is passed to the internal `Blockchain._putBlockOrHeader()` function, PR [#1105](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1105)

## 5.0.0 - 2020-11-24

### New Package Name

**Attention!** This new version is part of a series of EthereumJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `ethereumjs-blockchain` -> `@ethereumjs/blockchain`

Please update your library references accordingly or install with:

```shell
npm i @ethereumjs/blockchain
```

### Library Promisification

The `Blockchain` library has been promisified and callbacks have been removed along PR [#833](https://github.com/ethereumjs/ethereumjs-monorepo/pull/833) and preceding PR [#779](https://github.com/ethereumjs/ethereumjs-monorepo/pull/779).

Old API example:

```typescript
blockchain.getBlock(blockId, (block) => {
  console.log(block)
})
```

New API example:

```typescript
const block = await blockchain.getBlock(blockId)
console.log(block)
```

See `Blockchain` [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/blockchain#example) for a complete example.

**Safe Static Constructor**

The library now has an additional safe static constructor `Blockchain.create()` which awaits the init method and throws if the init method throws:

```typescript
import Blockchain from '@ethereumjs/blockchain'
const common = new Common({ chain: 'ropsten' })
const blockchain = await Blockchain.create({ common })
```

This is the new recommended way to instantiate a `Blockchain` object, see PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930).

Constructor options (both for the static and the main constructor) for chain setup on all VM monorepo libraries have been simplified and the plain `chain` and `hardfork` options have been removed. Passing in a `Common` instance is now the single way to switch to a non-default chain (`mainnet`) or start a blockchain with a higher than `chainstart` hardfork, see PR [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863).

**Refactored Genesis Block Handling Mechanism**

Genesis handling has been reworked to now be safer and reduce the risk of wiping a blockchain by setting a new genesis, see PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930).

**Breaking**: The dedicated `setGenesisBlock()` methods and the optional `isGenesis` option on `Blockchain.putBlock()` have been removed. Instead the genesis block is created on initialization either from the `Common` library instance passed or a custom genesis block passed along with the `genesisBlock` option. If a custom genesis block is used, this custom block now always has to be passed along on `Blockchain` initialization, also when operating on an already existing DB.

### Removed deprecated `validate` option

The deprecated `validate` option has been removed, please use `valdiateBlock` and `validatePow` for options when instantiating a new `Blockchain`.

### Dual ES5 and ES2017 Builds

We significantly updated our internal tool and CI setup along the work on PR [#913](https://github.com/ethereumjs/ethereumjs-monorepo/pull/913) with an update to `ESLint` from `TSLint` for code linting and formatting and the introduction of a new build setup.

Packages now target `ES2017` for Node.js builds (the `main` entrypoint from `package.json`) and introduce a separate `ES5` build distributed along using the `browser` directive as an entrypoint, see PR [#921](https://github.com/ethereumjs/ethereumjs-monorepo/pull/921). This will result in performance benefits for Node.js consumers, see [here](https://github.com/ethereumjs/merkle-patricia-tree/pull/117) for a releated discussion.

### Other Changes

**Changes and Refactoring**

- **Breaking:** `validatePow` option has been renamed to `validateConsensus` to prepare for a future integration of non-PoW (PoA) consensus mechanisms, `validateConsensus` as well as `validateBlocks` options now throw when set to `true` for validation on a non-PoW chain (determined by `Common`, e.g. 'goerli'), see PR [#937](https://github.com/ethereumjs/ethereumjs-monorepo/pull/937)
- Exposed private `Blockchain._getTd()` total difficulty function as `Blockchain.getTotalDifficulty()`, PR [#956](https://github.com/ethereumjs/ethereumjs-monorepo/issues/956)
- Refactored `DBManager` with the introduction of an abstract DB operation handling mechanism, if you have modified `DBManager` in your code this will be a **potentially breaking** change for you, PR [#927](https://github.com/ethereumjs/ethereumjs-monorepo/pull/927)
- Renaming of internal variables like `Blockchain._headBlock`, if you are using these variables in your code this will be a **potentially breaking** change for you, PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Made internal `_` methods like `_saveHeads()` private, if you are using these functions in your code this will be a **potentially breaking** change for you, PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Improved code documentation, PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Fixed potential blockchain DB concurrency issues along PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Use `@ethereumjs/block` `v3.0.0` block library version, PR [#883](https://github.com/ethereumjs/ethereumjs-monorepo/pull/883)
- Removed `async` dependency, PR [#779](https://github.com/ethereumjs/ethereumjs-monorepo/pull/779)
- Updated `ethereumjs-util` to v7, PR [#748](https://github.com/ethereumjs/ethereumjs-monorepo/pull/748)

**Bug Fixes**

- Fixed blockchain hanging forever in case code throws between a semaphore `lock`/`unlock`,
  Issue [#877](https://github.com/ethereumjs/ethereumjs-monorepo/issues/877)

**Testing and CI**

- Dedicated `blockchain` reorg test setup and executable test, PR [#926](https://github.com/ethereumjs/ethereumjs-monorepo/pull/926)

## 5.0.0-rc.1 2020-11-19

This is the first release candidate towards a final library release, see [beta.2](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fblockchain%405.0.0-beta.2) and especially [beta.1](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fblockchain%405.0.0-beta.1) release notes for an overview on the full changes since the last publicly released version.

- Exposed private `Blockchain._getTd()` total difficulty function as `Blockchain.getTotalDifficulty()`, PR [#956](https://github.com/ethereumjs/ethereumjs-monorepo/issues/956)

## 5.0.0-beta.2 - 2020-11-12

This is the second beta release towards a final library release, see [beta.1 release notes](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fblockchain%405.0.0-beta.1) for an overview on the full changes since the last publicly released version.

This release introduces **new breaking changes**, so please carefully read the additional release note sections!

**Safe Static Constructor**

The library now has an additional safe static constructor `Blockchain.create()` which awaits the init method and throws if the init method throws:

```typescript
const common = new Common({ chain: 'ropsten' })
const blockchain = await Blockchain.create({ common })
```

This is the new recommended way to instantiate a `Blockchain` object, see PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930).

**Refactored Genesis Block Handling Mechanism**

Genesis handling has been reworked to now be safer and reduce the risk of wiping a blockchain by setting a new genesis, see PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930).

**Breaking**: The dedicated `setGenesisBlock()` methods and the optional `isGenesis` option on `Blockchain.putBlock()` have been removed. Instead the genesis block is created on initialization either from the `Common` library instance passed or a custom genesis block passed along with the `genesisBlock` option. If a custom genesis block is used, this custom block now always has to be passed along on `Blockchain` initialization, also when operating on an already existing DB.

**Changes and Refactoring**

- Refactored `DBManager` with the introduction of an abstract DB operation handling mechanism, if you have modified `DBManager` in your code this will be a **potentially breaking** change for you, PR [#927](https://github.com/ethereumjs/ethereumjs-monorepo/pull/927)
- Renaming of internal variables like `Blockchain._headBlock`, if you are using these variables in your code this will be a **potentially breaking** change for you, PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Made internal `_` methods like `_saveHeads()` private, if you are using these functions in your code this will be a **potentially breaking** change for you, PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Improved code documentation, PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)
- Fixed potential blockchain DB concurrency issues along PR [#930](https://github.com/ethereumjs/ethereumjs-monorepo/pull/930)

**Testing and CI**

- Dedicated `blockchain` reorg test setup and executable test, PR [#926](https://github.com/ethereumjs/ethereumjs-monorepo/pull/926)
- **Breaking:** `validatePow` option has been renamed to `validateConsensus` to prepare for a future integration of non-PoW (PoA) consensus mechanisms, `validateConsensus` as well as `validateBlocks` options now throw when set to `true` for validation on a non-PoW chain (determined by `Common`, e.g. 'goerli'), see PR [#937](https://github.com/ethereumjs/ethereumjs-monorepo/pull/937)

## 5.0.0-beta.1 - 2020-10-22

### New Package Name

**Attention!** This new version is part of a series of EthereumJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `ethereumjs-blockchain` -> `@ethereumjs/blockchain`

Please update your library references accordingly or install with:

```shell
npm i @ethereumjs/blockchain
```

### Library Promisification

The `Blockchain` library has been promisified and callbacks have been removed along
PR [#833](https://github.com/ethereumjs/ethereumjs-monorepo/pull/833) and preceding PR
[#779](https://github.com/ethereumjs/ethereumjs-monorepo/pull/779).

Old API example:

```typescript
blockchain.getBlock(blockId, (block) => {
  console.log(block)
})
```

New API example:

```typescript
const block = await blockchain.getBlock(blockId)
console.log(block)
```

See `Blockchain` [README](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/blockchain#example) for a complete example.

### Constructor API Changes

Constructor options for chain setup on all VM monorepo libraries have been simplified and the plain `chain` and `hardfork` options have been removed. Passing in a `Common` instance is now the single way to switch to a non-default chain (`mainnet`) or start a blockchain with a higher than `chainstart` hardfork, see PR [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863).

Example:

```typescript
import Blockchain from '@ethereumjs/blockchain'
const common = new Common({ chain: 'ropsten', hardfork: 'byzantium' })
const blockchain = new Blockchain({ common })
```

### Removed deprecated `validate` option

The deprecated `validate` option has been removed, please use `valdiateBlock` and `validatePow` for options when instantiating a new `Blockchain`.

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

- Use `@ethereumjs/block` `v3.0.0` block library version,
  PR [#883](https://github.com/ethereumjs/ethereumjs-monorepo/pull/883)
- Removed `async` dependency,
  PR [#779](https://github.com/ethereumjs/ethereumjs-monorepo/pull/779)
- Updated `ethereumjs-util` to v7,
  PR [#748](https://github.com/ethereumjs/ethereumjs-monorepo/pull/748)

**Bug Fixes**

- Fixed blockchain hanging forever in case code throws between a semaphore `lock`/`unlock`,
  Issue [#877](https://github.com/ethereumjs/ethereumjs-monorepo/issues/877)

## 4.0.4 - 2020-07-27

This release replaces the tilde (`~`) dependency from `ethereumjs-util` for a caret (`^`) one, meaning that any update to `ethereumjs-util` v6 will also be available for this library.

## [4.0.3] - 2019-12-19

Supports `MuirGlacier` by updating `ethereumjs-block` to
[v2.2.2](https://github.com/ethereumjs/ethereumjs-block/releases/tag/v2.2.2)
and `ethereumjs-common` to
[v1.5.0](https://github.com/ethereumjs/ethereumjs-common/releases/tag/v1.5.0).

This release comes also with a completely refactored test suite, see
PR [#134](https://github.com/ethereumjs/ethereumjs-blockchain/pull/134).
Tests are now less coupled and it gets easier to modify tests or extend
the test suite.

[4.0.3]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%404.0.2...%40ethereumjs%2Fblockchain%404.0.3

## [4.0.2] - 2019-11-15

Supports Istanbul by updating `ethereumjs-block` to
[v2.2.1](https://github.com/ethereumjs/ethereumjs-block/releases/tag/v2.2.1) which in turn
uses `ethereumjs-tx` [v2.1.1](https://github.com/ethereumjs/ethereumjs-tx/releases/tag/v2.1.1)
which implements EIP-2028 (calldata fee reduction),
PR [#130](https://github.com/ethereumjs/ethereumjs-blockchain/pull/130).

From this release the `validate` flag is deprecated and users are encouraged
to use the more granular flags `validatePow` and `validateBlocks`. For more
on this please see [#121](https://github.com/ethereumjs/ethereumjs-blockchain/pull/121).

For Typescript users this release also comes with a `BlockchainInterface` interface
which the `Blockchain` class implements,
PR [#124](https://github.com/ethereumjs/ethereumjs-blockchain/pull/124).

[4.0.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%404.0.1...%40ethereumjs%2Fblockchain%404.0.2

## [4.0.1] - 2019-07-01

- Fixes a browser-compatibility issue caused by the library using `util.callbackify`,
  PR [#117](https://github.com/ethereumjs/ethereumjs-blockchain/pull/117)

[4.0.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%404.0.0...%40ethereumjs%2Fblockchain%404.0.1

## [4.0.0] - 2019-04-26

First **TypeScript** based release of the library. `TypeScript` handles `ES6` transpilation
[a bit differently](https://github.com/Microsoft/TypeScript/issues/2719) (at the
end: cleaner) than `babel` so `require` syntax of the library slightly changes to:

```javascript
let Blockchain = require('ethereumjs-blockchain').default
```

The library now also comes with a **type declaration file** distributed along
with the package published.

This release drops support for Node versions `4` and `6` due to
internal code updates requiring newer Node.js versions and removes the previously
deprecated DB constructor options `opts.blockDb` and `opts.detailsDb`.

**Change Summary:**

- Migration of code base and internal toolchain to `TypeScript`,
  PR [#92](https://github.com/ethereumjs/ethereumjs-blockchain/pull/92)
- Refactoring of `DB` operations introducing a separate `DBManager` class
  (comes along with dropped Node `6` support),
  PR [#91](https://github.com/ethereumjs/ethereumjs-blockchain/pull/91)
- Auto-generated `TSDoc` documentation,
  PR [#98](https://github.com/ethereumjs/ethereumjs-blockchain/pull/98)
- Replaced `safe-buffer` with native Node.js `Buffer` usage (this comes along
  with dropped support for Node `4`),
  PR [#92](https://github.com/ethereumjs/ethereumjs-blockchain/pull/92)
- Dropped deprecated `DB` options,
  PR [#100](https://github.com/ethereumjs/ethereumjs-blockchain/pull/100)

[4.0.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.4.0...%40ethereumjs%2Fblockchain%404.0.0

## [3.4.0] - 2019-02-06

**Petersburg** (aka `constantinopleFix`) as well as **Goerli**
support/readiness by updating to a supporting `ethereumjs-common` version
[v1.1.0](https://github.com/ethereumjs/ethereumjs-common/releases/tag/v1.1.0),
PR [#86](https://github.com/ethereumjs/ethereumjs-blockchain/pull/86)

[3.4.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.3.3...%40ethereumjs%2Fblockchain%403.4.0

## [3.3.3] - 2019-01-03

- Fixed a bug causing the `iterate()` method to fail when an older version
  `levelup` DB instance is passed, see PR [#83](https://github.com/ethereumjs/ethereumjs-blockchain/pull/83)

[3.3.3]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.3.2...%40ethereumjs%2Fblockchain%403.3.3

## [3.3.2] - 2018-12-20

- Updated `levelup` dependency to `level-mem` `v3.0.1`, PR [#75](https://github.com/ethereumjs/ethereumjs-blockchain/pull/75)
- Fix `putBlock()` edge case, PR [#79](https://github.com/ethereumjs/ethereumjs-blockchain/pull/79)
- Replaced uses of deprecated `new Buffer` with `Buffer.from`, PR [#80](https://github.com/ethereumjs/ethereumjs-blockchain/pull/80)

[3.3.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.3.1...%40ethereumjs%2Fblockchain%403.3.2

## [3.3.1] - 2018-10-26

- Replaced calls to BN.toBuffer() with BN.toArrayLike() so that `ethereumjs-blockchain` can run in a browser environment, PR [#73](https://github.com/ethereumjs/ethereumjs-blockchain/pull/73)

[3.3.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.3.0...%40ethereumjs%2Fblockchain%403.3.1

## [3.3.0] - 2018-10-19

- Constantinople support when using block validation (set with `opts.validate` in constructor),
  update to a Constantinople-ready version of the `ethereumjs-block` dependency (>2.1.0), PR [#71](https://github.com/ethereumjs/ethereumjs-blockchain/pull/71)

[3.3.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.2.1...%40ethereumjs%2Fblockchain%403.3.0

## [3.2.1] - 2018-08-29

- Fixed an issue with the `iterator()` function returning an error on end of block iteration instead of finish gracefully, PR [#64](https://github.com/ethereumjs/ethereumjs-blockchain/pull/64)
- Updated `ethereumjs-common` dependency to `v0.5.0` (custom chain support), PR [#63](https://github.com/ethereumjs/ethereumjs-blockchain/pull/63)

[3.2.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.2.0...%40ethereumjs%2Fblockchain%403.2.1

## [3.2.0] - 2018-08-13

- Added support for setting network and performing hardfork-specific validation by integrating with [ethereumjs-common](https://github.com/ethereumjs/ethereumjs-common), PR [#59](https://github.com/ethereumjs/ethereumjs-blockchain/pull/59)
- Added `Blockchain.putHeader()` and `Blockchain.putHeaders()` functions to provide header-chain functionality (needed by ethereumjs-client), PR [#59](https://github.com/ethereumjs/ethereumjs-blockchain/pull/59)
- Fixed a bug with caching, PR [#59](https://github.com/ethereumjs/ethereumjs-blockchain/pull/59)
- Fixed error propagation in `Blockchain.iterator()`, PR [#60](https://github.com/ethereumjs/ethereumjs-blockchain/pull/60)

[3.2.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.1.0...%40ethereumjs%2Fblockchain%403.2.0

## [3.1.0] - 2018-05-24

- New `getLatestHeader()` and `getLatestBlock()` methods for retrieving the latest header
  respectively full block in the canonical chain, PR [#52](https://github.com/ethereumjs/ethereumjs-blockchain/pull/52)
- Fixed `saveHeads()` bug not storing the internal `headHeader`/`headBlock` header cursors
  to the DB, PR [#52](https://github.com/ethereumjs/ethereumjs-blockchain/pull/52)
- Updated API docs

[3.1.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%403.0.0...%40ethereumjs%2Fblockchain%403.1.0

## [3.0.0] - 2018-05-18

This release comes with heavy internal changes bringing Geth DB compatibility to the
`ethereumjs-blockchain` library. For a full list of changes and associated discussion
see PR [#47](https://github.com/ethereumjs/ethereumjs-blockchain/pull/47)
(thanks to @vpulim for this amazing work!). To test iterating through your local Geth
chaindata DB you can run the [example](https://github.com/ethereumjs/ethereumjs-blockchain#example)
in the README file.

This allows for various new use cases of the library in the areas of testing, simulation or
running actual blockchain data from a Geth node through the VM. The Geth data model used is
not compatible with the old format where chaindata and metadata have been stored separately on two leveldb
instances, so it is not possible to load an old DB with the new library version (if this causes
problems for you get in touch on GitHub or Gitter!).

Summary of the changes:

- New unified constructor where `detailsDB` and `blockDB` are replaced by a single `db` reference
- Deprecation of the `getDetails()` method now returning an empty object
- `td` and `height` are not stored in the db as meta info but computed as needed
- Block headers and body are stored under two separate keys
- Changes have been made to properly rebuild the chain and number/hash mappings as a result of forks and deletions
- A write-through cache has been added to reduce database reads
- Similar to geth, we now defend against selfish mining vulnerability
- Added many more tests to increase coverage to over 90%
- Updated docs to reflect the API changes
- Updated library dependencies

[3.0.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%402.1.0...%40ethereumjs%2Fblockchain%403.0.0

## [2.1.0] - 2017-10-11

- `Metro-Byzantium` compatible
- Updated `ethereumjs-block` dependency (new difficulty formula / difficulty bomb delay)

[2.1.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%402.0.2...%40ethereumjs%2Fblockchain%402.1.0

## [2.0.2] - 2017-09-19

- Tightened dependencies to prevent the `2.0.x` version of the library to break
  after `ethereumjs` Byzantium library updates

[2.0.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%402.0.1...%40ethereumjs%2Fblockchain%402.0.2

## [2.0.1] - 2017-09-14

- Fixed severe bug adding blocks before blockchain init is complete

[2.0.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%402.0.0...%40ethereumjs%2Fblockchain%402.0.1

## [2.0.0] - 2017-01-01

- Split `db` into `blockDB` and `detailsDB` (breaking)

[2.0.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.4.2...%40ethereumjs%2Fblockchain%402.0.0

## [1.4.2] - 2016-12-29

- New `getBlocks` API method
- Testing improvements

[1.4.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.4.1...%40ethereumjs%2Fblockchain%401.4.2

## [1.4.1] - 2016-03-01

- Update dependencies to support Windows

[1.4.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.4.0...%40ethereumjs%2Fblockchain%401.4.1

## [1.4.0] - 2016-01-09

- Bump dependencies

[1.4.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.3.4...%40ethereumjs%2Fblockchain%401.4.0

## Older releases:

- [1.3.4](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.3.3...%40ethereumjs%2Fblockchain%401.3.4) - 2016-01-08
- [1.3.3](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.3.2...%40ethereumjs%2Fblockchain%401.3.3) - 2015-11-27
- [1.3.2](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.3.1...%40ethereumjs%2Fblockchain%401.3.2) - 2015-11-27
- [1.3.1](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fblockchain%401.2.0...%40ethereumjs%2Fblockchain%401.3.1) - 2015-10-23
- 1.2.0 - 2015-10-01
