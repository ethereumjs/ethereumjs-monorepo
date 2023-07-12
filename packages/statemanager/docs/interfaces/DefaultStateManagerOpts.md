[@ethereumjs/statemanager](../README.md) / DefaultStateManagerOpts

# Interface: DefaultStateManagerOpts

Options for constructing a StateManager.

## Table of contents

### Properties

- [accountCacheOpts](DefaultStateManagerOpts.md#accountcacheopts)
- [common](DefaultStateManagerOpts.md#common)
- [prefixCodeHashes](DefaultStateManagerOpts.md#prefixcodehashes)
- [storageCacheOpts](DefaultStateManagerOpts.md#storagecacheopts)
- [trie](DefaultStateManagerOpts.md#trie)

## Properties

### accountCacheOpts

• `Optional` **accountCacheOpts**: `CacheOptions`

#### Defined in

[stateManager.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L120)

___

### common

• `Optional` **common**: `Common`

The common to use

#### Defined in

[stateManager.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L127)

___

### prefixCodeHashes

• `Optional` **prefixCodeHashes**: `boolean`

Option to prefix codehashes in the database. This defaults to `true`.
If this is disabled, note that it is possible to corrupt the trie, by deploying code
which code is equal to the preimage of a trie-node.
E.g. by putting the code `0x80` into the empty trie, will lead to a corrupted trie.

#### Defined in

[stateManager.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L118)

___

### storageCacheOpts

• `Optional` **storageCacheOpts**: `CacheOptions`

#### Defined in

[stateManager.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L122)

___

### trie

• `Optional` **trie**: `Trie`

A Trie instance

#### Defined in

[stateManager.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/stateManager.ts#L111)
