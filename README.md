# SYNOPSIS

[![NPM Package](https://img.shields.io/npm/v/merkle-patricia-tree)](https://www.npmjs.org/package/merkle-patricia-tree)
[![Actions Status](https://github.com/ethereumjs/ethereumjs-util/workflows/Build/badge.svg)](https://github.com/ethereumjs/merkle-patricia-tree/actions)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/merkle-patricia-tree.svg)](https://coveralls.io/r/ethereumjs/merkle-patricia-tree)
[![Gitter](https://img.shields.io/gitter/room/ethereum/ethereumjs.svg)](https://gitter.im/ethereum/ethereumjs)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This is an implementation of the modified merkle patricia tree as specified in the [Ethereum's Yellow Paper](http://gavwood.com/Paper.pdf):

> The modified Merkle Patricia tree (trie) provides a persistent data structure to map between arbitrary-length binary data (byte arrays). It is defined in terms of a mutable data structure to map between 256-bit binary fragments and arbitrary-length binary data. The core of the trie, and its sole requirement in terms of the protocol specification is to provide a single 32-byte value that identifies a given set of key-value pairs.

The only backing store supported is LevelDB through the `levelup` module.

# INSTALL

`npm install merkle-patricia-tree`

# USAGE

There are 3 variants of the tree implemented in this library, namely: `BaseTrie`, `CheckpointTrie` and `SecureTrie`. `CheckpointTrie` adds checkpointing functionality to the `BaseTrie` with the methods `checkpoint`, `commit` and `revert`. `SecureTrie` extends `CheckpointTrie` and is the most suitable variant for Ethereum applications. It stores values under the `keccak256` hash of their keys.

## Initialization and Basic Usage

```javascript
const Trie = require('merkle-patricia-tree').BaseTrie,
  level = require('level'),
  db = level('./testdb'),
  trie = new Trie(db)

trie.put(Buffer.from('test'), Buffer.from('one'), function () {
  trie.get(Buffer.from('test'), function (err, value) {
    if (value) console.log(value.toString())
  })
})
```

## Merkle Proofs

```javascript
Trie.prove(trie, Buffer.from('test'), function (err, prove) {
  if (err) return cb(err)
  Trie.verifyProof(trie.root, Buffer.from('test'), prove, function (err, value) {
    if (err) return cb(err)
    console.log(value.toString())
    cb()
  })
})
```

## Read stream on Geth DB

```javascript
var level = require('level')
var Trie = require('merkle-patricia-tree').SecureTrie

var stateRoot = '0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544' // Block #222

var db = level('YOUR_PATH_TO_THE_GETH_CHAIN_DB')
var trie = new Trie(db, stateRoot)

trie
  .createReadStream()
  .on('data', function (data) {
    console.log(data)
  })
  .on('end', function () {
    console.log('End.')
  })
```

## Read Account State including Storage from Geth DB

```javascript
var level = require('level')
var rlp = require('rlp')
var ethutil = require('ethereumjs-util')

var Trie = require('merkle-patricia-tree').SecureTrie
var Account = require('ethereumjs-account').default
var BN = ethutil.BN

var stateRoot = 'STATE_ROOT_OF_A_BLOCK'

var db = level('YOUR_PATH_TO_THE_GETH_CHAINDATA_FOLDER')
var trie = new Trie(db, stateRoot)

var address = 'AN_ETHEREUM_ACCOUNT_ADDRESS'

trie.get(address, function (err, data) {
  if (err) return cb(err)

  var acc = new Account(data)
  console.log('-------State-------')
  console.log(`nonce: ${new BN(acc.nonce)}`)
  console.log(`balance in wei: ${new BN(acc.balance)}`)
  console.log(`storageRoot: ${ethutil.bufferToHex(acc.stateRoot)}`)
  console.log(`codeHash: ${ethutil.bufferToHex(acc.codeHash)}`)

  var storageTrie = trie.copy()
  storageTrie.root = acc.stateRoot

  console.log('------Storage------')
  var stream = storageTrie.createReadStream()
  stream
    .on('data', function (data) {
      console.log(`key: ${ethutil.bufferToHex(data.key)}`)
      console.log(`Value: ${ethutil.bufferToHex(rlp.decode(data.value))}`)
    })
    .on('end', function () {
      console.log('Finished reading storage.')
    })
})
```

# API

[Documentation](./docs/README.md)

# TESTING

`npm test`

# REFERENCES

- ["Exploring Ethereum's state trie with Node.js"](https://wanderer.github.io/ethereum/nodejs/code/2014/05/21/using-ethereums-tries-with-node/) blog post
- ["Merkling in Ethereum"](https://blog.ethereum.org/2015/11/15/merkling-in-ethereum/) blog post
- [Ethereum Trie Specification](https://github.com/ethereum/wiki/wiki/Patricia-Tree) Wiki
- ["Understanding the ethereum trie"](https://easythereentropy.wordpress.com/2014/06/04/understanding-the-ethereum-trie/) blog post
- ["Trie and Patricia Trie Overview"](https://www.youtube.com/watch?v=jXAHLqQthKw&t=26s) Video Talk on Youtube

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

# LICENSE

MPL-2.0
