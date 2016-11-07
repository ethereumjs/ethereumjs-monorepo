# addHexPrefix

[index.js:535-541](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L535-L541 "Source code on GitHub")

Adds "0x" to a given `String` if it does not already start with "0x"

**Parameters**

-   `str` **String** 

Returns **String** 

# baToJSON

[index.js:594-604](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L594-L604 "Source code on GitHub")

Converts a `Buffer` or `Array` to JSON

**Parameters**

-   `ba` **Buffer or Array** 

Returns **Array or String or ** 

# BN

[index.js:60-60](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L60-L60 "Source code on GitHub")

[`BN`](https://github.com/indutny/bn.js)

# bufferToHex

[index.js:207-214](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L207-L214 "Source code on GitHub")

Converts a `Buffer` into a hex `String`

**Parameters**

-   `buf` **Buffer** 

Returns **String** 

# bufferToInt

[index.js:198-200](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L198-L200 "Source code on GitHub")

Converts a `Buffer` to a `Number`

**Parameters**

-   `buf` **Buffer** 

Returns **Number** 

# defineProperties

[index.js:616-709](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L616-L709 "Source code on GitHub")

Defines properties on a `Object`. It make the assumption that underlying data is binary.

**Parameters**

-   `self` **Object** the `Object` to define properties on
-   `fields` **Array** an array fields to define. Fields can contain:-   `name` - the name of the properties
    -   `length` - the number of bytes the field can have
    -   `allowLess` - if the field can be less than the length
    -   `allowEmpty`
-   `data` **Any** data to be validated against the definitions

# ecrecover

[index.js:380-388](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L380-L388 "Source code on GitHub")

ECDSA public key recovery from signature

**Parameters**

-   `msgHash` **Buffer** 
-   `v` **Number** 
-   `r` **Buffer** 
-   `s` **Buffer** 

Returns **Buffer** publicKey

# ecsign

[index.js:362-370](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L362-L370 "Source code on GitHub")

ECDSA sign

**Parameters**

-   `msgHash` **Buffer** 
-   `privateKey` **Buffer** 

Returns **Object** 

# fromRpcSig

[index.js:409-427](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L409-L427 "Source code on GitHub")

Convert signature format of the `eth_sign` RPC method to signature parameters
NOTE: all because of a bug in geth: <https://github.com/ethereum/go-ethereum/issues/2053>

**Parameters**

-   `sig` **String** 

Returns **Object** 

# fromSigned

[index.js:221-223](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L221-L223 "Source code on GitHub")

Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.

**Parameters**

-   `num` **Buffer** 

Returns **BN** 

# generateAddress

[index.js:483-497](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L483-L497 "Source code on GitHub")

Generates an address of a newly created contract

**Parameters**

-   `from` **Buffer** the address which is creating this new address
-   `nonce` **Buffer** the nonce of the from account

Returns **Buffer** 

# importPublic

[index.js:348-354](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L348-L354 "Source code on GitHub")

Converts a public key to the Ethereum format.

**Parameters**

-   `publicKey` **Buffer** 

Returns **Buffer** 

# intToBuffer

[index.js:187-190](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L187-L190 "Source code on GitHub")

Converts an `Number` to a `Buffer`

**Parameters**

-   `i` **Number** 

Returns **Buffer** 

# intToHex

[index.js:171-180](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L171-L180 "Source code on GitHub")

Converts a `Number` into a hex `String`

**Parameters**

-   `i` **Number** 

Returns **String** 

# isHexPrefixed

[index.js:514-516](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L514-L516 "Source code on GitHub")

Returns a `Boolean` on whether or not the a `String` starts with "0x"

**Parameters**

-   `str` **String** 

Returns **Boolean** 

# isPrecompiled

[index.js:504-507](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L504-L507 "Source code on GitHub")

Returns true if the supplied address belongs to a precompiled account

**Parameters**

-   `address` **Buffer or String** 

Returns **Boolean** 

# isValidAddress

[index.js:443-445](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L443-L445 "Source code on GitHub")

Checks if the address is a valid. Accepts checksummed addresses too

**Parameters**

-   `address` **String** 

Returns **Boolean** 

# isValidChecksumAddress

[index.js:473-475](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L473-L475 "Source code on GitHub")

Checks if the address is a valid checksummed address

**Parameters**

-   `address` **Buffer** 

Returns **Boolean** 

# isValidPrivate

[index.js:291-293](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L291-L293 "Source code on GitHub")

Checks if the private key satisfies the rules of the curve secp256k1.

**Parameters**

-   `privateKey` **Buffer** 

Returns **Boolean** 

# isValidPublic

[index.js:302-313](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L302-L313 "Source code on GitHub")

Checks if the public key satisfies the rules of the curve secp256k1
and the requirements of Ethereum.

**Parameters**

-   `publicKey` **Buffer** The two points of an uncompressed key, unless sanitize is enabled
-   `sanitize` **[Boolean]** Accept public keys in other formats (optional, default `false`)

Returns **Boolean** 

# MAX_INTEGER

[index.js:12-12](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L12-L12 "Source code on GitHub")

the max integer that this VM can handle (a `BN`)

# padToEven

[index.js:548-551](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L548-L551 "Source code on GitHub")

Pads a `String` to have an even length

**Parameters**

-   `a` **String** 

Returns **String** 

# privateToAddress

[index.js:434-436](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L434-L436 "Source code on GitHub")

Returns the ethereum address of a given private key

**Parameters**

-   `privateKey` **Buffer** A private key must be 256 bits wide

Returns **Buffer** 

# pubToAddress

[index.js:322-330](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L322-L330 "Source code on GitHub")

Returns the ethereum address of a given public key.
Accepts "Ethereum public keys" and SEC1 encoded keys.

**Parameters**

-   `pubKey` **Buffer** The two points of an uncompressed key, unless sanitize is enabled
-   `sanitize` **[Boolean]** Accept public keys in other formats (optional, default `false`)

Returns **Buffer** 

# ripemd160

[index.js:267-275](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L267-L275 "Source code on GitHub")

Creates RIPEMD160 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `padded` **Boolean** whether it should be padded to 256 bits or not

Returns **Buffer** 

# rlp

[index.js:66-66](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L66-L66 "Source code on GitHub")

[`rlp`](https://github.com/ethereumjs/rlp)

# rlphash

[index.js:282-284](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L282-L284 "Source code on GitHub")

Creates SHA-3 hash of the RLP encoded version of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# secp256k1

[index.js:72-72](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L72-L72 "Source code on GitHub")

[`secp256k1`](https://github.com/cryptocoinjs/secp256k1-node/)

# setLengthLeft

[index.js:95-111](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L95-L111 "Source code on GitHub")

Left Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters**

-   `msg` **Buffer or Array** the value to pad
-   `length` **Number** the number of bytes the output should be
-   `right` **[Boolean]** whether to start padding form the left or right (optional, default `false`)

Returns **Buffer or Array** 

# setLengthRight

[index.js:120-122](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L120-L122 "Source code on GitHub")

Right Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters**

-   `msg` **Buffer or Array** the value to pad
-   `length` **Number** the number of bytes the output should be

Returns **Buffer or Array** 

# sha256

[index.js:256-259](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L256-L259 "Source code on GitHub")

Creates SHA256 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# sha3

[index.js:240-249](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L240-L249 "Source code on GitHub")

Creates SHA-3 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `bits` **[Number]** the SHA width (optional, default `256`)

Returns **Buffer** 

# SHA3_NULL

[index.js:30-30](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L30-L30 "Source code on GitHub")

SHA3-256 hash of null (a `Buffer`)

# SHA3_NULL_S

[index.js:24-24](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L24-L24 "Source code on GitHub")

SHA3-256 hash of null (a `String`)

# SHA3_RLP

[index.js:54-54](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L54-L54 "Source code on GitHub")

SHA3-256 hash of the RLP of null (a `Buffer`)

# SHA3_RLP_ARRAY

[index.js:42-42](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L42-L42 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `Buffer`)

# SHA3_RLP_ARRAY_S

[index.js:36-36](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L36-L36 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `String`)

# SHA3_RLP_S

[index.js:48-48](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L48-L48 "Source code on GitHub")

SHA3-256 hash of the RLP of null  (a `String`)

# stripHexPrefix

[index.js:523-528](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L523-L528 "Source code on GitHub")

Removes "0x" from a given `String`

**Parameters**

-   `str` **String** 

Returns **String** 

# toBuffer

[index.js:142-164](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L142-L164 "Source code on GitHub")

Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.

**Parameters**

-   `v` **Any** the value

# toChecksumAddress

[index.js:452-466](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L452-L466 "Source code on GitHub")

Returns a checksummed address

**Parameters**

-   `address` **String** 

Returns **String** 

# toRpcSig

[index.js:397-401](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L397-L401 "Source code on GitHub")

Convert signature parameters into the format of `eth_sign` RPC method

**Parameters**

-   `v` **Number** 
-   `r` **Buffer** 
-   `s` **Buffer** 

Returns **String** sig

# toUnsigned

[index.js:230-232](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L230-L232 "Source code on GitHub")

Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

**Parameters**

-   `num` **BN** 

Returns **Buffer** 

# TWO_POW256

[index.js:18-18](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L18-L18 "Source code on GitHub")

2^256 (a `BN`)

# unpad

[index.js:129-137](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L129-L137 "Source code on GitHub")

Trims leading zeros from a `Buffer` or an `Array`

**Parameters**

-   `a` **Buffer or Array or String** 

Returns **Buffer or Array or String** 

# zeros

[index.js:80-84](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L80-L84 "Source code on GitHub")

Returns a buffer filled with 0s

**Parameters**

-   `bytes` **Number** the number of bytes the buffer should be

Returns **Buffer** 

# privateToPublic

[index.js:337-341](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L337-L341 "Source code on GitHub")

Returns the ethereum public key of a given private key

**Parameters**

-   `privateKey` **Buffer** A private key must be 256 bits wide

Returns **Buffer** 

# SECP256K1_N_DIV_2

[index.js:563-563](https://github.com/ethereum/ethereumjs-util/blob/dc680ef2824775a01398fd92d1a3716a383510c7/index.js#L563-L563 "Source code on GitHub")

Validate ECDSA signature

**Parameters**

-   `v` **Buffer** 
-   `r` **Buffer** 
-   `s` **Buffer** 
-   `homestead` **[Boolean]**  (optional, default `true`)

Returns **Boolean** 
