# SYNOPSIS 
[![NPM Package](https://img.shields.io/npm/v/merkle-patricia-tree.svg?style=flat-square)](https://www.npmjs.org/package/merkle-patricia-tree)
[![Build Status](https://img.shields.io/travis/ethereumjs/merkle-patricia-tree.svg?branch=master&style=flat-square)](https://travis-ci.org/ethereumjs/merkle-patricia-tree)
[![Coverage Status](https://img.shields.io/coveralls/ethereumjs/merkle-patricia-tree.svg?style=flat-square)](https://coveralls.io/r/ethereumjs/merkle-patricia-tree)
[![Gitter](https://img.shields.io/gitter/room/ethereum/ethereumjs-lib.svg?style=flat-square)](https://gitter.im/ethereum/ethereumjs-lib) or #ethereumjs on freenode  

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)  

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
[./docs/](./docs/index.md)

# TESTING
`npm test`

# LICENSE
MPL-2.0
