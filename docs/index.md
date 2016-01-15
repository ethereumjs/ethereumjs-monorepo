# BN

[index.js:60-60](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L60-L60 "Source code on GitHub")

[`BN`](https://github.com/indutny/bn.js)

# MAX_INTEGER

[index.js:12-12](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L12-L12 "Source code on GitHub")

the max integer that this VM can handle (a `BN`)

# SHA3_NULL

[index.js:30-30](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L30-L30 "Source code on GitHub")

SHA3-256 hash of null (a `Buffer`)

# SHA3_NULL_S

[index.js:24-24](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L24-L24 "Source code on GitHub")

SHA3-256 hash of null (a `String`)

# SHA3_RLP

[index.js:54-54](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L54-L54 "Source code on GitHub")

SHA3-256 hash of the RLP of null (a `Buffer`)

# SHA3_RLP_ARRAY

[index.js:42-42](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L42-L42 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `Buffer`)

# SHA3_RLP_ARRAY_S

[index.js:36-36](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L36-L36 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `String`)

# SHA3_RLP_S

[index.js:48-48](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L48-L48 "Source code on GitHub")

SHA3-256 hash of the RLP of null  (a `String`)

# TWO_POW256

[index.js:18-18](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L18-L18 "Source code on GitHub")

2^256 (a `BN`)

# addHexPrefix

[index.js:397-403](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L397-L403 "Source code on GitHub")

Adds "0x" to a given `String` if it does not already start with "0x"

**Parameters**

-   `str` **String** 

Returns **String** 

# baToJSON

[index.js:502-512](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L502-L512 "Source code on GitHub")

Converts a `Buffer` or `Array` to JSON

**Parameters**

-   `ba` **Buffer or Array** 

Returns **Array** 

# bufferToInt

[index.js:200-207](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L200-L207 "Source code on GitHub")

Converts a `Buffer` to a `Number`

**Parameters**

-   `buf` **Buffer** 

Returns **Number** 

# defineProperties

[index.js:416-494](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L416-L494 "Source code on GitHub")

Defines properties on a `Object`. It make the assumption that underlying data is binary.

**Parameters**

-   `self` **Object** the `Object` to define properties on
-   `fields` **Array** an array fields to define. Fields can contain:-   `name` - the name of the properties
    -   `length` - the number of bytes the field can have
    -   `allowLess` - if the field can be less than the length
    -   `allowEmpty`
-   `data` **Any** data to be validated against the definitions

# fromSigned

[index.js:215-222](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L215-L222 "Source code on GitHub")

Interprets a `Buffer` as a signed integer and returns a `BN`

**Parameters**

-   `num` **Buffer** 

Returns **BN** 

# generateAddress

[index.js:342-355](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L342-L355 "Source code on GitHub")

Generates an address of a newly created contract

**Parameters**

-   `from` **Buffer** the address which is creating this new address
-   `nonce` **Buffer** the nonce of the from account

Returns **Buffer** 

# intToBuffer

[index.js:189-192](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L189-L192 "Source code on GitHub")

Converts an `Number` to a `Buffer`

**Parameters**

-   `i` **Number** 

Returns **Buffer** 

# intToHex

[index.js:172-181](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L172-L181 "Source code on GitHub")

Converts a `Number` into a hex `String`

**Parameters**

-   `i` **Number** 

Returns **String** 

# isHexPrefixed

[index.js:374-376](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L374-L376 "Source code on GitHub")

Returns a `Boolean` on whether or not the a `String` starts with "0x"

**Parameters**

-   `str` **String** 

Returns **Boolean** 

# isPrecompiled

[index.js:363-366](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L363-L366 "Source code on GitHub")

Returns true if the supplied address belongs to a precompiled account

**Parameters**

-   `address` **Buffer or String** 

Returns **Boolean** 

# pad

[index.js:94-102](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L94-L102 "Source code on GitHub")

Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters**

-   `msg` **Buffer or Array** the value to pad
-   `length` **Number** the number of bytes the output should be

Returns **Buffer or Array** 

# padToEven

[index.js:520-523](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L520-L523 "Source code on GitHub")

Pads a `String` to have an even length

**Parameters**

-   `a` **String** 

Returns **String** 

# privateToAddress

[index.js:331-333](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L331-L333 "Source code on GitHub")

Returns the ethereum address of a given private key

**Parameters**

-   `privateKey` **Buffer** 

Returns **Buffer** 

# pubToAddress

[index.js:301-311](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L301-L311 "Source code on GitHub")

Returns the ethereum address of a given public key.
Accepts "Ethereum public keys" and DER encoded keys.

**Parameters**

-   `pubKey` **Buffer** 

Returns **Buffer** 

# ripemd160

[index.js:274-282](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L274-L282 "Source code on GitHub")

Creates RIPEMD160 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `padded` **Boolean** whether it should be padded to 256 bits or not

Returns **Buffer** 

# rlp

[index.js:66-66](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L66-L66 "Source code on GitHub")

[`rlp`](https://github.com/ethereumjs/rlp)

# rlphash

[index.js:290-292](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L290-L292 "Source code on GitHub")

Creates SHA-3 hash of the RLP encoded version of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# rpad

[index.js:112-120](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L112-L120 "Source code on GitHub")

Pads an `Array` or `Buffer` with trailing zeros till it has `length` bytes
Or it truncates the end if it exceeds.

**Parameters**

-   `msg` **Buffer or Array** the value to pad
-   `length` **Number** the number of bytes the output should be

Returns **Buffer or Array** 

# secp256k1

[index.js:72-72](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L72-L72 "Source code on GitHub")

[`secp256k1`](https://github.com/cryptocoinjs/secp256k1-node/)

# sha256

[index.js:262-265](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L262-L265 "Source code on GitHub")

Creates SHA256 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# sha3

[index.js:245-254](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L245-L254 "Source code on GitHub")

Creates SHA-3 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `bytes` **[Number]** the SHA width (optional, default `256`)

Returns **Buffer** 

# stripHexPrefix

[index.js:384-389](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L384-L389 "Source code on GitHub")

Removes "0x" from a given `String`

**Parameters**

-   `str` **String** 

Returns **String** 

# toBuffer

[index.js:142-164](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L142-L164 "Source code on GitHub")

Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.

**Parameters**

-   `v` **Any** the value

# toUnsigned

[index.js:230-236](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L230-L236 "Source code on GitHub")

Converts a `BN` to an unsigned integer and returns it as a `Buffer`

**Parameters**

-   `num` **BN** 

Returns **Buffer** 

# unpad

[index.js:128-136](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L128-L136 "Source code on GitHub")

Trims leading zeros from a `Buffer` or an `Array`

**Parameters**

-   `a` **Buffer or Array or String** 

Returns **Buffer or Array or String** 

# zeros

[index.js:80-84](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L80-L84 "Source code on GitHub")

Returns a buffer filled with 0s

**Parameters**

-   `bytes` **Number** the number of bytes the buffer should be

Returns **Buffer** 

# privateToPublic

[index.js:319-323](https://github.com/ethereumjs/ethereumjs-util/blob/f4083cff39ead1804124f2cda3f4b83402e016f6/index.js#L319-L323 "Source code on GitHub")

Returns the ethereum public key of a given private key

**Parameters**

-   `privateKey` **Buffer** 

Returns **Buffer** 
