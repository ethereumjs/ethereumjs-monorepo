# SYNOPSIS
 
 [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![Build Status](https://travis-ci.org/wanderer/merkle-patricia-tree.svg?branch=master)](https://travis-ci.org/wanderer/merkle-patricia-tree) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/ethereumjs-lib?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or #ethereumjs on freenode

 
This is an implementation of the modified merkle patricia tree as specified in the [Ethereum's yellow paper](http://gavwood.com/Paper.pdf).

> The modified Merkle Patricia tree (trie) provides a persistent data structure to map between arbitrary-length binary data (byte arrays). It is defined in terms of a mutable data structure to map between 256-bit binary fragments and arbitrary-length binary data. The core of the trie, and its sole requirement in terms of the protocol specification is to provide a single 32-byte value that identifies a given set of key-value pairs.   
  \- Ethereum's yellow paper  

The only backing store supported is LevelDB through the ```levelup``` module.

# INSTALL
 `npm install merkle-patricia-tree`

# USAGE
```javascript
var Trie = require('merkle-patricia-tree'),
levelup = require('levelup'),
db = levelup('./testdb'),
trie = new Trie(db); 

trie.put('test', 'one', function () {
  trie.get('test', function (err, value) {
    if(value) console.log(value.toString())
  });
});
```

Also see [this blog post](https://wanderer.github.io/ethereum/nodejs/code/2014/05/21/using-ethereums-tries-with-node/).

# API
## Trie
Find below how to create, load and modify a tree. As seen above, use `require('merkel-patricia-tree')` for the raw interface. In Ethereum applications stick with the *Secure Trie Overlay*. The API for the raw and the secure interface is the same.

## Secure Trie Overlay
You can create a secure Trie where the keys are automatically hashed using **SHA3** by `require('merkle-patricia-tree/secure')`.

### `new Trie([db], [root])`
### `new Trie([root])`
Creates a new Trie object.
- `db` -  An instance of [levelup](https://github.com/rvagg/node-levelup/) or a compatible API. If the db is `null` or left undefined, then the trie will be stored in memory via [memdown](https://github.com/rvagg/memdown).
- `root` - A hex `String` or `Buffer` for the root of a previously stored trie.

--------------------------------------------------------

### `Trie` Properties
- `root` - The root of the `trie` as a `Buffer`.
- `isCheckpoint` -  A `Boolean` determining if you are saving to a checkpoint or directly to the db.
- `EMPTY_TRIE_ROOT`  - A `buffer` that is a the Root for an empty trie.

--------------------------------------------------------

### `Trie` Methods
#### `trie.put(key, value, cb)`
Stores a given value at the given key.
- `key` - The key as a `Buffer` or `String`.
- `value` - The value to be stored.
- `cb` - A callback `Function`, which is given the argument `err` - for errors that may have occured.

--------------------------------------------------------

#### `trie.get(key, cb)`
Retrieves a value stored at a key.
- `key` - The key as a `Buffer` or `String`.
- `cb` - A callback `Function`, which is given the arguments `err` - for errors that may have occured and `value` - the found value in a `Buffer` or if no value was found `null`.

--------------------------------------------------------

#### `trie.del(key, cb)`
Removes a value.
- `key` - The key as a `Buffer` or `String`.
- `cb` - A callback `Function`, which is given the argument `err` - for errors that may have occured.

--------------------------------------------------------

####  `trie.checkpoint()`
Creates a checkpoint that can later be reverted to or committed. After this is called, no changes to the trie will be permanently saved until `commit` is called.

--------------------------------------------------------

####  `trie.commit(cb)`
Commits a checkpoint to the trie.
- `cb` - A callback `Function`.

--------------------------------------------------------

####  `trie.revert()`
Reverts the trie to the state it was at when `checkpoint` was first called.
- `cb` - A callback `Function`.

--------------------------------------------------------

####  `trie.copy()`
Create an new Trie, which shares the underlying db and cache with the orginal trie.

--------------------------------------------------------

####  `trie.batch(operations, cb)`
The given hash of operations (key additions or deletions) are executed on the DB.
- `operations` a hash of `key`/`values` to add to the trie.
example  
```javascript
var ops = {
 'dog': 'dogecoin', 
 'cat': 'meow',
 'bird': ''    //delete bird
}
```
--------------------------------------------------------

#### `trie.createReadStream()`
Returns a read stream. The `data` event is given an `Object` hat has two properties; the `key` and the `value`. Both should be Buffers.

--------------------------------------------------------
#### `trie.putRaw(key, value, cb)`
Stores a raw value in the underlying db.
- `key` - The key as a `Buffer` or `String`.
- `value` - The value to be stored.
- `cb` - A callback `Function`, which is given the argument `err` - for errors that may have occured.

--------------------------------------------------------

#### `trie.getRaw(key, cb)`
Retrieves a raw value in the underlying db.
- `key` - the key as a `Buffer` or `String`.
- `cb` - A callback `Function`, which is given the arguments `err` - for errors that may have occured and `value` - the found value in a `Buffer` or if no value was found `null`.

--------------------------------------------------------

#### `trie.delRaw(key, cb)`
Removes a raw value in the underlying db.
- `key` - The key as a `Buffer` or `String`.
- `cb` - A callback `Function`, which is given the argument `err` - for errors that may have occured.

--------------------------------------------------------


# TESTING
`npm test`  
Test use mocha
