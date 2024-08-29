[@ethereumjs/verkle](../README.md) / BaseVerkleNode

# Class: BaseVerkleNode<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`VerkleNodeType`](../enums/VerkleNodeType.md) |

## Hierarchy

- **`BaseVerkleNode`**

  ↳ [`InternalNode`](InternalNode.md)

  ↳ [`LeafNode`](LeafNode.md)

## Implements

- [`VerkleNodeInterface`](../interfaces/VerkleNodeInterface.md)

## Table of contents

### Constructors

- [constructor](BaseVerkleNode.md#constructor)

### Properties

- [commitment](BaseVerkleNode.md#commitment)
- [depth](BaseVerkleNode.md#depth)

### Methods

- [commit](BaseVerkleNode.md#commit)
- [hash](BaseVerkleNode.md#hash)
- [insert](BaseVerkleNode.md#insert)
- [raw](BaseVerkleNode.md#raw)
- [serialize](BaseVerkleNode.md#serialize)

## Constructors

### constructor

• **new BaseVerkleNode**<`T`\>(`options`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`VerkleNodeType`](../enums/VerkleNodeType.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`VerkleNodeOptions`](../interfaces/VerkleNodeOptions.md)[`T`] |

#### Defined in

[node/baseVerkleNode.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L11)

## Properties

### commitment

• **commitment**: [`Point`](../interfaces/Point.md)

#### Defined in

[node/baseVerkleNode.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L8)

___

### depth

• **depth**: `number`

#### Defined in

[node/baseVerkleNode.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L9)

## Methods

### commit

▸ `Abstract` **commit**(): [`Point`](../interfaces/Point.md)

#### Returns

[`Point`](../interfaces/Point.md)

#### Implementation of

[VerkleNodeInterface](../interfaces/VerkleNodeInterface.md).[commit](../interfaces/VerkleNodeInterface.md#commit)

#### Defined in

[node/baseVerkleNode.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L16)

___

### hash

▸ **hash**(): `Uint8Array`

#### Returns

`Uint8Array`

#### Implementation of

[VerkleNodeInterface](../interfaces/VerkleNodeInterface.md).[hash](../interfaces/VerkleNodeInterface.md#hash)

#### Defined in

[node/baseVerkleNode.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L19)

___

### insert

▸ `Abstract` **insert**(`key`, `value`, `nodeResolverFn`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `Uint8Array` |
| `value` | `Uint8Array` |
| `nodeResolverFn` | () => `void` |

#### Returns

`void`

#### Defined in

[node/baseVerkleNode.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L23)

___

### raw

▸ `Abstract` **raw**(): `Uint8Array`[]

#### Returns

`Uint8Array`[]

#### Defined in

[node/baseVerkleNode.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L25)

___

### serialize

▸ **serialize**(): `Uint8Array`

#### Returns

`Uint8Array`

the RLP serialized node

#### Implementation of

[VerkleNodeInterface](../interfaces/VerkleNodeInterface.md).[serialize](../interfaces/VerkleNodeInterface.md#serialize)

#### Defined in

[node/baseVerkleNode.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L30)
