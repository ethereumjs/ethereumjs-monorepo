# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 0.1.0 - 2024-08-15

This is the first (still experimental) Verkle library release with some basic `put()` and `get()` functionality working! 🎉 Still highly moving and evolving parts, but early experiments and feedback welcome!

- Kaustinen6 adjustments, `verkle-cryptography-wasm` migration, PRs [#3355](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3355) and [#3356](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3356)
- Move tree key computation to verkle and simplify, PR [#3420](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3420)
- Rename code keccak, PR [#3426](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3426)
- Add tests for verkle bytes helper, PR [#3441](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3441)
- Verkle decoupling, PR [#3462](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3462)
- Rename verkle utils and refactor, PR [#3468](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3468)
- Optimize storage of default values in VerkleNode, PR [#3476](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3476)
- Build out trie processing, PR [#3430](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3430)
- Implement `trie.put()`, PR [#3473](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3473)
- Add `trie.del()`, PR [#3486](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3486)

## 0.0.2 - 2024-03-18

- Fix a type error related to the `lru-cache` dependency, PR [#3285](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3285)
- Downstream dependency updates, see PR [#3297](https://github.com/ethereumjs/ethereumjs-monorepo/pull/3297)

## 0.0.1 - 2023-10-15

- Initial development release
