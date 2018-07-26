# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) 
(modification: no type change headlines) and this project adheres to 
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.4.0] - 2018-07-27

With the ``2.4.x`` release series we now start to gradually add ``Constantinople`` features with the
bitwise shifting instructions from [EIP 145](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-145.md)
making the start being introduced in the ``v2.4.0`` release.

Since both the scope of the ``Constantinople`` hardfork as well as the state of at least some of the EIPs
to be included are not yet finalized, this is only meant for ``EXPERIMENTAL`` purposes, e.g. for developer
tools to give users early access and make themself familiar with dedicated features.

Once scope and EIPs from ``Constantinople`` are final we will target a ``v2.5.0`` release which will officially
introduce ``Constantinople`` support with all the changes bundled together.

Note that from this release on we also introduce new ``chain`` (default: ``mainnet``) and ``hardfork`` 
(default: ``byzantium``) initialization parameters, which make use of our new [ethereumjs-common](https://github.com/ethereumjs/ethereumjs-common) library and in the future will allow
for parallel hardfork support from ``Byzantium`` onwards.

Since ``hardfork`` default might be changed or dropped in future releases, you might want to explicitly
set this to ``byzantium`` on your next update to avoid future unexpected behavior.

All the changes from this release:

**FEATURES/FUNCTIONALITY**

- Improved chain and fork support, see PR [#304](https://github.com/ethereumjs/ethereumjs-vm/pull/304)
- Support for the ``Constantinople`` bitwise shifiting instructions ``SHL``, ``SHR`` and ``SAR``, see PR [#251](https://github.com/ethereumjs/ethereumjs-vm/pull/251)
- New ``newContract`` event which can be used to do interrupting tasks on contract/address creation, see PR [#306](https://github.com/ethereumjs/ethereumjs-vm/pull/306)
- Alignment of behavior of bloom filter hashing to go along with mainnet compatible clients *BREAKING*, see PR [#295](https://github.com/ethereumjs/ethereumjs-vm/pull/295) 

**UPDATES/TESTING**

- Usage of the latest ``rustbn.js`` API, see PR [#312](https://github.com/ethereumjs/ethereumjs-vm/pull/312)
- Some cleanup in precompile error handling, see PR [#318](https://github.com/ethereumjs/ethereumjs-vm/pull/318)
- Some cleanup for ``StateManager``, see PR [#266](https://github.com/ethereumjs/ethereumjs-vm/pull/266)
- Renaming of ``util.sha3`` usages to ``util.keccak256`` and bump ``ethereumjs-util`` to ``v5.2.0`` (you should do to if you use ``ethereumjs-util``)
- Parallel testing of the``Byzantium`` and ``Constantinople`` state tests, see PR [#317](https://github.com/ethereumjs/ethereumjs-vm/pull/317)
- For lower build times our CI configuration now runs solely on ``CircleCI`` and support for ``Travis`` have been dropped, see PR [#316](https://github.com/ethereumjs/ethereumjs-vm/pull/316)

**BUG FIXES**

- Programmatic runtime errors in the VM execution context (within an opcode) are no longer absorbed and displayed as a VMError but explicitly thrown, allowing for easier discovery of implementation bugs, see PR [#307](https://github.com/ethereumjs/ethereumjs-vm/pull/307)
- Fix of the ``Bloom.check()`` method not working properly, see PR [#311](https://github.com/ethereumjs/ethereumjs-vm/pull/311)
- Fix a bug when ``REVERT`` is used within a ``CREATE`` context, see PR [#297](https://github.com/ethereumjs/ethereumjs-vm/pull/297)
- Fix a bug in ``FakeBlockChain`` error handing, see PR [#320](https://github.com/ethereumjs/ethereumjs-vm/pull/320)

[2.4.0]: https://github.com/ethereumjs/ethereumjs-vm/compare/v2.3.5...v2.4.0

## [2.3.5] - 2018-04-25

- Fixed ``BYTE`` opcode return value bug, PR [#293](https://github.com/ethereumjs/ethereumjs-vm/pull/293)
- Clean up touched-accounts management in ``StateManager``, PR [#287](https://github.com/ethereumjs/ethereumjs-vm/pull/287)
- New ``stateManager.copy()`` function, PR [#276](https://github.com/ethereumjs/ethereumjs-vm/pull/276)
- Updated Circle CI configuration to 2.0 format, PR [#292](https://github.com/ethereumjs/ethereumjs-vm/pull/292)

[2.3.5]: https://github.com/ethereumjs/ethereumjs-vm/compare/v2.3.4...v2.3.5

## [2.3.4] - 2018-04-06

- Support of external statemanager in VM constructor (experimental), PR [#264](https://github.com/ethereumjs/ethereumjs-vm/pull/264)
- ``ES5`` distribution on npm for better toolchain compatibility, PR [#281](https://github.com/ethereumjs/ethereumjs-vm/pull/281)
- ``allowUnlimitedContractSize`` VM option for debugging purposes, PR [#282](https://github.com/ethereumjs/ethereumjs-vm/pull/282)
- Added ``gasRefund`` to transaction results, PR [#284](https://github.com/ethereumjs/ethereumjs-vm/pull/284)
- Test coverage / coveralls support for the library, PR [#270](https://github.com/ethereumjs/ethereumjs-vm/pull/270)
- Properly calculate totalgas for large return values, PR [#275](https://github.com/ethereumjs/ethereumjs-vm/pull/275)
- Improve iterateVm check output after step hook, PR [#279](https://github.com/ethereumjs/ethereumjs-vm/pull/279)

[2.3.4]: https://github.com/ethereumjs/ethereumjs-vm/compare/v2.3.3...v2.3.4

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
