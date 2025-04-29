# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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

### Changes since `RC.1`

- New package name `@ethereumjs/e2store`, add support for `E2HS` file format, PR [#3954](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3954)


## 10.0.0-rc.1 - 2025-03-24

Initial development release

Features:

- Export history data as Era1
- Read Era1 files which store pre-merge execution layer block history in 8192 block increments (i.e. eras)
- Read Era files which store SSZ encoded signed beacon blocks by era (8192 blocks)

Note: This library is still **experimental** and the API might change along minor release versions!