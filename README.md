rlp [![Build Status](https://travis-ci.org/wanderer/rlp.png?branch=master)](https://travis-ci.org/wanderer/rlp)
===

[Recursive Length]( https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP) Prefix Encoding for node.js original based off of [josephyzhou](https://github.com/josephyzhou) implementation.

Install
======
`npm install rlp`


Usage
=======

```javascript
var RLP = require('rlp'); 

var nestedList = [ [], [[]], [ [], [[]] ] ];
var encoded = RLP.encode(nestedList);
var decoded = RLP.decode(encoded);
  assert.deepEqual(nestedList, decoded);
});
```
API
=====
`rlp.encode(plain)` - RLP encodes an `Array`, `Buffer` or `String` and returns a `Buffer`

`rlp.decode(encoded)` - Decodes a RLP encoded `Buffer`, `Array` or `String` and returns a `Buffer` or an `Array` of `Buffers`

Tests
=====
test uses mocha. To run  
`npm test`
