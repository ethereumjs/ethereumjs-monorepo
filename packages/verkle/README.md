# @ethereumjs/verkle

[![NPM Package][verkle-npm-badge]][verkle-npm-link]
[![GitHub Issues][verkle-issues-badge]][verkle-issues-link]
[![Actions Status][verkle-actions-badge]][verkle-actions-link]
[![Code Coverage][verkle-coverage-badge]][verkle-coverage-link]
[![Discord][discord-badge]][discord-link]

| Implementation of [Verkle Trees](https://ethereum.org/en/roadmap/verkle-trees/) as specified in [EIP-6800](https://eips.ethereum.org/EIPS/eip-6800) |
| --------------------------------------------------------------------------------------------------------------------------------------------------- |

> Verkle trees are a cryptographic data structure proposed for use in Ethereum to optimize storage and transaction verification. They combine features of Merkle Patricia Tries and Vector Commitment Trees to offer efficient data verification with smaller proof sizes. The goal is to improve scalability and efficiency in Ethereum's network operations.

This package is currently in early alpha and is a work in progress. It is not intended for use in production environments, but rather for research and development purposes. Any help in improving the package is very much welcome.

## Installation

To obtain the latest version, simply require the project using `npm`:

```shell
npm install @ethereumjs/verkle
```

## Usage

### Initialization and Basic Usage

```ts
import { VerkleTree } from '@ethereumjs/verkle'
import { bytesToUtf8, utf8ToBytes } from '@ethereumjs/util'

const tree = new VerkleTree()

async function test() {
  await tree.put(utf8ToBytes('test'), utf8ToBytes('one'))
  const value = await tree.get(utf8ToBytes('test'))
  console.log(value ? bytesToUtf8(value) : 'not found') // 'one'
}

test()
```

## Proofs

### Verkle Proofs

The EthereumJS Verkle package is still in its infancy, and as such, it does not currently support Verkle proof creation and verification. Support for Verkle proofs will be added eventually.

## Examples

You can find additional examples complete with detailed explanations [here](./examples/README.md).

## Browser

With the breaking release round in Summer 2023 we have added hybrid ESM/CJS builds for all our libraries (see section below) and have eliminated many of the caveats which had previously prevented frictionless browser usage.

It is now easily possible to run a browser build of one of the EthereumJS libraries within a modern browser using the provided ESM build. For a setup example see [./examples/browser.html](./examples/browser.html).

## API

### Docs

Generated TypeDoc API [Documentation](./docs/README.md)

### Hybrid CJS/ESM Builds

With the breaking releases from Summer 2023 we have started to ship our libraries with both CommonJS (`cjs` folder) and ESM builds (`esm` folder), see `package.json` for the detailed setup.

If you use an ES6-style `import` in your code, files from the ESM build will be used:

```ts
import { EthereumJSClass } from '@ethereumjs/[PACKAGE_NAME]'
```

If you use Node.js-specific `require`, the CJS build will be used:

```ts
const { EthereumJSClass } = require('@ethereumjs/[PACKAGE_NAME]')
```

Using ESM will give you additional advantages over CJS beyond browser usage like static code analysis / Tree Shaking, which CJS cannot provide.

## References

- Wiki
  - [Overview of verkle trees](https://ethereum.org/en/roadmap/verkle-trees/)
  - [Verkle trees general resource](https://verkle.info/)

## EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices. If you want to join for work or carry out improvements on the libraries, please review our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html) first.

## License

[MIT](https://opensource.org/licenses/MIT)

[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
[verkle-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/verkle.svg
[verkle-npm-link]: https://www.npmjs.com/package/@ethereumjs/verkle
[verkle-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-monorepo/package:%20verkle?label=issues
[verkle-issues-link]: https://github.com/ethereumjs/ethereumjs-monorepo/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+verkle"
[verkle-actions-badge]: https://github.com/ethereumjs/ethereumjs-monorepo/workflows/Verkle/badge.svg
[verkle-actions-link]: https://github.com/ethereumjs/ethereumjs-monorepo/actions?query=workflow%3A%22Verkle%22
[verkle-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/branch/master/graph/badge.svg?flag=verkle
[verkle-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-monorepo/tree/master/packages/verkle
