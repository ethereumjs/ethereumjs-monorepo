# SYNOPSIS

[![NPM Package](https://img.shields.io/npm/v/merkle-patricia-tree)](https://www.npmjs.org/package/merkle-patricia-tree)
[![Actions Status](https://github.com/ethereumjs/merkle-patricia-tree/workflows/Build/badge.svg)](https://github.com/ethereumjs/merkle-patricia-tree/actions)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/merkle-patricia-tree.svg)](https://coveralls.io/r/ethereumjs/merkle-patricia-tree)
[![Gitter](https://img.shields.io/gitter/room/ethereum/ethereumjs.svg)](https://gitter.im/ethereum/ethereumjs)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This is an implementation of the modified merkle patricia tree as specified in the [Ethereum Yellow Paper](http://gavwood.com/Paper.pdf):

> The modified Merkle Patricia tree (trie) provides a persistent data structure to map between arbitrary-length binary data (byte arrays). It is defined in terms of a mutable data structure to map between 256-bit binary fragments and arbitrary-length binary data. The core of the trie, and its sole requirement in terms of the protocol specification is to provide a single 32-byte value that identifies a given set of key-value pairs.

The only backing store supported is LevelDB through the `levelup` module.

# INSTALL

`npm install merkle-patricia-tree`

# USAGE

There are 3 variants of the tree implemented in this library, namely: `BaseTrie`, `CheckpointTrie` and `SecureTrie`. `CheckpointTrie` adds checkpointing functionality to the `BaseTrie` with the methods `checkpoint`, `commit` and `revert`. `SecureTrie` extends `CheckpointTrie` and is the most suitable variant for Ethereum applications. It stores values under the `keccak256` hash of their keys.

## Initialization and Basic Usage

```typescript
import level from 'level'
import { BaseTrie as Trie } from 'merkle-patricia-tree'

const db = level('./testdb')
const trie = new Trie(db)

async function test() {
  await trie.put(Buffer.from('test'), Buffer.from('one'))
  const value = await trie.get(Buffer.from('test'))
  console.log(value.toString()) // 'one'
}

test()
```

## Merkle Proofs

```typescript
const trie = new Trie()

async function test() {
  await trie.put(Buffer.from('test'), Buffer.from('one'))
  const proof = await Trie.createProof(trie, Buffer.from('test'))
  const value = await Trie.verifyProof(trie.root, Buffer.from('test'), proof)
  console.log(value.toString()) // 'one'
}

test()
```

## Read stream on Geth DB

```typescript
import level from 'level'
import { SecureTrie as Trie } from 'merkle-patricia-tree'

const db = level('YOUR_PATH_TO_THE_GETH_CHAIN_DB')
// Set stateRoot to block #222
const stateRoot = '0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544'
// Initialize trie
const trie = new Trie(db, stateRoot)

trie
  .createReadStream()
  .on('data', console.log)
  .on('end', () => {
    console.log('End.')
  })
```

## Read Account State including Storage from Geth DB

```typescript
import level from 'level'
import rlp from 'rlp'
import { BN, bufferToHex } from 'ethereumjs-util'
import Account from 'ethereumjs-account'
import { SecureTrie as Trie } from 'merkle-patricia-tree'

const stateRoot = 'STATE_ROOT_OF_A_BLOCK'

const db = level('YOUR_PATH_TO_THE_GETH_CHAINDATA_FOLDER')
const trie = new Trie(db, stateRoot)

const address = 'AN_ETHEREUM_ACCOUNT_ADDRESS'

async function test() {
  const data = await trie.get(address)
  const acc = new Account(data)

  console.log('-------State-------')
  console.log(`nonce: ${new BN(acc.nonce)}`)
  console.log(`balance in wei: ${new BN(acc.balance)}`)
  console.log(`storageRoot: ${bufferToHex(acc.stateRoot)}`)
  console.log(`codeHash: ${bufferToHex(acc.codeHash)}`)

  let storageTrie = trie.copy()
  storageTrie.root = acc.stateRoot

  console.log('------Storage------')
  const stream = storageTrie.createReadStream()
  stream
    .on('data', (data) => {
      console.log(`key: ${bufferToHex(data.key)}`)
      console.log(`Value: ${bufferToHex(rlp.decode(data.value))}`)
    })
    .on('end', () => {
      console.log('Finished reading storage.')
    })
}

test()
```

# API

[Documentation](./docs/README.md)

# TESTING

`npm test`

# REFERENCES

- Wiki
  - [Ethereum Trie Specification](https://github.com/ethereum/wiki/wiki/Patricia-Tree)
- Blog posts
  - [Exploring Ethereum's State Trie with Node.js](https://wanderer.github.io/ethereum/nodejs/code/2014/05/21/using-ethereums-tries-with-node/)
  - [Merkling in Ethereum](https://blog.ethereum.org/2015/11/15/merkling-in-ethereum/)
  - [Understanding the Ethereum Trie](https://easythereentropy.wordpress.com/2014/06/04/understanding-the-ethereum-trie/)
- Videos
  - [Trie and Patricia Trie Overview](https://www.youtube.com/watch?v=jXAHLqQthKw&t=26s)

# EthereumJS

See our organizational [documentation](https://ethereumjs.readthedocs.io) for an introduction to `EthereumJS` as well as information on current standards and best practices.

If you want to join for work or do improvements on the libraries have a look at our [contribution guidelines](https://ethereumjs.readthedocs.io/en/latest/contributing.html).

# LICENSE

MPL-2.0
