# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 10.0.0-dev-rc.1 - 2025-03-24

This is the first (and likely the last) round of `RC` releases for the upcoming breaking releases, following the `alpha` releases from October 2024. The releases are somewhat delayed (sorry for that), but final releases can now be expected very very soon, to be released once the Ethereum [Pectra](https://eips.ethereum.org/EIPS/eip-7600) hardfork is scheduled for mainnet and all EIPs are fully finalized. Pectra will then also be the default hardfork setting for all EthereumJS libraries.

### New Versioning Scheme

This breaking release round will come with a new versioning scheme (thanks to @paulmillr for the [suggestion](https://github.com/ethereumjs/ethereumjs-monorepo/issues/3748)), aligning the package numbers on breaking releases for all EthereumJS packages. This will make it easier to report bugs ("bug happened on EthereumJS version 10 releases"), reason about release series and make library compatibility more transparent and easier to grasp.

As a start we bump all major release versions to version 10, these `RC` releases are the first to be released with the new versioning scheme.

**Note: This is the initial developer release of a binary tree package. While we also directly bump the binarytree package version for consistency reasons please be aware that this package is still in a very early stage and not production ready!**
