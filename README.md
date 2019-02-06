# SYNOPSIS
[![NPM Package](https://img.shields.io/npm/v/ethereumjs-blockchain.svg?style=flat-square)](https://www.npmjs.org/package/ethereumjs-blockchain)
[![Build Status](https://travis-ci.org/ethereumjs/ethereumjs-blockchain.svg?branch=master)](https://travis-ci.org/ethereumjs/ethereumjs-blockchain)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/ethereumjs-blockchain.svg?style=flat-square)](https://coveralls.io/r/ethereumjs/ethereumjs-blockchain)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/ethereumjs-lib?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or #ethereumjs on freenode

A module to store and interact with blocks.

# INSTALL
`npm install ethereumjs-blockchain`

# EXAMPLE

The following is an example to iterate through an existing Geth DB (needs ``level`` to be
installed separately):

```javascript
const level = require('level')
const Blockchain = require('ethereumjs-blockchain')
const utils = require('ethereumjs-util')

const gethDbPath = './chaindata' // Add your own path here
const db = level(gethDbPath)

new Blockchain({db: db}).iterator('i', (block, reorg, cb) => {
  const blockNumber = utils.bufferToInt(block.header.number)
  const blockHash = block.hash().toString('hex')
  console.log(`BLOCK ${blockNumber}: ${blockHash}`)
  cb()
}, (err) => console.log(err || 'Done.'))
```

**WARNING**: Since ``ethereumjs-blockchain`` is also doing write operations
on the DB for safety reasons only run this on a copy of your database, otherwise this might lead
to a compromised DB state.

# API

- [`Blockchain`](#blockchain)
    - [`new Blockchain(opts)`](#new-blockchainblockdb-detailsdb)
    - [`BlockChain` methods](#blockchain-methods)
        - [`blockchain.putGenesis(genesis, [cb])`](#blockchainputgenesisgenesis-cb)
        - [`blockchain.getHead(name, [cb])`](#blockchaingetheadname-cb)
        - [`blockchain.getLatestHeader([cb])`](#blockchaingetlatestheadercb)
        - [`blockchain.getLatestBlock([cb])`](#blockchaingetlatestblockcb)
        - [`blockchain.putBlocks(blocks, [cb])`](#blockchainputblocksblocks-cb)
        - [`blockchain.putBlock(block, [cb])`](#blockchainputblockblock-cb)
        - [`blockchain.getBlock(hash, [cb])`](#blockchaingetblockhash-cb)
        - [`blockchain.getBlocks(blockId, maxBlocks, skip, reverse, [cb])`](#blockchaingetblocksblockid-maxblocks-skip-reverse-cb)
        - [`blockchain.putHeaders(headers, [cb])`](#blockchainputheadersheaders-cb)
        - [`blockchain.putHeader(header, [cb])`](#blockchainputheaderheader-cb)
        - [`blockchain.selectNeededHashes(hashes, [cb])`](#blockchainselectneededhasheshashes-cb)
        - [`blockchain.delBlock(blockHash, [cb])`](#blockchaindelblockblockhash-cb)
        - [`blockchain.iterator(name, onBlock, [cb])`](#blockchainiteratorname-onblock-cb)        

## `Blockchain`
Implements functions for retrieving, manipulating and storing Ethereum's blockchain

### `new Blockchain(opts)`
Creates new Blockchain object
-   `opts.chain` **([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number))** The chain for the block [default: 'mainnet']
-   `opts.hardfork` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Hardfork for the block [default: null, block number-based behavior]
-   `opts.common` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Alternatively pass a Common instance (ethereumjs-common) instead of setting chain/hardfork directly
- `opts.db` - Database to store blocks and metadata. Should be a [levelup](https://github.com/rvagg/node-levelup) instance.
- `opts.validate` - this the flag to validate blocks (e.g. Proof-of-Work), latest HF rules supported: ``Constantinople``.

[DEPRECATION NOTE]
The old separated DB constructor parameters `opts.blockDB` and `opts.detailsDB` from before the Geth DB-compatible ``v3.0.0`` release are deprecated and continued usage is discouraged. When provided `opts.blockDB` will be used
as `opts.db` and `opts.detailsDB` is ignored. On the storage level the DB formats are not compatible and it is not
possible to load an old-format DB state into a post-``v3.0.0`` ``Blockchain`` object.

### `BlockChain` methods

#### `blockchain.putGenesis(genesis, cb)`
Puts the genesis block in the database.
- `genesis` - the genesis block to be added
- `cb` - the callback. It is given two parameters `err` and the saved `block`

--------------------------------------------------------

#### `blockchain.getHead(name, cb)`
Returns the specified iterator head.
- `name` - Optional name of the state root head (default: 'vm')
- `cb` - the callback. It is given two parameters `err` and the returned `block`

--------------------------------------------------------

#### `blockchain.getLatestHeader(cb)`
Returns the latest header in the canonical chain.
- `cb` - the callback. It is given two parameters `err` and the returned `header`

--------------------------------------------------------

#### `blockchain.getLatestBlock(cb)`
Returns the latest full block in the canonical chain.
- `cb` - the callback. It is given two parameters `err` and the returned `block`

--------------------------------------------------------

#### `blockchain.putBlocks(blocks, cb)`
Adds many blocks to the blockchain.
- `blocks` - the blocks to be added to the blockchain
- `cb` - the callback. It is given two parameters `err` and the last of the saved `blocks`
--------------------------------------------------------

#### `blockchain.putBlock(block, cb)`
Adds a block to the blockchain.
- `block` - the block to be added to the blockchain
- `cb` - the callback. It is given two parameters `err` and the saved `block`

--------------------------------------------------------

#### `blockchain.getBlock(blockTag, cb)`
Gets a block by its blockTag.
- `blockTag`  - the block's hash or number
- `cb` - the callback. It is given two parameters `err` and the found `block` (an instance of https://github.com/ethereumjs/ethereumjs-block) if any.

--------------------------------------------------------

#### `blockchain.getBlocks(blockId, maxBlocks, skip, reverse, cb)`
Looks up many blocks relative to blockId.
- `blockId` - the block's hash or number
- `maxBlocks` - max number of blocks to return
- `skip` - number of blocks to skip
- `reverse` - fetch blocks in reverse
- `cb` - the callback. It is given two parameters `err` and the found `blocks` if any.

--------------------------------------------------------

#### `blockchain.putHeaders(headers, cb)`
Adds many headers to the blockchain.
- `headers` - the headers to be added to the blockchain
- `cb` - the callback. It is given two parameters `err` and the last of the saved `headers`
--------------------------------------------------------

#### `blockchain.putHeader(header, cb)`
Adds a header to the blockchain.
- `header` - the header to be added to the blockchain
- `cb` - the callback. It is given two parameters `err` and the saved `header`

--------------------------------------------------------

#### `blockchain.getDetails(hash, cb)`
[DEPRECATED] Returns an empty object

--------------------------------------------------------

#### `blockchain.selectNeededHashes(hashes, cb)`
Given an ordered array, returns to the callback an array of hashes that are not in the blockchain yet.
- `hashes`  - Ordered array of hashes
- `cb` - the callback. It is given two parameters `err` and hashes found.

--------------------------------------------------------

#### `blockchain.delBlock(blockHash, cb)`
Deletes a block from the blockchain. All child blocks in the chain are deleted and any encountered heads are set to the parent block
- `blockHash`  - the hash of the block to be deleted
- `cb` - A callback.

--------------------------------------------------------

#### `blockchain.iterator(name, onBlock, cb)`
Iterates through blocks starting at the specified verified state root head and calls the onBlock function on each block
- `name` - name of the state root head
- `onBlock` - function called on each block with params (block, reorg, cb)
- `cb` - A callback function

# TESTS

Tests can be found in the ``test`` directory and run with ``npm run test``.

These can also be valuable as examples/inspiration on how to run the library and invoke different parts of the API.
