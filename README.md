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
### `new new Trie([db], [root])`
### `new new Trie([options], [root])`
Creates a new Trie object
- `db` -  A instance of [levelup](https://github.com/rvagg/node-levelup/) or compatiable API. If no db is `null` or left undefined then the the trie will be stored in memory vai [memdown](https://github.com/rvagg/memdown)
- `root` - A hex `String` or `Buffer` for the root of a prevously stored trie.
- `options` - hash with the following 
 - `immutable`  - A `Boolean` determing if the Trie will be immutable or not. This property can be changed later.
 - `db` - the db

--------------------------------------------------------

### `Trie` Properties
- `root` - The root of the `trie` as a `Buffer` 
- `checkpoint` -  A `Boolean` determining if you are saving to a checkpoint or directly to the db 
- `immutable` - A `Boolean` flag determing if the Trie is immutable or not

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

#### `trie.delete(key, cb)`
Removes a value
- `key` - the key as a `Buffer` or `String`
- `cb` - a callback `Function` which is given the argumnet `err` - for an errors that may have occured

--------------------------------------------------------

####  `trie.createCheckpoint()`
Creates a checkpoint that can later be reverted to or commited. After this is called, no changes to the trie will be permanently saved until `commitCheckpoint` is called. 

--------------------------------------------------------

####  `trie.commitCheckpoint(cb)`
Commits a checkpoint to the trie
- `cb` - a callback `Function` 

--------------------------------------------------------

####  `trie.revertCheckpoint()`
revets the trie to the state it was at when `createCheckpoint` was first called

--------------------------------------------------------

#### `trie.createReadStream()`
returns a read stream. The `data` event is given an `Object` hat has two propeties; the `key` and the `value`. Both should be Buffers.

## examples
see [this blog post](https://wanderer.github.io/ethereum/nodejs/code/2014/05/21/using-ethereums-tries-with-node/)

## Testing
`npm test`  
Test use mocha
