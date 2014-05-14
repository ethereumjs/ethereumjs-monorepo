#modified merkle patricia tree

This is an implementation of the modified merkle patricia tree as speficed in the [Ethereum's yellow paper](http://gavwood.com/Paper.pdf).

> The modified Merkle Patricia tree (trie) provides a persistent data structure to map between arbitrary-length binary data (byte arrays). It is defined in terms of a mutable data structure to map between 256-bit binary fragments and arbitrary-length binary data. The core of the trie, and its sole requirement in terms of the protocol specification is to provide a single 32-byte value that identifies a given set of key-value pairs.   
  \- Ethereum's yellow paper  

## Installation
## Usage
## API
### `new new Trie(db, root)`
Creates a new Trie object
- `db` -  A instance of [levelup](https://github.com/rvagg/node-levelup/) or compatiable API.
- `root` - A hex `String` or `Buffer` for the root of a prevously stored trie.

--------------------------------------------------------

### `Trie` Properties
- `root` - The root of the `trie` as a `Buffer` 

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

## Testing
