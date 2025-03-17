[**@ethereumjs/binarytree**](../README.md)

***

[@ethereumjs/binarytree](../README.md) / InternalBinaryNode

# Class: InternalBinaryNode

Defined in: [node/internalNode.ts:8](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/node/internalNode.ts#L8)

## Constructors

### new InternalBinaryNode()

> **new InternalBinaryNode**(`options`): [`InternalBinaryNode`](InternalBinaryNode.md)

Defined in: [node/internalNode.ts:13](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/node/internalNode.ts#L13)

#### Parameters

##### options

`InternalBinaryNodeOptions`

#### Returns

[`InternalBinaryNode`](InternalBinaryNode.md)

## Properties

### children

> **children**: (`null` \| [`ChildBinaryNode`](../type-aliases/ChildBinaryNode.md))[]

Defined in: [node/internalNode.ts:9](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/node/internalNode.ts#L9)

***

### type

> **type**: [`BinaryNodeType`](../enumerations/BinaryNodeType.md) = `BinaryNodeType.Internal`

Defined in: [node/internalNode.ts:11](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/node/internalNode.ts#L11)

## Methods

### getChild()

> **getChild**(`index`): `null` \| [`ChildBinaryNode`](../type-aliases/ChildBinaryNode.md)

Defined in: [node/internalNode.ts:70](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/node/internalNode.ts#L70)

#### Parameters

##### index

`number`

#### Returns

`null` \| [`ChildBinaryNode`](../type-aliases/ChildBinaryNode.md)

***

### raw()

> **raw**(): `Uint8Array`[]

Defined in: [node/internalNode.ts:101](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/node/internalNode.ts#L101)

Returns the raw serialized representation of this internal node as an array of Uint8Arrays.

The returned array contains:
1. A single-byte Uint8Array indicating the node type (BinaryNodeType.Internal).
2. For each child (left then right):
   - The child’s hash, or an empty Uint8Array if the child is null.
3. For each child (left then right):
   - An RLP-encoded tuple [pathLength, packedPathBytes] where:
        - `pathLength` is a one-byte Uint8Array representing the number of meaningful bits in the child’s path.
        - `packedPathBytes` is the packed byte representation of the child's bit path (as produced by `bitsToBytes`).

#### Returns

`Uint8Array`[]

An array of Uint8Arrays representing the node's serialized internal data.

#### Dev

When decoding, the stored child path (an RLP-encoded tuple) must be converted back into the original bit array.

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [node/internalNode.ts:81](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/node/internalNode.ts#L81)

#### Returns

`Uint8Array`

the RLP serialized node

***

### setChild()

> **setChild**(`index`, `child`): `void`

Defined in: [node/internalNode.ts:74](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/node/internalNode.ts#L74)

#### Parameters

##### index

`number`

##### child

`null` | [`ChildBinaryNode`](../type-aliases/ChildBinaryNode.md)

#### Returns

`void`

***

### create()

> `static` **create**(`children`?): [`InternalBinaryNode`](InternalBinaryNode.md)

Defined in: [node/internalNode.ts:63](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/node/internalNode.ts#L63)

Generates a new Internal node

#### Parameters

##### children?

(`null` \| [`ChildBinaryNode`](../type-aliases/ChildBinaryNode.md))[]

the children nodes

#### Returns

[`InternalBinaryNode`](InternalBinaryNode.md)

a new Internal node

***

### fromRawNode()

> `static` **fromRawNode**(`rawNode`): [`InternalBinaryNode`](InternalBinaryNode.md)

Defined in: [node/internalNode.ts:17](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/binarytree/src/node/internalNode.ts#L17)

#### Parameters

##### rawNode

`Uint8Array`[]

#### Returns

[`InternalBinaryNode`](InternalBinaryNode.md)
