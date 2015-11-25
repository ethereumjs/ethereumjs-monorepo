# SYNOPSIS
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
 [![Build Status](https://travis-ci.org/ethereum/ethereumjs-util.svg)](https://travis-ci.org/ethereum/ethereumjs-util)  [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/ethereumjs-lib?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or #ethereumjs on freenode  

A collection of utility functions for ethereum. It can be used in node.js or can be in the browser with browserify.

# API
## properties
 - `MAX_INTEGER`  - The max integer that the VM can handle
 -  `TWO_POW256` - 2^256
 -  `SHA3_NULL` - SHA3-256 hash of `null`
 -  `SHA3_RLP_ARRAY` - SHA3-256 of an RLP of an empty array
 -  `SHA3_RLP` - SHA3-256 hash of the RLP of `null`
 -  `ETH_UNITS` - an array of ethereum units
 -  [`BN`](https://github.com/indutny/bn.js)
 -  [`rlp`](https://github.com/wanderer/rlp)

## methods
### `zeros(number)`
Returns buffer filled with 0's  
**Parameters**
- `number` - the number of bytes to return

**Return:** `Buffer`

### `pad(val, length)`
Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes
**Parameters**
- `val`  - the value to pad
- `length` - the of the resulting value  

**Return:** `Array` or `Buffer`

### `rpad(val, length)`
Pads an `Array` or `Buffer` with trailing zeros till it has `length` bytes
**Parameters**
- `val`  - the value to pad
- `length` - the of the resulting value

**Return:** `Array` or `Buffer`

### `unpad(val)`
Trims leading zeros from a `Buffer` or an `Array`
**Parameters**
- `val` - a `Buffer` or an `Array` to unpad

**Return:** `Buffer` or `Array`

### `toBuffer(val)`
Attempts to turn a value into a Buffer. Attempts to turn a value into a Buffer. Supports Buffer, string, number, null/undefined, BN.js or other objects with a toArray() method.

**Parameters**
- `val` the object to be converted

**Return:** `Buffer`

### `intToHex(int)`
Converts an `Integer` into a hex `String`
**Parameters**
- `int`  

**Return:** `String`

### `intToBuffer(int)`
Converts an `Integer` to a `Buffer`
**Parameters**
- `int`  

**Return:** `Buffer`

### `bufferToInt(buf)`
Converts a `Buffer` to an `Integer`
**Parameters**
- `buf`  

**Return:** `Interger`

### `fromSigned(buf)`
Interprets a `Buffer` as a signed `Integer`
**Parameters**
- `buf`  

**Return:** [`BN.js`](https://github.com/indutny/bn.js)

### `toUnsigned(num)`
Converts a [`BN.js`](https://github.com/indutny/bn.js) to an unsigned integer
**Parameters**   
- `num` - a [`BN.js`](https://github.com/indutny/bn.js)  

**Return:** `buffer`

### `publicToAddress(pubKey)`
Returns the ethereum address of a given public key   
**Parameters**  
- `pubKey` - the public key as a `Buffer`

**Return:** : `Buffer`

### `privateToAddress(privateKey)`
Returns the ethereum address of a given private key  
**Parameters**  
- `privateKey` - the private key as a `Buffer`

**Return:** `Buffer`

### `privateToPublic(privateKey)`
Returns the ethereum public key of a given private key
**Parameters**  
- `privateKey` - the private key as a `Buffer`

**Return:** `Buffer`

### `generateAddress(from, nonce)`
Generates an address of a newly created contract. Don't forget to increment the nonce to get the correct address.
**Parameters**  
- `from` - the address of the account creating the contract
- `nonce` - the creating accounts nonce  

**Return:** `Buffer`

### `sha3(a, bytes)`
Returns a sha3 of `a` of the length of `bytes`  
**Parameters**
- `a` - the value to hash
- `bytes` - how many bytes the hash should be

**Return:** `Buffer`  

### `sha256(a, bytes)`
Returns a sha256 of `a`
**Parameters**
- `a` - the value to hash

**Return:** `Buffer`

### `ripemd160(a, bytes)`
Returns a ripemd160 of `a`
**Parameters**
- `a` - the value to hash
- `padded` - pad the hash to 256 bits with zeroes

**Return:** `Buffer`

### `printBA(ba)`
Print a Buffer Array  
**Parameters**   
- `ba` - an `Array` of `Buffers`

**Return:** a Buffer Array

### `baToJSON(ba)`
Converts a buffer array to JSON
**Parameters**
- `ba` - an `Array` of `Buffers`

**Return:** a JSON Object

### `isHexPrefixed(string)`
Returns a Boolean on whether or not the String starts with `0x`
**Parameters**
- `string` - a `String`

**Return:** `Boolean`

### `stripHexPrefix(string)`
Removes `0x` from a given String  
**Parameters**
- `string` - a `String`

**Return:** `String`

### `addHexPrefix(string)`
Adds `0x` to a given string if it does not already start with `0x`  
**Parameters**   
- `string` - a `String`

**Return:** `string`

### `defineProperties(self, fields)`
Defines properties on a `Object`. It make the assumption that underlying data is binary.
**Parameters**   
- `self` - the `Object` to define properties on
- `fields` - an array fields to define. Fields can contain:
 - `name` the name of the properties
 - `length` the number of bytes the field can have
 - `allowLess` if the field can be less than the `length`
 - `allowEmpty`

### `validate(fields, data)`
Validate defined fields  
**Parameters**   
- `fields`
- `data`

**Return:** `Boolean`

# TESTING
Node.js Tests use Mocha. Test in the browser use Testling.

# LICENSE
MPL-2.0
