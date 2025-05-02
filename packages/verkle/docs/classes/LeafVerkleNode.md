[**@ethereumjs/verkle**](../README.md)

***

[@ethereumjs/verkle](../README.md) / LeafVerkleNode

# Class: LeafVerkleNode

Defined in: [node/leafNode.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L15)

## Extends

- [`BaseVerkleNode`](BaseVerkleNode.md)\<*typeof* [`Leaf`](../variables/VerkleNodeType.md#leaf)\>

## Constructors

### Constructor

> **new LeafVerkleNode**(`options`): `LeafVerkleNode`

Defined in: [node/leafNode.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L22)

#### Parameters

##### options

`LeafVerkleNodeOptions`

#### Returns

`LeafVerkleNode`

#### Overrides

[`BaseVerkleNode`](BaseVerkleNode.md).[`constructor`](BaseVerkleNode.md#constructor)

## Properties

### c1?

> `optional` **c1**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [node/leafNode.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L18)

***

### c2?

> `optional` **c2**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [node/leafNode.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L19)

***

### commitment

> **commitment**: `Uint8Array`

Defined in: [node/baseVerkleNode.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L8)

#### Inherited from

[`BaseVerkleNode`](BaseVerkleNode.md).[`commitment`](BaseVerkleNode.md#commitment)

***

### stem

> **stem**: `Uint8Array`

Defined in: [node/leafNode.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L16)

***

### type

> **type**: `1` = `VerkleNodeType.Leaf`

Defined in: [node/leafNode.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L20)

***

### values

> **values**: (`Uint8Array`\<`ArrayBufferLike`\> \| [`LeafVerkleNodeValue`](../type-aliases/LeafVerkleNodeValue.md))[]

Defined in: [node/leafNode.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L17)

## Methods

### getValue()

> **getValue**(`index`): `undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [node/leafNode.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L132)

#### Parameters

##### index

`number`

#### Returns

`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>

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

Defined in: [node/leafNode.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L181)

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

### setValue()

> **setValue**(`index`, `value`): `void`

Defined in: [node/leafNode.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L150)

Set the value at the provided index from the values array and update the node commitments

#### Parameters

##### index

`number`

the index of the specific leaf value to be updated

##### value

the value to insert into the leaf value at `index`

`Uint8Array`\<`ArrayBufferLike`\> | [`LeafVerkleNodeValue`](../type-aliases/LeafVerkleNodeValue.md)

#### Returns

`void`

***

### create()

> `static` **create**(`stem`, `verkleCrypto`, `values?`): `Promise`\<`LeafVerkleNode`\>

Defined in: [node/leafNode.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L38)

Create a new leaf node from a stem and values

#### Parameters

##### stem

`Uint8Array`

the 31 byte stem corresponding to the where the leaf node should be placed in the trie

##### verkleCrypto

`VerkleCrypto`

the verkle cryptography interface

##### values?

(`Uint8Array`\<`ArrayBufferLike`\> \| [`LeafVerkleNodeValue`](../type-aliases/LeafVerkleNodeValue.md))[]

the 256 element array of 32 byte values stored in the leaf node

#### Returns

`Promise`\<`LeafVerkleNode`\>

an instantiated leaf node with commitments defined

***

### fromRawNode()

> `static` **fromRawNode**(`rawNode`, `verkleCrypto`): `LeafVerkleNode`

Defined in: [node/leafNode.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L109)

#### Parameters

##### rawNode

`Uint8Array`\<`ArrayBufferLike`\>[]

##### verkleCrypto

`VerkleCrypto`

#### Returns

`LeafVerkleNode`
