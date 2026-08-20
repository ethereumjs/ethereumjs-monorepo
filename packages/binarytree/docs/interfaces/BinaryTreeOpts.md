[**@ethereumjs/binarytree**](../README.md)

***

[@ethereumjs/binarytree](../README.md) / BinaryTreeOpts

# Interface: BinaryTreeOpts

Defined in: [types.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L6)

Options for [createBinaryTree](../functions/createBinaryTree.md) and [BinaryTree](../classes/BinaryTree.md).

## Properties

### cacheSize

> **cacheSize**: `number`

Defined in: [types.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L27)

LRU cache for tree nodes to allow for faster node retrieval.

Default: 0 (deactivated)

***

### db

> **db**: `DB`\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [types.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L10)

A database instance.

***

### hashFunction

> **hashFunction**: (`msg`) => `Uint8Array`

Defined in: [types.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L32)

Hash function used for hashing the tree nodes.

#### Parameters

##### msg

`Uint8Array`

#### Returns

`Uint8Array`

***

### root?

> `optional` **root?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L15)

A `Uint8Array` for the root of a previously stored tree

***

### useRootPersistence

> **useRootPersistence**: `boolean`

Defined in: [types.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/types.ts#L20)

Store the root inside the database after every `write` operation
