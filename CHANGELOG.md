# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) 
(modification: no type change headlines) and this project adheres to 
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).


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





