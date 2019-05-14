
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

*Defined in [account.ts:151](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L151)*

___
<a id="setlength"></a>

### `<Const>` setLength

**● setLength**: *[setLengthLeft]()* =  setLengthLeft

*Defined in [bytes.ts:37](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L37)*

___
<a id="stripzeros"></a>

### `<Const>` stripZeros

**● stripZeros**: *[unpad]()* =  unpad

*Defined in [bytes.ts:64](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L64)*

___

## Functions

<a id="addhexprefix"></a>

### `<Const>` addHexPrefix

▸ **addHexPrefix**(str: *`string`*): `string`

*Defined in [bytes.ts:135](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L135)*

Adds "0x" to a given `String` if it does not already start with "0x".

**Parameters:**

| Name | Type |
| ------ | ------ |
| str | `string` |

**Returns:** `string`

___
<a id="batojson"></a>

### `<Const>` baToJSON

▸ **baToJSON**(ba: *`any`*): `any`

*Defined in [bytes.ts:148](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L148)*

Converts a `Buffer` or `Array` to JSON.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| ba | `any` |  (Buffer\|Array) |

**Returns:** `any`
(Array|String|null)

___
<a id="buffertohex"></a>

### `<Const>` bufferToHex

▸ **bufferToHex**(buf: *`Buffer`*): `string`

*Defined in [bytes.ts:111](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L111)*

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

*Defined in [bytes.ts:103](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L103)*

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

*Defined in [object.ts:17](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/object.ts#L17)*

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

*Defined in [signature.ts:36](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L36)*

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

*Defined in [signature.ts:15](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L15)*

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

*Defined in [signature.ts:70](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L70)*

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

*Defined in [bytes.ts:120](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L120)*

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

*Defined in [account.ts:63](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L63)*

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

*Defined in [account.ts:83](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L83)*

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

▸ **hashPersonalMessage**(message: *`Buffer`*): `Buffer`

*Defined in [signature.ts:136](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L136)*

Returns the keccak-256 hash of `message`, prefixed with the header used by the `eth_sign` RPC call. The output of this function can be fed into `ecsign` to produce the same signature as the `eth_sign` call for a given `message`, or fed to `ecrecover` along with a signature to recover the public key used to produce the signature.

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | `Buffer` |

**Returns:** `Buffer`

___
<a id="importpublic"></a>

### `<Const>` importPublic

▸ **importPublic**(publicKey: *`Buffer`*): `Buffer`

*Defined in [account.ts:174](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L174)*

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

*Defined in [account.ts:105](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L105)*

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

*Defined in [account.ts:20](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L20)*

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

*Defined in [account.ts:54](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L54)*

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

*Defined in [account.ts:113](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L113)*

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

*Defined in [account.ts:123](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L123)*

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

*Defined in [signature.ts:95](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L95)*

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

*Defined in [account.ts:27](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L27)*

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

*Defined in [hash.ts:13](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L13)*

Creates Keccak hash of the input

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| a | `any` | - |  The input data (Buffer\|Array\|String\|Number) If the string is a 0x-prefixed hex value it's interpreted as hexadecimal, otherwise as utf8. |
| `Default value` bits | `number` | 256 |  The Keccak width |

**Returns:** `Buffer`

___
<a id="keccak256"></a>

### `<Const>` keccak256

▸ **keccak256**(a: *`any`*): `Buffer`

*Defined in [hash.ts:31](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L31)*

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

*Defined in [account.ts:157](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L157)*

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

*Defined in [account.ts:165](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L165)*

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

*Defined in [account.ts:142](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L142)*

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

*Defined in [hash.ts:51](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L51)*

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

*Defined in [hash.ts:67](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L67)*

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

*Defined in [bytes.ts:20](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L20)*

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

*Defined in [bytes.ts:46](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L46)*

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

*Defined in [hash.ts:39](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/hash.ts#L39)*

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

*Defined in [bytes.ts:70](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L70)*

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

*Defined in [account.ts:35](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L35)*

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

*Defined in [signature.ts:56](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/signature.ts#L56)*

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

*Defined in [bytes.ts:128](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L128)*

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

*Defined in [bytes.ts:55](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L55)*

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

*Defined in [account.ts:11](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/account.ts#L11)*

Returns a zero address.

**Returns:** `string`

___
<a id="zeros"></a>

### `<Const>` zeros

▸ **zeros**(bytes: *`number`*): `Buffer`

*Defined in [bytes.ts:8](https://github.com/ethereumjs/ethereumjs-util/blob/master/src/bytes.ts#L8)*

Returns a buffer filled with 0s.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| bytes | `number` |  the number of bytes the buffer should be |

**Returns:** `Buffer`

___

