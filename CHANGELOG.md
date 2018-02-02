# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) 
(modification: no type change headlines) and this project adheres to 
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.3.3] - 2018-02-02

- Reworked memory expansion/access for opcodes, PR [#174](https://github.com/ethereumjs/ethereumjs-vm/pull/174) (fixes consensus bugs on
  large numbers >= 53 bit for opcodes using memory location)
- Keep stack items as bn.js instances (arithmetic performance increases), PRs [#159](https://github.com/ethereumjs/ethereumjs-vm/pull/159), [#254](https://github.com/ethereumjs/ethereumjs-vm/pull/254) and [#256](https://github.com/ethereumjs/ethereumjs-vm/pull/256)
- More consistent VM error handling, PR [#219](https://github.com/ethereumjs/ethereumjs-vm/pull/219)
- Validate stack items after operations, PR [#222](https://github.com/ethereumjs/ethereumjs-vm/pull/222)
- Updated ``ethereumjs-util`` dependency from ``4.5.0`` to ``5.1.x``, PR [#241](https://github.com/ethereumjs/ethereumjs-vm/pull/241)
- Fixed child contract deletion bug, PR [#246](https://github.com/ethereumjs/ethereumjs-vm/pull/246)
- Fixed a bug associated with direct stack usage, PR [#240](https://github.com/ethereumjs/ethereumjs-vm/pull/240)
- Fix error on large return fees, PR [#235](https://github.com/ethereumjs/ethereumjs-vm/pull/235)
- Various bug fixes

[2.3.3]: https://github.com/ethereumjs/ethereumjs-vm/compare/v2.3.2...v2.3.3

## [2.3.2] - 2017-10-29
- Better handling of ``rustbn.js`` exceptions
- Fake (default if non-provided) blockchain fixes
- Testing improvements (separate skip lists)
- Minor optimizations and bug fixes

[2.3.2]: https://github.com/ethereumjs/ethereumjs-vm/compare/v2.3.1...v2.3.2

## [2.3.1] - 2017-10-11
- ``Byzantium`` compatible
- New opcodes ``REVERT``, ``RETURNDATA`` and ``STATICCALL``
- Precompiles for curve operations and bigint mod exp
- Transaction return data in receipts
- For detailed list of changes see PR [#161](https://github.com/ethereumjs/ethereumjs-vm/pull/161) 
- For a ``Spurious Dragon``/``EIP 150`` compatible version of this library install latest version of ``2.2.x``

[2.3.1]: https://github.com/ethereumjs/ethereumjs-vm/compare/v2.2.2...v2.3.1

## [2.3.0] - Version Skipped due to faulty npm release

## [2.2.2] - 2017-09-19
- Fixed [JS number issues](https://github.com/ethereumjs/ethereumjs-vm/pull/168)
  and [certain edge cases](https://github.com/ethereumjs/ethereumjs-vm/pull/188)
- Fixed various smaller bugs and improved code consistency
- Some VM speedups
- Testing improvements
- Narrowed down dependencies for library not to break after Byzantium release

[2.2.2]: https://github.com/ethereumjs/ethereumjs-vm/compare/v2.2.1...v2.2.2

## [2.2.1] - 2017-08-04
- Fixed bug prevent the library to be used in the browser

[2.2.1]: https://github.com/ethereumjs/ethereumjs-vm/compare/v2.2.0...v2.2.1

## [2.2.0] - 2017-07-28
- ``Spurious Dragon`` & ``EIP 150`` compatible
- Detailed list of changes in pull requests [#147](https://github.com/ethereumjs/ethereumjs-vm/pull/147) and  [#143](https://github.com/ethereumjs/ethereumjs-vm/pull/143)
- Removed ``enableHomestead`` option when creating a [ new VM object](https://github.com/ethereumjs/ethereumjs-vm#new-vmstatetrie-blockchain) (pre-Homestead fork rules not supported any more)

[2.2.0]: https://github.com/ethereumjs/ethereumjs-vm/compare/v2.1.0...v2.2.0

## [2.1.0] - 2017-06-28
- Homestead compatible
- update state test runner for General State Tests

[2.1.0]: https://github.com/ethereumjs/ethereumjs-vm/compare/v2.0.1...v2.1.0

## Older releases:

- [2.0.1](https://github.com/ethereumjs/ethereumjs-vm/compare/v2.0.0...v2.0.1) - 2016-10-31
- [2.0.0](https://github.com/ethereumjs/ethereumjs-vm/compare/v1.4.0...v2.0.0) - 2016-09-26
- [1.4.0](https://github.com/ethereumjs/ethereumjs-vm/compare/v1.3.0...v1.4.0) - 2016-05-20
- [1.3.0](https://github.com/ethereumjs/ethereumjs-vm/compare/v1.2.2...v1.3.0) - 2016-04-02
- [1.2.2](https://github.com/ethereumjs/ethereumjs-vm/compare/v1.2.1...v1.2.2) - 2016-03-31
- [1.2.1](https://github.com/ethereumjs/ethereumjs-vm/compare/v1.2.0...v1.2.1) - 2016-03-03
- [1.2.0](https://github.com/ethereumjs/ethereumjs-vm/compare/v1.1.0...v1.2.0) - 2016-02-27
- [1.1.0](https://github.com/ethereumjs/ethereumjs-vm/compare/v1.0.4...v1.1.0) - 2016-01-09
- [1.0.4](https://github.com/ethereumjs/ethereumjs-vm/compare/v1.0.3...v1.0.4) - 2015-12-18
- [1.0.3](https://github.com/ethereumjs/ethereumjs-vm/compare/v1.0.0...v1.0.3) - 2015-11-27
- 1.0.0 - 2015-10-06
