[**@ethereumjs/verkle**](../README.md)

***

[@ethereumjs/verkle](../README.md) / InternalVerkleNode

# Class: InternalVerkleNode

Defined in: [node/internalNode.ts:8](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L8)

## Extends

- [`BaseVerkleNode`](BaseVerkleNode.md)\<[`Internal`](../enumerations/VerkleNodeType.md#internal)\>

## Constructors

### new InternalVerkleNode()

> **new InternalVerkleNode**(`options`): [`InternalVerkleNode`](InternalVerkleNode.md)

Defined in: [node/internalNode.ts:13](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L13)

#### Parameters

##### options

`InternalVerkleNodeOptions`

#### Returns

[`InternalVerkleNode`](InternalVerkleNode.md)

#### Overrides

[`BaseVerkleNode`](BaseVerkleNode.md).[`constructor`](BaseVerkleNode.md#constructors)

## Properties

### children

> **children**: (`null` \| [`ChildNode`](../interfaces/ChildNode.md))[]

Defined in: [node/internalNode.ts:10](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L10)

***

### commitment

> **commitment**: `Uint8Array`

Defined in: [node/baseVerkleNode.ts:8](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L8)

#### Inherited from

[`BaseVerkleNode`](BaseVerkleNode.md).[`commitment`](BaseVerkleNode.md#commitment)

***

### type

> **type**: [`VerkleNodeType`](../enumerations/VerkleNodeType.md) = `VerkleNodeType.Internal`

Defined in: [node/internalNode.ts:11](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L11)

## Methods

### getChildren()

> **getChildren**(`index`): `null` \| [`ChildNode`](../interfaces/ChildNode.md)

Defined in: [node/internalNode.ts:81](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L81)

#### Parameters

##### index

`number`

The index in the children array to retrieve the child node commitment from

#### Returns

`null` \| [`ChildNode`](../interfaces/ChildNode.md)

the uncompressed 64byte commitment for the child node at the `index` position in the children array

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [node/baseVerkleNode.ts:16](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L16)

#### Returns

`Uint8Array`

#### Inherited from

[`BaseVerkleNode`](BaseVerkleNode.md).[`hash`](BaseVerkleNode.md#hash)

***

### raw()

> **raw**(): `Uint8Array`[]

Defined in: [node/internalNode.ts:85](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L85)

#### Returns

`Uint8Array`[]

#### Overrides

[`BaseVerkleNode`](BaseVerkleNode.md).[`raw`](BaseVerkleNode.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [node/baseVerkleNode.ts:26](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L26)

#### Returns

`Uint8Array`

the RLP serialized node

#### Inherited from

[`BaseVerkleNode`](BaseVerkleNode.md).[`serialize`](BaseVerkleNode.md#serialize)

***

### setChild()

> **setChild**(`childIndex`, `child`): `void`

Defined in: [node/internalNode.ts:19](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L19)

#### Parameters

##### childIndex

`number`

##### child

`null` | [`ChildNode`](../interfaces/ChildNode.md)

#### Returns

`void`

***

### create()

> `static` **create**(`verkleCrypto`): [`InternalVerkleNode`](InternalVerkleNode.md)

Defined in: [node/internalNode.ts:67](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L67)

Generates a new Internal node with default commitment

#### Parameters

##### verkleCrypto

`VerkleCrypto`

#### Returns

[`InternalVerkleNode`](InternalVerkleNode.md)

***

### fromRawNode()

> `static` **fromRawNode**(`rawNode`, `verkleCrypto`): [`InternalVerkleNode`](InternalVerkleNode.md)

Defined in: [node/internalNode.ts:42](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L42)

#### Parameters

##### rawNode

`Uint8Array`[]

##### verkleCrypto

`VerkleCrypto`

#### Returns

[`InternalVerkleNode`](InternalVerkleNode.md)
