# addHexPrefix

[index.js:423-429](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L423-L429 "Source code on GitHub")

Adds "0x" to a given `String` if it does not already start with "0x"

**Parameters**

-   `str` **String** 

Returns **String** 

# baToJSON

[index.js:484-494](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L484-L494 "Source code on GitHub")

Converts a `Buffer` or `Array` to JSON

**Parameters**

-   `ba` **Buffer or Array** 

Returns **Array or String or ** 

# BN

[index.js:60-60](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L60-L60 "Source code on GitHub")

[`BN`](https://github.com/indutny/bn.js)

# bufferToInt

[index.js:203-210](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L203-L210 "Source code on GitHub")

Converts a `Buffer` to a `Number`

**Parameters**

-   `buf` **Buffer** 

Returns **Number** 

# defineProperties

[index.js:507-600](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L507-L600 "Source code on GitHub")

Defines properties on a `Object`. It make the assumption that underlying data is binary.

**Parameters**

-   `self` **Object** the `Object` to define properties on
-   `fields` **Array** an array fields to define. Fields can contain:-   `name` - the name of the properties
    -   `length` - the number of bytes the field can have
    -   `allowLess` - if the field can be less than the length
    -   `allowEmpty`
-   `data` **Any** data to be validated against the definitions

# ecrecover

[index.js:468-476](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L468-L476 "Source code on GitHub")

ECDSA public key recovery from signature

**Parameters**

-   `msgHash` **Buffer** 
-   `v` **Buffer** 
-   `r` **Buffer** 
-   `s` **Buffer** 

Returns **Buffer** publicKey

# ecsign

[index.js:449-457](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L449-L457 "Source code on GitHub")

ECDSA sign

**Parameters**

-   `msgHash` **Buffer** 
-   `privateKey` **Buffer** 

Returns **Object** 

# fromSigned

[index.js:218-220](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L218-L220 "Source code on GitHub")

Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.

**Parameters**

-   `num` **Buffer** 

Returns **BN** 

# generateAddress

[index.js:367-381](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L367-L381 "Source code on GitHub")

Generates an address of a newly created contract

**Parameters**

-   `from` **Buffer** the address which is creating this new address
-   `nonce` **Buffer** the nonce of the from account

Returns **Buffer** 

# intToBuffer

[index.js:192-195](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L192-L195 "Source code on GitHub")

Converts an `Number` to a `Buffer`

**Parameters**

-   `i` **Number** 

Returns **Buffer** 

# intToHex

[index.js:175-184](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L175-L184 "Source code on GitHub")

Converts a `Number` into a hex `String`

**Parameters**

-   `i` **Number** 

Returns **String** 

# isHexPrefixed

[index.js:400-402](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L400-L402 "Source code on GitHub")

Returns a `Boolean` on whether or not the a `String` starts with "0x"

**Parameters**

-   `str` **String** 

Returns **Boolean** 

# isPrecompiled

[index.js:389-392](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L389-L392 "Source code on GitHub")

Returns true if the supplied address belongs to a precompiled account

**Parameters**

-   `address` **Buffer or String** 

Returns **Boolean** 

# isValidChecksumAddress

[index.js:356-358](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L356-L358 "Source code on GitHub")

Checks if the address is a valid checksummed address

**Parameters**

-   `address` **Buffer** 

Returns **Boolean** 

# MAX_INTEGER

[index.js:12-12](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L12-L12 "Source code on GitHub")

the max integer that this VM can handle (a `BN`)

# padToEven

[index.js:437-440](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L437-L440 "Source code on GitHub")

Pads a `String` to have an even length

**Parameters**

-   `a` **String** 

Returns **String** 

# privateToAddress

[index.js:324-326](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L324-L326 "Source code on GitHub")

Returns the ethereum address of a given private key

**Parameters**

-   `privateKey` **Buffer** A private key must be 256 bits wide

Returns **Buffer** 

# pubToAddress

[index.js:296-304](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L296-L304 "Source code on GitHub")

Returns the ethereum address of a given public key.
Accepts "Ethereum public keys" and SEC1 encoded keys.

**Parameters**

-   `pubKey` **Buffer** The two points of an uncompressed key, unless sanitize is enabled
-   `sanitize` **Boolean** Accept public keys in other formats

Returns **Buffer** 

# ripemd160

[index.js:268-276](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L268-L276 "Source code on GitHub")

Creates RIPEMD160 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `padded` **Boolean** whether it should be padded to 256 bits or not

Returns **Buffer** 

# rlp

[index.js:66-66](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L66-L66 "Source code on GitHub")

[`rlp`](https://github.com/ethereumjs/rlp)

# rlphash

[index.js:284-286](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L284-L286 "Source code on GitHub")

Creates SHA-3 hash of the RLP encoded version of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# secp256k1

[index.js:72-72](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L72-L72 "Source code on GitHub")

[`secp256k1`](https://github.com/cryptocoinjs/secp256k1-node/)

# setLengthLeft

[index.js:95-111](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L95-L111 "Source code on GitHub")

Left Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters**

-   `msg` **Buffer or Array** the value to pad
-   `length` **Number** the number of bytes the output should be
-   `right` **[Boolean]** whether to start padding form the left or right (optional, default `false`)

Returns **Buffer or Array** 

# setLengthRight

[index.js:121-123](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L121-L123 "Source code on GitHub")

Right Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters**

-   `msg` **Buffer or Array** the value to pad
-   `length` **Number** the number of bytes the output should be

Returns **Buffer or Array** 

# sha256

[index.js:256-259](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L256-L259 "Source code on GitHub")

Creates SHA256 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# sha3

[index.js:239-248](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L239-L248 "Source code on GitHub")

Creates SHA-3 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `bytes` **[Number]** the SHA width (optional, default `256`)

Returns **Buffer** 

# SHA3_NULL

[index.js:30-30](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L30-L30 "Source code on GitHub")

SHA3-256 hash of null (a `Buffer`)

# SHA3_NULL_S

[index.js:24-24](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L24-L24 "Source code on GitHub")

SHA3-256 hash of null (a `String`)

# SHA3_RLP

[index.js:54-54](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L54-L54 "Source code on GitHub")

SHA3-256 hash of the RLP of null (a `Buffer`)

# SHA3_RLP_ARRAY

[index.js:42-42](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L42-L42 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `Buffer`)

# SHA3_RLP_ARRAY_S

[index.js:36-36](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L36-L36 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `String`)

# SHA3_RLP_S

[index.js:48-48](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L48-L48 "Source code on GitHub")

SHA3-256 hash of the RLP of null  (a `String`)

# stripHexPrefix

[index.js:410-415](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L410-L415 "Source code on GitHub")

Removes "0x" from a given `String`

**Parameters**

-   `str` **String** 

Returns **String** 

# toBuffer

[index.js:145-167](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L145-L167 "Source code on GitHub")

Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.

**Parameters**

-   `v` **Any** the value

# toChecksumAddress

[index.js:334-348](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L334-L348 "Source code on GitHub")

Returns a checksummed address

**Parameters**

-   `address` **String** 

Returns **String** 

# toUnsigned

[index.js:228-230](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L228-L230 "Source code on GitHub")

Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

**Parameters**

-   `num` **BN** 

Returns **Buffer** 

# TWO_POW256

[index.js:18-18](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L18-L18 "Source code on GitHub")

2^256 (a `BN`)

# unpad

[index.js:131-139](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L131-L139 "Source code on GitHub")

Trims leading zeros from a `Buffer` or an `Array`

**Parameters**

-   `a` **Buffer or Array or String** 

Returns **Buffer or Array or String** 

# zeros

[index.js:80-84](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L80-L84 "Source code on GitHub")

Returns a buffer filled with 0s

**Parameters**

-   `bytes` **Number** the number of bytes the buffer should be

Returns **Buffer** 

# privateToPublic

[index.js:312-316](https://github.com/ethereumjs/ethereumjs-util/blob/18b6027fcfd16b1f325830c42e7bb5afcd70be83/index.js#L312-L316 "Source code on GitHub")

Returns the ethereum public key of a given private key

**Parameters**

-   `privateKey` **Buffer** A private key must be 256 bits wide

Returns **Buffer** 
