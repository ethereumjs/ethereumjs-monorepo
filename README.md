rlp [![Build Status](https://travis-ci.org/wanderer/rlp.png?branch=master)](https://travis-ci.org/wanderer/rlp)
===

[Recursive Length]( https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP) Prefix Encoding for node.js based off of [josephyzhou](https://github.com/josephyzhou) implementation.


Usage
=====

`encode` - RLP encodes an array, buffer or string and returns a buffer

`decode` - Decodes and RLP encoded buffer, array or string and returns a buffer or and array of buffers

Example
=======

```javascript
var RLP = require('rlp'); 

var nestedList = [ [], [[]], [ [], [[]] ] ];
var encoded = RLP.encode(nestedList);
var decoded = RLP.decode(encoded);
assert.deepEqual(nestedList, decoded);
});
```

Tests
=====
test uses mocha. To run  
`npm test`
