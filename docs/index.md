# BN

[index.js:60-60](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L60-L60 "Source code on GitHub")

[`BN`](https://github.com/indutny/bn.js)

# MAX_INTEGER

[index.js:12-12](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L12-L12 "Source code on GitHub")

the max integer that this VM can handle (a `BN`)

# SHA3_NULL

[index.js:30-30](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L30-L30 "Source code on GitHub")

SHA3-256 hash of null (a `Buffer`)

# SHA3_NULL_S

[index.js:24-24](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L24-L24 "Source code on GitHub")

SHA3-256 hash of null (a `String`)

# SHA3_RLP

[index.js:54-54](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L54-L54 "Source code on GitHub")

SHA3-256 hash of the RLP of null (a `Buffer`)

# SHA3_RLP_ARRAY

[index.js:42-42](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L42-L42 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `Buffer`)

# SHA3_RLP_ARRAY_S

[index.js:36-36](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L36-L36 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `String`)

# SHA3_RLP_S

[index.js:48-48](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L48-L48 "Source code on GitHub")

SHA3-256 hash of the RLP of null  (a `String`)

# TWO_POW256

[index.js:18-18](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L18-L18 "Source code on GitHub")

2^256 (a `BN`)

# addHexPrefix

[index.js:388-394](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L388-L394 "Source code on GitHub")

Adds "0x" to a given `String` if it does not already start with "0x"

**Parameters**

-   `str` **String** 

Returns **String** 

# baToJSON

[index.js:446-456](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L446-L456 "Source code on GitHub")

Converts a `Buffer` or `Array` to JSON

**Parameters**

-   `ba` **Buffer or Array** 

Returns **Array or String or ** 

# bufferToInt

[index.js:191-198](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L191-L198 "Source code on GitHub")

Converts a `Buffer` to a `Number`

**Parameters**

-   `buf` **Buffer** 

Returns **Number** 

# defineProperties

[index.js:469-549](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L469-L549 "Source code on GitHub")

Defines properties on a `Object`. It make the assumption that underlying data is binary.

**Parameters**

-   `self` **Object** the `Object` to define properties on
-   `fields` **Array** an array fields to define. Fields can contain:-   `name` - the name of the properties
    -   `length` - the number of bytes the field can have
    -   `allowLess` - if the field can be less than the length
    -   `allowEmpty`
-   `data` **Any** data to be validated against the definitions

# ecrecover

[index.js:433-438](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L433-L438 "Source code on GitHub")

ECDSA public key recovery from signature

**Parameters**

-   `msgHash` **Buffer** 
-   `v` **Buffer** 
-   `r` **Buffer** 
-   `s` **Buffer** 

Returns **Buffer** publicKey

# ecsign

[index.js:414-422](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L414-L422 "Source code on GitHub")

ECDSA sign

**Parameters**

-   `msgHash` **Buffer** 
-   `privateKey` **Buffer** 

Returns **Object** 

# fromSigned

[index.js:206-213](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L206-L213 "Source code on GitHub")

Interprets a `Buffer` as a signed integer and returns a `BN`

**Parameters**

-   `num` **Buffer** 

Returns **BN** 

# generateAddress

[index.js:332-346](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L332-L346 "Source code on GitHub")

Generates an address of a newly created contract

**Parameters**

-   `from` **Buffer** the address which is creating this new address
-   `nonce` **Buffer** the nonce of the from account

Returns **Buffer** 

# intToBuffer

[index.js:180-183](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L180-L183 "Source code on GitHub")

Converts an `Number` to a `Buffer`

**Parameters**

-   `i` **Number** 

Returns **Buffer** 

# intToHex

[index.js:163-172](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L163-L172 "Source code on GitHub")

Converts a `Number` into a hex `String`

**Parameters**

-   `i` **Number** 

Returns **String** 

# isHexPrefixed

[index.js:365-367](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L365-L367 "Source code on GitHub")

Returns a `Boolean` on whether or not the a `String` starts with "0x"

**Parameters**

-   `str` **String** 

Returns **Boolean** 

# isPrecompiled

[index.js:354-357](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L354-L357 "Source code on GitHub")

Returns true if the supplied address belongs to a precompiled account

**Parameters**

-   `address` **Buffer or String** 

Returns **Boolean** 

# padToEven

[index.js:402-405](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L402-L405 "Source code on GitHub")

Pads a `String` to have an even length

**Parameters**

-   `a` **String** 

Returns **String** 

# privateToAddress

[index.js:321-323](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L321-L323 "Source code on GitHub")

Returns the ethereum address of a given private key

**Parameters**

-   `privateKey` **Buffer** A private key must be 256 bits wide

Returns **Buffer** 

# pubToAddress

[index.js:293-301](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L293-L301 "Source code on GitHub")

Returns the ethereum address of a given public key.
Accepts "Ethereum public keys" and SEC1 encoded keys.

**Parameters**

-   `pubKey` **Buffer** The two points of an uncompressed key, unless sanitize is enabled
-   `sanitize` **Boolean** Accept public keys in other formats

Returns **Buffer** 

# ripemd160

[index.js:265-273](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L265-L273 "Source code on GitHub")

Creates RIPEMD160 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `padded` **Boolean** whether it should be padded to 256 bits or not

Returns **Buffer** 

# rlp

[index.js:66-66](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L66-L66 "Source code on GitHub")

[`rlp`](https://github.com/ethereumjs/rlp)

# rlphash

[index.js:281-283](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L281-L283 "Source code on GitHub")

Creates SHA-3 hash of the RLP encoded version of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# secp256k1

[index.js:72-72](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L72-L72 "Source code on GitHub")

[`secp256k1`](https://github.com/cryptocoinjs/secp256k1-node/)

# setLength

[index.js:95-111](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L95-L111 "Source code on GitHub")

Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters**

-   `msg` **Buffer or Array** the value to pad
-   `length` **Number** the number of bytes the output should be
-   `right` **[Boolean]** whether to start padding form the left or right (optional, default `false`)

Returns **Buffer or Array** 

# sha256

[index.js:253-256](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L253-L256 "Source code on GitHub")

Creates SHA256 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# sha3

[index.js:236-245](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L236-L245 "Source code on GitHub")

Creates SHA-3 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `bytes` **[Number]** the SHA width (optional, default `256`)

Returns **Buffer** 

# stripHexPrefix

[index.js:375-380](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L375-L380 "Source code on GitHub")

Removes "0x" from a given `String`

**Parameters**

-   `str` **String** 

Returns **String** 

# toBuffer

[index.js:133-155](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L133-L155 "Source code on GitHub")

Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.

**Parameters**

-   `v` **Any** the value

# toUnsigned

[index.js:221-227](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L221-L227 "Source code on GitHub")

Converts a `BN` to an unsigned integer and returns it as a `Buffer`

**Parameters**

-   `num` **BN** 

Returns **Buffer** 

# unpad

[index.js:119-127](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L119-L127 "Source code on GitHub")

Trims leading zeros from a `Buffer` or an `Array`

**Parameters**

-   `a` **Buffer or Array or String** 

Returns **Buffer or Array or String** 

# zeros

[index.js:80-84](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L80-L84 "Source code on GitHub")

Returns a buffer filled with 0s

**Parameters**

-   `bytes` **Number** the number of bytes the buffer should be

Returns **Buffer** 

# privateToPublic

[index.js:309-313](https://github.com/ethereumjs/ethereumjs-util/blob/2f7bdfc8b8148cd9520e297b2db8d09c18ae2d76/index.js#L309-L313 "Source code on GitHub")

Returns the ethereum public key of a given private key

**Parameters**

-   `privateKey` **Buffer** A private key must be 256 bits wide

Returns **Buffer** 
