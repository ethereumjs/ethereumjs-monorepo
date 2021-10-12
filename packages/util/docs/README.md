ethereumjs-util

# ethereumjs-util

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

### Type aliases

- [AddressLike](README.md#addresslike)
- [BNLike](README.md#bnlike)
- [BufferLike](README.md#bufferlike)
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
- [TWO\_POW256](README.md#two_pow256)

### Functions

- [addHexPrefix](README.md#addhexprefix)
- [arrayContainsArray](README.md#arraycontainsarray)
- [baToJSON](README.md#batojson)
- [bnToHex](README.md#bntohex)
- [bnToRlp](README.md#bntorlp)
- [bnToUnpaddedBuffer](README.md#bntounpaddedbuffer)
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
- [zeroAddress](README.md#zeroaddress)
- [zeros](README.md#zeros)

## Type aliases

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

### PrefixedHexString

Ƭ **PrefixedHexString**: `string`

#### Defined in

[packages/util/src/types.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L26)

___

### ToBufferInputTypes

Ƭ **ToBufferInputTypes**: [`PrefixedHexString`](README.md#prefixedhexstring) \| `number` \| [`BN`](classes/BN.md) \| `Buffer` \| `Uint8Array` \| `number`[] \| [`TransformableToArray`](interfaces/TransformableToArray.md) \| [`TransformableToBuffer`](interfaces/TransformableToBuffer.md) \| ``null`` \| `undefined`

#### Defined in

[packages/util/src/bytes.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L130)

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

[packages/util/src/types.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L86)

## Variables

### KECCAK256\_NULL

• **KECCAK256\_NULL**: `Buffer`

Keccak-256 hash of null

#### Defined in

[packages/util/src/constants.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L29)

___

### KECCAK256\_NULL\_S

• **KECCAK256\_NULL\_S**: `string` = `'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'`

Keccak-256 hash of null

#### Defined in

[packages/util/src/constants.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L23)

___

### KECCAK256\_RLP

• **KECCAK256\_RLP**: `Buffer`

Keccak-256 hash of the RLP of null

#### Defined in

[packages/util/src/constants.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L51)

___

### KECCAK256\_RLP\_ARRAY

• **KECCAK256\_RLP\_ARRAY**: `Buffer`

Keccak-256 of an RLP of an empty array

#### Defined in

[packages/util/src/constants.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L40)

___

### KECCAK256\_RLP\_ARRAY\_S

• **KECCAK256\_RLP\_ARRAY\_S**: `string` = `'1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347'`

Keccak-256 of an RLP of an empty array

#### Defined in

[packages/util/src/constants.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L34)

___

### KECCAK256\_RLP\_S

• **KECCAK256\_RLP\_S**: `string` = `'56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'`

Keccak-256 hash of the RLP of null

#### Defined in

[packages/util/src/constants.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L45)

___

### MAX\_INTEGER

• **MAX\_INTEGER**: [`BN`](classes/BN.md)

The max integer that this VM can handle

#### Defined in

[packages/util/src/constants.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L7)

___

### TWO\_POW256

• **TWO\_POW256**: [`BN`](classes/BN.md)

2^256

#### Defined in

[packages/util/src/constants.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/constants.ts#L15)

## Functions

### addHexPrefix

▸ `Const` **addHexPrefix**(`str`): `string`

Adds "0x" to a given `String` if it does not already start with "0x".

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

#### Defined in

[packages/util/src/bytes.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L227)

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

▸ `Const` **baToJSON**(`ba`): `any`

Converts a `Buffer` or `Array` to JSON.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ba` | `any` | (Buffer\|Array) |

#### Returns

`any`

(Array|String|null)

#### Defined in

[packages/util/src/bytes.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L268)

___

### bnToHex

▸ **bnToHex**(`value`): [`PrefixedHexString`](README.md#prefixedhexstring)

Convert BN to 0x-prefixed hex string.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`BN`](classes/BN.md) |

#### Returns

[`PrefixedHexString`](README.md#prefixedhexstring)

#### Defined in

[packages/util/src/types.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L53)

___

### bnToRlp

▸ **bnToRlp**(`value`): `Buffer`

Deprecated alias for [bnToUnpaddedBuffer](README.md#bntounpaddedbuffer)

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`BN`](classes/BN.md) |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/types.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L72)

___

### bnToUnpaddedBuffer

▸ **bnToUnpaddedBuffer**(`value`): `Buffer`

Convert value from BN to an unpadded Buffer
(useful for RLP transport)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | [`BN`](classes/BN.md) | value to convert |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/types.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L62)

___

### bufferToHex

▸ `Const` **bufferToHex**(`buf`): `string`

Converts a `Buffer` into a `0x`-prefixed hex `String`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buf` | `Buffer` | `Buffer` object to convert |

#### Returns

`string`

#### Defined in

[packages/util/src/bytes.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L203)

___

### bufferToInt

▸ `Const` **bufferToInt**(`buf`): `number`

Converts a `Buffer` to a `Number`.

**`throws`** If the input number exceeds 53 bits.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `buf` | `Buffer` | `Buffer` object to convert |

#### Returns

`number`

#### Defined in

[packages/util/src/bytes.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L195)

___

### defineProperties

▸ `Const` **defineProperties**(`self`, `fields`, `data?`): `void`

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

▸ `Const` **ecrecover**(`msgHash`, `v`, `r`, `s`, `chainId?`): `Buffer`

ECDSA public key recovery from signature.

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

[packages/util/src/signature.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L65)

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

▸ `Const` **fromRpcSig**(`sig`): [`ECDSASignature`](interfaces/ECDSASignature.md)

Convert signature format of the `eth_sign` RPC method to signature parameters
NOTE: all because of a bug in geth: https://github.com/ethereum/go-ethereum/issues/2053

#### Parameters

| Name | Type |
| :------ | :------ |
| `sig` | `string` |

#### Returns

[`ECDSASignature`](interfaces/ECDSASignature.md)

#### Defined in

[packages/util/src/signature.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L119)

___

### fromSigned

▸ `Const` **fromSigned**(`num`): [`BN`](classes/BN.md)

Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `num` | `Buffer` | Signed integer value |

#### Returns

[`BN`](classes/BN.md)

#### Defined in

[packages/util/src/bytes.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L212)

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

▸ `Const` **generateAddress**(`from`, `nonce`): `Buffer`

Generates an address of a newly created contract.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `from` | `Buffer` | The address which is creating this new address |
| `nonce` | `Buffer` | The nonce of the from account |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L192)

___

### generateAddress2

▸ `Const` **generateAddress2**(`from`, `salt`, `initCode`): `Buffer`

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

[packages/util/src/account.ts:213](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L213)

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

▸ `Const` **hashPersonalMessage**(`message`): `Buffer`

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

[packages/util/src/signature.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L196)

___

### importPublic

▸ `Const` **importPublic**(`publicKey`): `Buffer`

Converts a public key to the Ethereum format.

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `Buffer` |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:293](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L293)

___

### intToBuffer

▸ `Const` **intToBuffer**(`i`): `Buffer`

Converts an `Number` to a `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/bytes.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L23)

___

### intToHex

▸ `Const` **intToHex**(`i`): `string`

Converts a `Number` into a hex `String`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |

#### Returns

`string`

#### Defined in

[packages/util/src/bytes.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L11)

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

▸ `Const` **isValidAddress**(`hexAddress`): `boolean`

Checks if the address is a valid. Accepts checksummed addresses too.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hexAddress` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L129)

___

### isValidChecksumAddress

▸ `Const` **isValidChecksumAddress**(`hexAddress`, `eip1191ChainId?`): `boolean`

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

[packages/util/src/account.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L180)

___

### isValidPrivate

▸ `Const` **isValidPrivate**(`privateKey`): `boolean`

Checks if the private key satisfies the rules of the curve secp256k1.

#### Parameters

| Name | Type |
| :------ | :------ |
| `privateKey` | `Buffer` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L231)

___

### isValidPublic

▸ `Const` **isValidPublic**(`publicKey`, `sanitize?`): `boolean`

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

[packages/util/src/account.ts:241](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L241)

___

### isValidSignature

▸ `Const` **isValidSignature**(`v`, `r`, `s`, `homesteadOrLater?`, `chainId?`): `boolean`

Validate a ECDSA signature.

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

[packages/util/src/signature.ts:155](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L155)

___

### isZeroAddress

▸ `Const` **isZeroAddress**(`hexAddress`): `boolean`

Checks if a given address is the zero address.

#### Parameters

| Name | Type |
| :------ | :------ |
| `hexAddress` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/account.ts:313](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L313)

___

### keccak

▸ `Const` **keccak**(`a`, `bits?`): `Buffer`

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

▸ `Const` **keccak256**(`a`): `Buffer`

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

▸ `Const` **keccakFromArray**(`a`, `bits?`): `Buffer`

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

▸ `Const` **keccakFromHexString**(`a`, `bits?`): `Buffer`

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

▸ `Const` **keccakFromString**(`a`, `bits?`): `Buffer`

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

▸ `Const` **privateToAddress**(`privateKey`): `Buffer`

Returns the ethereum address of a given private key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Buffer` | A private key must be 256 bits wide |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:286](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L286)

___

### privateToPublic

▸ `Const` **privateToPublic**(`privateKey`): `Buffer`

Returns the ethereum public key of a given private key.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `privateKey` | `Buffer` | A private key must be 256 bits wide |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:276](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L276)

___

### pubToAddress

▸ `Const` **pubToAddress**(`pubKey`, `sanitize?`): `Buffer`

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

[packages/util/src/account.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L261)

___

### publicToAddress

▸ `Const` **publicToAddress**(`pubKey`, `sanitize?`): `Buffer`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pubKey` | `Buffer` | `undefined` |
| `sanitize` | `boolean` | `false` |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/account.ts:270](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L270)

___

### ripemd160

▸ `Const` **ripemd160**(`a`, `padded`): `Buffer`

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

▸ `Const` **ripemd160FromArray**(`a`, `padded`): `Buffer`

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

▸ `Const` **ripemd160FromString**(`a`, `padded`): `Buffer`

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

▸ `Const` **rlphash**(`a`): `Buffer`

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

▸ `Const` **setLengthLeft**(`msg`, `length`): `Buffer`

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

[packages/util/src/bytes.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L68)

___

### setLengthRight

▸ `Const` **setLengthRight**(`msg`, `length`): `Buffer`

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

[packages/util/src/bytes.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L80)

___

### sha256

▸ `Const` **sha256**(`a`): `Buffer`

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

▸ `Const` **sha256FromArray**(`a`): `Buffer`

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

▸ `Const` **sha256FromString**(`a`): `Buffer`

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

▸ `Const` **stripHexPrefix**(`str`): `string`

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

▸ `Const` **toBuffer**(`v`): `Buffer`

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

[packages/util/src/bytes.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L148)

___

### toChecksumAddress

▸ `Const` **toChecksumAddress**(`hexAddress`, `eip1191ChainId?`): `string`

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

[packages/util/src/account.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L151)

___

### toCompactSig

▸ `Const` **toCompactSig**(`v`, `r`, `s`, `chainId?`): `string`

Convert signature parameters into the format of Compact Signature Representation (EIP-2098).

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

[packages/util/src/signature.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L99)

___

### toRpcSig

▸ `Const` **toRpcSig**(`v`, `r`, `s`, `chainId?`): `string`

Convert signature parameters into the format of `eth_sign` RPC method.

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

[packages/util/src/signature.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/signature.ts#L85)

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

[packages/util/src/types.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L99)

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

[packages/util/src/types.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L100)

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

[packages/util/src/types.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/types.ts#L101)

___

### toUnsigned

▸ `Const` **toUnsigned**(`num`): `Buffer`

Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.

#### Parameters

| Name | Type |
| :------ | :------ |
| `num` | [`BN`](classes/BN.md) |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/bytes.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L220)

___

### toUtf8

▸ `Const` **toUtf8**(`hex`): `string`

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

[packages/util/src/bytes.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L252)

___

### unpadArray

▸ `Const` **unpadArray**(`a`): `number`[]

Trims leading zeros from an `Array` (of numbers).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `number`[] | (number[]) |

#### Returns

`number`[]

(number[])

#### Defined in

[packages/util/src/bytes.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L114)

___

### unpadBuffer

▸ `Const` **unpadBuffer**(`a`): `Buffer`

Trims leading zeros from a `Buffer`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `Buffer` | (Buffer) |

#### Returns

`Buffer`

(Buffer)

#### Defined in

[packages/util/src/bytes.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L104)

___

### unpadHexString

▸ `Const` **unpadHexString**(`a`): `string`

Trims leading zeros from a hex-prefixed `String`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `string` | (String) |

#### Returns

`string`

(String)

#### Defined in

[packages/util/src/bytes.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L124)

___

### zeroAddress

▸ `Const` **zeroAddress**(): `string`

Returns the zero address.

#### Returns

`string`

#### Defined in

[packages/util/src/account.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L304)

___

### zeros

▸ `Const` **zeros**(`bytes`): `Buffer`

Returns a buffer filled with 0s.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bytes` | `number` | the number of bytes the buffer should be |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/bytes.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bytes.ts#L32)
