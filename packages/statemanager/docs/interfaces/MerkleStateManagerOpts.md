[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / MerkleStateManagerOpts

# Interface: MerkleStateManagerOpts

Defined in: [types.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L35)

Options for constructing a [MerkleStateManager](../classes/MerkleStateManager.md).

## Extends

- `BaseStateManagerOpts`

## Properties

### caches?

> `optional` **caches?**: [`Caches`](../classes/Caches.md)

Defined in: [types.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L67)

Options to enable and configure the use of a cache account, code and storage
This can be useful for speeding up reads, especially when the trie is large.
The cache is only used for reading from the trie and is not used for writing to the trie.

Default: false

***

### common?

> `optional` **common?**: [`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

Defined in: [types.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L14)

The common to use

#### Inherited from

`BaseStateManagerOpts.common`

***

### prefixCodeHashes?

> `optional` **prefixCodeHashes?**: `boolean`

Defined in: [types.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L46)

Option to prefix codehashes in the database. This defaults to `true`.
If this is disabled, note that it is possible to corrupt the trie, by deploying code
which code is equal to the preimage of a trie-node.
E.g. by putting the code `0x80` into the empty trie, will lead to a corrupted trie.

***

### prefixStorageTrieKeys?

> `optional` **prefixStorageTrieKeys?**: `boolean`

Defined in: [types.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L58)

Option to prefix the keys for the storage tries with the first 7 bytes from the
associated account address. Activating this option gives a noticeable performance
boost for storage DB reads when operating on larger tries.

Note: Activating/deactivating this option causes continued state reads to be
incompatible with existing databases.

Default: false (for backwards compatibility reasons)

***

### trie?

> `optional` **trie?**: [`MerklePatriciaTrie`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/docs/classes/MerklePatriciaTrie.md)

Defined in: [types.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/types.ts#L39)

A [MerklePatriciaTrie](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/docs/classes/MerklePatriciaTrie.md) instance
