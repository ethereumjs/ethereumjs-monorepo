[@ethereumjs/devp2p](../README.md) / util

# Module: util

## Table of contents

### Classes

- [Deferred](../classes/util.deferred.md)

### Functions

- [assertEq](util.md#asserteq)
- [buffer2int](util.md#buffer2int)
- [createDeferred](util.md#createdeferred)
- [formatLogData](util.md#formatlogdata)
- [formatLogId](util.md#formatlogid)
- [genPrivateKey](util.md#genprivatekey)
- [id2pk](util.md#id2pk)
- [int2buffer](util.md#int2buffer)
- [keccak256](util.md#keccak256)
- [pk2id](util.md#pk2id)
- [toNewUint8Array](util.md#tonewuint8array)
- [unstrictDecode](util.md#unstrictdecode)
- [xor](util.md#xor)
- [zfill](util.md#zfill)

## Functions

### assertEq

▸ **assertEq**(`expected`, `actual`, `msg`, `debug`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `expected` | `assertInput` |
| `actual` | `assertInput` |
| `msg` | `string` |
| `debug` | `Function` |

#### Returns

`void`

#### Defined in

[packages/devp2p/src/util.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L63)

___

### buffer2int

▸ **buffer2int**(`buffer`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `buffer` | `Buffer` |

#### Returns

`number`

#### Defined in

[packages/devp2p/src/util.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L39)

___

### createDeferred

▸ **createDeferred**<T\>(): [Deferred](../classes/util.deferred.md)<T\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Returns

[Deferred](../classes/util.deferred.md)<T\>

#### Defined in

[packages/devp2p/src/util.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L117)

___

### formatLogData

▸ **formatLogData**(`data`, `verbose`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |
| `verbose` | `boolean` |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/util.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L96)

___

### formatLogId

▸ **formatLogId**(`id`, `verbose`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `verbose` | `boolean` |

#### Returns

`string`

#### Defined in

[packages/devp2p/src/util.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L87)

___

### genPrivateKey

▸ **genPrivateKey**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L14)

___

### id2pk

▸ **id2pk**(`id`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `Buffer` |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L26)

___

### int2buffer

▸ **int2buffer**(`v`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `v` | `number` \| ``null`` |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L30)

___

### keccak256

▸ **keccak256**(...`buffers`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...buffers` | `Buffer`[] |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L9)

___

### pk2id

▸ **pk2id**(`pk`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pk` | `Buffer` |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L19)

___

### toNewUint8Array

▸ **toNewUint8Array**(`buf`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `buf` | `Uint8Array` |

#### Returns

`Uint8Array`

#### Defined in

[packages/devp2p/src/util.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L128)

___

### unstrictDecode

▸ **unstrictDecode**(`value`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `Buffer` |

#### Returns

`any`

#### Defined in

[packages/devp2p/src/util.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L121)

___

### xor

▸ **xor**(`a`, `b`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `Buffer` |
| `b` | `any` |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L54)

___

### zfill

▸ **zfill**(`buffer`, `size`, `leftpad?`): `Buffer`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `buffer` | `Buffer` | `undefined` |
| `size` | `number` | `undefined` |
| `leftpad` | `boolean` | true |

#### Returns

`Buffer`

#### Defined in

[packages/devp2p/src/util.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/devp2p/src/util.ts#L47)
