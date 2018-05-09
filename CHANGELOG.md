# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) 
(modification: no type change headlines) and this project adheres to 
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).


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





