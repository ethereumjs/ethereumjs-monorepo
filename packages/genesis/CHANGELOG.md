# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 10.1.0 - 2025-11-06

Maintenance release, no active changes.

## 10.0.0 - 2025-04-29

### Overview

This release is part of the `v10` breaking release round making the `EthereumJS` libraries compatible with the [Pectra](https://eips.ethereum.org/EIPS/eip-7600) hardfork going live on Ethereum `mainnet` on May 7 2025. Beside the hardfork update these releases mark a milestone in our release history since they - for the first time ever - bring the full `Ethereum` protocol stack - including the `EVM` - to the browser without any restrictions anymore, coming along with other substantial updates regarding library security and functionality.

Some highlights:

- 🌴 Introduction of a tree-shakeable API
- 👷🏼 Substantial dependency reduction to a "controlled dependency set" (no more than 10 + `@Noble` crypto)
- 📲 **EIP-7702** readiness
- 🛵 Substantial bundle size reductions for all libraries
- 🏄🏾‍♂️ All libraries now pure JS being WASM-free by default
- 🦋 No more propriatary `Node.js` primitives

So: **All libraries now work in the browser "out of the box"**.

### Release Notes

Major release notes for this release can be found in the `alpha.1` release notes [here](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3722#issuecomment-2792400268), with some additions along with the `RC.1` releases, see [here](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3886#issuecomment-2748966923).

## 10.0.0-rc.1 - 2025-03-24

This is the first (and likely the last) round of `RC` releases for the upcoming breaking releases, following the `alpha` releases from October 2024 (see `alpha` release release notes for full/main change description). The releases are somewhat delayed (sorry for that), but final releases can now be expected very very soon, to be released once the Ethereum [Pectra](https://eips.ethereum.org/EIPS/eip-7600) hardfork is scheduled for mainnet and all EIPs are fully finalized. Pectra will then also be the default hardfork setting for all EthereumJS libraries.

### New Versioning Scheme

This breaking release round will come with a new versioning scheme (thanks to paulmillr for the [suggestion](https://github.com/ethereumjs/ethereumjs-monorepo/issues/3748)), aligning the package numbers on breaking releases for all EthereumJS packages. This will make it easier to report bugs ("bug happened on EthereumJS version 10 releases"), reason about release series and make library compatibility more transparent and easier to grasp.

As a start we bump all major release versions to version 10, these `RC` releases are the first to be released with the new versioning scheme.

## 0.3.0-alpha.1 - 2024-10-17

- Upgrade to TypeScript 5, PR [#3607](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3607)
- Node 22 support, PR [#3669](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3669)
- Upgrade `ethereum-cryptography` to v3, PR [#3668](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3668)

## 0.2.3 - 2024-08-15

Maintenance release with downstream dependency updates, see PR [#3527](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3527)

## 0.2.2 - 2024-03-18

Maintenance release with downstream dependency updates, see PR [#3297](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3297)

## 0.2.1 - 2024-02-08

Maintenance release with dependency updates, see PR [#3261](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3261)

## 0.2.0 - 2023-10-26

### Holesky Testnet Support

This release comes with full support for the [Holesky](https://holesky.ethpandaops.io/) public Ethereum testnet replacing the `Goerli` test network.

- Add Holesky genesis specification, PR [2982](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2982), [#2989](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2989), [#2997](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2997), [#3049](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3049), [#3074](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3074) and [#3088](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3088)

### Other Changes

- Package CI integration, PR [#3098](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3098)

## 0.1.0 - 2023-08-09

Final release version from the breaking release round from Summer 2023 on the EthereumJS libraries, thanks to the whole team for this amazing accomplishment! ❤️ 🥳

See [RC1 release notes](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fgenesis%400.1.0-rc.1) for the main change description.

## 0.1.0-rc.1 - 2023-07-18

Initial release.

This package contains all genesis state files (currently for Goerli, Mainnet and Sepolia) previously included in the `@ethereumjs/blockchain` package, see PR [#2768](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2768), [#2815](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2815 and [#2886](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2886)) for package introduction.

This is to reduce bundle and distribution sizes for other packages, mainly Blockchain, EVM and VM, since genesis state information (particularly the large Mainnet state) is often not necessary for large parts of API usage.
