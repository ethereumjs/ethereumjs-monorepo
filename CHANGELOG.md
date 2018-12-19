# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) 
(modification: no type change headlines) and this project adheres to 
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## [0.6.3] - 2018-12-19
- Fixed installation errors for certain packaging tools, PR [#67](https://github.com/ethereumjs/ethereumjs-wallet/pull/67)
- Remove dependency on ``crypto.randomBytes`` and use ``randombytes`` package instead, PR [#63](https://github.com/ethereumjs/ethereumjs-wallet/pull/63)
- Add comprehensive test coverage for ``fromV3``, PR [#62](https://github.com/ethereumjs/ethereumjs-wallet/pull/62)
- Remove excess parameter from ``decipherBuffer`` usage, PR [#77](https://github.com/ethereumjs/ethereumjs-wallet/pull/77)
- Update dependencies, including a fixed ``scrypt.js``, which should resolve more installation issues, PR [#78](https://github.com/ethereumjs/ethereumjs-wallet/pull/78)

[0.6.3]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.6.2...v0.6.3

## [0.6.2] - 2018-08-08
- [PLEASE UPDATE!] Fixes a critical import bug introduced in ``v0.6.1`` accidentally
  changing the import path for the different submodules, see PR [#65](https://github.com/ethereumjs/ethereumjs-wallet/pull/65)

[0.6.2]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.6.1...v0.6.2

## [0.6.1] - 2018-07-28 [DEPRECATED]
- Added support for vanity address generation, PR [#5](https://github.com/ethereumjs/ethereumjs-wallet/pull/5)
- Fixed typo in provider-engine, PR [#16](https://github.com/ethereumjs/ethereumjs-wallet/pull/16)
- Accept the true range of addresses for ICAP direct, PR [#6](https://github.com/ethereumjs/ethereumjs-wallet/pull/6)
- Switched to babel ES5 build, PR [#37](https://github.com/ethereumjs/ethereumjs-wallet/pull/37)
- Improve test coverage (at 88% now), PR [#27](https://github.com/ethereumjs/ethereumjs-wallet/pull/27)
- Various dependency updates, PR [#25](https://github.com/ethereumjs/ethereumjs-wallet/pull/25)

[0.6.1]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.6.0...v0.6.1

## [0.6.0] - 2016-04-27
- Added provider-engine integration, PR [#7](https://github.com/ethereumjs/ethereumjs-wallet/pull/7)

[0.6.0]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.5.2...v0.6.0

## [0.5.2] - 2016-04-25
- Dependency updates

[0.5.2]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.5.1...v0.5.2

## [0.5.1] - 2016-03-26
- Bugfix for ``EthereumHDKey.privateExtendedKey()``
- Added travis and coveralls support
- Documentation and test improvements

[0.5.1]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.5.0...v0.5.1

## [0.5.0] - 2016-03-23
- Support HD keys using ``cryptocoinjs/hdkey``
- Ensure private keys are valid according to the curve
- Support instantation with public keys
- Support importing BIP32 xpub/xpriv
- Only support Ethereum keys internally, non-strict mode for importing compressed ones
- Thirdparty API doc improvements

[0.5.0]: https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.4.0...v0.5.0

## Older releases:

- [0.4.0](https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.3.0...v0.4.0) - 2016-03-16
- [0.3.0](https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.2.1...v0.3.0) - 2016-03-09
- [0.2.1](https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.2.0...v0.2.1) - 2016-03-07
- [0.2.0](https://github.com/ethereumjs/ethereumjs-wallet/compare/v0.1.0...v0.2.0) - 2016-03-07
- 0.1.0 - 2016-02-23
