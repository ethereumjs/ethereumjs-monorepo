# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) 
(modification: no type change headlines) and this project adheres to 
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## [0.6.1] - 2018-11-28
- Experimental support for the [Goerli](https://github.com/goerli/testnet) cross-client ``PoA`` testnet (``chains/goerli.json``), see PR [#31](https://github.com/ethereumjs/ethereumjs-common/pull/31)
- Unified hex-prefixing (so always prefixing with ``0x``) of account addresses in genesis files (fixes an issue with state root computation on other libraries), see PR [#32](https://github.com/ethereumjs/ethereumjs-common/issues/32)

[0.6.1]: https://github.com/ethereumjs/ethereumjs-common/compare/v0.6.0...v0.6.1

## [0.6.0] - 2018-10-11
Parameter support for the ``Constantinople`` hardfork (see ``hardforks/constantinople.json``):
- Added ``SSTORE`` gas/refund prices (``EIP-1283``), PR [#27](https://github.com/ethereumjs/ethereumjs-common/pull/27)
- Added Block Reward Adjustment (``EIP-1234``), PR [#26](https://github.com/ethereumjs/ethereumjs-common/pull/26)

[0.6.0]: https://github.com/ethereumjs/ethereumjs-common/compare/v0.5.0...v0.6.0

## [0.5.0] - 2018-08-27
- Introduces **support for private chains** by allowing to pass a custom dictionary as the ``chain`` parameter
  in the constructor or the ``setChain()`` method as an alternative to just passing one of the predefined
  ``chain`` ``String`` names (e.g. ``mainnet``, ``ropsten``), PR [#24](https://github.com/ethereumjs/ethereumjs-common/pull/24)

[0.5.0]: https://github.com/ethereumjs/ethereumjs-common/compare/v0.4.1...v0.5.0

## [0.4.1] - 2018-08-13
- Added ``timestamp`` field to genesis definitions in chain files, set for ``Rinkeby`` and ``null`` for other chains, PR [#21](https://github.com/ethereumjs/ethereumjs-common/pull/21)
- Updated ``Ropsten`` bootstrap nodes, PR [#20](https://github.com/ethereumjs/ethereumjs-common/pull/20)

[0.4.1]: https://github.com/ethereumjs/ethereumjs-common/compare/v0.4.0...v0.4.1

## [0.4.0] - 2018-06-20
- Remove leftover ...Gas postfix for some gas prices (e.g. ``ecAddGas`` -> ``ecAdd``) to
  be consistent with overall gas price naming

[0.4.0]: https://github.com/ethereumjs/ethereumjs-common/compare/v0.3.1...v0.4.0

## [0.3.1] - 2018-05-28
- Added two alias functions ``activeOnBlock()`` and ``gteHardfork()`` when hardfork is set for convenience, PR [#15](https://github.com/ethereumjs/ethereumjs-common/pull/15)
- Added option to dynamically choose genesis state (see ``README``), PR [#15](https://github.com/ethereumjs/ethereumjs-common/pull/15)

[0.3.1]: https://github.com/ethereumjs/ethereumjs-common/compare/v0.3.0...v0.3.1

## [0.3.0] - 2018-05-25
- Allow functions like ``hardforkIsActiveOnBlock()`` - where hardfork is provided as param - also to be run on hardfork set for greater flexibility/comfort, PR [#13](https://github.com/ethereumjs/ethereumjs-common/pull/13)
- New ``hardforkGteHardfork()`` method for HF order comparisons, PR [#13](https://github.com/ethereumjs/ethereumjs-common/pull/13)

[0.3.0]: https://github.com/ethereumjs/ethereumjs-common/compare/v0.2.0...v0.3.0

## [0.2.0] - 2018-05-14
- New optional initialization parameter ``allowedHardforks``,  this allows for cleaner client
library implementations by preventing undefined behaviour, PR [#10](https://github.com/ethereumjs/ethereumjs-common/pull/10)
- Added ``activeHardfork()`` function to get latest active HF for chain or block, PR [#11](https://github.com/ethereumjs/ethereumjs-common/pull/11)

[0.2.0]: https://github.com/ethereumjs/ethereumjs-common/compare/v0.1.1...v0.2.0

## [0.1.1] - 2018-05-09
- Remove dynamic require to prevent browserify issue, PR [#8](https://github.com/ethereumjs/ethereumjs-common/pull/8)

[0.1.1]: https://github.com/ethereumjs/ethereumjs-common/compare/v0.1.0...v0.1.1

## [0.1.0] - 2018-05-09
- Initial version, this library succeeds the [ethereum/common](https://github.com/ethereumjs/common/issues/12)
  library, being more future-proof through a better structured design
  
Features:
- Easy chain-/HF-based parameter access
- No parameter changes on library updates (``c.param('gasPrices', 'ecAddGas', 'byzantium')`` will always return the same value)
- Ease experimentation/research by allowing to include future HF parameters (already included as draft: ``constantinople`` and ``hybridCasper``) without breaking current installations
- Improved structure for parameter access (mainly through topics like ``gasPrices``, ``pow``, ``sharding``) for better readability/developer overview
- See [README](https://github.com/ethereumjs/ethereumjs-common) and [API Docs](https://github.com/ethereumjs/ethereumjs-common/blob/master/docs/index.md) for a more in-depth feature overview and usage instructions

[0.1.0]: https://github.com/ethereumjs/ethereumjs-common/compare/6d0df89...v0.1.0





