# ethereumjs-blockchain

[![NPM Package][blockchain-npm-badge]][blockchain-npm-link]
[![GitHub Issues][blockchain-issues-badge]][blockchain-issues-link]
[![Actions Status][blockchain-actions-badge]][blockchain-actions-link]
[![Code Coverage][blockchain-coverage-badge]][blockchain-coverage-link]
[![Gitter][gitter-badge]][gitter-link]

[![js-standard-style][js-standard-style-badge]][js-standard-style-link]

A module to store and interact with blocks.

# INSTALL

`npm install ethereumjs-blockchain`

# API

[Documentation](./docs/README.md)

# EXAMPLE

The following is an example to iterate through an existing Geth DB (needs `level` to be installed separately).

This module performs write operations. Making a backup of your data before trying it is recommended. Otherwise, you can end up with a compromised DB state.

```javascript
const level = require('level')
const Blockchain = require('@ethereumjs/blockchain').default
const utils = require('ethereumjs-util')

const gethDbPath = './chaindata' // Add your own path here. It will get modified, see remarks.
const db = level(gethDbPath)

new Blockchain({ db: db }).iterator(
  'i',
  (block, reorg, cb) => {
    const blockNumber = utils.bufferToInt(block.header.number)
    const blockHash = block.hash().toString('hex')
    console.log(`BLOCK ${blockNumber}: ${blockHash}`)
    cb()
  },
  err => console.log(err || 'Done.'),
)
```

**WARNING**: Since `@ethereumjs/blockchain` is also doing write operations
on the DB for safety reasons only run this on a copy of your database, otherwise this might lead
to a compromised DB state.

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

[gitter-badge]: https://img.shields.io/gitter/room/ethereum/ethereumjs.svg
[gitter-link]: https://gitter.im/ethereum/ethereumjs
[js-standard-style-badge]: https://cdn.rawgit.com/feross/standard/master/badge.svg
[js-standard-style-link]: https://github.com/feross/standard
[blockchain-npm-badge]: https://img.shields.io/npm/v/@ethereumjs/blockchain.svg
[blockchain-npm-link]: https://www.npmjs.org/package/@ethereumjs/blockchain
[blockchain-issues-badge]: https://img.shields.io/github/issues/ethereumjs/ethereumjs-vm/package:%20blockchain?label=issues
[blockchain-issues-link]: https://github.com/ethereumjs/ethereumjs-vm/issues?q=is%3Aopen+is%3Aissue+label%3A"package%3A+blockchain"
[blockchain-actions-badge]: https://github.com/ethereumjs/ethereumjs-vm/workflows/Blockchain%20Test/badge.svg
[blockchain-actions-link]: https://github.com/ethereumjs/ethereumjs-vm/actions?query=workflow%3A%22Blockchain+Test%22
[blockchain-coverage-badge]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/branch/master/graph/badge.svg?flag=blockchain
[blockchain-coverage-link]: https://codecov.io/gh/ethereumjs/ethereumjs-vm/tree/master/packages/blockchain
