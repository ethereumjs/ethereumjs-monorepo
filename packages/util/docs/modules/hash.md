[ethereumjs-util](../README.md) / hash

# Module: hash

## Table of contents

### Functions

- [keccak](hash.md#keccak)
- [keccak256](hash.md#keccak256)
- [keccakFromArray](hash.md#keccakfromarray)
- [keccakFromHexString](hash.md#keccakfromhexstring)
- [keccakFromString](hash.md#keccakfromstring)
- [ripemd160](hash.md#ripemd160)
- [ripemd160FromArray](hash.md#ripemd160fromarray)
- [ripemd160FromString](hash.md#ripemd160fromstring)
- [rlphash](hash.md#rlphash)
- [sha256](hash.md#sha256)
- [sha256FromArray](hash.md#sha256fromarray)
- [sha256FromString](hash.md#sha256fromstring)

## Functions

### keccak

▸ `Const` **keccak**(`a`, `bits?`): `Buffer`

Creates Keccak hash of a Buffer input

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `a` | `Buffer` | `undefined` | The input data (Buffer) |
| `bits` | `number` | 256 | (number = 256) The Keccak width |

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
| `bits` | `number` | 256 | (number = 256) The Keccak width |

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
| `bits` | `number` | 256 | (number = 256) The Keccak width |

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
| `bits` | `number` | 256 | (number = 256) The Keccak width |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L46)

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
| `a` | [Input](externals.rlp.md#input) | The input data |

#### Returns

`Buffer`

#### Defined in

[packages/util/src/hash.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/hash.ts#L157)

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
