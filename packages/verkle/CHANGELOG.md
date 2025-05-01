# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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

**Note: while we also bump the verkle package version for consistency reasons please be aware that this package is still in an experimental stage and not yet production ready!**

### EthereumJS-wide Error Objects

We have done preparations to allow for handling specific error sub types in the future by introducing a monorepo-wide `EthereumJSError` error class in the `@ethereumjs/util` package, see PR [#3879](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3879). This error is thrown for all error cases within the monorepo and can be specifically handled by comparing with `instanceof EthereumJSError`.

We will introduce a set of more specific sub error classes inheriting from this generic type in upcoming minor releases, and so keeping things fully backwards compatible. This will allow for a more specific and robust handling of errors thrown by EthereumJS libraries.

### Changes

- Switch to JS (`micro-eth-signer`) for verkle cryptography, PR [#3785](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3785)
- Read verkle crypto through common `customCrypto`, PRs [#3790](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3790) and [#3797](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3797)
- Improvements to verkle tree instantiation, PR [#3768](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3768)
- Fix handling of storage values, PR [#3778](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3778)
- Rewrite `chunkifyCode` (Util package), PR [#3798](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3798)

## 0.2.0-alpha.1 - 2024-10-17

We are getting there! 😁 While still in an experimental stage this release makes a big leap towards stateful Verkle-based EVM execution, by applying various updates and aligning with a new experimental `StatefulVerkleStateManager`.

- Use node hash as db key, PR [#3472](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3472)
- Apply leaf marker on all touched values, PR [#3520](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3520)
- Proof function renaming (e.g. `createProof()` -> `createVerkleProof()`), PR [#3557](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3557)
- Refactor trie and verkle utils, PR [#3600](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3600)
- Add and integrate `StatefulVerkleStateManager`, PR [#3628](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3628)
- Various Verkle Fixes, PR [#3650](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3650)

## 0.1.0 - 2024-08-15

This is the first (still experimental) Verkle library release with some basic `put()` and `get()` functionality working! 🎉 Still highly moving and evolving parts, but early experiments and feedback welcome!

- Kaustinen6 adjustments, `verkle-cryptography-wasm` migration, PRs [#3355](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3355) and [#3356](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3356)
- Move tree key computation to verkle and simplify, PR [#3420](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3420)
- Rename code keccak, PR [#3426](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3426)
- Add tests for verkle bytes helper, PR [#3441](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3441)
- Verkle decoupling, PR [#3462](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3462)
- Rename verkle utils and refactor, PR [#3468](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3468)
- Optimize storage of default values in VerkleNode, PR [#3476](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3476)
- Build out trie processing, PR [#3430](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3430)
- Implement `trie.put()`, PR [#3473](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3473)
- Add `trie.del()`, PR [#3486](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3486)

## 0.0.2 - 2024-03-18

- Fix a type error related to the `lru-cache` dependency, PR [#3285](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3285)
- Downstream dependency updates, see PR [#3297](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3297)

## 0.0.1 - 2023-10-15

- Initial development release
