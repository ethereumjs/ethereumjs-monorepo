# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) 
(modification: no type change headlines) and this project adheres to 
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## [5.1.3] - 2018-01-03
- ``ES6`` syntax updates
- Dropped Node ``5`` support
- Moved babel to dev dependencies, switched to ``env`` preset
- Usage of ``safe-buffer`` instead of Node ``Buffer``
- Do not allow capital ``0X`` as valid address in ``isValidAddress()``
- New methods ``zeroAddress()`` and ``isZeroAddress()``
- Updated dependencies

[5.1.3]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.1.2...v5.1.3

## [5.1.2] - 2017-05-31
- Add browserify for ``ES2015`` compatibility
- Fix hex validation

[5.1.2]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.1.1...v5.1.2

## [5.1.1] - 2017-02-10
- Use hex utils from ``ethjs-util``
- Move secp vars into functions
- Dependency updates

[5.1.1]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.1.0...v5.1.1

## [5.1.0] - 2017-02-04
- Fix ``toRpcSig()`` function
- Updated Buffer creation (``Buffer.from``)
- Dependency updates
- Fix npm error
- Use ``keccak`` package instead of ``keccakjs``
- Helpers for ``eth_sign`` RPC call

[5.1.0]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.0.1...v5.1.0

## [5.0.1] - 2016-11-08
- Fix ``bufferToHex()``

[5.0.1]: https://github.com/ethereumjs/ethereumjs-util/compare/v5.0.0...v5.0.1

## [5.0.0] - 2016-11-08
- Added ``isValidSignature()`` (ECDSA signature validation)
- Change ``v`` param in ``ecrecover()`` from ``Buffer`` to ``int`` (breaking change!)
- Fix property alias for setting with initial parameters
- Reject invalid signature lengths for ``fromRpcSig()``
- Fix ``sha3()`` ``width`` param (byte -> bit)
- Fix overflow bug in ``bufferToInt()``

[5.0.0]: https://github.com/ethereumjs/ethereumjs-util/compare/v4.5.0...v5.0.0

## [4.5.0] - 2016-17-12
- Introduced ``toMessageSig()`` and ``fromMessageSig()``

[4.5.0]: https://github.com/ethereumjs/ethereumjs-util/compare/v4.4.1...v4.5.0

## Older releases:

- [4.4.1](https://github.com/ethereumjs/ethereumjs-util/compare/v4.4.0...v4.4.1) - 2016-05-20
- [4.4.0](https://github.com/ethereumjs/ethereumjs-util/compare/v4.3.1...v4.4.0) - 2016-04-26
- [4.3.1](https://github.com/ethereumjs/ethereumjs-util/compare/v4.3.0...v4.3.1) - 2016-04-25
- [4.3.0](https://github.com/ethereumjs/ethereumjs-util/compare/v4.2.0...v4.3.0) - 2016-03-23
- [4.2.0](https://github.com/ethereumjs/ethereumjs-util/compare/v4.1.0...v4.2.0) - 2016-03-18
- [4.1.0](https://github.com/ethereumjs/ethereumjs-util/compare/v4.0.0...v4.1.0) - 2016-03-08
- [4.0.0](https://github.com/ethereumjs/ethereumjs-util/compare/v3.0.0...v4.0.0) - 2016-02-02
- [3.0.0](https://github.com/ethereumjs/ethereumjs-util/compare/v2.0.0...v3.0.0) - 2016-01-20