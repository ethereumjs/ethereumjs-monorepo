[**@ethereumjs/verkle**](../README.md)

***

[@ethereumjs/verkle](../README.md) / LeafVerkleNode

# Class: LeafVerkleNode

Defined in: [node/leafNode.ts:10](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L10)

## Extends

- [`BaseVerkleNode`](BaseVerkleNode.md)\<[`Leaf`](../enumerations/VerkleNodeType.md#leaf)\>

## Constructors

### new LeafVerkleNode()

> **new LeafVerkleNode**(`options`): [`LeafVerkleNode`](LeafVerkleNode.md)

Defined in: [node/leafNode.ts:17](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L17)

#### Parameters

##### options

`LeafVerkleNodeOptions`

#### Returns

[`LeafVerkleNode`](LeafVerkleNode.md)

#### Overrides

[`BaseVerkleNode`](BaseVerkleNode.md).[`constructor`](BaseVerkleNode.md#constructors)

## Properties

### c1?

> `optional` **c1**: `Uint8Array`

Defined in: [node/leafNode.ts:13](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L13)

***

### c2?

> `optional` **c2**: `Uint8Array`

Defined in: [node/leafNode.ts:14](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L14)

***

### commitment

> **commitment**: `Uint8Array`

Defined in: [node/baseVerkleNode.ts:8](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/baseVerkleNode.ts#L8)

#### Inherited from

[`BaseVerkleNode`](BaseVerkleNode.md).[`commitment`](BaseVerkleNode.md#commitment)

***

### stem

> **stem**: `Uint8Array`

Defined in: [node/leafNode.ts:11](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L11)

***

### type

> **type**: [`VerkleNodeType`](../enumerations/VerkleNodeType.md) = `VerkleNodeType.Leaf`

Defined in: [node/leafNode.ts:15](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L15)

***

### values

> **values**: (`Uint8Array` \| [`LeafVerkleNodeValue`](../enumerations/LeafVerkleNodeValue.md))[]

Defined in: [node/leafNode.ts:12](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L12)

## Methods

### getValue()

> **getValue**(`index`): `undefined` \| `Uint8Array`

Defined in: [node/leafNode.ts:127](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L127)

#### Parameters

##### index

`number`

#### Returns

`undefined` \| `Uint8Array`

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

Defined in: [node/leafNode.ts:176](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L176)

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

### setValue()

> **setValue**(`index`, `value`): `void`

Defined in: [node/leafNode.ts:145](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L145)

Set the value at the provided index from the values array and update the node commitments

#### Parameters

##### index

`number`

the index of the specific leaf value to be updated

##### value

the value to insert into the leaf value at `index`

`Uint8Array` | [`LeafVerkleNodeValue`](../enumerations/LeafVerkleNodeValue.md)

#### Returns

`void`

***

### create()

> `static` **create**(`stem`, `verkleCrypto`, `values`?): `Promise`\<[`LeafVerkleNode`](LeafVerkleNode.md)\>

Defined in: [node/leafNode.ts:33](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L33)

Create a new leaf node from a stem and values

#### Parameters

##### stem

`Uint8Array`

the 31 byte stem corresponding to the where the leaf node should be placed in the trie

##### verkleCrypto

`VerkleCrypto`

the verkle cryptography interface

##### values?

(`Uint8Array` \| [`LeafVerkleNodeValue`](../enumerations/LeafVerkleNodeValue.md))[]

the 256 element array of 32 byte values stored in the leaf node

#### Returns

`Promise`\<[`LeafVerkleNode`](LeafVerkleNode.md)\>

an instantiated leaf node with commitments defined

***

### fromRawNode()

> `static` **fromRawNode**(`rawNode`, `verkleCrypto`): [`LeafVerkleNode`](LeafVerkleNode.md)

Defined in: [node/leafNode.ts:104](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/verkle/src/node/leafNode.ts#L104)

#### Parameters

##### rawNode

`Uint8Array`[]

##### verkleCrypto

`VerkleCrypto`

#### Returns

[`LeafVerkleNode`](LeafVerkleNode.md)
