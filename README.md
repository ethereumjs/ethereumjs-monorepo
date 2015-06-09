RLP [![Build Status](https://travis-ci.org/wanderer/rlp.png?branch=master)](https://travis-ci.org/wanderer/rlp)
===

[Recursive Length]( https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP) Prefix Encoding for node.js.
INSTALL
======
`npm install rlp`   
install with `-g` if you want to use the cli.

USAGE
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

CLI
===
`rlp decode <hex string>`   
`rlp encode <json String>`  

TESTS
=====
test uses mocha. To run  
`npm test`
