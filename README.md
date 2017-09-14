# SYNOPSIS
[![NPM Package](https://img.shields.io/npm/v/ethereumjs-blockchain.svg?style=flat-square)](https://www.npmjs.org/package/ethereumjs-blockchain)
[![Build Status](https://img.shields.io/travis/ethereumjs/ethereumjs-blockchain.svg?branch=master&style=flat-square)](https://travis-ci.org/ethereumjs/ethereumjs-blockchain)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/ethereumjs-blockchain.svg?style=flat-square)](https://coveralls.io/r/ethereumjs/ethereumjs-blockchain)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/ethereumjs-lib?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or #ethereumjs on freenode

A module to store and interact with blocks.

# INSTALL
`npm install ethereumjs-blockchain`

# API

# ethereumjs-blockchain
A module to store and interact with blocks

- [`Blockchain`](#blockchain)
    - [`new Blockchain(opts)`](#new-blockchainblockdb-detailsdb)
    - [`BlockChain` Properties](#blockchain-properties)
    - [`BlockChain` methods](#blockchain-methods)
        - [`blockchain.putBlock(block, [callback])`](#blockchainputblockblock-callback)
        - [`blockchain.getBlock(hash, [callback])`](#blockchaingetblockhash-callback)
        - [`blockchain.getBlockInfo(hash, cb)`](#blockchaingetblockinfohash-cb)
        - [`blockchain.getBlockHashes(parentHash, count, cb)`](#blockchaingetblockhashesparenthash-count-cb)
        - [`blockchain.getBlockChain(startingHashes, count, cb)`](#blockchaingetblockhashesparenthash-count-cb)
        - [`blockchain.selectNeededHashes(hashes, cb)`](#blockchainselectneededhasheshashes-cb)

## `Blockchain`
Implements functions for retrieving, manipulating and storing Ethereum's blockchain

### `new Blockchain(opts)`
Creates new Blockchain object 
- `opts.blockDB` - the database where Blocks are stored and retreived by hash. Should be a [levelup](https://github.com/rvagg/node-levelup) instance.
- `opts.detailsDB` - the database where Block number resolutions and other metadata is stored. Should be a [levelup](https://github.com/rvagg/node-levelup) instance.
- `opts.validate` - this the flag to validate blocks (e.g. Proof-of-Work).

### `BlockChain` Properties
- `head` - The Head, the block that has the most weight
- `parentHead`- The parent of the head block
- `genesisHash` - The hash of the genesis block
- `height` - The height of the blockchain
- `totallDifficulty` - The totall difficulty which is the some of a the difficulty of all the prevous blocks

### `BlockChain` methods

#### `blockchain.putBlock(block, callback)`
Adds a block to the blockchain.
- `block` - the block to be added to the blockchain
- `callback` - the callback. It is given two parameters `err` and the saved `block`

--------------------------------------------------------

#### `blockchain.getBlock(blockTag, callback)`
Gets a block by its blockTag.
- `blockTag`  - the block's hash or number
- `callback` - the callback. It is given two parameters `err` and the found `block` (an instance of https://github.com/ethereumjs/ethereumjs-block) if any. 

--------------------------------------------------------

#### `blockchain.getDetails(hash, callback)`
Retrieves meta infromation about the block and passed it to the `callback`
- `hash` - the hash of the block as a `Buffer` or a hex `String`
- `callback` - the callback which is passed an `Object` containing the following properties:
- * `parent` - the hash of the parent block
- * `td` - the total difficulty of the block
- * `number` - the block number
- * `child` - the block's children
- * `genesis` - boolean (true if genesis block, false if not)
- * `inChain` - TODO
- * `staleChildren` - TODO

--------------------------------------------------------

#### `blockchain.getBlockHashes(parentHash, count, callback)`
Gets a segment of the blockchain starting at the parent hash and contuning for `count ` blocks returning an array of block hashes orders from oldest to youngest.
- `parentHash` - the block to start from. Given as a `Buffer` or a hex `String`
- `count` - a `Number` specifing how many block hashes to return
- `callback` - the callback which is give an array of block hashes

--------------------------------------------------------


#### `blockchain.getBlockChain(startingHashes, count, callback)`
gets a section of the blockchain in a form of an array starting at the parent hash, up `count` blocks
- `startingHashes` - an array of hashes or a single hash to start returning the chain from. The first hash in the array that is found in the blockchain will be used. 
- `count` - the max number of blocks to return
- `callback` - the callback. It is given two parameters `err` and `blockchain`. `err` is any errors. If none of the starting hashes were found `err` will be `notFound`. `blockchain` is an array of blocks.

#### `blockchain.selectNeededHashes(hashes, callback)`
Given an ordered array, returns to the callback an array of hashes that are not in the blockchain yet.
- `hashes` - an `Array` hashes
- `callback` - the callback
