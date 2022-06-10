@ethereumjs/util

# @ethereumjs/util

## Table of contents

### Namespaces

- [BN](modules/BN.md)
- [rlp](modules/rlp.md)

### Enumerations

- [TypeOutput](enums/TypeOutput.md)

### Classes

- [Account](classes/Account.md)
- [Address](classes/Address.md)
- [BN](classes/BN.md)

### Interfaces

- [AccountData](interfaces/AccountData.md)
- [ECDSASignature](interfaces/ECDSASignature.md)
- [ECDSASignatureBuffer](interfaces/ECDSASignatureBuffer.md)
- [TransformableToArray](interfaces/TransformableToArray.md)
- [TransformableToBuffer](interfaces/TransformableToBuffer.md)

### Type Aliases

- [AddressLike](README.md#addresslike)
- [BNLike](README.md#bnlike)
- [BufferLike](README.md#bufferlike)
- [NestedBufferArray](README.md#nestedbufferarray)
- [NestedUint8Array](README.md#nesteduint8array)
- [PrefixedHexString](README.md#prefixedhexstring)
- [ToBufferInputTypes](README.md#tobufferinputtypes)
- [TypeOutputReturnType](README.md#typeoutputreturntype)

### Variables

- [KECCAK256\_NULL](README.md#keccak256_null)
- [KECCAK256\_NULL\_S](README.md#keccak256_null_s)
- [KECCAK256\_RLP](README.md#keccak256_rlp)
- [KECCAK256\_RLP\_ARRAY](README.md#keccak256_rlp_array)
- [KECCAK256\_RLP\_ARRAY\_S](README.md#keccak256_rlp_array_s)
- [KECCAK256\_RLP\_S](README.md#keccak256_rlp_s)
- [MAX\_INTEGER](README.md#max_integer)
- [MAX\_UINT64](README.md#max_uint64)
- [TWO\_POW256](README.md#two_pow256)

### Functions

- [addHexPrefix](README.md#addhexprefix)
- [arrToBufArr](README.md#arrtobufarr)
- [arrayContainsArray](README.md#arraycontainsarray)
- [baToJSON](README.md#batojson)
- [bigIntToHex](README.md#bigIntToHex)
- [bnToRlp](README.md#bntorlp)
- [bigIntToUnpaddedBuffer](README.md#bigIntToUnpaddedBuffer)
- [bufArrToArr](README.md#bufarrtoarr)
- [bufferToHex](README.md#buffertohex)
- [bufferToInt](README.md#buffertoint)
- [defineProperties](README.md#defineproperties)
- [ecrecover](README.md#ecrecover)
- [ecsign](README.md#ecsign)
- [fromAscii](README.md#fromascii)
- [fromRpcSig](README.md#fromrpcsig)
- [fromSigned](README.md#fromsigned)
- [fromUtf8](README.md#fromutf8)
- [generateAddress](README.md#generateaddress)
- [generateAddress2](README.md#generateaddress2)
- [getBinarySize](README.md#getbinarysize)
- [getKeys](README.md#getkeys)
- [hashPersonalMessage](README.md#hashpersonalmessage)
- [importPublic](README.md#importpublic)
- [intToBuffer](README.md#inttobuffer)
- [intToHex](README.md#inttohex)
- [isHexPrefixed](README.md#ishexprefixed)
- [isHexString](README.md#ishexstring)
- [isValidAddress](README.md#isvalidaddress)
- [isValidChecksumAddress](README.md#isvalidchecksumaddress)
- [isValidPrivate](README.md#isvalidprivate)
- [isValidPublic](README.md#isvalidpublic)
- [isValidSignature](README.md#isvalidsignature)
- [isZeroAddress](README.md#iszeroaddress)
- [keccak](README.md#keccak)
- [keccak256](README.md#keccak256)
- [keccakFromArray](README.md#keccakfromarray)
- [keccakFromHexString](README.md#keccakfromhexstring)
- [keccakFromString](README.md#keccakfromstring)
- [padToEven](README.md#padtoeven)
- [privateToAddress](README.md#privatetoaddress)
- [privateToPublic](README.md#privatetopublic)
- [pubToAddress](README.md#pubtoaddress)
- [publicToAddress](README.md#publictoaddress)
- [ripemd160](README.md#ripemd160)
- [ripemd160FromArray](README.md#ripemd160fromarray)
- [ripemd160FromString](README.md#ripemd160fromstring)
- [rlphash](README.md#rlphash)
- [setLengthLeft](README.md#setlengthleft)
- [setLengthRight](README.md#setlengthright)
- [sha256](README.md#sha256)
- [sha256FromArray](README.md#sha256fromarray)
- [sha256FromString](README.md#sha256fromstring)
- [stripHexPrefix](README.md#striphexprefix)
- [toAscii](README.md#toascii)
- [toBuffer](README.md#tobuffer)
- [toChecksumAddress](README.md#tochecksumaddress)
- [toCompactSig](README.md#tocompactsig)
- [toRpcSig](README.md#torpcsig)
- [toType](README.md#totype)
- [toUnsigned](README.md#tounsigned)
- [toUtf8](README.md#toutf8)
- [unpadArray](README.md#unpadarray)
- [unpadBuffer](README.md#unpadbuffer)
- [unpadHexString](README.md#unpadhexstring)
- [validateNoLeadingZeroes](README.md#validatenoleadingzeroes)
- [zeroAddress](README.md#zeroaddress)
- [zeros](README.md#zeros)

## Type Aliases

### AddressLike

Ƭ **AddressLike**: [`Address`](classes/Address.md) \| `Buffer` \| [`PrefixedHexString`](README.md#prefixedhexstring)

A type that represents an Address-like value.
To convert to address, use `new Address(toBuffer(value))`

#### Defined in

[packages/util/src/types.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L32)

___

### BNLike

Ƭ **BNLike**: [`BN`](classes/BN.md) \| [`PrefixedHexString`](README.md#prefixedhexstring) \| `number` \| `Buffer`

#### Defined in

[packages/util/src/types.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L9)

___

### BufferLike

Ƭ **BufferLike**: `Buffer` \| `Uint8Array` \| `number`[] \| `number` \| [`BN`](classes/BN.md) \| [`TransformableToBuffer`](interfaces/TransformableToBuffer.md) \| [`PrefixedHexString`](README.md#prefixedhexstring)

#### Defined in

[packages/util/src/types.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L14)

___

### NestedBufferArray

Ƭ **NestedBufferArray**: (`Buffer` \| [`NestedBufferArray`](README.md#nestedbufferarray))[]

#### Defined in

[packages/util/src/types.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L51)

___

### NestedUint8Array

Ƭ **NestedUint8Array**: (`Uint8Array` \| [`NestedUint8Array`](README.md#nesteduint8array))[]

#### Defined in

[packages/util/src/types.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L50)

___

### PrefixedHexString

Ƭ **PrefixedHexString**: `string`

#### Defined in

[packages/util/src/types.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L26)

___

### ToBufferInputTypes

Ƭ **ToBufferInputTypes**: [`PrefixedHexString`](README.md#prefixedhexstring) \| `number` \| [`BN`](classes/BN.md) \| `Buffer` \| `Uint8Array` \| `number`[] \| [`TransformableToArray`](interfaces/TransformableToArray.md) \| [`TransformableToBuffer`](interfaces/TransformableToBuffer.md) \| ``null`` \| `undefined`

#### Defined in

[packages/util/src/bytes.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L136)

___

### TypeOutputReturnType

Ƭ **TypeOutputReturnType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `0` | `number` |
| `1` | [`BN`](classes/BN.md) |
| `2` | `Buffer` |
| `3` | [`PrefixedHexString`](README.md#prefixedhexstring) |

#### Defined in

[packages/util/src/types.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L89)

## Variables

### KECCAK256\_NULL

• `Const` **KECCAK256\_NULL**: `Buffer`

Keccak-256 hash of null

#### Defined in

[packages/util/src/constants.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L33)

___

### KECCAK256\_NULL\_S

• `Const` **KECCAK256\_NULL\_S**: ``"c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"``

Keccak-256 hash of null

#### Defined in

[packages/util/src/constants.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L28)

___

### KECCAK256\_RLP

• `Const` **KECCAK256\_RLP**: `Buffer`

Keccak-256 hash of the RLP of null

#### Defined in

[packages/util/src/constants.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L54)

___

### KECCAK256\_RLP\_ARRAY

• `Const` **KECCAK256\_RLP\_ARRAY**: `Buffer`

Keccak-256 of an RLP of an empty array

#### Defined in

[packages/util/src/constants.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L44)

___

### KECCAK256\_RLP\_ARRAY\_S

• `Const` **KECCAK256\_RLP\_ARRAY\_S**: ``"1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347"``

Keccak-256 of an RLP of an empty array

#### Defined in

[packages/util/src/constants.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L38)

___

### KECCAK256\_RLP\_S

• `Const` **KECCAK256\_RLP\_S**: ``"56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"``

Keccak-256 hash of the RLP of null

#### Defined in

[packages/util/src/constants.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L49)

___

### MAX\_INTEGER

• `Const` **MAX\_INTEGER**: [`BN`](classes/BN.md)

The max integer that the evm can handle (2^256-1)

#### Defined in

[packages/util/src/constants.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L12)

___

### MAX\_UINT64

• `Const` **MAX\_UINT64**: [`BN`](classes/BN.md)

2^64-1

#### Defined in

[packages/util/src/constants.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L7)

___

### TWO\_POW256

• `Const` **TWO\_POW256**: [`BN`](classes/BN.md)

2^256

#### Defined in

[packages/util/src/constants.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L20)

## Functions

### addHexPrefix

▸ **addHexPrefix**(`str`): `string`

Adds "0x" to a given `String` if it does not already start with "0x".

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

#### Defined in

[packages/util/src/bytes.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L236)

___

### arrToBufArr

▸ **arrToBufArr**(`arr`): `Buffer`

Converts a {@link Uint8Array} or [NestedUint8Array](README.md#nesteduint8array) to [Buffer](enums/TypeOutput.md#buffer) or [NestedBufferArray](README.md#nestedbufferarray)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `Uint8Array` |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/bytes.ts:313](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L313)

▸ **arrToBufArr**(`arr`): [`NestedBufferArray`](README.md#nestedbufferarray)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | [`NestedUint8Array`](README.md#nesteduint8array) |

#### Returns

[`NestedBufferArray`](README.md#nestedbufferarray)

#### Defined in

[packages/util/src/bytes.ts:314](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L314)

▸ **arrToBufArr**(`arr`): `Buffer` \| [`NestedBufferArray`](README.md#nestedbufferarray)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `Uint8Array` \| [`NestedUint8Array`](README.md#nesteduint8array) |

#### Returns

`Buffer` \| [`NestedBufferArray`](README.md#nestedbufferarray)

#### Defined in

[packages/util/src/bytes.ts:315](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L315)

___

### arrayContainsArray

▸ **arrayContainsArray**(`superset`, `subset`, `some?`): `boolean`

Returns TRUE if the first specified array contains all elements
from the second one. FALSE otherwise.

#### Parameters

| Name | Type |
| :------ | :------ |
| `superset` | `unknown`[] |
| `subset` | `unknown`[] |
| `some?` | `boolean` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/internal.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L89)

___

### baToJSON

▸ **baToJSON**(`ba`): `any`

Converts a `Buffer` or `Array` to JSON.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ba` | `any` | (Buffer\|Array) |

#### Returns

`any`

(Array|String|null)

#### Defined in

[packages/util/src/bytes.ts:277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L277)

___

### bigIntToHex

▸ **bigIntToHex**(`value`): [`PrefixedHexString`](README.md#prefixedhexstring)

Convert BN to 0x-prefixed hex string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`BN`](classes/BN.md) |

#### Returns

[`PrefixedHexString`](README.md#prefixedhexstring)

#### Defined in

[packages/util/src/types.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L56)

___

### bnToRlp

▸ **bnToRlp**(`value`): `Buffer`

Deprecated alias for [bigIntToUnpaddedBuffer](README.md#bigIntToUnpaddedBuffer)

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`BN`](classes/BN.md) |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/types.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L75)

___

### bigIntToUnpaddedBuffer

▸ **bigIntToUnpaddedBuffer**(`value`): `Buffer`

Convert value from BN to an unpadded Buffer
(useful for RLP transport)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | [`BN`](classes/BN.md) | value to convert |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/types.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L65)

___

### bufArrToArr

▸ **bufArrToArr**(`arr`): `Uint8Array`

Converts a [Buffer](enums/TypeOutput.md#buffer) or [NestedBufferArray](README.md#nestedbufferarray) to {@link Uint8Array} or [NestedUint8Array](README.md#nesteduint8array)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `Buffer` |

#### Returns

`Uint8Array`

#### Defined in

[packages/util/src/bytes.ts:326](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L326)

▸ **bufArrToArr**(`arr`): [`NestedUint8Array`](README.md#nesteduint8array)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | [`NestedBufferArray`](README.md#nestedbufferarray) |

#### Returns

[`NestedUint8Array`](README.md#nesteduint8array)

#### Defined in

[packages/util/src/bytes.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L327)

▸ **bufArrToArr**(`arr`): `Uint8Array` \| [`NestedUint8Array`](README.md#nesteduint8array)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `Buffer` \| [`NestedBufferArray`](README.md#nestedbufferarray) |

#### Returns

`Uint8Array` \| [`NestedUint8Array`](README.md#nesteduint8array)

#### Defined in

[packages/util/src/bytes.ts:328](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L328)

___

### bufferToHex

▸ **bufferToHex**(`buf`): `string`

Converts a `Buffer` into a `0x`-prefixed hex `String`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buf` | `Buffer` | `Buffer` object to convert |

#### Returns

`string`

#### Defined in

[packages/util/src/bytes.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L212)

___

### bufferToInt

▸ **bufferToInt**(`buf`): `number`

Converts a `Buffer` to a `Number`.

**`throws`** If the input number exceeds 53 bits.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buf` | `Buffer` | `Buffer` object to convert |

#### Returns

`number`

#### Defined in

[packages/util/src/bytes.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L204)

___

### defineProperties

▸ **defineProperties**(`self`, `fields`, `data?`): `void`

Defines properties on a `Object`. It make the assumption that underlying data is binary.

**`deprecated`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `self` | `any` | the `Object` to define properties on |
| `fields` | `any` | an array fields to define. Fields can contain: * `name` - the name of the properties * `length` - the number of bytes the field can have * `allowLess` - if the field can be less than the length * `allowEmpty` |
| `data?` | `any` | data to be validated against the definitions |

#### Returns

`void`

#### Defined in

[packages/util/src/object.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/object.ts#L17)

___

### ecrecover

▸ **ecrecover**(`msgHash`, `v`, `r`, `s`, `chainId?`): `Buffer`

ECDSA public key recovery from signature.
NOTE: Accepts `v == 0 | v == 1` for EIP1559 transactions

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgHash` | `Buffer` |
| `v` | [`BNLike`](README.md#bnlike) |
| `r` | `Buffer` |
| `s` | `Buffer` |
| `chainId?` | [`BNLike`](README.md#bnlike) |

#### Returns

`Buffer`

Recovered public key

#### Defined in

[packages/util/src/signature.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L69)

___

### ecsign

▸ **ecsign**(`msgHash`, `privateKey`, `chainId?`): [`ECDSASignature`](interfaces/ECDSASignature.md)

Returns the ECDSA signature of a message hash.

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgHash` | `Buffer` |
| `privateKey` | `Buffer` |
| `chainId?` | `number` |

#### Returns

[`ECDSASignature`](interfaces/ECDSASignature.md)

#### Defined in

[packages/util/src/signature.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L23)

▸ **ecsign**(`msgHash`, `privateKey`, `chainId`): [`ECDSASignatureBuffer`](interfaces/ECDSASignatureBuffer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgHash` | `Buffer` |
| `privateKey` | `Buffer` |
| `chainId` | [`BNLike`](README.md#bnlike) |

#### Returns

[`ECDSASignatureBuffer`](interfaces/ECDSASignatureBuffer.md)

#### Defined in

[packages/util/src/signature.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L24)

___

### fromAscii

▸ **fromAscii**(`stringValue`): `string`

Should be called to get hex representation (prefixed by 0x) of ascii string

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringValue` | `string` |

#### Returns

`string`

hex representation of input string

#### Defined in

[packages/util/src/internal.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L149)

___

### fromRpcSig

▸ **fromRpcSig**(`sig`): [`ECDSASignature`](interfaces/ECDSASignature.md)

Convert signature format of the `eth_sign` RPC method to signature parameters
NOTE: all because of a bug in geth: https://github.com/ethereum/go-ethereum/issues/2053
NOTE: After EIP1559, `v` could be `0` or `1` but this function assumes
it's a signed message (EIP-191 or EIP-712) adding `27` at the end. Remove if needed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `sig` | `string` |

#### Returns

[`ECDSASignature`](interfaces/ECDSASignature.md)

#### Defined in

[packages/util/src/signature.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L127)

___

### fromSigned

▸ **fromSigned**(`num`): [`BN`](classes/BN.md)

Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `num` | `Buffer` | Signed integer value |

#### Returns

[`BN`](classes/BN.md)

#### Defined in

[packages/util/src/bytes.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L221)

___

### fromUtf8

▸ **fromUtf8**(`stringValue`): `string`

Should be called to get hex representation (prefixed by 0x) of utf8 string

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringValue` | `string` |

#### Returns

`string`

hex representation of input string

#### Defined in

[packages/util/src/internal.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L136)

___

### generateAddress

▸ **generateAddress**(`from`, `nonce`): `Buffer`

Generates an address of a newly created contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | `Buffer` | The address which is creating this new address |
| `nonce` | `Buffer` | The nonce of the from account |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L191)

___

### generateAddress2

▸ **generateAddress2**(`from`, `salt`, `initCode`): `Buffer`

Generates an address for a contract created using CREATE2.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | `Buffer` | The address which is creating this new address |
| `salt` | `Buffer` | A salt |
| `initCode` | `Buffer` | The init code of the contract being created |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L212)

___

### getBinarySize

▸ **getBinarySize**(`str`): `number`

Get the binary size of a string

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`number`

the number of bytes contained within the string

#### Defined in

[packages/util/src/internal.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L73)

___

### getKeys

▸ **getKeys**(`params`, `key`, `allowEmpty?`): `string`[]

Returns the keys from an array of objects.

**`example`**
```js
getKeys([{a: '1', b: '2'}, {a: '3', b: '4'}], 'a') => ['1', '3']
````

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Record`<`string`, `string`\>[] |
| `key` | `string` |
| `allowEmpty?` | `boolean` |

#### Returns

`string`[]

output just a simple array of output keys

#### Defined in

[packages/util/src/internal.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L171)

___

### hashPersonalMessage

▸ **hashPersonalMessage**(`message`): `Buffer`

Returns the keccak-256 hash of `message`, prefixed with the header used by the `eth_sign` RPC call.
The output of this function can be fed into `ecsign` to produce the same signature as the `eth_sign`
call for a given `message`, or fed to `ecrecover` along with a signature to recover the public key
used to produce the signature.

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `Buffer` |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/signature.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L205)

___

### importPublic

▸ **importPublic**(`publicKey`): `Buffer`

Converts a public key to the Ethereum format.

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `Buffer` |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:292](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L292)

___

### intToBuffer

▸ **intToBuffer**(`i`): `Buffer`

Converts an `Number` to a `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/bytes.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L29)

___

### intToHex

▸ **intToHex**(`i`): `string`

Converts a `Number` into a hex `String`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |

#### Returns

`string`

#### Defined in

[packages/util/src/bytes.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L17)

___

### isHexPrefixed

▸ **isHexPrefixed**(`str`): `boolean`

Returns a `Boolean` on whether or not the a `String` starts with '0x'

**`throws`** if the str input is not a string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | the string input value |

#### Returns

`boolean`

a boolean if it is or is not hex prefixed

#### Defined in

[packages/util/src/internal.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L31)

___

### isHexString

▸ **isHexString**(`value`, `length?`): `boolean`

Is the string a hex string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `length?` | `number` |

#### Returns

`boolean`

output the string is a hex string

#### Defined in

[packages/util/src/internal.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L203)

___

### isValidAddress

▸ **isValidAddress**(`hexAddress`): `boolean`

Checks if the address is a valid. Accepts checksummed addresses too.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hexAddress` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L128)

___

### isValidChecksumAddress

▸ **isValidChecksumAddress**(`hexAddress`, `eip1191ChainId?`): `boolean`

Checks if the address is a valid checksummed address.

See toChecksumAddress' documentation for details about the eip1191ChainId parameter.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hexAddress` | `string` |
| `eip1191ChainId?` | [`BNLike`](README.md#bnlike) |

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L179)

___

### isValidPrivate

▸ **isValidPrivate**(`privateKey`): `boolean`

Checks if the private key satisfies the rules of the curve secp256k1.

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Buffer` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L230)

___

### isValidPublic

▸ **isValidPublic**(`publicKey`, `sanitize?`): `boolean`

Checks if the public key satisfies the rules of the curve secp256k1
and the requirements of Ethereum.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `publicKey` | `Buffer` | `undefined` | The two points of an uncompressed key, unless sanitize is enabled |
| `sanitize` | `boolean` | `false` | Accept public keys in other formats |

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L240)

___

### isValidSignature

▸ **isValidSignature**(`v`, `r`, `s`, `homesteadOrLater?`, `chainId?`): `boolean`

Validate a ECDSA signature.
NOTE: Accepts `v == 0 | v == 1` for EIP1559 transactions

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `v` | [`BNLike`](README.md#bnlike) | `undefined` | - |
| `r` | `Buffer` | `undefined` | - |
| `s` | `Buffer` | `undefined` | - |
| `homesteadOrLater` | `boolean` | `true` | Indicates whether this is being used on either the homestead hardfork or a later one |
| `chainId?` | [`BNLike`](README.md#bnlike) | `undefined` | - |

#### Returns

`boolean`

#### Defined in

[packages/util/src/signature.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L164)

___

### isZeroAddress

▸ **isZeroAddress**(`hexAddress`): `boolean`

Checks if a given address is the zero address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hexAddress` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:312](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L312)

___

### keccak

▸ **keccak**(`a`, `bits?`): `Buffer`

Creates Keccak hash of a Buffer input

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `a` | `Buffer` | `undefined` | The input data (Buffer) |
| `bits` | `number` | `256` | (number = 256) The Keccak width |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L12)

___

### keccak256

▸ **keccak256**(`a`): `Buffer`

Creates Keccak-256 hash of the input, alias for keccak(a, 256).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `Buffer` | The input data (Buffer) |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L37)

___

### keccakFromArray

▸ **keccakFromArray**(`a`, `bits?`): `Buffer`

Creates Keccak hash of a number array input

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `a` | `number`[] | `undefined` | The input data (number[]) |
| `bits` | `number` | `256` | (number = 256) The Keccak width |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L67)

___

### keccakFromHexString

▸ **keccakFromHexString**(`a`, `bits?`): `Buffer`

Creates Keccak hash of an 0x-prefixed string input

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `a` | `string` | `undefined` | The input data (String) |
| `bits` | `number` | `256` | (number = 256) The Keccak width |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L57)

___

### keccakFromString

▸ **keccakFromString**(`a`, `bits?`): `Buffer`

Creates Keccak hash of a utf-8 string input

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `a` | `string` | `undefined` | The input data (String) |
| `bits` | `number` | `256` | (number = 256) The Keccak width |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L46)

___

### padToEven

▸ **padToEven**(`value`): `string`

Pads a `String` to have an even length

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`string`

output

#### Defined in

[packages/util/src/internal.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L56)

___

### privateToAddress

▸ **privateToAddress**(`privateKey`): `Buffer`

Returns the ethereum address of a given private key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Buffer` | A private key must be 256 bits wide |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:285](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L285)

___

### privateToPublic

▸ **privateToPublic**(`privateKey`): `Buffer`

Returns the ethereum public key of a given private key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Buffer` | A private key must be 256 bits wide |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:275](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L275)

___

### pubToAddress

▸ **pubToAddress**(`pubKey`, `sanitize?`): `Buffer`

Returns the ethereum address of a given public key.
Accepts "Ethereum public keys" and SEC1 encoded keys.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `pubKey` | `Buffer` | `undefined` | The two points of an uncompressed key, unless sanitize is enabled |
| `sanitize` | `boolean` | `false` | Accept public keys in other formats |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L260)

___

### publicToAddress

▸ **publicToAddress**(`pubKey`, `sanitize?`): `Buffer`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pubKey` | `Buffer` | `undefined` |
| `sanitize` | `boolean` | `false` |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L269)

___

### ripemd160

▸ **ripemd160**(`a`, `padded`): `Buffer`

Creates RIPEMD160 hash of a Buffer input.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `Buffer` | The input data (Buffer) |
| `padded` | `boolean` | Whether it should be padded to 256 bits or not |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L128)

___

### ripemd160FromArray

▸ **ripemd160FromArray**(`a`, `padded`): `Buffer`

Creates RIPEMD160 hash of a number[] input.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `number`[] | The input data (number[]) |
| `padded` | `boolean` | Whether it should be padded to 256 bits or not |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L148)

___

### ripemd160FromString

▸ **ripemd160FromString**(`a`, `padded`): `Buffer`

Creates RIPEMD160 hash of a string input.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `string` | The input data (String) |
| `padded` | `boolean` | Whether it should be padded to 256 bits or not |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L138)

___

### rlphash

▸ **rlphash**(`a`): `Buffer`

Creates SHA-3 hash of the RLP encoded version of the input.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | [`Input`](modules/rlp.md#input) | The input data |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L157)

___

### setLengthLeft

▸ **setLengthLeft**(`msg`, `length`): `Buffer`

Left Pads a `Buffer` with leading zeros till it has `length` bytes.
Or it truncates the beginning if it exceeds.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `msg` | `Buffer` | the value to pad (Buffer) |
| `length` | `number` | the number of bytes the output should be |

#### Returns

`Buffer`

(Buffer)

#### Defined in

[packages/util/src/bytes.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L74)

___

### setLengthRight

▸ **setLengthRight**(`msg`, `length`): `Buffer`

Right Pads a `Buffer` with trailing zeros till it has `length` bytes.
it truncates the end if it exceeds.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `msg` | `Buffer` | the value to pad (Buffer) |
| `length` | `number` | the number of bytes the output should be |

#### Returns

`Buffer`

(Buffer)

#### Defined in

[packages/util/src/bytes.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L86)

___

### sha256

▸ **sha256**(`a`): `Buffer`

Creates SHA256 hash of a Buffer input.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `Buffer` | The input data (Buffer) |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L85)

___

### sha256FromArray

▸ **sha256FromArray**(`a`): `Buffer`

Creates SHA256 hash of a number[] input.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `number`[] | The input data (number[]) |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L103)

___

### sha256FromString

▸ **sha256FromString**(`a`): `Buffer`

Creates SHA256 hash of a string input.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `string` | The input data (string) |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L94)

___

### stripHexPrefix

▸ **stripHexPrefix**(`str`): `string`

Removes '0x' from a given `String` if present

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | the string value |

#### Returns

`string`

the string without 0x prefix

#### Defined in

[packages/util/src/internal.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L44)

___

### toAscii

▸ **toAscii**(`hex`): `string`

Should be called to get ascii from its hex representation

#### Parameters

| Name | Type |
| :------ | :------ |
| `hex` | `string` |

#### Returns

`string`

ascii string representation of hex value

#### Defined in

[packages/util/src/internal.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L114)

___

### toBuffer

▸ **toBuffer**(`v`): `Buffer`

Attempts to turn a value into a `Buffer`.
Inputs supported: `Buffer`, `String` (hex-prefixed), `Number`, null/undefined, `BN` and other objects
with a `toArray()` or `toBuffer()` method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `v` | [`ToBufferInputTypes`](README.md#tobufferinputtypes) | the value |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/bytes.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L154)

___

### toChecksumAddress

▸ **toChecksumAddress**(`hexAddress`, `eip1191ChainId?`): `string`

Returns a checksummed address.

If an eip1191ChainId is provided, the chainId will be included in the checksum calculation. This
has the effect of checksummed addresses for one chain having invalid checksums for others.
For more details see [EIP-1191](https://eips.ethereum.org/EIPS/eip-1191).

WARNING: Checksums with and without the chainId will differ and the EIP-1191 checksum is not
backwards compatible to the original widely adopted checksum format standard introduced in
[EIP-55](https://eips.ethereum.org/EIPS/eip-55), so this will break in existing applications.
Usage of this EIP is therefore discouraged unless you have a very targeted use case.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hexAddress` | `string` |
| `eip1191ChainId?` | [`BNLike`](README.md#bnlike) |

#### Returns

`string`

#### Defined in

[packages/util/src/account.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L150)

___

### toCompactSig

▸ **toCompactSig**(`v`, `r`, `s`, `chainId?`): `string`

Convert signature parameters into the format of Compact Signature Representation (EIP-2098).
NOTE: Accepts `v == 0 | v == 1` for EIP1559 transactions

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`BNLike`](README.md#bnlike) |
| `r` | `Buffer` |
| `s` | `Buffer` |
| `chainId?` | [`BNLike`](README.md#bnlike) |

#### Returns

`string`

Signature

#### Defined in

[packages/util/src/signature.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L105)

___

### toRpcSig

▸ **toRpcSig**(`v`, `r`, `s`, `chainId?`): `string`

Convert signature parameters into the format of `eth_sign` RPC method.
NOTE: Accepts `v == 0 | v == 1` for EIP1559 transactions

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | [`BNLike`](README.md#bnlike) |
| `r` | `Buffer` |
| `s` | `Buffer` |
| `chainId?` | [`BNLike`](README.md#bnlike) |

#### Returns

`string`

Signature

#### Defined in

[packages/util/src/signature.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L90)

___

### toType

▸ **toType**<`T`\>(`input`, `outputType`): ``null``

Convert an input to a specified type.
Input of null/undefined returns null/undefined regardless of the output type.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TypeOutput`](enums/TypeOutput.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | ``null`` | value to convert |
| `outputType` | `T` | type to output |

#### Returns

``null``

#### Defined in

[packages/util/src/types.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L102)

▸ **toType**<`T`\>(`input`, `outputType`): `undefined`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TypeOutput`](enums/TypeOutput.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `undefined` |
| `outputType` | `T` |

#### Returns

`undefined`

#### Defined in

[packages/util/src/types.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L103)

▸ **toType**<`T`\>(`input`, `outputType`): [`TypeOutputReturnType`](README.md#typeoutputreturntype)[`T`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`TypeOutput`](enums/TypeOutput.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | [`ToBufferInputTypes`](README.md#tobufferinputtypes) |
| `outputType` | `T` |

#### Returns

[`TypeOutputReturnType`](README.md#typeoutputreturntype)[`T`]

#### Defined in

[packages/util/src/types.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L104)

___

### toUnsigned

▸ **toUnsigned**(`num`): `Buffer`

Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

#### Parameters

| Name | Type |
| :------ | :------ |
| `num` | [`BN`](classes/BN.md) |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/bytes.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L229)

___

### toUtf8

▸ **toUtf8**(`hex`): `string`

Returns the utf8 string representation from a hex string.

Examples:

Input 1: '657468657265756d000000000000000000000000000000000000000000000000'
Input 2: '657468657265756d'
Input 3: '000000000000000000000000000000000000000000000000657468657265756d'

Output (all 3 input variants): 'ethereum'

Note that this method is not intended to be used with hex strings
representing quantities in both big endian or little endian notation.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hex` | `string` |

#### Returns

`string`

Utf8 string

#### Defined in

[packages/util/src/bytes.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L261)

___

### unpadArray

▸ **unpadArray**(`a`): `number`[]

Trims leading zeros from an `Array` (of numbers).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `number`[] | (number[]) |

#### Returns

`number`[]

(number[])

#### Defined in

[packages/util/src/bytes.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L120)

___

### unpadBuffer

▸ **unpadBuffer**(`a`): `Buffer`

Trims leading zeros from a `Buffer`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `Buffer` | (Buffer) |

#### Returns

`Buffer`

(Buffer)

#### Defined in

[packages/util/src/bytes.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L110)

___

### unpadHexString

▸ **unpadHexString**(`a`): `string`

Trims leading zeros from a hex-prefixed `String`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `string` | (String) |

#### Returns

`string`

(String)

#### Defined in

[packages/util/src/bytes.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L130)

___

### validateNoLeadingZeroes

▸ **validateNoLeadingZeroes**(`values`): `void`

Checks provided Buffers for leading zeroes and throws if found.

Examples:

Valid values: 0x1, 0x, 0x01, 0x1234
Invalid values: 0x0, 0x00, 0x001, 0x0001

Note: This method is useful for validating that RLP encoded integers comply with the rule that all
integer values encoded to RLP must be in the most compact form and contain no leading zero bytes

**`throws`** if any provided value is found to have leading zero bytes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Object` | An object containing string keys and Buffer values |

#### Returns

`void`

#### Defined in

[packages/util/src/bytes.ts:302](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L302)

___

### zeroAddress

▸ **zeroAddress**(): `string`

Returns the zero address.

#### Returns

`string`

#### Defined in

[packages/util/src/account.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L303)

___

### zeros

▸ **zeros**(`bytes`): `Buffer`

Returns a buffer filled with 0s.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `number` | the number of bytes the buffer should be |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/bytes.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L38)
