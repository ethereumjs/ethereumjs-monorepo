# SYNOPSIS  

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard) [![Build Status](https://travis-ci.org/ethereum/ethereumjs-block.svg?branch=master)](https://travis-ci.org/ethereum/ethereumjs-block)

Implements schema and functions related to Etheruem's block. 

# INSTALL
`npm install ethereumjs-block`

# BOWSER  
This module work with `browserify`
# CONTACT
 [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/ethereumjs-lib?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or #ethereumjs on freenode

# API
- [`Block`](#block)
    - [`new Block([data])`](#new-blockdata)
    - [`Block` Properties](#block-properties)
    - [`Block` Methods](#block-methods)
        - [`block.genTxTrie(cb)`](#blockgentxtriecb) 
        - [`block.hash()`](#blockhash)
        - [`block.serialize()`](#blockserialize)
        - [`block.validate(blockchain, cb)`](#blockvalidateblockchain-cb)
        - [`block.validateUncles(blockchain, cb)`](#blockvalidateunclesblockchain-cb)
        - [`block.validateTransactions()`](#blockvalidatetransactions)
        - [`block.validateTransactionsTrie()`](#blockvalidatetransactionstrie)
        - [`block.isGenesis()`](#blockisgenesis)
        - [`block.setGenesisParams()`](#blocksetgenesisparams)
        - [`block.toJSON([label=false])`](#blocktojsonlabelfalse)

- [`Blockheader`](#blockheader)
    - [`Blockheader` Properties](#blockheader-properties)
    - [`Blockheader` Methods](#blockheader-methods)
        - [`blockheader.validate(blockchain, [height], cb)`](#blockheadervalidateblockchain-height-cb)
        - [`blockheader.validateDifficulty()`](#blockheadervalidatedifficulty)
        - [`blockheader.validateGasLimit()`](#blockheadervalidategaslimit)
        - [`blockheader.canonicalGasLimit(parentBlock)`](#blockheadercanonicalgaslimitparentblock)
        - [`blockheader.canonicalDifficulty(parentBlock)`](#blockheadercanonicaldifficultyparentblock)
        - [`blockheader.hash()`](#blockheaderhash)

## `Block`

### `new Block([data])`
Creates a new block object
- `data` - the serialized block (usually from the network) in a array of buffers as described in the [wire protocol](https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-Wire-Protocol)

### `Block` Properties 
- `header` - the block's [`header`](#blockheader)
- `transactionReceipt` - an array of [`TransactionReceipt`](#transactionreceipt) in the block
- `uncleList` - an array of uncle [`headers`](#blockheader)
- `raw` - an array of buffers containing the raw blocks.

### `Block` Methods

#### `block.genTxTrie(cb)`
Generates the transaction trie. This must be done before doing validation
- `cb` - the callback 

#### `block.hash()`
Returns the sha3-256 hash of the RLP encoding of the serialized block

#### `block.serialize()`
Returns the RLP serialization of the block.

#### `block.validate(blockchain, cb)`
Validates the entire block. Returns a `string` to the callback if block is invalid
- `blockchain` - an instance of the [`Blockchain`](docs/blockchain.md)
- `cb` - the callback

#### `block.validateUncles(blockchain, cb)`
Validates the uncles that are in the block if any. Returns a `string` to the callback if uncles are invalid
- `blockchain` - an instance of the [`Blockchain`](docs/blockchain.md)
- `cb` - the callback

#### `block.validateTransactions()`
Validates all of the transactions in the block. Returns a `Boolean`

#### `block.validateTransactionsTrie()`
Validates the transaction trie. Returns a `Boolean`

#### `block.isGenesis()`
Returns a `Boolean` determining if the block is a genesis block

#### `block.setGenesisParams()`
Sets the parameters of the block to the genesis block.

#### `block.toJSON([label=false])`
Returns the block as a JSON object.
- `label` - A `Boolean`. If true returns an JSON object with properties corresponding to the block properties if false it just returns a JSON array.

## `Blockheader`
A object that repersents the block header.

### `Blockheader` Properties
- `parentHash` - the blocks' parnet's hash
- `uncleHash` - sha3(rlp_encode(uncle_list))
- `coinbase` - the miner address
- `stateRoot` - The root of a Merkle Patricia tree
- `transactionTrie` - the root of a Trie containing the transactions
- `receiptTrie` - the root of a Trie containing the transaction Reciept
- `bloom`
- `difficulty`
- `number` - the height
- `gasLimit`
- `gasUsed`
- `timestamp`
- `extraData`
- `raw` - an `Array` of `Buffers` forming the raw header

### `Blockheader` Methods

#### `blockheader.validate(blockchain, [height], cb)`
Validates the entire block headers
- `blockchain` - blockChain the blockchain that this block is validating against
- `height` if this is an uncle header, this is the height of the block that is including it
- `cb` the callback function

#### `blockheader.validateDifficulty()`
Validates the difficutly returning a `Boolean`

#### `blockheader.validateGasLimit()`
Validates the gasLimit, returning a `Boolean`

#### `blockheader.canonicalGasLimit(parentBlock)`
Returns the canonical gas limit of the block
- `parentBlock` - the parent`Block` of the header

#### `blockheader.canonicalDifficulty(parentBlock)`
Returns the canoncical difficulty of the block
- `parentBlock` - the parent `Block` of the header

#### `blockheader.hash()`
Returns the sha3 hash of the blockheader

# LICENSE
[MPL-2.0](https://tldrlegal.com/license/mozilla-public-license-2.0-(mpl-2))
