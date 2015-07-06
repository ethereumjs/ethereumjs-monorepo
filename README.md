#modified merkle patricia tree [![Build Status](https://travis-ci.org/wanderer/merkle-patricia-tree.svg?branch=master)](https://travis-ci.org/wanderer/merkle-patricia-tree)
 
This is an implementation of the modified merkle patricia tree as specified in the [Ethereum's yellow paper](http://gavwood.com/Paper.pdf).

> The modified Merkle Patricia tree (trie) provides a persistent data structure to map between arbitrary-length binary data (byte arrays). It is defined in terms of a mutable data structure to map between 256-bit binary fragments and arbitrary-length binary data. The core of the trie, and its sole requirement in terms of the protocol specification is to provide a single 32-byte value that identifies a given set of key-value pairs.   
  \- Ethereum's yellow paper  

## Installation
- `npm install merkle-patricia-tree`

## Usage
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

## API
### `new Trie([db], [root])`
### `new Trie([root])`
Creates a new Trie object
- `db` -  A instance of [levelup](https://github.com/rvagg/node-levelup/) or compatiable API. If no db is `null` or left undefined then the the trie will be stored in memory via [memdown](https://github.com/rvagg/memdown)
- `root` - A hex `String` or `Buffer` for the root of a prevously stored trie.

--------------------------------------------------------

### `Trie` Properties
- `root` - The root of the `trie` as a `Buffer` 
- `isCheckpoint` -  A `Boolean` determining if you are saving to a checkpoint or directly to the db
- `EMPTY_TRIE_ROOT`  - A `buffer` that is a the Root for an empty trie.

--------------------------------------------------------

### `Trie` Methods
#### `trie.put(key, value, cb)`
Stores a give value at the give key
- `key` - the key as a `Buffer` or `String`
- `value` - the value to be stored
- `cb` - a callback `Function` which is given the argumnet `err` - for an errors that may have occured

--------------------------------------------------------

#### `trie.get(key, cb)`
Retrieves a value stored at a key
- `key` - the key as a `Buffer` or `String`
- `cb` - a callback `Function` which is given the argumnets `err` - for an errors that may have occured and `vlue` - The found value in a `Buffer` or if no value was found `null`.

--------------------------------------------------------

#### `trie.del(key, cb)`
Removes a value
- `key` - the key as a `Buffer` or `String`
- `cb` - a callback `Function` which is given the argumnet `err` - for an errors that may have occured

--------------------------------------------------------

####  `trie.checkpoint()`
Creates a checkpoint that can later be reverted to or commited. After this is called, no changes to the trie will be permanently saved until `commit` is called. 

--------------------------------------------------------

####  `trie.commit(cb)`
Commits a checkpoint to the trie
- `cb` - a callback `Function` 

--------------------------------------------------------

####  `trie.revert()`
revets the trie to the state it was at when `checkpoint` was first called

--------------------------------------------------------

####  `trie.batch(operations)`
Give an hash of operation adds them to the DB
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
returns a read stream. The `data` event is given an `Object` hat has two propeties; the `key` and the `value`. Both should be Buffers.

--------------------------------------------------------
#### `trie.putRaw(key, value, cb)`
Stores a raw value in the underlining db
- `key` - the key as a `Buffer` or `String`
- `value` - the value to be stored
- `cb` - a callback `Function` which is given the argumnet `err` - for an errors that may have occured

--------------------------------------------------------

#### `trie.getRaw(key, cb)`
Retrieves a raw value in the underlining db
- `key` - the key as a `Buffer` or `String`
- `cb` - a callback `Function` which is given the argumnets `err` - for an errors that may have occured and `value` - The found value in a `Buffer` or if no value was found `null`.

--------------------------------------------------------

#### `trie.delRaw(key, cb)`
Removes a raw value in the underlining db
- `key` - the key as a `Buffer` or `String`
- `cb` - a callback `Function` which is given the argumnet `err` - for an errors that may have occured

--------------------------------------------------------

## Secure Trie Overlay
You can create a secure Trie where the keys are automatically hashed using sha3 by usin `require('merkle-patricia-tree/secure')`

## examples
see [this blog post](https://wanderer.github.io/ethereum/nodejs/code/2014/05/21/using-ethereums-tries-with-node/)

## Testing
`npm test`  
Test use mocha
