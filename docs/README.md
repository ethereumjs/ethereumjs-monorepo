[ethereumjs-util](README.md)

# ethereumjs-util

## Index

### Interfaces

* [ECDSASignature](interfaces/ecdsasignature.md)

### Variables

* [BN](README.md#bn)
* [Buffer](README.md#const-buffer)
* [KECCAK256_NULL](README.md#const-keccak256_null)
* [KECCAK256_NULL_S](README.md#const-keccak256_null_s)
* [KECCAK256_RLP](README.md#const-keccak256_rlp)
* [KECCAK256_RLP_ARRAY](README.md#const-keccak256_rlp_array)
* [KECCAK256_RLP_ARRAY_S](README.md#const-keccak256_rlp_array_s)
* [KECCAK256_RLP_S](README.md#const-keccak256_rlp_s)
* [MAX_INTEGER](README.md#const-max_integer)
* [TWO_POW256](README.md#const-two_pow256)
* [assert](README.md#const-assert)
* [createHash](README.md#const-createhash)
* [createKeccakHash](README.md#const-createkeccakhash)
* [ethjsUtil](README.md#const-ethjsutil)
* [publicToAddress](README.md#const-publictoaddress)
* [rlp](README.md#rlp)
* [secp256k1](README.md#const-secp256k1)
* [setLength](README.md#const-setlength)
* [stripZeros](README.md#const-stripzeros)

### Functions

* [addHexPrefix](README.md#const-addhexprefix)
* [baToJSON](README.md#const-batojson)
* [bufferToHex](README.md#const-buffertohex)
* [bufferToInt](README.md#const-buffertoint)
* [calculateSigRecovery](README.md#calculatesigrecovery)
* [defineProperties](README.md#const-defineproperties)
* [ecrecover](README.md#const-ecrecover)
* [ecsign](README.md#const-ecsign)
* [fromRpcSig](README.md#const-fromrpcsig)
* [fromSigned](README.md#const-fromsigned)
* [generateAddress](README.md#const-generateaddress)
* [generateAddress2](README.md#const-generateaddress2)
* [hashPersonalMessage](README.md#const-hashpersonalmessage)
* [importPublic](README.md#const-importpublic)
* [isPrecompiled](README.md#const-isprecompiled)
* [isValidAddress](README.md#const-isvalidaddress)
* [isValidChecksumAddress](README.md#const-isvalidchecksumaddress)
* [isValidPrivate](README.md#const-isvalidprivate)
* [isValidPublic](README.md#const-isvalidpublic)
* [isValidSigRecovery](README.md#isvalidsigrecovery)
* [isValidSignature](README.md#const-isvalidsignature)
* [isZeroAddress](README.md#const-iszeroaddress)
* [keccak](README.md#const-keccak)
* [keccak256](README.md#const-keccak256)
* [privateToAddress](README.md#const-privatetoaddress)
* [privateToPublic](README.md#const-privatetopublic)
* [pubToAddress](README.md#const-pubtoaddress)
* [ripemd160](README.md#const-ripemd160)
* [rlphash](README.md#const-rlphash)
* [setLengthLeft](README.md#const-setlengthleft)
* [setLengthRight](README.md#const-setlengthright)
* [sha256](README.md#const-sha256)
* [toBuffer](README.md#const-tobuffer)
* [toChecksumAddress](README.md#const-tochecksumaddress)
* [toRpcSig](README.md#const-torpcsig)
* [toUnsigned](README.md#const-tounsigned)
* [unpad](README.md#const-unpad)
* [zeroAddress](README.md#const-zeroaddress)
* [zeros](README.md#const-zeros)

## Variables

###  BN

• **BN**: *[BN](README.md#bn)*

*Defined in [bytes.ts:2](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L2)*

*Defined in [account.ts:4](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L4)*

*Defined in [constants.ts:1](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L1)*

*Defined in [signature.ts:2](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L2)*

*Defined in [index.ts:3](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L3)*

___

### `Const` Buffer

• **Buffer**: *any* = require('buffer').Buffer

*Defined in [constants.ts:2](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L2)*

___

### `Const` KECCAK256_NULL

• **KECCAK256_NULL**: *[Buffer](README.md#const-buffer)* = Buffer.from(KECCAK256_NULL_S, 'hex')

*Defined in [constants.ts:29](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L29)*

Keccak-256 hash of null

___

### `Const` KECCAK256_NULL_S

• **KECCAK256_NULL_S**: *string* = "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"

*Defined in [constants.ts:23](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L23)*

Keccak-256 hash of null

___

### `Const` KECCAK256_RLP

• **KECCAK256_RLP**: *[Buffer](README.md#const-buffer)* = Buffer.from(KECCAK256_RLP_S, 'hex')

*Defined in [constants.ts:51](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L51)*

Keccak-256 hash of the RLP of null

___

### `Const` KECCAK256_RLP_ARRAY

• **KECCAK256_RLP_ARRAY**: *[Buffer](README.md#const-buffer)* = Buffer.from(KECCAK256_RLP_ARRAY_S, 'hex')

*Defined in [constants.ts:40](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L40)*

Keccak-256 of an RLP of an empty array

___

### `Const` KECCAK256_RLP_ARRAY_S

• **KECCAK256_RLP_ARRAY_S**: *string* = "1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347"

*Defined in [constants.ts:34](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L34)*

Keccak-256 of an RLP of an empty array

___

### `Const` KECCAK256_RLP_S

• **KECCAK256_RLP_S**: *string* = "56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"

*Defined in [constants.ts:45](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L45)*

Keccak-256 hash of the RLP of null

___

### `Const` MAX_INTEGER

• **MAX_INTEGER**: *[BN](README.md#bn)* = new BN(
  'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  16,
)

*Defined in [constants.ts:7](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L7)*

The max integer that this VM can handle

___

### `Const` TWO_POW256

• **TWO_POW256**: *[BN](README.md#bn)* = new BN(
  '10000000000000000000000000000000000000000000000000000000000000000',
  16,
)

*Defined in [constants.ts:15](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L15)*

2^256

___

### `Const` assert

• **assert**: *any* = require('assert')

*Defined in [account.ts:1](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L1)*

*Defined in [object.ts:1](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/object.ts#L1)*

___

### `Const` createHash

• **createHash**: *any* = require('create-hash')

*Defined in [hash.ts:2](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L2)*

___

### `Const` createKeccakHash

• **createKeccakHash**: *any* = require('keccak')

*Defined in [hash.ts:1](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L1)*

___

### `Const` ethjsUtil

• **ethjsUtil**: *any* = require('ethjs-util')

*Defined in [bytes.ts:1](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L1)*

*Defined in [hash.ts:3](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L3)*

*Defined in [account.ts:2](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L2)*

*Defined in [object.ts:2](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/object.ts#L2)*

*Defined in [index.ts:2](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L2)*

___

### `Const` publicToAddress

• **publicToAddress**: *pubToAddress* = pubToAddress

*Defined in [account.ts:163](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L163)*

___

###  rlp

• **rlp**: *"/Users/ryanghods/dev/ethereumjs-util/node_modules/rlp/dist/index"*

*Defined in [hash.ts:4](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L4)*

*Defined in [object.ts:3](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/object.ts#L3)*

*Defined in [index.ts:4](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L4)*

___

### `Const` secp256k1

• **secp256k1**: *any* = require('secp256k1')

*Defined in [account.ts:3](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L3)*

*Defined in [signature.ts:1](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L1)*

*Defined in [index.ts:1](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L1)*

___

### `Const` setLength

• **setLength**: *setLengthLeft* = setLengthLeft

*Defined in [bytes.ts:37](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L37)*

___

### `Const` stripZeros

• **stripZeros**: *unpad* = unpad

*Defined in [bytes.ts:64](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L64)*

## Functions

### `Const` addHexPrefix

▸ **addHexPrefix**(`str`: string): *string*

*Defined in [bytes.ts:135](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L135)*

Adds "0x" to a given `String` if it does not already start with "0x".

**Parameters:**

Name | Type |
------ | ------ |
`str` | string |

**Returns:** *string*

___

### `Const` baToJSON

▸ **baToJSON**(`ba`: any): *any*

*Defined in [bytes.ts:148](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L148)*

Converts a `Buffer` or `Array` to JSON.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`ba` | any | (Buffer|Array) |

**Returns:** *any*

(Array|String|null)

___

### `Const` bufferToHex

▸ **bufferToHex**(`buf`: [Buffer](README.md#const-buffer)): *string*

*Defined in [bytes.ts:111](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L111)*

Converts a `Buffer` into a `0x`-prefixed hex `String`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buf` | [Buffer](README.md#const-buffer) | `Buffer` object to convert  |

**Returns:** *string*

___

### `Const` bufferToInt

▸ **bufferToInt**(`buf`: [Buffer](README.md#const-buffer)): *number*

*Defined in [bytes.ts:103](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L103)*

Converts a `Buffer` to a `Number`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`buf` | [Buffer](README.md#const-buffer) | `Buffer` object to convert |

**Returns:** *number*

___

###  calculateSigRecovery

▸ **calculateSigRecovery**(`v`: number, `chainId?`: undefined | number): *number*

*Defined in [signature.ts:144](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L144)*

**Parameters:**

Name | Type |
------ | ------ |
`v` | number |
`chainId?` | undefined &#124; number |

**Returns:** *number*

___

### `Const` defineProperties

▸ **defineProperties**(`self`: any, `fields`: any, `data`: any): *void*

*Defined in [object.ts:17](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/object.ts#L17)*

Defines properties on a `Object`. It make the assumption that underlying data is binary.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`self` | any | the `Object` to define properties on |
`fields` | any | an array fields to define. Fields can contain: * `name` - the name of the properties * `length` - the number of bytes the field can have * `allowLess` - if the field can be less than the length * `allowEmpty` |
`data` | any | data to be validated against the definitions |

**Returns:** *void*

___

### `Const` ecrecover

▸ **ecrecover**(`msgHash`: [Buffer](README.md#const-buffer), `v`: number, `r`: [Buffer](README.md#const-buffer), `s`: [Buffer](README.md#const-buffer), `chainId?`: undefined | number): *[Buffer](README.md#const-buffer)*

*Defined in [signature.ts:36](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L36)*

ECDSA public key recovery from signature.

**Parameters:**

Name | Type |
------ | ------ |
`msgHash` | [Buffer](README.md#const-buffer) |
`v` | number |
`r` | [Buffer](README.md#const-buffer) |
`s` | [Buffer](README.md#const-buffer) |
`chainId?` | undefined &#124; number |

**Returns:** *[Buffer](README.md#const-buffer)*

Recovered public key

___

### `Const` ecsign

▸ **ecsign**(`msgHash`: [Buffer](README.md#const-buffer), `privateKey`: [Buffer](README.md#const-buffer), `chainId?`: undefined | number): *[ECDSASignature](interfaces/ecdsasignature.md)*

*Defined in [signature.ts:15](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L15)*

Returns the ECDSA signature of a message hash.

**Parameters:**

Name | Type |
------ | ------ |
`msgHash` | [Buffer](README.md#const-buffer) |
`privateKey` | [Buffer](README.md#const-buffer) |
`chainId?` | undefined &#124; number |

**Returns:** *[ECDSASignature](interfaces/ecdsasignature.md)*

___

### `Const` fromRpcSig

▸ **fromRpcSig**(`sig`: string): *[ECDSASignature](interfaces/ecdsasignature.md)*

*Defined in [signature.ts:70](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L70)*

Convert signature format of the `eth_sign` RPC method to signature parameters
NOTE: all because of a bug in geth: https://github.com/ethereum/go-ethereum/issues/2053

**Parameters:**

Name | Type |
------ | ------ |
`sig` | string |

**Returns:** *[ECDSASignature](interfaces/ecdsasignature.md)*

___

### `Const` fromSigned

▸ **fromSigned**(`num`: [Buffer](README.md#const-buffer)): *[BN](README.md#bn)*

*Defined in [bytes.ts:120](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L120)*

Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | [Buffer](README.md#const-buffer) | Signed integer value  |

**Returns:** *[BN](README.md#bn)*

___

### `Const` generateAddress

▸ **generateAddress**(`from`: [Buffer](README.md#const-buffer), `nonce`: [Buffer](README.md#const-buffer)): *[Buffer](README.md#const-buffer)*

*Defined in [account.ts:75](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L75)*

Generates an address of a newly created contract.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`from` | [Buffer](README.md#const-buffer) | The address which is creating this new address |
`nonce` | [Buffer](README.md#const-buffer) | The nonce of the from account  |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` generateAddress2

▸ **generateAddress2**(`from`: [Buffer](README.md#const-buffer) | string, `salt`: [Buffer](README.md#const-buffer) | string, `initCode`: [Buffer](README.md#const-buffer) | string): *[Buffer](README.md#const-buffer)*

*Defined in [account.ts:95](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L95)*

Generates an address for a contract created using CREATE2.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`from` | [Buffer](README.md#const-buffer) &#124; string | The address which is creating this new address |
`salt` | [Buffer](README.md#const-buffer) &#124; string | A salt |
`initCode` | [Buffer](README.md#const-buffer) &#124; string | The init code of the contract being created  |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` hashPersonalMessage

▸ **hashPersonalMessage**(`message`: [Buffer](README.md#const-buffer)): *[Buffer](README.md#const-buffer)*

*Defined in [signature.ts:136](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L136)*

Returns the keccak-256 hash of `message`, prefixed with the header used by the `eth_sign` RPC call.
The output of this function can be fed into `ecsign` to produce the same signature as the `eth_sign`
call for a given `message`, or fed to `ecrecover` along with a signature to recover the public key
used to produce the signature.

**Parameters:**

Name | Type |
------ | ------ |
`message` | [Buffer](README.md#const-buffer) |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` importPublic

▸ **importPublic**(`publicKey`: [Buffer](README.md#const-buffer)): *[Buffer](README.md#const-buffer)*

*Defined in [account.ts:186](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L186)*

Converts a public key to the Ethereum format.

**Parameters:**

Name | Type |
------ | ------ |
`publicKey` | [Buffer](README.md#const-buffer) |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` isPrecompiled

▸ **isPrecompiled**(`address`: [Buffer](README.md#const-buffer) | string): *boolean*

*Defined in [account.ts:117](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L117)*

Returns true if the supplied address belongs to a precompiled account (Byzantium).

**Parameters:**

Name | Type |
------ | ------ |
`address` | [Buffer](README.md#const-buffer) &#124; string |

**Returns:** *boolean*

___

### `Const` isValidAddress

▸ **isValidAddress**(`address`: string): *boolean*

*Defined in [account.ts:20](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L20)*

Checks if the address is a valid. Accepts checksummed addresses too.

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *boolean*

___

### `Const` isValidChecksumAddress

▸ **isValidChecksumAddress**(`address`: string, `eip1191ChainId?`: undefined | number): *boolean*

*Defined in [account.ts:66](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L66)*

Checks if the address is a valid checksummed address.

See toChecksumAddress' documentation for details about the eip1191ChainId parameter.

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |
`eip1191ChainId?` | undefined &#124; number |

**Returns:** *boolean*

___

### `Const` isValidPrivate

▸ **isValidPrivate**(`privateKey`: [Buffer](README.md#const-buffer)): *boolean*

*Defined in [account.ts:125](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L125)*

Checks if the private key satisfies the rules of the curve secp256k1.

**Parameters:**

Name | Type |
------ | ------ |
`privateKey` | [Buffer](README.md#const-buffer) |

**Returns:** *boolean*

___

### `Const` isValidPublic

▸ **isValidPublic**(`publicKey`: [Buffer](README.md#const-buffer), `sanitize`: boolean): *boolean*

*Defined in [account.ts:135](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L135)*

Checks if the public key satisfies the rules of the curve secp256k1
and the requirements of Ethereum.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`publicKey` | [Buffer](README.md#const-buffer) | - | The two points of an uncompressed key, unless sanitize is enabled |
`sanitize` | boolean | false | Accept public keys in other formats  |

**Returns:** *boolean*

___

###  isValidSigRecovery

▸ **isValidSigRecovery**(`recovery`: number): *boolean*

*Defined in [signature.ts:148](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L148)*

**Parameters:**

Name | Type |
------ | ------ |
`recovery` | number |

**Returns:** *boolean*

___

### `Const` isValidSignature

▸ **isValidSignature**(`v`: number, `r`: [Buffer](README.md#const-buffer), `s`: [Buffer](README.md#const-buffer), `homesteadOrLater`: boolean, `chainId?`: undefined | number): *boolean*

*Defined in [signature.ts:95](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L95)*

Validate a ECDSA signature.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`v` | number | - | - |
`r` | [Buffer](README.md#const-buffer) | - | - |
`s` | [Buffer](README.md#const-buffer) | - | - |
`homesteadOrLater` | boolean | true | Indicates whether this is being used on either the homestead hardfork or a later one  |
`chainId?` | undefined &#124; number | - | - |

**Returns:** *boolean*

___

### `Const` isZeroAddress

▸ **isZeroAddress**(`address`: string): *boolean*

*Defined in [account.ts:27](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L27)*

Checks if a given address is a zero address.

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |

**Returns:** *boolean*

___

### `Const` keccak

▸ **keccak**(`a`: any, `bits`: number): *[Buffer](README.md#const-buffer)*

*Defined in [hash.ts:13](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L13)*

Creates Keccak hash of the input

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`a` | any | - | The input data (Buffer|Array|String|Number) If the string is a 0x-prefixed hex value it's interpreted as hexadecimal, otherwise as utf8. |
`bits` | number | 256 | The Keccak width  |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` keccak256

▸ **keccak256**(`a`: any): *[Buffer](README.md#const-buffer)*

*Defined in [hash.ts:31](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L31)*

Creates Keccak-256 hash of the input, alias for keccak(a, 256).

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | any | The input data (Buffer|Array|String|Number)  |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` privateToAddress

▸ **privateToAddress**(`privateKey`: [Buffer](README.md#const-buffer)): *[Buffer](README.md#const-buffer)*

*Defined in [account.ts:169](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L169)*

Returns the ethereum address of a given private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | [Buffer](README.md#const-buffer) | A private key must be 256 bits wide  |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` privateToPublic

▸ **privateToPublic**(`privateKey`: [Buffer](README.md#const-buffer)): *[Buffer](README.md#const-buffer)*

*Defined in [account.ts:177](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L177)*

Returns the ethereum public key of a given private key.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`privateKey` | [Buffer](README.md#const-buffer) | A private key must be 256 bits wide  |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` pubToAddress

▸ **pubToAddress**(`pubKey`: [Buffer](README.md#const-buffer), `sanitize`: boolean): *[Buffer](README.md#const-buffer)*

*Defined in [account.ts:154](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L154)*

Returns the ethereum address of a given public key.
Accepts "Ethereum public keys" and SEC1 encoded keys.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`pubKey` | [Buffer](README.md#const-buffer) | - | The two points of an uncompressed key, unless sanitize is enabled |
`sanitize` | boolean | false | Accept public keys in other formats  |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` ripemd160

▸ **ripemd160**(`a`: any, `padded`: boolean): *[Buffer](README.md#const-buffer)*

*Defined in [hash.ts:51](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L51)*

Creates RIPEMD160 hash of the input.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | any | The input data (Buffer|Array|String|Number) |
`padded` | boolean | Whether it should be padded to 256 bits or not  |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` rlphash

▸ **rlphash**(`a`: rlp.Input): *[Buffer](README.md#const-buffer)*

*Defined in [hash.ts:67](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L67)*

Creates SHA-3 hash of the RLP encoded version of the input.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | rlp.Input | The input data  |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` setLengthLeft

▸ **setLengthLeft**(`msg`: any, `length`: number, `right`: boolean): *any*

*Defined in [bytes.ts:20](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L20)*

Left Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`msg` | any | - | the value to pad (Buffer|Array) |
`length` | number | - | the number of bytes the output should be |
`right` | boolean | false | whether to start padding form the left or right |

**Returns:** *any*

(Buffer|Array)

___

### `Const` setLengthRight

▸ **setLengthRight**(`msg`: any, `length`: number): *any*

*Defined in [bytes.ts:46](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L46)*

Right Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`msg` | any | the value to pad (Buffer|Array) |
`length` | number | the number of bytes the output should be |

**Returns:** *any*

(Buffer|Array)

___

### `Const` sha256

▸ **sha256**(`a`: any): *[Buffer](README.md#const-buffer)*

*Defined in [hash.ts:39](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L39)*

Creates SHA256 hash of the input.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | any | The input data (Buffer|Array|String|Number)  |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` toBuffer

▸ **toBuffer**(`v`: any): *[Buffer](README.md#const-buffer)*

*Defined in [bytes.ts:70](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L70)*

Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`v` | any | the value  |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` toChecksumAddress

▸ **toChecksumAddress**(`address`: string, `eip1191ChainId?`: undefined | number): *string*

*Defined in [account.ts:42](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L42)*

Returns a checksummed address.

If a eip1191ChainId is provided, the chainId will be included in the checksum calculation. This
has the effect of checksummed addresses for one chain having invalid checksums for others.
For more details, consult EIP-1191.

WARNING: Checksums with and without the chainId will differ. As of 2019-06-26, the most commonly
used variation in Ethereum was without the chainId. This may change in the future.

**Parameters:**

Name | Type |
------ | ------ |
`address` | string |
`eip1191ChainId?` | undefined &#124; number |

**Returns:** *string*

___

### `Const` toRpcSig

▸ **toRpcSig**(`v`: number, `r`: [Buffer](README.md#const-buffer), `s`: [Buffer](README.md#const-buffer), `chainId?`: undefined | number): *string*

*Defined in [signature.ts:56](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L56)*

Convert signature parameters into the format of `eth_sign` RPC method.

**Parameters:**

Name | Type |
------ | ------ |
`v` | number |
`r` | [Buffer](README.md#const-buffer) |
`s` | [Buffer](README.md#const-buffer) |
`chainId?` | undefined &#124; number |

**Returns:** *string*

Signature

___

### `Const` toUnsigned

▸ **toUnsigned**(`num`: [BN](README.md#bn)): *[Buffer](README.md#const-buffer)*

*Defined in [bytes.ts:128](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L128)*

Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`num` | [BN](README.md#bn) |   |

**Returns:** *[Buffer](README.md#const-buffer)*

___

### `Const` unpad

▸ **unpad**(`a`: any): *any*

*Defined in [bytes.ts:55](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L55)*

Trims leading zeros from a `Buffer` or an `Array`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`a` | any | (Buffer|Array|String) |

**Returns:** *any*

(Buffer|Array|String)

___

### `Const` zeroAddress

▸ **zeroAddress**(): *string*

*Defined in [account.ts:11](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L11)*

Returns a zero address.

**Returns:** *string*

___

### `Const` zeros

▸ **zeros**(`bytes`: number): *[Buffer](README.md#const-buffer)*

*Defined in [bytes.ts:8](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L8)*

Returns a buffer filled with 0s.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`bytes` | number | the number of bytes the buffer should be  |

**Returns:** *[Buffer](README.md#const-buffer)*
