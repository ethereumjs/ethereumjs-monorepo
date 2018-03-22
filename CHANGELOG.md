# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) 
(modification: no type change headlines) and this project adheres to 
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## [2.5.0] - 2018-03-22
- Light client protocol (``LES/2``) implementation, PR [#21](https://github.com/ethereumjs/ethereumjs-devp2p/pull/21)
- ``LES/2`` usage example, see: ``examples/peer-communication-les.js`` 
- Better test coverage for upper-layer protocols (``ETH``, ``LES/2``), PR [#34](https://github.com/ethereumjs/ethereumjs-devp2p/pull/34)

[2.5.0]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.4.0...v2.5.0

## [2.4.0] - 2018-02-28
- First release providing a reliable ``ETH`` connection
- Fix Parity ``DPT`` ping echo hash bug preventing the library to connect
  to Parity clients, PR [#32](https://github.com/ethereumjs/ethereumjs-devp2p/pull/32)
- Fixed a bug not setting weHello in peer after sent ``HELLO`` msg

[2.4.0]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.3.0...v2.4.0

## [2.3.0] - 2018-02-27
- Fix critical ``RLPX`` bug leading to not processing incoming ``EIP-8`` ``Auth`` or ``Ack`` messages, PR [#26](https://github.com/ethereumjs/ethereumjs-devp2p/pull/26)
- Fix bug not forwarding ``k-bucket`` remove event through ``DPT`` (so ``peer:removed`` from
  ``DPT`` was not working), PR [#27](https://github.com/ethereumjs/ethereumjs-devp2p/pull/27)
- Fix updating ``ingressMac`` with wrong ``Auth`` msg leading to diverging ``Mac`` hashes, PR [#29](https://github.com/ethereumjs/ethereumjs-devp2p/pull/29)
- Fix bug not let first ``ETH`` ``status`` message emit a ``message`` event, PR [#30](https://github.com/ethereumjs/ethereumjs-devp2p/pull/30)
- Large rework of the test setup, additional ``DPT``, ``RLPX`` and ``ETH`` simulator tests,
  improving test coverage from 48% to 84%, PR [#25](https://github.com/ethereumjs/ethereumjs-devp2p/pull/25)

[2.3.0]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.2.0...v2.3.0

## [2.2.0] - 2017-12-07
- ``EIP-8`` compatibility
- Improved debug messages
- Fixes a bug on DPT ping timeout being triggered even if pong message is received
- Only send connect event after both HELLO msgs are exchanged (fixes unreliable upper-protocol communication start)
- Connection reliability improvements for ``peer-communication`` example
- API documentation

[2.2.0]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.1.3...v2.2.0

## [2.1.3] - 2017-11-09
- Dependency updates
- Improved README documentation

[2.1.3]: https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.1.2...v2.1.3

## Older releases:

- [2.1.2](https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.1.1...v2.1.2) - 2017-05-16
- [2.1.1](https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.1.0...v2.1.1) - 2017-04-27
- [2.1.0](https://github.com/ethereumjs/ethereumjs-devp2p/compare/v2.0.0...v2.1.0) - 2016-12-11
- [2.0.0](https://github.com/ethereumjs/ethereumjs-devp2p/compare/v1.0.0...v2.0.0) - 2016-11-14
- 1.0.0 - 2016-10-18




