# SYNOPSIS [![Build Status](https://travis-ci.org/ethereum/ethereumjs-util.svg)](https://travis-ci.org/ethereum/ethereumjs-util)
A collection of utility functions for ethereum. It can be used in node.js or can be in the browser with browserify.

# CONTACT
 [Scrollback](https://scrollback.io/ethereumjs/all/all-messages) or #ethereumjs on freenode

# API
## properties
 - `MAX_INTEGER`  - The max interger that the VM can handle
 -  `TWO_POW256` - 2^256
 -  `SHA3_NULL` - SHA3-256 hash of `null`
 -  `SHA3_RLP_ARRAY` - SHA3-256 of an rlp of an empty array
 -  `SHA3_RLP` - SHA3-256 hash of the rlp of `null`
 -  `ETH_UNITS` - an array of ethereum units

## methods 
### `zeros(number)`
Returns buffer filled with 0's
- `number` - the number bytes to to return

### `pad(val, length)`
pads an `array` or `buffer` with leading zeros till it has `length` bytes
- `val`  - the value to pad
- `length` - the of the resulting value

### `unpad(val)`
Trims leading zeros from a buffer or an array
- `val` - a `buffer` to unpad

### `intToHex(int)`
Converts an `Integer` into a hex `String`
- `int`

### `intToBuffer(int)`
Converts an `Integer` to a `Buffer`
- `int`

### `bufferToInt(buf)`
converts a `Buffer` to an `Interger`
- `buf`

### `fromSigned(buf)`
interpets a `Buffer` as a signed `Integer` and returns a `Bignum`
- `buf`

### `toUnsigned(num)`
Converts a `bignum` to an unsigned interger and returns it as a `buffer`
- `num` - a `bignum`

### `publicToAddress(pubKey)`
Returns the ethereum address of a given public key
- `pubKey` - the public key as a `buffer`

### `privateToAddress(privateKey)`
Returns the ethereum address of a given private key
- `privateKey` - the private key as a `buffer`

### `privateToPublic(privateKey)`
Returns the ethereum public key of a given private key
- `privateKey` - the private key as a `buffer`

### `generateAddress(from, nonce)` 
Generates an address of a newly created contract
- `from` - the address creating contract
- `nonce` - the creating accounts nonce

### `sha3(a, bytes)`  
Returns a sha3 of `a` of the length of `bytes`
- `a` the value to hash
- `bytes` how many bytes the hash should be

### `defineProperties(self, fields)`
defines properties on a `Object`
- `self` - the `Object` to define properties on
- `fields` - an array fields to define

### `validate(fields, data)`
Validate defined fields
- `fields`
- `data`

### `printBA(ba)`
Print a Buffer Array
- `ba` - an `Array` of `Buffers`

### `baToJSON(ba)`
converts a buffer array to JSON
- `ba` - an `Array` of `Buffers`

### `isHexPrefixed(String)`
Returns a Boolean on whether or not the a sting starts with `0x`

### `stripHexPrefix(String)`
Removes `0x` from a given String

### `addHexPrefix(String)`
Adds `0x` to a given string if it does not already start with `0x`

# TESTING
Node.js Tests use Mocha. Test in the browser use Testling.

# LICENSE
GPL
