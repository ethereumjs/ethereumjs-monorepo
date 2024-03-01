[@ethereumjs/verkle](../README.md) / LeafNode

# Class: LeafNode

## Hierarchy

- [`BaseVerkleNode`](BaseVerkleNode.md)<[`Leaf`](../enums/VerkleNodeType.md#leaf)\>

  ↳ **`LeafNode`**

## Table of contents

### Constructors

- [constructor](LeafNode.md#constructor)

### Properties

- [c1](LeafNode.md#c1)
- [c2](LeafNode.md#c2)
- [commitment](LeafNode.md#commitment)
- [depth](LeafNode.md#depth)
- [stem](LeafNode.md#stem)
- [type](LeafNode.md#type)
- [values](LeafNode.md#values)

### Methods

- [commit](LeafNode.md#commit)
- [getValue](LeafNode.md#getvalue)
- [hash](LeafNode.md#hash)
- [insert](LeafNode.md#insert)
- [insertMultiple](LeafNode.md#insertmultiple)
- [insertStem](LeafNode.md#insertstem)
- [raw](LeafNode.md#raw)
- [serialize](LeafNode.md#serialize)
- [setDepth](LeafNode.md#setdepth)
- [create](LeafNode.md#create)
- [fromRawNode](LeafNode.md#fromrawnode)

## Constructors

### constructor

• **new LeafNode**(`options`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `VerkleLeafNodeOptions` |

#### Overrides

[BaseVerkleNode](BaseVerkleNode.md).[constructor](BaseVerkleNode.md#constructor)

#### Defined in

[node/leafNode.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L15)

## Properties

### c1

• **c1**: [`Point`](../interfaces/Point.md)

#### Defined in

[node/leafNode.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L11)

___

### c2

• **c2**: [`Point`](../interfaces/Point.md)

#### Defined in

[node/leafNode.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L12)

___

### commitment

• **commitment**: [`Point`](../interfaces/Point.md)

#### Inherited from

[BaseVerkleNode](BaseVerkleNode.md).[commitment](BaseVerkleNode.md#commitment)

#### Defined in

[node/baseVerkleNode.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L8)

___

### depth

• **depth**: `number`

#### Inherited from

[BaseVerkleNode](BaseVerkleNode.md).[depth](BaseVerkleNode.md#depth)

#### Defined in

[node/baseVerkleNode.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L9)

___

### stem

• **stem**: `Uint8Array`

#### Defined in

[node/leafNode.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L9)

___

### type

• **type**: [`VerkleNodeType`](../enums/VerkleNodeType.md) = `VerkleNodeType.Leaf`

#### Defined in

[node/leafNode.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L13)

___

### values

• **values**: `Uint8Array`[]

#### Defined in

[node/leafNode.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L10)

## Methods

### commit

▸ **commit**(): [`Point`](../interfaces/Point.md)

#### Returns

[`Point`](../interfaces/Point.md)

#### Overrides

[BaseVerkleNode](BaseVerkleNode.md).[commit](BaseVerkleNode.md#commit)

#### Defined in

[node/leafNode.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L48)

___

### getValue

▸ **getValue**(`index`): ``null`` \| `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

``null`` \| `Uint8Array`

#### Defined in

[node/leafNode.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L52)

___

### hash

▸ **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Inherited from

[BaseVerkleNode](BaseVerkleNode.md).[hash](BaseVerkleNode.md#hash)

#### Defined in

[node/baseVerkleNode.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L19)

___

### insert

▸ **insert**(`key`, `value`, `nodeResolverFn`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |
| `nodeResolverFn` | () => `void` |

#### Returns

`void`

#### Overrides

[BaseVerkleNode](BaseVerkleNode.md).[insert](BaseVerkleNode.md#insert)

#### Defined in

[node/leafNode.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L56)

___

### insertMultiple

▸ **insertMultiple**(`key`, `values`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |
| `values` | `Uint8Array`[] |

#### Returns

`void`

#### Defined in

[node/leafNode.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L62)

___

### insertStem

▸ **insertStem**(`key`, `value`, `resolver`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |
| `value` | `Uint8Array`[] |
| `resolver` | () => `void` |

#### Returns

`void`

#### Defined in

[node/leafNode.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L66)

___

### raw

▸ **raw**(): `Uint8Array`[]

#### Returns

`Uint8Array`[]

#### Overrides

[BaseVerkleNode](BaseVerkleNode.md).[raw](BaseVerkleNode.md#raw)

#### Defined in

[node/leafNode.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L71)

___

### serialize

▸ **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

the RLP serialized node

#### Inherited from

[BaseVerkleNode](BaseVerkleNode.md).[serialize](BaseVerkleNode.md#serialize)

#### Defined in

[node/baseVerkleNode.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L30)

___

### setDepth

▸ **setDepth**(`depth`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `depth` | `number` |

#### Returns

`void`

#### Defined in

[node/leafNode.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L82)

___

### create

▸ `Static` **create**(`stem`, `values`): [`LeafNode`](LeafNode.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `stem` | `Uint8Array` |
| `values` | `Uint8Array`[] |

#### Returns

[`LeafNode`](LeafNode.md)

#### Defined in

[node/leafNode.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L24)

___

### fromRawNode

▸ `Static` **fromRawNode**(`rawNode`, `depth`): [`LeafNode`](LeafNode.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `rawNode` | `Uint8Array`[] |
| `depth` | `number` |

#### Returns

[`LeafNode`](LeafNode.md)

#### Defined in

[node/leafNode.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L28)
