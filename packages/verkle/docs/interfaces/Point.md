[@ethereumjs/verkle](../README.md) / Point

# Interface: Point

## Table of contents

### Methods

- [add](Point.md#add)
- [bytes](Point.md#bytes)
- [bytesUncompressed](Point.md#bytesuncompressed)
- [double](Point.md#double)
- [equal](Point.md#equal)
- [isOnCurve](Point.md#isoncurve)
- [mapToBaseField](Point.md#maptobasefield)
- [mapToScalarField](Point.md#maptoscalarfield)
- [neg](Point.md#neg)
- [normalise](Point.md#normalise)
- [scalarMul](Point.md#scalarmul)
- [set](Point.md#set)
- [setBytes](Point.md#setbytes)
- [setBytesUncompressed](Point.md#setbytesuncompressed)
- [setIdentity](Point.md#setidentity)
- [sub](Point.md#sub)

## Methods

### add

▸ **add**(`point1`, `point2`): [`Point`](Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `point1` | [`Point`](Point.md) |
| `point2` | [`Point`](Point.md) |

#### Returns

[`Point`](Point.md)

#### Defined in

[types.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L41)

___

### bytes

▸ **bytes**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[types.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L13)

___

### bytesUncompressed

▸ **bytesUncompressed**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Defined in

[types.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L15)

___

### double

▸ **double**(`point1`): [`Point`](Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `point1` | [`Point`](Point.md) |

#### Returns

[`Point`](Point.md)

#### Defined in

[types.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L38)

___

### equal

▸ **equal**(`secondPoint`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `secondPoint` | [`Point`](Point.md) |

#### Returns

`boolean`

#### Defined in

[types.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L32)

___

### isOnCurve

▸ **isOnCurve**(): `boolean`

#### Returns

`boolean`

#### Defined in

[types.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L47)

___

### mapToBaseField

▸ **mapToBaseField**(): [`Point`](Point.md)

#### Returns

[`Point`](Point.md)

#### Defined in

[types.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L26)

___

### mapToScalarField

▸ **mapToScalarField**(`field`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `field` | [`Fr`](Fr.md) |

#### Returns

`void`

#### Defined in

[types.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L29)

___

### neg

▸ **neg**(): [`Point`](Point.md)

#### Returns

[`Point`](Point.md)

#### Defined in

[types.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L55)

___

### normalise

▸ **normalise**(): `void`

#### Returns

`void`

#### Defined in

[types.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L49)

___

### scalarMul

▸ **scalarMul**(`point1`, `scalarMont`): [`Point`](Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `point1` | [`Point`](Point.md) |
| `scalarMont` | [`Fr`](Fr.md) |

#### Returns

[`Point`](Point.md)

#### Defined in

[types.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L58)

___

### set

▸ **set**(): [`Point`](Point.md)

#### Returns

[`Point`](Point.md)

#### Defined in

[types.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L52)

___

### setBytes

▸ **setBytes**(`bytes`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |

#### Returns

`void`

#### Defined in

[types.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L20)

___

### setBytesUncompressed

▸ **setBytesUncompressed**(`bytes`, `trusted`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `bytes` | `Uint8Array` |
| `trusted` | `boolean` |

#### Returns

`void`

#### Defined in

[types.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L23)

___

### setIdentity

▸ **setIdentity**(): [`Point`](Point.md)

#### Returns

[`Point`](Point.md)

#### Defined in

[types.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L35)

___

### sub

▸ **sub**(`point1`, `point2`): [`Point`](Point.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `point1` | [`Point`](Point.md) |
| `point2` | [`Point`](Point.md) |

#### Returns

[`Point`](Point.md)

#### Defined in

[types.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L44)
