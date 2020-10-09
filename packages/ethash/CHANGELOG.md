# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.0.0] - [UNRELEASED]

### New Package Name

**Attention!** This new version is part of a series of EthereumJS releases all moving to a
new scoped package name format. In this case the library is renamed as follows:

- `ethashjs` -> `@ethereumjs/ethash`

Please update your library references accordingly or install with:

```shell
npm i @ethereumjs/ethash
```

### Library Promisification

The `Ethash` library has been promisified and callbacks have been removed along
PR [#833](https://github.com/ethereumjs/ethereumjs-vm/pull/833) and preceeding PR
[#779](https://github.com/ethereumjs/ethereumjs-vm/pull/779).

Old API:

```typescript
ethash.verifyPOW(validblock, (result) => {
  console.log(result)
})
```

New API:

```typescript
const result = await ethash.verifyPOW(validBlock)
console.log(result) // => true
```

See `Ethash` [README](https://github.com/ethereumjs/ethereumjs-vm/tree/master/packages/ethash#usage)
for a complete example.

[1.0.0]: https://github.com/ethereumjs/ethereumjs-vm/releases/tag/%40ethereumjs%2Fethash%401.0.0

### Other Changes

- Removed `async` dependency,
  PR [#779](https://github.com/ethereumjs/ethereumjs-vm/pull/779)

## [0.0.8] - 2020-05-27

This is a maintenance release with dependency updates, CI improvements, and some code modernization.

Changes from PR [#23](https://github.com/ethereumjs/ethashjs/pull/23):

- Upgraded CI from travis to GH Actions
- Node versions tested updated from [4, 5] to [10, 12, 13, 14]
- Upgraded dev deps (ethereumjs-block, nyc, standard)
- Added `ethash_tests.json` to test dir and removes ethereumjs-testing dep
- Use single imports for ethereumjs-util, upgrades to v7.0.2
- Modernizes buffer init syntax

Further/preceeding dependency updates in
PR [#19](https://github.com/ethereumjs/ethashjs/pull/19),
PR [#11](https://github.com/ethereumjs/ethashjs/pull/11),
PR [#8](https://github.com/ethereumjs/ethashjs/pull/8) and
PR [#7](https://github.com/ethereumjs/ethashjs/pull/7)

[0.0.8]: https://github.com/ethereumjs/ethashjs/compare/v0.0.7...v0.0.8

## Older releases:

- [0.0.7](https://github.com/ethereumjs/ethashjs/compare/v0.0.6...v0.0.7) - 2016-05-01
- [0.0.6](https://github.com/ethereumjs/ethashjs/compare/v0.0.5...v0.0.6) - 2016-01-08
- [0.0.5](https://github.com/ethereumjs/ethashjs/compare/v0.0.4...v0.0.5) - 2015-11-27
- 0.0.4 - 2015-10-01
