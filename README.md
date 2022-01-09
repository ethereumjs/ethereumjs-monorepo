# rlp

[![NPM Package][npm-badge]][npm-link]
[![GitHub Issues][issues-badge]][issues-link]
[![Actions Status][actions-badge]][actions-link]
[![Code Coverage][coverage-badge]][coverage-link]
[![Discord][discord-badge]][discord-link]

[Recursive Length Prefix](https://eth.wiki/en/fundamentals/rlp) encoding for Node.js and the browser.

## INSTALL

`npm install rlp`

install with `-g` if you want to use the cli.

## USAGE

```typescript
import assert from 'assert'
import * as rlp from 'rlp'

const nestedList = [[], [[]], [[], [[]]]]
const encoded = rlp.encode(nestedList)
const decoded = rlp.decode(encoded)
assert.deepEqual(nestedList, decoded)
```

## API

`rlp.encode(plain)` - RLP encodes an `Array`, `Uint8Array` or `String` and returns a `Uint8Array`.

`rlp.decode(encoded, [skipRemainderCheck=false])` - Decodes an RLP encoded `Uint8Array`, `Array` or `String` and returns a `Uint8Array` or an `Array` of `Uint8Arrays`. If `skipRemainderCheck` is enabled, `rlp` will just decode the first rlp sequence in the Uint8Array. By default, it would throw an error if there are more bytes in Uint8Array than used by rlp sequence.

## CLI

`rlp encode <JSON string>`
`rlp decode <0x-prefixed hex string>`

### Examples

- `rlp encode '5'` => `0x05`
- `rlp encode '[5]'` => `0xc105`
- `rlp encode '["cat", "dog"]'` => `0xc88363617483646f67`
- `rlp decode 0xc88363617483646f67` => `["cat","dog"]`

## TESTS

Tests use mocha.

To run tests and linting: `npm test`

To auto fix linting problems use: `npm run lint:fix`

## CODE COVERAGE

Install dev dependencies
`npm install`

Run
`npm run coverage`

The results are at
`coverage/lcov-report/index.html`

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

[npm-badge]: https://img.shields.io/npm/v/rlp.svg
[npm-link]: https://www.npmjs.org/package/rlp
[issues-badge]: https://img.shields.io/github/issues/ethereumjs/rlp
[issues-link]: https://github.com/ethereumjs/rlp/issues?q=is%3Aopen+is%3Aissue
[actions-badge]: https://github.com/ethereumjs/rlp/workflows/Build/badge.svg
[actions-link]: https://github.com/ethereumjs/rlp/actions
[coverage-badge]: https://img.shields.io/coveralls/ethereumjs/rlp.svg
[coverage-link]: https://coveralls.io/r/ethereumjs/rlp
[discord-badge]: https://img.shields.io/static/v1?logo=discord&label=discord&message=Join&color=blue
[discord-link]: https://discord.gg/TNwARpR
