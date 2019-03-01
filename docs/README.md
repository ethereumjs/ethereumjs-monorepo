
#  ethereumjs-util

## Index

### Interfaces

* [ECDSASignature](interfaces/ecdsasignature.md)

### Variables

* [KECCAK256_NULL](#keccak256_null)
* [KECCAK256_NULL_S](#keccak256_null_s)
* [KECCAK256_RLP](#keccak256_rlp)
* [KECCAK256_RLP_ARRAY](#keccak256_rlp_array)
* [KECCAK256_RLP_ARRAY_S](#keccak256_rlp_array_s)
* [KECCAK256_RLP_S](#keccak256_rlp_s)
* [MAX_INTEGER](#max_integer)
* [TWO_POW256](#two_pow256)
* [publicToAddress](#publictoaddress)
* [setLength](#setlength)
* [stripZeros](#stripzeros)

### Functions

* [addHexPrefix](#addhexprefix)
* [baToJSON](#batojson)
* [bufferToHex](#buffertohex)
* [bufferToInt](#buffertoint)
* [defineProperties](#defineproperties)
* [ecrecover](#ecrecover)
* [ecsign](#ecsign)
* [fromRpcSig](#fromrpcsig)
* [fromSigned](#fromsigned)
* [generateAddress](#generateaddress)
* [generateAddress2](#generateaddress2)
* [hashPersonalMessage](#hashpersonalmessage)
* [importPublic](#importpublic)
* [isPrecompiled](#isprecompiled)
* [isValidAddress](#isvalidaddress)
* [isValidChecksumAddress](#isvalidchecksumaddress)
* [isValidPrivate](#isvalidprivate)
* [isValidPublic](#isvalidpublic)
* [isValidSignature](#isvalidsignature)
* [isZeroAddress](#iszeroaddress)
* [keccak](#keccak)
* [keccak256](#keccak256)
* [privateToAddress](#privatetoaddress)
* [privateToPublic](#privatetopublic)
* [pubToAddress](#pubtoaddress)
* [ripemd160](#ripemd160)
* [rlphash](#rlphash)
* [setLengthLeft](#setlengthleft)
* [setLengthRight](#setlengthright)
* [sha256](#sha256)
* [toBuffer](#tobuffer)
* [toChecksumAddress](#tochecksumaddress)
* [toRpcSig](#torpcsig)
* [toUnsigned](#tounsigned)
* [unpad](#unpad)
* [zeroAddress](#zeroaddress)
* [zeros](#zeros)

---

## Variables

<a id="keccak256_null"></a>

### `<Const>` KECCAK256_NULL

**● KECCAK256_NULL**: *`Buffer`* =  Buffer.from(KECCAK256_NULL_S, 'hex')

*Defined in [constants.ts:28](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L28)*

Keccak-256 hash of null

___
<a id="keccak256_null_s"></a>

### `<Const>` KECCAK256_NULL_S

**● KECCAK256_NULL_S**: *`string`* = "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"

*Defined in [constants.ts:22](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L22)*

Keccak-256 hash of null

___
<a id="keccak256_rlp"></a>

### `<Const>` KECCAK256_RLP

**● KECCAK256_RLP**: *`Buffer`* =  Buffer.from(KECCAK256_RLP_S, 'hex')

*Defined in [constants.ts:50](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L50)*

Keccak-256 hash of the RLP of null

___
<a id="keccak256_rlp_array"></a>

### `<Const>` KECCAK256_RLP_ARRAY

**● KECCAK256_RLP_ARRAY**: *`Buffer`* =  Buffer.from(KECCAK256_RLP_ARRAY_S, 'hex')

*Defined in [constants.ts:39](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L39)*

Keccak-256 of an RLP of an empty array

___
<a id="keccak256_rlp_array_s"></a>

### `<Const>` KECCAK256_RLP_ARRAY_S

**● KECCAK256_RLP_ARRAY_S**: *`string`* = "1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347"

*Defined in [constants.ts:33](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L33)*

Keccak-256 of an RLP of an empty array

___
<a id="keccak256_rlp_s"></a>

### `<Const>` KECCAK256_RLP_S

**● KECCAK256_RLP_S**: *`string`* = "56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"

*Defined in [constants.ts:44](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L44)*

Keccak-256 hash of the RLP of null

___
<a id="max_integer"></a>

### `<Const>` MAX_INTEGER

**● MAX_INTEGER**: *`BN`* =  new BN(
  'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  16,
)

*Defined in [constants.ts:6](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L6)*

The max integer that this VM can handle

___
<a id="two_pow256"></a>

### `<Const>` TWO_POW256

**● TWO_POW256**: *`BN`* =  new BN(
  '10000000000000000000000000000000000000000000000000000000000000000',
  16,
)

*Defined in [constants.ts:14](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/constants.ts#L14)*

2^256

___
<a id="publictoaddress"></a>

### `<Const>` publicToAddress

**● publicToAddress**: *[pubToAddress]()* =  pubToAddress

*Defined in [index.ts:271](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L271)*

___
<a id="setlength"></a>

### `<Const>` setLength

**● setLength**: *[setLengthLeft]()* =  setLengthLeft

*Defined in [index.ts:79](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L79)*

___
<a id="stripzeros"></a>

### `<Const>` stripZeros

**● stripZeros**: *[unpad]()* =  unpad

*Defined in [index.ts:106](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L106)*

___

## Functions

<a id="addhexprefix"></a>

### `<Const>` addHexPrefix

▸ **addHexPrefix**(str: *`string`*): `string`

*Defined in [index.ts:488](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L488)*

Adds "0x" to a given `String` if it does not already start with "0x".

**Parameters:**

| Name | Type |
| ------ | ------ |
| str | `string` |

**Returns:** `string`

___
<a id="batojson"></a>

### `<Const>` baToJSON

▸ **baToJSON**(ba: *`any`*): `undefined` \| `string` \| `any`[]

*Defined in [index.ts:540](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L540)*

Converts a `Buffer` or `Array` to JSON.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| ba | `any` |  (Buffer\|Array) |

**Returns:** `undefined` \| `string` \| `any`[]
(Array|String|null)

___
<a id="buffertohex"></a>

### `<Const>` bufferToHex

▸ **bufferToHex**(buf: *`Buffer`*): `string`

*Defined in [index.ts:151](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L151)*

Converts a `Buffer` into a hex `String`.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| buf | `Buffer` |  \`Buffer\` object to convert |

**Returns:** `string`

___
<a id="buffertoint"></a>

### `<Const>` bufferToInt

▸ **bufferToInt**(buf: *`Buffer`*): `number`

*Defined in [index.ts:143](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L143)*

Converts a `Buffer` to a `Number`.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| buf | `Buffer` |  \`Buffer\` object to convert |

**Returns:** `number`

___
<a id="defineproperties"></a>

### `<Const>` defineProperties

▸ **defineProperties**(self: *`any`*, fields: *`any`*, data: *`any`*): `void`

*Defined in [index.ts:562](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L562)*

Defines properties on a `Object`. It make the assumption that underlying data is binary.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| self | `any` |  the \`Object\` to define properties on |
| fields | `any` |  an array fields to define. Fields can contain:*   \`name\` - the name of the properties*   \`length\` - the number of bytes the field can have*   \`allowLess\` - if the field can be less than the length*   \`allowEmpty\` |
| data | `any` |  data to be validated against the definitions |

**Returns:** `void`

___
<a id="ecrecover"></a>

### `<Const>` ecrecover

▸ **ecrecover**(msgHash: *`Buffer`*, v: *`number`*, r: *`Buffer`*, s: *`Buffer`*, chainId?: *`undefined` \| `number`*): `Buffer`

*Defined in [index.ts:329](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L329)*

ECDSA public key recovery from signature.

**Parameters:**

| Name | Type |
| ------ | ------ |
| msgHash | `Buffer` |
| v | `number` |
| r | `Buffer` |
| s | `Buffer` |
| `Optional` chainId | `undefined` \| `number` |

**Returns:** `Buffer`
Recovered public key

___
<a id="ecsign"></a>

### `<Const>` ecsign

▸ **ecsign**(msgHash: *`Buffer`*, privateKey: *`Buffer`*, chainId?: *`undefined` \| `number`*): [ECDSASignature](interfaces/ecdsasignature.md)

*Defined in [index.ts:297](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L297)*

Returns the ECDSA signature of a message hash.

**Parameters:**

| Name | Type |
| ------ | ------ |
| msgHash | `Buffer` |
| privateKey | `Buffer` |
| `Optional` chainId | `undefined` \| `number` |

**Returns:** [ECDSASignature](interfaces/ecdsasignature.md)

___
<a id="fromrpcsig"></a>

### `<Const>` fromRpcSig

▸ **fromRpcSig**(sig: *`string`*): [ECDSASignature](interfaces/ecdsasignature.md)

*Defined in [index.ts:363](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L363)*

Convert signature format of the `eth_sign` RPC method to signature parameters NOTE: all because of a bug in geth: [https://github.com/ethereum/go-ethereum/issues/2053](https://github.com/ethereum/go-ethereum/issues/2053)

**Parameters:**

| Name | Type |
| ------ | ------ |
| sig | `string` |

**Returns:** [ECDSASignature](interfaces/ecdsasignature.md)

___
<a id="fromsigned"></a>

### `<Const>` fromSigned

▸ **fromSigned**(num: *`Buffer`*): `BN`

*Defined in [index.ts:160](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L160)*

Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| num | `Buffer` |  Signed integer value |

**Returns:** `BN`

___
<a id="generateaddress"></a>

### `<Const>` generateAddress

▸ **generateAddress**(from: *`Buffer`*, nonce: *`Buffer`*): `Buffer`

*Defined in [index.ts:438](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L438)*

Generates an address of a newly created contract.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| from | `Buffer` |  The address which is creating this new address |
| nonce | `Buffer` |  The nonce of the from account |

**Returns:** `Buffer`

___
<a id="generateaddress2"></a>

### `<Const>` generateAddress2

▸ **generateAddress2**(from: *`Buffer` \| `string`*, salt: *`Buffer` \| `string`*, initCode: *`Buffer` \| `string`*): `Buffer`

*Defined in [index.ts:458](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L458)*

Generates an address for a contract created using CREATE2.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| from | `Buffer` \| `string` |  The address which is creating this new address |
| salt | `Buffer` \| `string` |  A salt |
| initCode | `Buffer` \| `string` |  The init code of the contract being created |

**Returns:** `Buffer`

___
<a id="hashpersonalmessage"></a>

### `<Const>` hashPersonalMessage

▸ **hashPersonalMessage**(message: *`any`*): `Buffer`

*Defined in [index.ts:320](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L320)*

Returns the keccak-256 hash of `message`, prefixed with the header used by the `eth_sign` RPC call. The output of this function can be fed into `ecsign` to produce the same signature as the `eth_sign` call for a given `message`, or fed to `ecrecover` along with a signature to recover the public key used to produce the signature.

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | `any` |

**Returns:** `Buffer`

___
<a id="importpublic"></a>

### `<Const>` importPublic

▸ **importPublic**(publicKey: *`Buffer`*): `Buffer`

*Defined in [index.ts:286](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L286)*

Converts a public key to the Ethereum format.

**Parameters:**

| Name | Type |
| ------ | ------ |
| publicKey | `Buffer` |

**Returns:** `Buffer`

___
<a id="isprecompiled"></a>

### `<Const>` isPrecompiled

▸ **isPrecompiled**(address: *`Buffer` \| `string`*): `boolean`

*Defined in [index.ts:480](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L480)*

Returns true if the supplied address belongs to a precompiled account (Byzantium).

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `Buffer` \| `string` |

**Returns:** `boolean`

___
<a id="isvalidaddress"></a>

### `<Const>` isValidAddress

▸ **isValidAddress**(address: *`string`*): `boolean`

*Defined in [index.ts:395](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L395)*

Checks if the address is a valid. Accepts checksummed addresses too.

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `boolean`

___
<a id="isvalidchecksumaddress"></a>

### `<Const>` isValidChecksumAddress

▸ **isValidChecksumAddress**(address: *`string`*): `boolean`

*Defined in [index.ts:429](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L429)*

Checks if the address is a valid checksummed address.

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `boolean`

___
<a id="isvalidprivate"></a>

### `<Const>` isValidPrivate

▸ **isValidPrivate**(privateKey: *`Buffer`*): `boolean`

*Defined in [index.ts:233](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L233)*

Checks if the private key satisfies the rules of the curve secp256k1.

**Parameters:**

| Name | Type |
| ------ | ------ |
| privateKey | `Buffer` |

**Returns:** `boolean`

___
<a id="isvalidpublic"></a>

### `<Const>` isValidPublic

▸ **isValidPublic**(publicKey: *`Buffer`*, sanitize?: *`boolean`*): `boolean`

*Defined in [index.ts:243](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L243)*

Checks if the public key satisfies the rules of the curve secp256k1 and the requirements of Ethereum.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| publicKey | `Buffer` | - |  The two points of an uncompressed key, unless sanitize is enabled |
| `Default value` sanitize | `boolean` | false |  Accept public keys in other formats |

**Returns:** `boolean`

___
<a id="isvalidsignature"></a>

### `<Const>` isValidSignature

▸ **isValidSignature**(v: *`number`*, r: *`Buffer`*, s: *`Buffer`*, homesteadOrLater?: *`boolean`*, chainId?: *`undefined` \| `number`*): `boolean`

*Defined in [index.ts:500](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L500)*

Validate a ECDSA signature.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| v | `number` | - |
| r | `Buffer` | - |
| s | `Buffer` | - |
| `Default value` homesteadOrLater | `boolean` | true |  Indicates whether this is being used on either the homestead hardfork or a later one |
| `Optional` chainId | `undefined` \| `number` | - |

**Returns:** `boolean`

___
<a id="iszeroaddress"></a>

### `<Const>` isZeroAddress

▸ **isZeroAddress**(address: *`string`*): `boolean`

*Defined in [index.ts:402](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L402)*

Checks if a given address is a zero address.

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `boolean`

___
<a id="keccak"></a>

### `<Const>` keccak

▸ **keccak**(a: *`any`*, bits?: *`number`*): `Buffer`

*Defined in [index.ts:177](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L177)*

Creates Keccak hash of the input

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| a | `any` | - |  The input data (Buffer\|Array\|String\|Number) |
| `Default value` bits | `number` | 256 |  The Keccak width |

**Returns:** `Buffer`

___
<a id="keccak256"></a>

### `<Const>` keccak256

▸ **keccak256**(a: *`any`*): `Buffer`

*Defined in [index.ts:190](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L190)*

Creates Keccak-256 hash of the input, alias for keccak(a, 256).

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| a | `any` |  The input data (Buffer\|Array\|String\|Number) |

**Returns:** `Buffer`

___
<a id="privatetoaddress"></a>

### `<Const>` privateToAddress

▸ **privateToAddress**(privateKey: *`Buffer`*): `Buffer`

*Defined in [index.ts:388](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L388)*

Returns the ethereum address of a given private key.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| privateKey | `Buffer` |  A private key must be 256 bits wide |

**Returns:** `Buffer`

___
<a id="privatetopublic"></a>

### `<Const>` privateToPublic

▸ **privateToPublic**(privateKey: *`Buffer`*): `Buffer`

*Defined in [index.ts:277](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L277)*

Returns the ethereum public key of a given private key.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| privateKey | `Buffer` |  A private key must be 256 bits wide |

**Returns:** `Buffer`

___
<a id="pubtoaddress"></a>

### `<Const>` pubToAddress

▸ **pubToAddress**(pubKey: *`Buffer`*, sanitize?: *`boolean`*): `Buffer`

*Defined in [index.ts:262](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L262)*

Returns the ethereum address of a given public key. Accepts "Ethereum public keys" and SEC1 encoded keys.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| pubKey | `Buffer` | - |  The two points of an uncompressed key, unless sanitize is enabled |
| `Default value` sanitize | `boolean` | false |  Accept public keys in other formats |

**Returns:** `Buffer`

___
<a id="ripemd160"></a>

### `<Const>` ripemd160

▸ **ripemd160**(a: *`any`*, padded: *`boolean`*): `Buffer`

*Defined in [index.ts:210](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L210)*

Creates RIPEMD160 hash of the input.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| a | `any` |  The input data (Buffer\|Array\|String\|Number) |
| padded | `boolean` |  Whether it should be padded to 256 bits or not |

**Returns:** `Buffer`

___
<a id="rlphash"></a>

### `<Const>` rlphash

▸ **rlphash**(a: *`rlp.Input`*): `Buffer`

*Defined in [index.ts:226](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L226)*

Creates SHA-3 hash of the RLP encoded version of the input.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| a | `rlp.Input` |  The input data |

**Returns:** `Buffer`

___
<a id="setlengthleft"></a>

### `<Const>` setLengthLeft

▸ **setLengthLeft**(msg: *`any`*, length: *`number`*, right?: *`boolean`*): `any`

*Defined in [index.ts:62](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L62)*

Left Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes. Or it truncates the beginning if it exceeds.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| msg | `any` | - |  the value to pad (Buffer\|Array) |
| length | `number` | - |  the number of bytes the output should be |
| `Default value` right | `boolean` | false |  whether to start padding form the left or right |

**Returns:** `any`
(Buffer|Array)

___
<a id="setlengthright"></a>

### `<Const>` setLengthRight

▸ **setLengthRight**(msg: *`any`*, length: *`number`*): `any`

*Defined in [index.ts:88](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L88)*

Right Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes. Or it truncates the beginning if it exceeds.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| msg | `any` |  the value to pad (Buffer\|Array) |
| length | `number` |  the number of bytes the output should be |

**Returns:** `any`
(Buffer|Array)

___
<a id="sha256"></a>

### `<Const>` sha256

▸ **sha256**(a: *`any`*): `Buffer`

*Defined in [index.ts:198](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L198)*

Creates SHA256 hash of the input.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| a | `any` |  The input data (Buffer\|Array\|String\|Number) |

**Returns:** `Buffer`

___
<a id="tobuffer"></a>

### `<Const>` toBuffer

▸ **toBuffer**(v: *`any`*): `Buffer`

*Defined in [index.ts:112](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L112)*

Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| v | `any` |  the value |

**Returns:** `Buffer`

___
<a id="tochecksumaddress"></a>

### `<Const>` toChecksumAddress

▸ **toChecksumAddress**(address: *`string`*): `string`

*Defined in [index.ts:410](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L410)*

Returns a checksummed address.

**Parameters:**

| Name | Type |
| ------ | ------ |
| address | `string` |

**Returns:** `string`

___
<a id="torpcsig"></a>

### `<Const>` toRpcSig

▸ **toRpcSig**(v: *`number`*, r: *`Buffer`*, s: *`Buffer`*, chainId?: *`undefined` \| `number`*): `string`

*Defined in [index.ts:349](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L349)*

Convert signature parameters into the format of `eth_sign` RPC method.

**Parameters:**

| Name | Type |
| ------ | ------ |
| v | `number` |
| r | `Buffer` |
| s | `Buffer` |
| `Optional` chainId | `undefined` \| `number` |

**Returns:** `string`
Signature

___
<a id="tounsigned"></a>

### `<Const>` toUnsigned

▸ **toUnsigned**(num: *`BN`*): `Buffer`

*Defined in [index.ts:168](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L168)*

Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| num | `BN` |   |

**Returns:** `Buffer`

___
<a id="unpad"></a>

### `<Const>` unpad

▸ **unpad**(a: *`any`*): `any`

*Defined in [index.ts:97](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L97)*

Trims leading zeros from a `Buffer` or an `Array`.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| a | `any` |  (Buffer\|Array\|String) |

**Returns:** `any`
(Buffer|Array|String)

___
<a id="zeroaddress"></a>

### `<Const>` zeroAddress

▸ **zeroAddress**(): `string`

*Defined in [index.ts:48](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L48)*

Returns a zero address.

**Returns:** `string`

___
<a id="zeros"></a>

### `<Const>` zeros

▸ **zeros**(bytes: *`number`*): `Buffer`

*Defined in [index.ts:41](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/index.ts#L41)*

Returns a buffer filled with 0s.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| bytes | `number` |  the number of bytes the buffer should be |

**Returns:** `Buffer`

___

