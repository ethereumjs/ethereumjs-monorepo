[ethereumjs-util](../README.md) / @types/ethjs-util

# Module: @types/ethjs-util

## Table of contents

### Functions

- [arrayContainsArray](_types_ethjs_util.md#arraycontainsarray)
- [fromAscii](_types_ethjs_util.md#fromascii)
- [fromUtf8](_types_ethjs_util.md#fromutf8)
- [getBinarySize](_types_ethjs_util.md#getbinarysize)
- [getKeys](_types_ethjs_util.md#getkeys)
- [intToBuffer](_types_ethjs_util.md#inttobuffer)
- [intToHex](_types_ethjs_util.md#inttohex)
- [isHexPrefixed](_types_ethjs_util.md#ishexprefixed)
- [isHexString](_types_ethjs_util.md#ishexstring)
- [padToEven](_types_ethjs_util.md#padtoeven)
- [stripHexPrefix](_types_ethjs_util.md#striphexprefix)
- [toAscii](_types_ethjs_util.md#toascii)
- [toUtf8](_types_ethjs_util.md#toutf8)

## Functions

### arrayContainsArray

▸ **arrayContainsArray**(`superset`, `subset`, `some?`): `boolean`

**`description`** Returns TRUE if the first specified array contains all elements
             from the second one. FALSE otherwise. If `some` is true, will
             return true if first specified array contain some elements of
             the second.

#### Parameters

| Name | Type |
| :------ | :------ |
| `superset` | `any`[] |
| `subset` | `any`[] |
| `some?` | `boolean` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/@types/ethjs-util/index.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/@types/ethjs-util/index.ts#L38)

___

### fromAscii

▸ **fromAscii**(`stringValue`): `string`

**`description`** Should be called to get hex representation (prefixed by 0x) of ascii string

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringValue` | `string` |

#### Returns

`string`

#### Defined in

[packages/util/src/@types/ethjs-util/index.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/@types/ethjs-util/index.ts#L58)

___

### fromUtf8

▸ **fromUtf8**(`stringValue`): `string`

**`description`** Should be called to get hex representation (prefixed by 0x) of utf8 string

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringValue` | `string` |

#### Returns

`string`

#### Defined in

[packages/util/src/@types/ethjs-util/index.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/@types/ethjs-util/index.ts#L53)

___

### getBinarySize

▸ **getBinarySize**(`str`): `number`

**`description`** Get the binary size of a string

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`number`

#### Defined in

[packages/util/src/@types/ethjs-util/index.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/@types/ethjs-util/index.ts#L30)

___

### getKeys

▸ **getKeys**(`params`, `key`, `allowEmpty?`): `any`[]

**`description`** getKeys([{a: 1, b: 2}, {a: 3, b: 4}], 'a') => [1, 3]

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any`[] |
| `key` | `string` |
| `allowEmpty?` | `boolean` |

#### Returns

`any`[]

#### Defined in

[packages/util/src/@types/ethjs-util/index.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/@types/ethjs-util/index.ts#L63)

___

### intToBuffer

▸ **intToBuffer**(`i`): `Buffer`

**`description`** Converts an `Number` to a `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/@types/ethjs-util/index.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/@types/ethjs-util/index.ts#L25)

___

### intToHex

▸ **intToHex**(`i`): `string`

**`description`** Converts a `Number` into a hex `String`

#### Parameters

| Name | Type |
| :------ | :------ |
| `i` | `number` |

#### Returns

`string`

#### Defined in

[packages/util/src/@types/ethjs-util/index.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/@types/ethjs-util/index.ts#L20)

___

### isHexPrefixed

▸ **isHexPrefixed**(`str`): `boolean`

**`description`** Returns a `Boolean` on whether or not the a `String` starts with '0x'

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/@types/ethjs-util/index.ts:5](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/@types/ethjs-util/index.ts#L5)

___

### isHexString

▸ **isHexString**(`value`, `length?`): `boolean`

**`description`** check if string is hex string of specific length

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `length?` | `number` |

#### Returns

`boolean`

#### Defined in

[packages/util/src/@types/ethjs-util/index.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/@types/ethjs-util/index.ts#L68)

___

### padToEven

▸ **padToEven**(`value`): `string`

**`description`** Pads a `String` to have an even length

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`string`

#### Defined in

[packages/util/src/@types/ethjs-util/index.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/@types/ethjs-util/index.ts#L15)

___

### stripHexPrefix

▸ **stripHexPrefix**(`str`): `string`

**`description`** Removes '0x' from a given `String` if present

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

#### Defined in

[packages/util/src/@types/ethjs-util/index.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/@types/ethjs-util/index.ts#L10)

___

### toAscii

▸ **toAscii**(`hex`): `string`

**`description`** Should be called to get ascii from it's hex representation

#### Parameters

| Name | Type |
| :------ | :------ |
| `hex` | `string` |

#### Returns

`string`

#### Defined in

[packages/util/src/@types/ethjs-util/index.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/@types/ethjs-util/index.ts#L48)

___

### toUtf8

▸ **toUtf8**(`hex`): `string`

**`description`** Should be called to get utf8 from it's hex representation

#### Parameters

| Name | Type |
| :------ | :------ |
| `hex` | `string` |

#### Returns

`string`

#### Defined in

[packages/util/src/@types/ethjs-util/index.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/@types/ethjs-util/index.ts#L43)
