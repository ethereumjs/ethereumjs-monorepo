# SYNOPSIS

[![NPM Package](https://img.shields.io/npm/v/ethereumjs-blockchain.svg?style=flat-square)](https://www.npmjs.org/package/ethereumjs-blockchain)
[![Build Status](https://travis-ci.org/ethereumjs/ethereumjs-blockchain.svg?branch=master)](https://travis-ci.org/ethereumjs/ethereumjs-blockchain)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/ethereumjs-blockchain.svg?style=flat-square)](https://coveralls.io/r/ethereumjs/ethereumjs-blockchain)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/ethereumjs-lib?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or #ethereumjs on freenode

A module to store and interact with blocks.

# INSTALL

`npm install ethereumjs-blockchain`

# API

[./docs/](./docs/README.md)

# EXAMPLE USAGE

The following is an example to iterate through an existing Geth DB (needs `level` to be installed separately).

This module performs write operations. Making a backup of your data before trying it is recommended. Otherwise, you can end up with a compromised DB state.

```javascript
const level = require('level')
const Blockchain = require('ethereumjs-blockchain')
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
