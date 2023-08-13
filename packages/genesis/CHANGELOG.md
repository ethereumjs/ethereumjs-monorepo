# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 0.1.0 - 2023-08-09

Final release version from the breaking release round from Summer 2023 on the EthereumJS libraries, thanks to the whole team for this amazing accomplishment! ❤️ 🥳

See [RC1 release notes](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fgenesis%400.1.0-rc.1) for the main change description.

## 0.1.0-rc.1 - 2023-07-18

Initial release.

This package contains all genesis state files (currently for Goerli, Mainnet and Sepolia) previously included in the `@ethereumjs/blockchain` package, see PR [#2768](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2768), [#2815](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2815 and [#2886](https://github.com/ethereumjs/ethereumjs-monorepo/pull/2886)) for package introduction.

This is to reduce bundle and distribution sizes for other packages, mainly Blockchain, EVM and VM, since genesis state information (particularly the large Mainnet state) is often not necessary for large parts of API usage.
