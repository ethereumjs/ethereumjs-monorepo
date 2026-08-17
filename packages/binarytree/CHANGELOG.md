# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 10.1.2 - 2026-05-29

### Release round overview

Welcome to **`10.1.2`** — a coordinated release across all active `@ethereumjs/*` libraries on the **`10.1.x`** line. If you have been following the upcoming Amsterdam hardfork, this is our **first experimental preview** ready to try out: a largely complete **nine-EIP `Hardfork.Amsterdam` bundle**, currently aligned with [tests-bal@v7.1.0](https://github.com/ethereum/execution-specs/releases/tag/tests-bal@v7.1.0) and [BAL devnet-7](https://notes.ethereum.org/@ethpandaops/bal-devnet-7).

Amsterdam is still in flux — **please do not use this in production yet** — and we expect further **`10.1.x`** releases as the spec and official tests evolve. The sections below cover **this package only**; for the full fork picture (EIP list, examples, release ↔ spec tracking), see the [@ethereumjs/vm Amsterdam overview](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#amsterdam-hardfork-experimental). On Osaka or earlier hardforks? Nothing changes unless you explicitly select `Hardfork.Amsterdam`.

### `@ethereumjs/binarytree`

`@ethereumjs/binarytree` implements the binary trie structure used by certain state-manager code paths (Verkle-adjacent experiments and specialized backends). Amsterdam work in the `10.1.2` round focused on the Merkle + BAL execution path; binarytree bumps in version only to keep the monorepo on a uniform `@ethereumjs/*` dependency line. No public API changes.

## 10.1.1 - 2025-01-28

- Deprecate Node.js 18 support, minimum Node.js version is now 20, see PR [#4180](https://github.com/ethereumjs/ethereumjs-monorepo/pull/4180)
- Add Node.js 24 support, see PR [#4194](https://github.com/ethereumjs/ethereumjs-monorepo/pull/4194)
- Dependency update: `@noble/hashes` to v2, see PR [#4184](https://github.com/ethereumjs/ethereumjs-monorepo/pull/4184)

## 10.1.0 - 2025-11-06

Maintenance release, no active changes.

## 10.0.0 (EXPERIMENTAL) - 2025-04-29

**Note:** This library is in an **experimental** stage and should not be used in production!

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

**Note: This is the initial developer release of a binary tree package. While we also directly bump the binarytree package version for consistency reasons please be aware that this package is still in a very early stage and not production ready!**
