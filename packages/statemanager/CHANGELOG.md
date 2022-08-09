# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 1.0.0-beta.2 - 2022-07-15

Beta 2 release for the upcoming breaking release round on the [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries, see the Beta 1 release notes ([CHANGELOG](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/CHANGELOG.md)) for the main change set description.

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

### Removed Default Imports in this Library

The main `DefaultStateManager` class import has been updated, so import changes from:

```typescript
import DefaultStateManager from '@ethereumjs/statemanager'
```

to:

```typescript
import { DefaultStateManager } from '@ethereumjs/statemanager'
```

## Other Changes

- Added `ESLint` strict boolean expressions linting rule, PR [#2030](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2030)

## 1.0.0-beta.1 - 2022-06-30

This release is part of a larger breaking release round where all [EthereumJS monorepo](https://github.com/ethereumjs/ethereumjs-monorepo) libraries (VM, Tx, Trie, other) get major version upgrades. This round of releases has been prepared for a long time and we are really pleased with and proud of the result, thanks to all team members and contributors who worked so hard and made this possible! 🙂 ❤️

We have gotten rid of a lot of technical debt and inconsistencies and removed unused functionality, renamed methods, improved on the API and on TypeScript typing, to name a few of the more local type of refactoring changes. There are also broader structural changes like a full transition to native JavaScript `BigInt` values as well as various somewhat deep-reaching refactorings, both within a single package as well as some reaching beyond the scope of a single package. Also two completely new packages - `@ethereumjs/evm` (in addition to the existing `@ethereumjs/vm` package) and `@ethereumjs/statemanager` - have been created, leading to a more modular Ethereum JavaScript VM.

We are very much confident that users of the libraries will greatly benefit from the changes being introduced. However - along the upgrade process - these releases require some extra attention and care since the changeset is both so big and deep reaching. We highly recommend to closely read the release notes, we have done our best to create a full picture on the changes with some special emphasis on delicate code and API parts and give some explicit guidance on how to upgrade and where problems might arise!

So, enjoy the releases (this is a first round of Beta releases, with final releases following a couple of weeks after if things go well)! 🎉

The EthereumJS Team

### New Package

The `StateManager` has been extracted from the `VM` and is now a separate package, see PR [#1817](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1817). The new package can be installed separately with:

```shell
npm i @ethereumjs/statemanager
```

The `@ethereumjs/vm` package still has this package added as a dependency and it is automatically integrated. The `StateManager` provides a high-level interface to an underlying state storage solution. This is classically a `Trie` (in our case: an `@ethereumjs/trie`) instance, but can also be something else, e.g. a plain database, an underlying RPC connection or a Verkle Tree in the future.

The extraction of this module allows to easier customize a `StateManager` and provide or use your own implementations in the future. It is now also possible to use the `StateManager` standalone for high-level state access in a non-VM context.

A `StateManager` must adhere to a predefined interface `StateManager` and implement a certain set of state access methods like `getAccount()`, `putContractCode()`,... Such an implementation is then guaranteed to work e.g. in the `@ethereumjs/vm` implementation.

### StateManager Refactoring

Along with the package extraction parts of the old `StateManager` has also been reworked. So if you are building on the old `StateManager` class/interface it is likely not enough to just change on the import statement but do some adjustments to get things working. Here is a summary of the changes.

Methods added:

- `flush()`

Methods removed:

- `touchAccount()` (EVM-specific, remained in `EVMStateAccess` interface in EVM)
- All methods from `EIP2929StateManager` (removed as separate interface) (EVM-specific, remained in `EVMStateAccess` interface in EVM)
- `getOriginalContractStorage()` (EVM-specific, remained in `EVMStateAccess` interface in EVM)
- `hasGenesisState()` (removed)
- `generateGenesis()` (removed)
- `generateCanonicalGenesis()` (EVM-specific, remained in `EVMStateAccess` interface in EVM)
- `cleanupTouchedAccounts()` (EVM-specific, remained in `EVMStateAccess` interface in EVM)
- `clearOriginalStorageCache()` (EVM-specific, remained in `EVMStateAccess` interface in EVM)

Other Changes:

- New partial parent interface `StateAccess` with just the access focused functionality

So overall the `StateManager` interface got a lot leaner requiring fewer methods to be implemented which should make an implementation and/or adoption a lot easier.

The `StateManager` package ships with a Trie-based `StateManager` implementation extending from a `BaseStateManager` which might be a suitable starting point for your own implementations. This will very much depend on the specific needs though.

### BigInt Introduction / ES2020 Build Target

With this round of breaking releases the whole EthereumJS library stack removes the [BN.js](https://github.com/indutny/bn.js/) library and switches to use native JavaScript [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) values for large-number operations and interactions.

This makes the libraries more secure and robust (no more BN.js v4 vs v5 incompatibilities) and generally comes with substantial performance gains for the large-number-arithmetic-intense parts of the libraries (particularly the VM).

To allow for BigInt support our build target has been updated to [ES2020](https://262.ecma-international.org/11.0/). We feel that some still remaining browser compatibility issues on the edges (old Safari versions e.g.) are justified by the substantial gains this step brings along.

See [#1671](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1671) and [#1771](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1771) for the core `BigInt` transition PRs.

### Disabled esModuleInterop and allowSyntheticDefaultImports TypeScript Compiler Options

The above TypeScript options provide some semantic sugar like allowing to write an import like `import React from "react"` instead of `import * as React from "react"`, see [esModuleInterop](https://www.typescriptlang.org/tsconfig#esModuleInterop) and [allowSyntheticDefaultImports](https://www.typescriptlang.org/tsconfig#allowSyntheticDefaultImports) docs for some details.

While this is convenient, it deviates from the ESM specification and forces downstream users into using these options, which might not be desirable, see [this TypeScript Semver docs section](https://www.semver-ts.org/#module-interop) for some more detailed argumentation.

Along with the breaking releases we have therefore deactivated both of these options and you might therefore need to adapt some import statements accordingly. Note that you still can activate these options in your bundle and/or transpilation pipeline (but now you also have the option _not_ to, which you didn't have before).
