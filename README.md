# SYNOPSIS
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
 [![Build Status](https://travis-ci.org/ethereum/ethereumjs-util.svg)](https://travis-ci.org/ethereum/ethereumjs-util)  [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/ethereum/ethereumjs-lib?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge) or #ethereumjs on freenode  
 
A collection of utility functions for ethereum. It can be used in node.js or can be in the browser with browserify.

# API
## properties
 - `MAX_INTEGER`  - The max interger that the VM can handle
 -  `TWO_POW256` - 2^256
 -  `SHA3_NULL` - SHA3-256 hash of `null`
 -  `SHA3_RLP_ARRAY` - SHA3-256 of an rlp of an empty array
 -  `SHA3_RLP` - SHA3-256 hash of the rlp of `null`
 -  `ETH_UNITS` - an array of ethereum units
 -  [`BN`](https://github.com/indutny/bn.js)
 -  [`rlp`](https://github.com/wanderer/rlp)

## methods 
### `zeros(number)`
Returns buffer filled with 0's  
**Parameters** 
- `number` - the number bytes to to return  

**Return:** `buffer`

### `pad(val, length)`
pads an `array` or `buffer` with leading zeros till it has `length` bytes  
**Parameters** 
- `val`  - the value to pad
- `length` - the of the resulting value  

**Return:** `array` or `buffer`

### `unpad(val)`
Trims leading zeros from a buffer or an array  
**Parameters** 
- `val` - a `buffer` or and `Array` to unpad  

**Return:** `buffer` or and `Array`

### `toBufer(val)`
Attemps to turn a value into a Buffer  
**Parameters** 
- `val` the 

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
converts a `Buffer` to an `Interger`  
**Parameters** 
- `buf`  

**Return:** `Interger`

### `fromSigned(buf)`
interpets a `Buffer` as a signed `Integer`  
**Parameters** 
- `buf`  

**Return:** [`BN.js`](https://github.com/indutny/bn.js)

### `toUnsigned(num)`
Converts a [`BN.js`](https://github.com/indutny/bn.js) to an unsigned interger   
**Parameters**   
- `num` - a [`BN.js`](https://github.com/indutny/bn.js)  

**Return:** `buffer`

### `publicToAddress(pubKey)`
Returns the ethereum address of a given public key   
**Parameters**  
- `pubKey` - the public key as a `buffer`  

**Return:** : `buffer`

### `privateToAddress(privateKey)`
Returns the ethereum address of a given private key  
**Parameters**  
- `privateKey` - the private key as a `buffer`  

**Return:** `Buffer`

### `privateToPublic(privateKey)`
Returns the ethereum public key of a given private key  
**Parameters**  
- `privateKey` - the private key as a `buffer`

**Return:** `Buffer`

### `generateAddress(from, nonce)` 
Generates an address of a newly created contract. Don't forget to incerment the nonce to get the correct address.  
**Parameters**  
- `from` - the address of the account creating the contract
- `nonce` - the creating accounts nonce  

**Return:** `Buffer`

### `sha3(a, bytes)`  
Returns a sha3 of `a` of the length of `bytes`  
**Parameters** 
- `a` the value to hash
- `bytes` how many bytes the hash should be  

**Return:** `Buffer`  

### `printBA(ba)`
Print a Buffer Array  
**Parameters**   
- `ba` - an `Array` of `Buffers`  

**Return:** a Buffer Array

### `baToJSON(ba)`
converts a buffer array to JSON  
**Parameters** 
- `ba` - an `Array` of `Buffers`  

**Return:** a JSON Object

### `isHexPrefixed(String)`
Returns a Boolean on whether or not the a sting starts with `0x`  
**Parameters** 
- String - a `String`   

**Return:** `String` 

### `stripHexPrefix(String)`
Removes `0x` from a given String  
**Parameters** 
- String - a `String`   

**Return:** `String`

### `addHexPrefix(String)`
Adds `0x` to a given string if it does not already start with `0x`  
**Parameters**   
- `string`  

**Return:** `string`

### `defineProperties(self, fields)`
defines properties on a `Object`. It make the assumtion that underlying data is binary.
**Parameters**   
- `self` - the `Object` to define properties on
- `fields` - an array fields to define. Fields can contain
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
