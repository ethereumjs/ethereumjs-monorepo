[**@ethereumjs/verkle**](../README.md)

***

[@ethereumjs/verkle](../README.md) / InternalVerkleNode

# Class: InternalVerkleNode

Defined in: [node/internalNode.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L8)

## Extends

- [`BaseVerkleNode`](BaseVerkleNode.md)\<*typeof* [`Internal`](../variables/VerkleNodeType.md#internal)\>

## Constructors

### Constructor

> **new InternalVerkleNode**(`options`): `InternalVerkleNode`

Defined in: [node/internalNode.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L13)

#### Parameters

##### options

`InternalVerkleNodeOptions`

#### Returns

`InternalVerkleNode`

#### Overrides

[`BaseVerkleNode`](BaseVerkleNode.md).[`constructor`](BaseVerkleNode.md#constructor)

## Properties

### children

> **children**: (`null` \| [`ChildNode`](../interfaces/ChildNode.md))[]

Defined in: [node/internalNode.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L10)

***

### commitment

> **commitment**: `Uint8Array`

Defined in: [node/baseVerkleNode.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L8)

#### Inherited from

[`BaseVerkleNode`](BaseVerkleNode.md).[`commitment`](BaseVerkleNode.md#commitment)

***

### type

> **type**: `0` = `VerkleNodeType.Internal`

Defined in: [node/internalNode.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L11)

## Methods

### getChildren()

> **getChildren**(`index`): `null` \| [`ChildNode`](../interfaces/ChildNode.md)

Defined in: [node/internalNode.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L76)

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

Defined in: [node/baseVerkleNode.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L16)

#### Returns

`Uint8Array`

#### Inherited from

[`BaseVerkleNode`](BaseVerkleNode.md).[`hash`](BaseVerkleNode.md#hash)

***

### raw()

> **raw**(): `Uint8Array`\<`ArrayBufferLike`\>[]

Defined in: [node/internalNode.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L80)

#### Returns

`Uint8Array`\<`ArrayBufferLike`\>[]

#### Overrides

[`BaseVerkleNode`](BaseVerkleNode.md).[`raw`](BaseVerkleNode.md#raw)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [node/baseVerkleNode.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L26)

#### Returns

`Uint8Array`

the RLP serialized node

#### Inherited from

[`BaseVerkleNode`](BaseVerkleNode.md).[`serialize`](BaseVerkleNode.md#serialize)

***

### setChild()

> **setChild**(`childIndex`, `child`): `void`

Defined in: [node/internalNode.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L19)

#### Parameters

##### childIndex

`number`

##### child

`null` | [`ChildNode`](../interfaces/ChildNode.md)

#### Returns

`void`

***

### create()

> `static` **create**(`verkleCrypto`): `InternalVerkleNode`

Defined in: [node/internalNode.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L62)

Generates a new Internal node with default commitment

#### Parameters

##### verkleCrypto

`VerkleCrypto`

#### Returns

`InternalVerkleNode`

***

### fromRawNode()

> `static` **fromRawNode**(`rawNode`, `verkleCrypto`): `InternalVerkleNode`

Defined in: [node/internalNode.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/internalNode.ts#L37)

#### Parameters

##### rawNode

`Uint8Array`\<`ArrayBufferLike`\>[]

##### verkleCrypto

`VerkleCrypto`

#### Returns

`InternalVerkleNode`
