# addHexPrefix

[index.js:502-508](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L502-L508 "Source code on GitHub")

Adds "0x" to a given `String` if it does not already start with "0x"

**Parameters**

-   `str` **String** 

Returns **String** 

# baToJSON

[index.js:551-561](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L551-L561 "Source code on GitHub")

Converts a `Buffer` or `Array` to JSON

**Parameters**

-   `ba` **Buffer or Array** 

Returns **Array or String or ** 

# BN

[index.js:61-61](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L61-L61 "Source code on GitHub")

[`BN`](https://github.com/indutny/bn.js)

# bufferToHex

[index.js:180-183](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L180-L183 "Source code on GitHub")

Converts a `Buffer` into a hex `String`

**Parameters**

-   `buf` **Buffer** 

Returns **String** 

# bufferToInt

[index.js:171-173](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L171-L173 "Source code on GitHub")

Converts a `Buffer` to a `Number`

**Parameters**

-   `buf` **Buffer** 

Returns **Number** 

# defineProperties

[index.js:573-666](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L573-L666 "Source code on GitHub")

Defines properties on a `Object`. It make the assumption that underlying data is binary.

**Parameters**

-   `self` **Object** the `Object` to define properties on
-   `fields` **Array** an array fields to define. Fields can contain:-   `name` - the name of the properties
    -   `length` - the number of bytes the field can have
    -   `allowLess` - if the field can be less than the length
    -   `allowEmpty`
-   `data` **Any** data to be validated against the definitions

# ecrecover

[index.js:358-366](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L358-L366 "Source code on GitHub")

ECDSA public key recovery from signature

**Parameters**

-   `msgHash` **Buffer** 
-   `v` **Number** 
-   `r` **Buffer** 
-   `s` **Buffer** 

Returns **Buffer** publicKey

# ecsign

[index.js:327-335](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L327-L335 "Source code on GitHub")

ECDSA sign

**Parameters**

-   `msgHash` **Buffer** 
-   `privateKey` **Buffer** 

Returns **Object** 

# fromRpcSig

[index.js:396-415](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L396-L415 "Source code on GitHub")

Convert signature format of the `eth_sign` RPC method to signature parameters
NOTE: all because of a bug in geth: <https://github.com/ethereum/go-ethereum/issues/2053>

**Parameters**

-   `sig` **String** 

Returns **Object** 

# fromSigned

[index.js:190-192](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L190-L192 "Source code on GitHub")

Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.

**Parameters**

-   `num` **Buffer** 

Returns **BN** 

# generateAddress

[index.js:471-485](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L471-L485 "Source code on GitHub")

Generates an address of a newly created contract

**Parameters**

-   `from` **Buffer** the address which is creating this new address
-   `nonce` **Buffer** the nonce of the from account

Returns **Buffer** 

# hashPersonalMessage

[index.js:345-348](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L345-L348 "Source code on GitHub")

Returns the keccak-256 hash of `message`, prefixed with the header used by the `eth_sign` RPC call.
The output of this function can be fed into `ecsign` to produce the same signature as the `eth_sign`
call for a given `message`, or fed to `ecrecover` along with a signature to recover the public key
used to produce the signature.

**Parameters**

-   `message`  

Returns **Buffer** hash

# importPublic

[index.js:313-319](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L313-L319 "Source code on GitHub")

Converts a public key to the Ethereum format.

**Parameters**

-   `publicKey` **Buffer** 

Returns **Buffer** 

# isPrecompiled

[index.js:492-495](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L492-L495 "Source code on GitHub")

Returns true if the supplied address belongs to a precompiled account

**Parameters**

-   `address` **Buffer or String** 

Returns **Boolean** 

# isValidAddress

[index.js:431-433](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L431-L433 "Source code on GitHub")

Checks if the address is a valid. Accepts checksummed addresses too

**Parameters**

-   `address` **String** 

Returns **Boolean** 

# isValidChecksumAddress

[index.js:461-463](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L461-L463 "Source code on GitHub")

Checks if the address is a valid checksummed address

**Parameters**

-   `address` **Buffer** 

Returns **Boolean** 

# isValidPrivate

[index.js:256-258](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L256-L258 "Source code on GitHub")

Checks if the private key satisfies the rules of the curve secp256k1.

**Parameters**

-   `privateKey` **Buffer** 

Returns **Boolean** 

# isValidPublic

[index.js:267-278](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L267-L278 "Source code on GitHub")

Checks if the public key satisfies the rules of the curve secp256k1
and the requirements of Ethereum.

**Parameters**

-   `publicKey` **Buffer** The two points of an uncompressed key, unless sanitize is enabled
-   `sanitize` **[Boolean]** Accept public keys in other formats (optional, default `false`)

Returns **Boolean** 

# isValidSignature

[index.js:520-544](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L520-L544 "Source code on GitHub")

Validate ECDSA signature

**Parameters**

-   `v` **Buffer** 
-   `r` **Buffer** 
-   `s` **Buffer** 
-   `homestead` **[Boolean]**  (optional, default `true`)

Returns **Boolean** 

# MAX_INTEGER

[index.js:13-13](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L13-L13 "Source code on GitHub")

the max integer that this VM can handle (a `BN`)

# privateToAddress

[index.js:422-424](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L422-L424 "Source code on GitHub")

Returns the ethereum address of a given private key

**Parameters**

-   `privateKey` **Buffer** A private key must be 256 bits wide

Returns **Buffer** 

# pubToAddress

[index.js:287-295](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L287-L295 "Source code on GitHub")

Returns the ethereum address of a given public key.
Accepts "Ethereum public keys" and SEC1 encoded keys.

**Parameters**

-   `pubKey` **Buffer** The two points of an uncompressed key, unless sanitize is enabled
-   `sanitize` **[Boolean]** Accept public keys in other formats (optional, default `false`)

Returns **Buffer** 

# ripemd160

[index.js:232-240](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L232-L240 "Source code on GitHub")

Creates RIPEMD160 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `padded` **Boolean** whether it should be padded to 256 bits or not

Returns **Buffer** 

# rlp

[index.js:67-67](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L67-L67 "Source code on GitHub")

[`rlp`](https://github.com/ethereumjs/rlp)

# rlphash

[index.js:247-249](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L247-L249 "Source code on GitHub")

Creates SHA-3 hash of the RLP encoded version of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# secp256k1

[index.js:73-73](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L73-L73 "Source code on GitHub")

[`secp256k1`](https://github.com/cryptocoinjs/secp256k1-node/)

# setLengthLeft

[index.js:94-110](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L94-L110 "Source code on GitHub")

Left Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters**

-   `msg` **Buffer or Array** the value to pad
-   `length` **Number** the number of bytes the output should be
-   `right` **[Boolean]** whether to start padding form the left or right (optional, default `false`)

Returns **Buffer or Array** 

# setLengthRight

[index.js:119-121](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L119-L121 "Source code on GitHub")

Right Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters**

-   `msg` **Buffer or Array** the value to pad
-   `length` **Number** the number of bytes the output should be

Returns **Buffer or Array** 

# sha256

[index.js:221-224](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L221-L224 "Source code on GitHub")

Creates SHA256 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# sha3

[index.js:209-214](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L209-L214 "Source code on GitHub")

Creates SHA-3 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `bits` **[Number]** the SHA width (optional, default `256`)

Returns **Buffer** 

# SHA3_NULL

[index.js:31-31](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L31-L31 "Source code on GitHub")

SHA3-256 hash of null (a `Buffer`)

# SHA3_NULL_S

[index.js:25-25](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L25-L25 "Source code on GitHub")

SHA3-256 hash of null (a `String`)

# SHA3_RLP

[index.js:55-55](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L55-L55 "Source code on GitHub")

SHA3-256 hash of the RLP of null (a `Buffer`)

# SHA3_RLP_ARRAY

[index.js:43-43](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L43-L43 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `Buffer`)

# SHA3_RLP_ARRAY_S

[index.js:37-37](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L37-L37 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `String`)

# SHA3_RLP_S

[index.js:49-49](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L49-L49 "Source code on GitHub")

SHA3-256 hash of the RLP of null  (a `String`)

# toBuffer

[index.js:141-163](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L141-L163 "Source code on GitHub")

Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.

**Parameters**

-   `v` **Any** the value

# toChecksumAddress

[index.js:440-454](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L440-L454 "Source code on GitHub")

Returns a checksummed address

**Parameters**

-   `address` **String** 

Returns **String** 

# toRpcSig

[index.js:375-388](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L375-L388 "Source code on GitHub")

Convert signature parameters into the format of `eth_sign` RPC method

**Parameters**

-   `v` **Number** 
-   `r` **Buffer** 
-   `s` **Buffer** 

Returns **String** sig

# toUnsigned

[index.js:199-201](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L199-L201 "Source code on GitHub")

Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

**Parameters**

-   `num` **BN** 

Returns **Buffer** 

# TWO_POW256

[index.js:19-19](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L19-L19 "Source code on GitHub")

2^256 (a `BN`)

# unpad

[index.js:128-136](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L128-L136 "Source code on GitHub")

Trims leading zeros from a `Buffer` or an `Array`

**Parameters**

-   `a` **Buffer or Array or String** 

Returns **Buffer or Array or String** 

# zeros

[index.js:81-83](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L81-L83 "Source code on GitHub")

Returns a buffer filled with 0s

**Parameters**

-   `bytes` **Number** the number of bytes the buffer should be

Returns **Buffer** 

# privateToPublic

[index.js:302-306](https://github.com/ethereumjs/ethereumjs-util/blob/d03528e7da885539cad141c99ea5b88829f73e72/index.js#L302-L306 "Source code on GitHub")

Returns the ethereum public key of a given private key

**Parameters**

-   `privateKey` **Buffer** A private key must be 256 bits wide

Returns **Buffer** 
