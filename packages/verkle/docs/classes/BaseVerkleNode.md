[**@ethereumjs/verkle**](../README.md)

***

[@ethereumjs/verkle](../README.md) / BaseVerkleNode

# Class: `abstract` BaseVerkleNode\<T\>

Defined in: [node/baseVerkleNode.ts:7](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L7)

## Extended by

- [`InternalVerkleNode`](InternalVerkleNode.md)
- [`LeafVerkleNode`](LeafVerkleNode.md)

## Type Parameters

• **T** *extends* [`VerkleNodeType`](../enumerations/VerkleNodeType.md)

## Implements

- [`VerkleNodeInterface`](../interfaces/VerkleNodeInterface.md)

## Constructors

### new BaseVerkleNode()

> **new BaseVerkleNode**\<`T`\>(`options`): [`BaseVerkleNode`](BaseVerkleNode.md)\<`T`\>

Defined in: [node/baseVerkleNode.ts:10](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L10)

#### Parameters

##### options

[`VerkleNodeOptions`](../interfaces/VerkleNodeOptions.md)\[`T`\]

#### Returns

[`BaseVerkleNode`](BaseVerkleNode.md)\<`T`\>

## Properties

### commitment

> **commitment**: `Uint8Array`

Defined in: [node/baseVerkleNode.ts:8](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L8)

## Methods

### hash()

> **hash**(): `Uint8Array`

Defined in: [node/baseVerkleNode.ts:16](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L16)

#### Returns

`Uint8Array`

#### Implementation of

[`VerkleNodeInterface`](../interfaces/VerkleNodeInterface.md).[`hash`](../interfaces/VerkleNodeInterface.md#hash)

***

### raw()

> `abstract` **raw**(): `Uint8Array`[]

Defined in: [node/baseVerkleNode.ts:21](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L21)

#### Returns

`Uint8Array`[]

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [node/baseVerkleNode.ts:26](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L26)

#### Returns

`Uint8Array`

the RLP serialized node

#### Implementation of

[`VerkleNodeInterface`](../interfaces/VerkleNodeInterface.md).[`serialize`](../interfaces/VerkleNodeInterface.md#serialize)
