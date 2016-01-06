# BN

[index.js:60-60](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L60-L60 "Source code on GitHub")

[`BN`](https://github.com/indutny/bn.js)

# MAX_INTEGER

[index.js:12-12](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L12-L12 "Source code on GitHub")

the max interger that this VM can handle (a `BN`)

# SHA3_NULL

[index.js:30-30](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L30-L30 "Source code on GitHub")

SHA3-256 hash of null (a `Buffer`)

# SHA3_NULL_S

[index.js:24-24](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L24-L24 "Source code on GitHub")

SHA3-256 hash of null (a `String`)

# SHA3_RLP

[index.js:54-54](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L54-L54 "Source code on GitHub")

SHA3-256 hash of the RLP of null (a `Buffer`)

# SHA3_RLP_ARRAY

[index.js:42-42](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L42-L42 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `Buffer`)

# SHA3_RLP_ARRAY_S

[index.js:36-36](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L36-L36 "Source code on GitHub")

SHA3-256 of an RLP of an empty array (a `String`)

# SHA3_RLP_S

[index.js:48-48](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L48-L48 "Source code on GitHub")

SHA3-256 hash of the RLP of null  (a `String`)

# TWO_POW256

[index.js:18-18](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L18-L18 "Source code on GitHub")

2^256 (a `BN`)

# addHexPrefix

[index.js:386-392](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L386-L392 "Source code on GitHub")

Adds "0x" to a given string if it does not already start with "0x"

**Parameters**

-   `String`  
-   `str`  

Returns **String** 

# baToJSON

[index.js:514-524](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L514-L524 "Source code on GitHub")

converts a buffer array to JSON

**Parameters**

-   `ba`  

# bufferToInt

[index.js:198-205](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L198-L205 "Source code on GitHub")

Converts a `Buffer` to an `Interger`

**Parameters**

-   `Buffer`  
-   `buf`  

Returns **Number** 

# defineProperties

[index.js:405-483](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L405-L483 "Source code on GitHub")

Defines properties on a Object. It make the assumption that underlying data is binary

**Parameters**

-   `self` **Object** the `Object` to define properties on
-   `fields` **Array** an array fields to define. Fields can contain:-   `name` - the name of the properties
    -   `length` - the number of bytes the field can have
    -   `allowLess` - if the field can be less than the length
    -   `allowEmpty`
-   `Data` **Any** data to be validated against the definitions
-   `data`  

# fromSigned

[index.js:213-220](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L213-L220 "Source code on GitHub")

interpets a `Buffer` as a signed integer and returns a `bignum`

**Parameters**

-   `num` **Buffer** 

Returns **BN** 

# generateAddress

[index.js:334-344](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L334-L344 "Source code on GitHub")

Generates an address of a newly created contract

**Parameters**

-   `from` **Buffer** the address which is creating this new address
-   `nonce` **Buffer** the nonce of the from account

Returns **Buffer** 

# intToBuffer

[index.js:187-190](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L187-L190 "Source code on GitHub")

Converts an `Integer` to a `Buffer`

**Parameters**

-   `Integer`  
-   `i`  

Returns **Buffer** 

# intToHex

[index.js:170-179](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L170-L179 "Source code on GitHub")

Converts an integer into a hex string

**Parameters**

-   `Number`  
-   `i`  

Returns **String** 

# isHexPrefixed

[index.js:363-365](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L363-L365 "Source code on GitHub")

Returns a `Boolean` on whether or not the a `Sting` starts with "0x"

**Parameters**

-   `str` **String** 

Returns **Boolean** 

# isPrecompiled

[index.js:352-355](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L352-L355 "Source code on GitHub")

Returns true if the supplied address belongs to a precompiled account

**Parameters**

-   `address`  

Returns **Boolean** 

# pad

[index.js:93-101](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L93-L101 "Source code on GitHub")

pads an array of buffer with leading zeros till it has `length` bytes

**Parameters**

-   `msg` **Buffer or Array** the value to pad
-   `length` **Integer** the number of bytes the output should be

Returns **Buffer or Array** 

# padToEven

[index.js:531-534](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L531-L534 "Source code on GitHub")

Pads a String to have an even length

**Parameters**

-   `String`  
-   `a`  

# printBA

[index.js:490-507](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L490-L507 "Source code on GitHub")

Print a Buffer Array

**Parameters**

-   `ba`  

# privateToAddress

[index.js:323-325](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L323-L325 "Source code on GitHub")

Returns the ethereum address of a given private key

**Parameters**

-   `privateKey` **Buffer** 

Returns **Buffer** 

# pubToAddress

[index.js:298-303](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L298-L303 "Source code on GitHub")

Returns the ethereum address of a given public key

**Parameters**

-   `Buffer`  
-   `pubKey`  

Returns **Buffer** 

# ripemd160

[index.js:272-280](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L272-L280 "Source code on GitHub")

Creates RIPEMD160 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `padded` **Boolean** whether it should be padded to 256 bits or not

Returns **Buffer** 

# rlp

[index.js:66-66](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L66-L66 "Source code on GitHub")

[`rlp`](https://github.com/wanderer/rlp)

# rlphash

[index.js:288-290](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L288-L290 "Source code on GitHub")

Creates SHA-3 hash of the RLP encoded version of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# rpad

[index.js:110-118](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L110-L118 "Source code on GitHub")

pads an array of buffer with trailing zeros till it has `length` bytes

**Parameters**

-   `msg` **Buffer or Array** the value to pad
-   `length` **Integer** the number of bytes the output should be

Returns **Buffer or Array** 

# secp256k1

[index.js:72-72](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L72-L72 "Source code on GitHub")

[`secp256k1`](https://github.com/cryptocoinjs/secp256k1-node/)

# sha256

[index.js:260-263](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L260-L263 "Source code on GitHub")

Creates SHA256 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data

Returns **Buffer** 

# sha3

[index.js:243-252](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L243-L252 "Source code on GitHub")

Creates SHA-3 hash of the input

**Parameters**

-   `a` **Buffer or Array or String or Number** the input data
-   `bytes` **[Number]** the SHA width (optional, default `256`)

Returns **Buffer** 

# stripHexPrefix

[index.js:373-378](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L373-L378 "Source code on GitHub")

Removes "0x" from a given `String`

**Parameters**

-   `str` **String** 

Returns **String** 

# toBuffer

[index.js:140-162](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L140-L162 "Source code on GitHub")

Attempts to turn a value into a Buffer. Attempts to turn a value into a Buffer. Supports Buffer, string, number, null/undefined, BN.js or other objects with a toArray() method.

**Parameters**

-   `v` **Any** the value

# toUnsigned

[index.js:228-234](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L228-L234 "Source code on GitHub")

Converts a `Bignum` to an unsigned interger and returns it as a `Buffer`

**Parameters**

-   `num` **Bignum** 

Returns **Buffer** 

# unpad

[index.js:126-134](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L126-L134 "Source code on GitHub")

Trims leading zeros from a buffer or an array

**Parameters**

-   `a`  

Returns **Buffer or Array or String** 

# zeros

[index.js:80-84](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L80-L84 "Source code on GitHub")

Returns a buffer filled with 0s

**Parameters**

-   `bytes` **Integer** the number of bytes the buffer should be

Returns **Buffer** 

# privateToPublic

[index.js:311-315](https://github.com/ethereumjs/ethereumjs-util/blob/1a7e3cc380dcdacc37186eb72eec4dafbceed66f/index.js#L311-L315 "Source code on GitHub")

Returns the ethereum public key of a given private key

**Parameters**

-   `privateKey` **Buffer** 

Returns **Buffer** 
