[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / MPTOpts

# Interface: MPTOpts

Defined in: [types.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L54)

Options for [createMPT](../functions/createMPT.md) and [MerklePatriciaTrie](../classes/MerklePatriciaTrie.md).

## Properties

### cacheSize?

> `optional` **cacheSize?**: `number`

Defined in: [types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L113)

LRU cache for trie nodes to allow for faster node retrieval.

Default: 0 (deactivated)

***

### common?

> `optional` **common?**: [`CommonInterface`](CommonInterface.md)

Defined in: [types.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L118)

@ethereumjs/common `Common` instance (an alternative to passing in a `customHashingFunction`)

***

### db?

> `optional` **db?**: [`DB`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/interfaces/DB.md)\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [types.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L58)

A database instance.

***

### keyPrefix?

> `optional` **keyPrefix?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L90)

Add a prefix to the trie node keys

(potential performance benefits if multiple tries are stored within the same DB,
e.g. all storage tries being stored in the outer account state DB)

***

### root?

> `optional` **root?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [types.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L63)

A `Uint8Array` for the root of a previously stored trie

***

### useKeyHashing?

> `optional` **useKeyHashing?**: `boolean`

Defined in: [types.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L77)

Create as a secure MerklePatriciaTrie where the keys are automatically hashed using the
**keccak_256** hash function or alternatively the custom hash function provided.
Default: `false`

This is the flavor of the MerklePatriciaTrie which is used in production Ethereum networks
like Ethereum Mainnet.

Note: This functionality has been refactored along the v5 release and was before
provided as a separate inherited class `SecureTrie`. Just replace with `Trie`
instantiation with `useKeyHashing` set to `true`.

***

### useKeyHashingFunction?

> `optional` **useKeyHashingFunction?**: [`HashKeysFunction`](../type-aliases/HashKeysFunction.md)

Defined in: [types.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L82)

Hash function used for hashing trie node and securing key.

***

### useNodePruning?

> `optional` **useNodePruning?**: `boolean`

Defined in: [types.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L106)

Flag to prune the trie. When set to `true`, each time a value is overridden,
unreachable nodes will be pruned (deleted) from the trie

***

### useRootPersistence?

> `optional` **useRootPersistence?**: `boolean`

Defined in: [types.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L100)

Store the root inside the database after every `write` operation

***

### valueEncoding?

> `optional` **valueEncoding?**: `ValueEncoding`

Defined in: [types.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L95)

ValueEncoding of the database (the values which are `put`/`get` in the db are of this type). Defaults to `string`
