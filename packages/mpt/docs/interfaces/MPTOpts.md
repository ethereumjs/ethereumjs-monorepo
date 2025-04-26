[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / MPTOpts

# Interface: MPTOpts

Defined in: [packages/mpt/src/types.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L47)

## Properties

### cacheSize?

> `optional` **cacheSize**: `number`

Defined in: [packages/mpt/src/types.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L106)

LRU cache for trie nodes to allow for faster node retrieval.

Default: 0 (deactivated)

***

### common?

> `optional` **common**: [`CommonInterface`](CommonInterface.md)

Defined in: [packages/mpt/src/types.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L111)

@ethereumjs/common `Common` instance (an alternative to passing in a `customHashingFunction`)

***

### db?

> `optional` **db**: `DB`\<`string`, `string` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [packages/mpt/src/types.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L51)

A database instance.

***

### keyPrefix?

> `optional` **keyPrefix**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/mpt/src/types.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L83)

Add a prefix to the trie node keys

(potential performance benefits if multiple tries are stored within the same DB,
e.g. all storage tries being stored in the outer account state DB)

***

### root?

> `optional` **root**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/mpt/src/types.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L56)

A `Uint8Array` for the root of a previously stored trie

***

### useKeyHashing?

> `optional` **useKeyHashing**: `boolean`

Defined in: [packages/mpt/src/types.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L70)

Create as a secure MerklePatriciaTrie where the keys are automatically hashed using the
**keccak256** hash function or alternatively the custom hash function provided.
Default: `false`

This is the flavor of the MerklePatriciaTrie which is used in production Ethereum networks
like Ethereum Mainnet.

Note: This functionality has been refactored along the v5 release and was before
provided as a separate inherited class `SecureTrie`. Just replace with `Trie`
instantiation with `useKeyHashing` set to `true`.

***

### useKeyHashingFunction?

> `optional` **useKeyHashingFunction**: [`HashKeysFunction`](../type-aliases/HashKeysFunction.md)

Defined in: [packages/mpt/src/types.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L75)

Hash function used for hashing trie node and securing key.

***

### useNodePruning?

> `optional` **useNodePruning**: `boolean`

Defined in: [packages/mpt/src/types.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L99)

Flag to prune the trie. When set to `true`, each time a value is overridden,
unreachable nodes will be pruned (deleted) from the trie

***

### useRootPersistence?

> `optional` **useRootPersistence**: `boolean`

Defined in: [packages/mpt/src/types.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L93)

Store the root inside the database after every `write` operation

***

### valueEncoding?

> `optional` **valueEncoding**: `ValueEncoding`

Defined in: [packages/mpt/src/types.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/types.ts#L88)

ValueEncoding of the database (the values which are `put`/`get` in the db are of this type). Defaults to `string`
