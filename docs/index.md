# addHexPrefix

[index.js:560-566](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L560-L566 "Source code on GitHub")

Adds "0x" to a given `String` if it does not already start with "0x"

**Parameters**

-   `str` **String** 

Returns **String** 

# baToJSON

[index.js:585-595](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L585-L595 "Source code on GitHub")

Converts a `Buffer` or `Array` to JSON

**Parameters**

-   `ba` **Buffer or Array** 

Returns **Array or String or ** 

# BN

[index.js:60-60](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L60-L60 "Source code on GitHub")

[`BN`](https://github.com/indutny/bn.js)

# bufferToHex

[index.js:213-220](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L213-L220 "Source code on GitHub")

Converts a `Buffer` into a hex `String`

**Parameters**

-   `buf` **Buffer** 

Returns **String** 

# bufferToInt

[index.js:203-205](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L203-L205 "Source code on GitHub")

Converts a `Buffer` to a `Number`

**Parameters**

-   `buf` **Buffer** 

Returns **Number** 

# defineProperties

[index.js:608-701](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L608-L701 "Source code on GitHub")

Defines properties on a `Object`. It make the assumption that underlying data is binary.

**Parameters**

-   `self` **Object** the `Object` to define properties on
-   `fields` **Array** an array fields to define. Fields can contain:-   `name` - the name of the properties
    -   `length` - the number of bytes the field can have
    -   `allowLess` - if the field can be less than the length
    -   `allowEmpty`
-   `data` **Any** data to be validated against the definitions

# ecrecover

[index.js:399-407](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L399-L407 "Source code on GitHub")

ECDSA public key recovery from signature

**Parameters**

-   `msgHash` **Buffer** 
-   `v` **Buffer** 
-   `r` **Buffer** 
-   `s` **Buffer** 

Returns **Buffer** publicKey

# ecsign

[index.js:380-388](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L380-L388 "Source code on GitHub")

ECDSA sign

**Parameters**

-   `msgHash` **Buffer** 
-   `privateKey` **Buffer** 

Returns **Object** 

# fromRpcSig

[index.js:429-443](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L429-L443 "Source code on GitHub")

Convert signature format of the `eth_sign` RPC method to signature parameters

**Parameters**

-   `sig` **String** 

Returns **Object** 

# fromSigned

[index.js:228-230](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L228-L230 "Source code on GitHub")

Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.

**Parameters**

-   `num` **Buffer** 

Returns **BN** 

# generateAddress

[index.js:504-518](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L504-L518 "Source code on GitHub")

Generates an address of a newly created contract

**Parameters**

-   `from` **Buffer** the address which is creating this new address
-   `nonce` **Buffer** the nonce of the from account

Returns **Buffer** 

# importPublic

[index.js:365-371](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L365-L371 "Source code on GitHub")

Converts a public key to the Ethereum format.

**Parameters**

-   `publicKey` **Buffer** 

Returns **Buffer** 

# intToBuffer

[index.js:192-195](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L192-L195 "Source code on GitHub")

Converts an `Number` to a `Buffer`

**Parameters**

-   `i` **Number** 

Returns **Buffer** 

# intToHex

[index.js:175-184](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L175-L184 "Source code on GitHub")

Converts a `Number` into a hex `String`

**Parameters**

-   `i` **Number** 

Returns **String** 

# isHexPrefixed

[index.js:537-539](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L537-L539 "Source code on GitHub")

Returns a `Boolean` on whether or not the a `String` starts with "0x"

**Parameters**

-   `str` **String** 

Returns **Boolean** 

# isPrecompiled

[index.js:526-529](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L526-L529 "Source code on GitHub")

Returns true if the supplied address belongs to a precompiled account

**Parameters**

-   `address` **Buffer or String** 

Returns **Boolean** 

# isValidAddress

[index.js:461-463](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L461-L463 "Source code on GitHub")

Checks if the address is a valid. Accepts checksummed addresses too

**Parameters**

-   `address` **String** 

Returns **Boolean** 

# isValidChecksumAddress

[index.js:493-495](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L493-L495 "Source code on GitHub")

Checks if the address is a valid checksummed address

**Parameters**

-   `address` **Buffer** 

Returns **Boolean** 

# isValidPrivate

[index.js:304-306](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L304-L306 "Source code on GitHub")

Checks if the private key satisfies the rules of the curve secp256k1.

**Parameters**

-   `privateKey` **Buffer** 

Returns **Boolean** 

# isValidPublic

[index.js:316-327](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L316-L327 "Source code on GitHub")

Checks if the public key satisfies the rules of the curve secp256k1
and the requirements of Ethereum.

**Parameters**

-   `publicKey` **Buffer** The two points of an uncompressed key, unless sanitize is enabled
-   `sanitize` **[Boolean]** Accept public keys in other formats (optional, default `false`)

Returns **Boolean** 

# MAX_INTEGER

[index.js:12-12](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L12-L12 "Source code on GitHub")

the max integer that this VM can handle (a `BN`)

# padToEven

[index.js:574-577](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L574-L577 "Source code on GitHub")

Pads a `String` to have an even length

**Parameters**

-   `a` **String** 

Returns **String** 

# privateToAddress

[index.js:451-453](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L451-L453 "Source code on GitHub")

Returns the ethereum address of a given private key

**Parameters**

-   `privateKey` **Buffer** A private key must be 256 bits wide

Returns **Buffer** 

# pubToAddress

[index.js:337-345](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L337-L345 "Source code on GitHub")

Returns the ethereum address of a given public key.
Accepts "Ethereum public keys" and SEC1 encoded keys.

**Parameters**

-   `pubKey` **Buffer** The two points of an uncompressed key, unless sanitize is enabled
-   `sanitize` **[Boolean]** Accept public keys in other formats (optional, default `false`)

Returns **Buffer** 

# ripemd160

[index.js:278-286](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L278-L286 "Source code on GitHub")

Creates RIPEMD160 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `padded` **Boolean** whether it should be padded to 256 bits or not

Returns **Buffer** 

# rlp

[index.js:66-66](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L66-L66 "Source code on GitHub")

[`rlp`](https://github.com/ethereumjs/rlp)

# rlphash

[index.js:294-296](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L294-L296 "Source code on GitHub")

Creates SHA-3 hash of the RLP encoded version of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# secp256k1

[index.js:72-72](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L72-L72 "Source code on GitHub")

[`secp256k1`](https://github.com/cryptocoinjs/secp256k1-node/)

# setLengthLeft

[index.js:95-111](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L95-L111 "Source code on GitHub")

Left Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters**

-   `msg` **Buffer or Array** the value to pad
-   `length` **Number** the number of bytes the output should be
-   `right` **[Boolean]** whether to start padding form the left or right (optional, default `false`)

Returns **Buffer or Array** 

# setLengthRight

[index.js:121-123](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L121-L123 "Source code on GitHub")

Right Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters**

-   `msg` **Buffer or Array** the value to pad
-   `length` **Number** the number of bytes the output should be

Returns **Buffer or Array** 

# sha256

[index.js:266-269](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L266-L269 "Source code on GitHub")

Creates SHA256 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# sha3

[index.js:249-258](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L249-L258 "Source code on GitHub")

Creates SHA-3 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `bytes` **[Number]** the SHA width (optional, default `256`)

Returns **Buffer** 

# SHA3_NULL

[index.js:30-30](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L30-L30 "Source code on GitHub")

SHA3-256 hash of null (a `Buffer`)

# SHA3_NULL_S

[index.js:24-24](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L24-L24 "Source code on GitHub")

SHA3-256 hash of null (a `String`)

# SHA3_RLP

[index.js:54-54](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L54-L54 "Source code on GitHub")

SHA3-256 hash of the RLP of null (a `Buffer`)

# SHA3_RLP_ARRAY

[index.js:42-42](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L42-L42 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `Buffer`)

# SHA3_RLP_ARRAY_S

[index.js:36-36](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L36-L36 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `String`)

# SHA3_RLP_S

[index.js:48-48](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L48-L48 "Source code on GitHub")

SHA3-256 hash of the RLP of null  (a `String`)

# stripHexPrefix

[index.js:547-552](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L547-L552 "Source code on GitHub")

Removes "0x" from a given `String`

**Parameters**

-   `str` **String** 

Returns **String** 

# toBuffer

[index.js:145-167](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L145-L167 "Source code on GitHub")

Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.

**Parameters**

-   `v` **Any** the value

# toChecksumAddress

[index.js:471-485](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L471-L485 "Source code on GitHub")

Returns a checksummed address

**Parameters**

-   `address` **String** 

Returns **String** 

# toRpcSig

[index.js:417-421](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L417-L421 "Source code on GitHub")

Convert signature parameters into the format of `eth_sign` RPC method

**Parameters**

-   `v` **Number** 
-   `r` **Buffer** 
-   `s` **Buffer** 

Returns **String** sig

# toUnsigned

[index.js:238-240](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L238-L240 "Source code on GitHub")

Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

**Parameters**

-   `num` **BN** 

Returns **Buffer** 

# TWO_POW256

[index.js:18-18](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L18-L18 "Source code on GitHub")

2^256 (a `BN`)

# unpad

[index.js:131-139](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L131-L139 "Source code on GitHub")

Trims leading zeros from a `Buffer` or an `Array`

**Parameters**

-   `a` **Buffer or Array or String** 

Returns **Buffer or Array or String** 

# zeros

[index.js:80-84](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L80-L84 "Source code on GitHub")

Returns a buffer filled with 0s

**Parameters**

-   `bytes` **Number** the number of bytes the buffer should be

Returns **Buffer** 

# privateToPublic

[index.js:353-357](https://github.com/ethereumjs/ethereumjs-util/blob/3527634ea80decbf2915ceafd8f3e259c004b9d3/index.js#L353-L357 "Source code on GitHub")

Returns the ethereum public key of a given private key

**Parameters**

-   `privateKey` **Buffer** A private key must be 256 bits wide

Returns **Buffer** 
