SYNOPSIS
=====
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Build Status](https://travis-ci.org/wanderer/rlp.png?branch=master)](https://travis-ci.org/wanderer/rlp)  [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/ethereumjs-lib?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or #ethereumjs on freenode 

[Recursive Length](https://github.com/ethereum/wiki/wiki/RLP) Prefix Encoding for node.js.

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
`rlp.encode(plain)` - RLP encodes an `Array`, `Buffer` or `String` and returns a `Buffer`. 

`rlp.decode(encoded, [skipRemainderCheck=false])` - Decodes a RLP encoded `Buffer`, `Array` or `String` and returns a `Buffer` or an `Array` of `Buffers`. If `skipRemainderCheck` is enabled `rlp` will just decode the first rlp sequence in the buffer. By default it would through an error if there is more bytes in Buffer than used by rlp sequence.

CLI
===
`rlp decode <hex string>`   
`rlp encode <json String>`  

TESTS
=====
test uses mocha. To run  
`npm test`
