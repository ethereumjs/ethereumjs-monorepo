@ethereumjs/util

# @ethereumjs/util

## Table of contents

### Enumerations

- [TypeOutput](enums/TypeOutput.md)

### Classes

- [Account](classes/Account.md)
- [Address](classes/Address.md)

### Interfaces

- [AccountData](interfaces/AccountData.md)
- [ECDSASignature](interfaces/ECDSASignature.md)
- [TransformableToArray](interfaces/TransformableToArray.md)
- [TransformableToBuffer](interfaces/TransformableToBuffer.md)

### Type Aliases

- [AddressLike](README.md#addresslike)
- [BigIntLike](README.md#bigintlike)
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
- [MAX\_INTEGER\_BIGINT](README.md#max_integer_bigint)
- [MAX\_UINT64](README.md#max_uint64)
- [RLP\_EMPTY\_STRING](README.md#rlp_empty_string)
- [SECP256K1\_ORDER](README.md#secp256k1_order)
- [SECP256K1\_ORDER\_DIV\_2](README.md#secp256k1_order_div_2)
- [TWO\_POW256](README.md#two_pow256)

### Functions

- [addHexPrefix](README.md#addhexprefix)
- [arrToBufArr](README.md#arrtobufarr)
- [arrayContainsArray](README.md#arraycontainsarray)
- [baToJSON](README.md#batojson)
- [bigIntToBuffer](README.md#biginttobuffer)
- [bigIntToHex](README.md#biginttohex)
- [bigIntToUnpaddedBuffer](README.md#biginttounpaddedbuffer)
- [bufArrToArr](README.md#bufarrtoarr)
- [bufferToBigInt](README.md#buffertobigint)
- [bufferToHex](README.md#buffertohex)
- [bufferToInt](README.md#buffertoint)
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
- [isFalsy](README.md#isfalsy)
- [isHexPrefixed](README.md#ishexprefixed)
- [isHexString](README.md#ishexstring)
- [isTruthy](README.md#istruthy)
- [isValidAddress](README.md#isvalidaddress)
- [isValidChecksumAddress](README.md#isvalidchecksumaddress)
- [isValidPrivate](README.md#isvalidprivate)
- [isValidPublic](README.md#isvalidpublic)
- [isValidSignature](README.md#isvalidsignature)
- [isZeroAddress](README.md#iszeroaddress)
- [padToEven](README.md#padtoeven)
- [privateToAddress](README.md#privatetoaddress)
- [privateToPublic](README.md#privatetopublic)
- [pubToAddress](README.md#pubtoaddress)
- [publicToAddress](README.md#publictoaddress)
- [setLengthLeft](README.md#setlengthleft)
- [setLengthRight](README.md#setlengthright)
- [short](README.md#short)
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

A type that represents an input that can be converted to an Address.

#### Defined in

[types.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L30)

___

### BigIntLike

Ƭ **BigIntLike**: `bigint` \| [`PrefixedHexString`](README.md#prefixedhexstring) \| `number` \| `Buffer`

#### Defined in

[types.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L8)

___

### BufferLike

Ƭ **BufferLike**: `Buffer` \| `Uint8Array` \| `number`[] \| `number` \| `bigint` \| [`TransformableToBuffer`](interfaces/TransformableToBuffer.md) \| [`PrefixedHexString`](README.md#prefixedhexstring)

#### Defined in

[types.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L13)

___

### NestedBufferArray

Ƭ **NestedBufferArray**: (`Buffer` \| [`NestedBufferArray`](README.md#nestedbufferarray))[]

#### Defined in

[types.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L49)

___

### NestedUint8Array

Ƭ **NestedUint8Array**: (`Uint8Array` \| [`NestedUint8Array`](README.md#nesteduint8array))[]

#### Defined in

[types.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L48)

___

### PrefixedHexString

Ƭ **PrefixedHexString**: `string`

#### Defined in

[types.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L25)

___

### ToBufferInputTypes

Ƭ **ToBufferInputTypes**: [`PrefixedHexString`](README.md#prefixedhexstring) \| `number` \| `bigint` \| `Buffer` \| `Uint8Array` \| `number`[] \| [`TransformableToArray`](interfaces/TransformableToArray.md) \| [`TransformableToBuffer`](interfaces/TransformableToBuffer.md) \| ``null`` \| `undefined`

#### Defined in

[bytes.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L135)

___

### TypeOutputReturnType

Ƭ **TypeOutputReturnType**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `0` | `number` |
| `1` | `bigint` |
| `2` | `Buffer` |
| `3` | [`PrefixedHexString`](README.md#prefixedhexstring) |

#### Defined in

[types.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L61)

## Variables

### KECCAK256\_NULL

• `Const` **KECCAK256\_NULL**: `Buffer`

Keccak-256 hash of null

#### Defined in

[constants.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L39)

___

### KECCAK256\_NULL\_S

• `Const` **KECCAK256\_NULL\_S**: ``"c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470"``

Keccak-256 hash of null

#### Defined in

[constants.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L34)

___

### KECCAK256\_RLP

• `Const` **KECCAK256\_RLP**: `Buffer`

Keccak-256 hash of the RLP of null

#### Defined in

[constants.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L60)

___

### KECCAK256\_RLP\_ARRAY

• `Const` **KECCAK256\_RLP\_ARRAY**: `Buffer`

Keccak-256 of an RLP of an empty array

#### Defined in

[constants.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L50)

___

### KECCAK256\_RLP\_ARRAY\_S

• `Const` **KECCAK256\_RLP\_ARRAY\_S**: ``"1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347"``

Keccak-256 of an RLP of an empty array

#### Defined in

[constants.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L44)

___

### KECCAK256\_RLP\_S

• `Const` **KECCAK256\_RLP\_S**: ``"56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"``

Keccak-256 hash of the RLP of null

#### Defined in

[constants.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L55)

___

### MAX\_INTEGER

• `Const` **MAX\_INTEGER**: `bigint`

The max integer that the evm can handle (2^256-1)

#### Defined in

[constants.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L12)

___

### MAX\_INTEGER\_BIGINT

• `Const` **MAX\_INTEGER\_BIGINT**: `bigint`

The max integer that the evm can handle (2^256-1) as a bigint

#### Defined in

[constants.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L19)

___

### MAX\_UINT64

• `Const` **MAX\_UINT64**: `bigint`

2^64-1

#### Defined in

[constants.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L7)

___

### RLP\_EMPTY\_STRING

• `Const` **RLP\_EMPTY\_STRING**: `Buffer`

RLP encoded empty string

#### Defined in

[constants.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L65)

___

### SECP256K1\_ORDER

• `Const` **SECP256K1\_ORDER**: `bigint` = `CURVE.n`

#### Defined in

[constants.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L21)

___

### SECP256K1\_ORDER\_DIV\_2

• `Const` **SECP256K1\_ORDER\_DIV\_2**: `bigint`

#### Defined in

[constants.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L22)

___

### TWO\_POW256

• `Const` **TWO\_POW256**: `bigint`

2^256

#### Defined in

[constants.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L27)

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

[bytes.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L257)

___

### arrToBufArr

▸ **arrToBufArr**(`arr`): `Buffer`

Converts a Uint8Array or [NestedUint8Array](README.md#nesteduint8array) to Buffer or [NestedBufferArray](README.md#nestedbufferarray)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `Uint8Array` |

#### Returns

`Buffer`

#### Defined in

[bytes.ts:350](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L350)

▸ **arrToBufArr**(`arr`): [`NestedBufferArray`](README.md#nestedbufferarray)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | [`NestedUint8Array`](README.md#nesteduint8array) |

#### Returns

[`NestedBufferArray`](README.md#nestedbufferarray)

#### Defined in

[bytes.ts:351](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L351)

▸ **arrToBufArr**(`arr`): `Buffer` \| [`NestedBufferArray`](README.md#nestedbufferarray)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `Uint8Array` \| [`NestedUint8Array`](README.md#nesteduint8array) |

#### Returns

`Buffer` \| [`NestedBufferArray`](README.md#nestedbufferarray)

#### Defined in

[bytes.ts:352](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L352)

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

[internal.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L89)

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

[bytes.ts:314](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L314)

___

### bigIntToBuffer

▸ **bigIntToBuffer**(`num`): `Buffer`

Converts a bigint to a Buffer

#### Parameters

| Name | Type |
| :------ | :------ |
| `num` | `bigint` |

#### Returns

`Buffer`

#### Defined in

[bytes.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L223)

___

### bigIntToHex

▸ **bigIntToHex**(`num`): `string`

Converts a bigint to a `0x` prefixed hex string

#### Parameters

| Name | Type |
| :------ | :------ |
| `num` | `bigint` |

#### Returns

`string`

#### Defined in

[bytes.ts:376](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L376)

___

### bigIntToUnpaddedBuffer

▸ **bigIntToUnpaddedBuffer**(`value`): `Buffer`

Convert value from bigint to an unpadded Buffer
(useful for RLP transport)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `bigint` | value to convert |

#### Returns

`Buffer`

#### Defined in

[bytes.ts:385](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L385)

___

### bufArrToArr

▸ **bufArrToArr**(`arr`): `Uint8Array`

Converts a Buffer or [NestedBufferArray](README.md#nestedbufferarray) to Uint8Array or [NestedUint8Array](README.md#nesteduint8array)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `Buffer` |

#### Returns

`Uint8Array`

#### Defined in

[bytes.ts:363](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L363)

▸ **bufArrToArr**(`arr`): [`NestedUint8Array`](README.md#nesteduint8array)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | [`NestedBufferArray`](README.md#nestedbufferarray) |

#### Returns

[`NestedUint8Array`](README.md#nesteduint8array)

#### Defined in

[bytes.ts:364](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L364)

▸ **bufArrToArr**(`arr`): `Uint8Array` \| [`NestedUint8Array`](README.md#nesteduint8array)

#### Parameters

| Name | Type |
| :------ | :------ |
| `arr` | `Buffer` \| [`NestedBufferArray`](README.md#nestedbufferarray) |

#### Returns

`Uint8Array` \| [`NestedUint8Array`](README.md#nesteduint8array)

#### Defined in

[bytes.ts:365](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L365)

___

### bufferToBigInt

▸ **bufferToBigInt**(`buf`): `bigint`

Converts a Buffer to a bigint

#### Parameters

| Name | Type |
| :------ | :------ |
| `buf` | `Buffer` |

#### Returns

`bigint`

#### Defined in

[bytes.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L212)

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

[bytes.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L204)

___

### bufferToInt

▸ **bufferToInt**(`buf`): `number`

Converts a `Buffer` to a `Number`.

**`Throws`**

If the input number exceeds 53 bits.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buf` | `Buffer` | `Buffer` object to convert |

#### Returns

`number`

#### Defined in

[bytes.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L232)

___

### ecrecover

▸ **ecrecover**(`msgHash`, `v`, `r`, `s`, `chainId?`): `Buffer`

ECDSA public key recovery from signature.
NOTE: Accepts `v == 0 | v == 1` for EIP1559 transactions

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgHash` | `Buffer` |
| `v` | `bigint` |
| `r` | `Buffer` |
| `s` | `Buffer` |
| `chainId?` | `bigint` |

#### Returns

`Buffer`

Recovered public key

#### Defined in

[signature.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L52)

___

### ecsign

▸ **ecsign**(`msgHash`, `privateKey`, `chainId?`): [`ECDSASignature`](interfaces/ECDSASignature.md)

Returns the ECDSA signature of a message hash.

If `chainId` is provided assume an EIP-155-style signature and calculate the `v` value
accordingly, otherwise return a "static" `v` just derived from the `recovery` bit

#### Parameters

| Name | Type |
| :------ | :------ |
| `msgHash` | `Buffer` |
| `privateKey` | `Buffer` |
| `chainId?` | `bigint` |

#### Returns

[`ECDSASignature`](interfaces/ECDSASignature.md)

#### Defined in

[signature.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L20)

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

[internal.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L149)

___

### fromRpcSig

▸ **fromRpcSig**(`sig`): [`ECDSASignature`](interfaces/ECDSASignature.md)

Convert signature format of the `eth_sign` RPC method to signature parameters

NOTE: For an extracted `v` value < 27 (see Geth bug https://github.com/ethereum/go-ethereum/issues/2053)
`v + 27` is returned for the `v` value
NOTE: After EIP1559, `v` could be `0` or `1` but this function assumes
it's a signed message (EIP-191 or EIP-712) adding `27` at the end. Remove if needed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `sig` | `string` |

#### Returns

[`ECDSASignature`](interfaces/ECDSASignature.md)

#### Defined in

[signature.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L112)

___

### fromSigned

▸ **fromSigned**(`num`): `bigint`

Interprets a `Buffer` as a signed integer and returns a `BigInt`. Assumes 256-bit numbers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `num` | `Buffer` | Signed integer value |

#### Returns

`bigint`

#### Defined in

[bytes.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L242)

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

[internal.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L136)

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

[account.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L196)

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

[account.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L216)

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

[internal.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L73)

___

### getKeys

▸ **getKeys**(`params`, `key`, `allowEmpty?`): `string`[]

Returns the keys from an array of objects.

**`Example`**

```js
getKeys([{a: '1', b: '2'}, {a: '3', b: '4'}], 'a') => ['1', '3']
````
@param  params
@param  key
@param  allowEmpty
@returns output just a simple array of output keys

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Record`<`string`, `string`\>[] |
| `key` | `string` |
| `allowEmpty?` | `boolean` |

#### Returns

`string`[]

#### Defined in

[internal.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L171)

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

[signature.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L189)

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

[account.ts:313](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L313)

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

[bytes.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L28)

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

[bytes.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L16)

___

### isFalsy

▸ **isFalsy**(`value`): value is Falsy

Returns true if a value is falsy

**`Deprecated`**

This helper function should only be used temporarily until the monorepo types are explicit enough

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `unknown` | Value to check for falseness |

#### Returns

value is Falsy

#### Defined in

[types.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L131)

___

### isHexPrefixed

▸ **isHexPrefixed**(`str`): `boolean`

Returns a `Boolean` on whether or not the a `String` starts with '0x'

**`Throws`**

if the str input is not a string

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | the string input value |

#### Returns

`boolean`

a boolean if it is or is not hex prefixed

#### Defined in

[internal.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L31)

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

[internal.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L203)

___

### isTruthy

▸ **isTruthy**<`T`\>(`value`): value is T

Returns true if a value is truthy

**`Deprecated`**

This helper function should only be used temporarily until the monorepo types are explicit enough

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `Falsy` \| `T` | Value to check for truthiness |

#### Returns

value is T

#### Defined in

[types.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L150)

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

[account.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L129)

___

### isValidChecksumAddress

▸ **isValidChecksumAddress**(`hexAddress`, `eip1191ChainId?`): `boolean`

Checks if the address is a valid checksummed address.

See toChecksumAddress' documentation for details about the eip1191ChainId parameter.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hexAddress` | `string` |
| `eip1191ChainId?` | [`BigIntLike`](README.md#bigintlike) |

#### Returns

`boolean`

#### Defined in

[account.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L184)

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

[account.ts:238](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L238)

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

[account.ts:248](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L248)

___

### isValidSignature

▸ **isValidSignature**(`v`, `r`, `s`, `homesteadOrLater?`, `chainId?`): `boolean`

Validate a ECDSA signature.
NOTE: Accepts `v == 0 | v == 1` for EIP1559 transactions

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `v` | `bigint` | `undefined` | - |
| `r` | `Buffer` | `undefined` | - |
| `s` | `Buffer` | `undefined` | - |
| `homesteadOrLater` | `boolean` | `true` | Indicates whether this is being used on either the homestead hardfork or a later one |
| `chainId?` | `bigint` | `undefined` | - |

#### Returns

`boolean`

#### Defined in

[signature.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L149)

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

[account.ts:333](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L333)

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

[internal.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L56)

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

[account.ts:306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L306)

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

[account.ts:296](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L296)

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

[account.ts:279](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L279)

___

### publicToAddress

▸ **publicToAddress**(`pubKey`, `sanitize?`): `Buffer`

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

[account.ts:279](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L279)

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

[bytes.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L73)

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

[bytes.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L85)

___

### short

▸ **short**(`buffer`, `maxLength?`): `string`

Shortens a string  or buffer's hex string representation to maxLength (default 50).

Examples:

Input:  '657468657265756d000000000000000000000000000000000000000000000000'
Output: '657468657265756d0000000000000000000000000000000000…'

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `buffer` | `string` \| `Buffer` | `undefined` |
| `maxLength` | `number` | `50` |

#### Returns

`string`

#### Defined in

[bytes.ts:273](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L273)

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

[internal.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L44)

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

[internal.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/internal.ts#L114)

___

### toBuffer

▸ **toBuffer**(`v`): `Buffer`

Attempts to turn a value into a `Buffer`.
Inputs supported: `Buffer`, `String` (hex-prefixed), `Number`, null/undefined, `BigInt` and other objects
with a `toArray()` or `toBuffer()` method.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `v` | [`ToBufferInputTypes`](README.md#tobufferinputtypes) | the value |

#### Returns

`Buffer`

#### Defined in

[bytes.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L153)

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
| `eip1191ChainId?` | [`BigIntLike`](README.md#bigintlike) |

#### Returns

`string`

#### Defined in

[account.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L151)

___

### toCompactSig

▸ **toCompactSig**(`v`, `r`, `s`, `chainId?`): `string`

Convert signature parameters into the format of Compact Signature Representation (EIP-2098).
NOTE: Accepts `v == 0 | v == 1` for EIP1559 transactions

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `bigint` |
| `r` | `Buffer` |
| `s` | `Buffer` |
| `chainId?` | `bigint` |

#### Returns

`string`

Signature

#### Defined in

[signature.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L89)

___

### toRpcSig

▸ **toRpcSig**(`v`, `r`, `s`, `chainId?`): `string`

Convert signature parameters into the format of `eth_sign` RPC method.
NOTE: Accepts `v == 0 | v == 1` for EIP1559 transactions

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `bigint` |
| `r` | `Buffer` |
| `s` | `Buffer` |
| `chainId?` | `bigint` |

#### Returns

`string`

Signature

#### Defined in

[signature.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L74)

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

[types.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L74)

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

[types.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L75)

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

[types.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L76)

___

### toUnsigned

▸ **toUnsigned**(`num`): `Buffer`

Converts a `BigInt` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

#### Parameters

| Name | Type |
| :------ | :------ |
| `num` | `bigint` |

#### Returns

`Buffer`

#### Defined in

[bytes.ts:250](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L250)

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

[bytes.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L298)

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

[bytes.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L119)

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

[bytes.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L109)

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

[bytes.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L129)

___

### validateNoLeadingZeroes

▸ **validateNoLeadingZeroes**(`values`): `void`

Checks provided Buffers for leading zeroes and throws if found.

Examples:

Valid values: 0x1, 0x, 0x01, 0x1234
Invalid values: 0x0, 0x00, 0x001, 0x0001

Note: This method is useful for validating that RLP encoded integers comply with the rule that all
integer values encoded to RLP must be in the most compact form and contain no leading zero bytes

**`Throws`**

if any provided value is found to have leading zero bytes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `Object` | An object containing string keys and Buffer values |

#### Returns

`void`

#### Defined in

[bytes.ts:339](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L339)

___

### zeroAddress

▸ **zeroAddress**(): `string`

Returns the zero address.

#### Returns

`string`

#### Defined in

[account.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L324)

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

[bytes.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L37)
