[@ethereumjs/statemanager](../README.md) / DefaultStateManagerOpts

# Interface: DefaultStateManagerOpts

Options for constructing a StateManager.

## Table of contents

### Properties

- [accountCacheOpts](DefaultStateManagerOpts.md#accountcacheopts)
- [codeCacheOpts](DefaultStateManagerOpts.md#codecacheopts)
- [common](DefaultStateManagerOpts.md#common)
- [prefixCodeHashes](DefaultStateManagerOpts.md#prefixcodehashes)
- [prefixStorageTrieKeys](DefaultStateManagerOpts.md#prefixstoragetriekeys)
- [storageCacheOpts](DefaultStateManagerOpts.md#storagecacheopts)
- [trie](DefaultStateManagerOpts.md#trie)

## Properties

### accountCacheOpts

• `Optional` **accountCacheOpts**: `CacheOptions`

#### Defined in

[stateManager.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L134)

___

### codeCacheOpts

• `Optional` **codeCacheOpts**: `CacheOptions`

#### Defined in

[stateManager.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L138)

___

### common

• `Optional` **common**: `Common`

The common to use

#### Defined in

[stateManager.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L143)

___

### prefixCodeHashes

• `Optional` **prefixCodeHashes**: `boolean`

Option to prefix codehashes in the database. This defaults to `true`.
If this is disabled, note that it is possible to corrupt the trie, by deploying code
which code is equal to the preimage of a trie-node.
E.g. by putting the code `0x80` into the empty trie, will lead to a corrupted trie.

#### Defined in

[stateManager.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L120)

___

### prefixStorageTrieKeys

• `Optional` **prefixStorageTrieKeys**: `boolean`

Option to prefix the keys for the storage tries with the first 7 bytes from the
associated account address. Activating this option gives a noticeable performance
boost for storage DB reads when operating on larger tries.

Note: Activating/deactivating this option causes continued state reads to be
incompatible with existing databases.

Default: false (for backwards compatibility reasons)

#### Defined in

[stateManager.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L132)

___

### storageCacheOpts

• `Optional` **storageCacheOpts**: `CacheOptions`

#### Defined in

[stateManager.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L136)

___

### trie

• `Optional` **trie**: `Trie`

A Trie instance

#### Defined in

[stateManager.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L113)
