[@ethereumjs/trie](../README.md) / TrieOpts

# Interface: TrieOpts

## Table of contents

### Properties

- [cacheSize](TrieOpts.md#cachesize)
- [db](TrieOpts.md#db)
- [root](TrieOpts.md#root)
- [useKeyHashing](TrieOpts.md#usekeyhashing)
- [useKeyHashingFunction](TrieOpts.md#usekeyhashingfunction)
- [useNodePruning](TrieOpts.md#usenodepruning)
- [useRootPersistence](TrieOpts.md#userootpersistence)

## Properties

### cacheSize

• `Optional` **cacheSize**: `number`

LRU cache for trie nodes to allow for faster node retrieval.

Default: 0 (deactivated)

#### Defined in

[packages/trie/src/types.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L72)

___

### db

• `Optional` **db**: `DB`<`string`, `string`\>

A database instance.

#### Defined in

[packages/trie/src/types.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L30)

___

### root

• `Optional` **root**: `Uint8Array`

A `Uint8Array` for the root of a previously stored trie

#### Defined in

[packages/trie/src/types.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L35)

___

### useKeyHashing

• `Optional` **useKeyHashing**: `boolean`

Create as a secure Trie where the keys are automatically hashed using the
**keccak256** hash function or alternatively the custom hash function provided.
Default: `false`

This is the flavor of the Trie which is used in production Ethereum networks
like Ethereum Mainnet.

Note: This functionality has been refactored along the v5 release and was before
provided as a separate inherited class `SecureTrie`. Just replace with `Trie`
instantiation with `useKeyHashing` set to `true`.

#### Defined in

[packages/trie/src/types.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L49)

___

### useKeyHashingFunction

• `Optional` **useKeyHashingFunction**: [`HashKeysFunction`](../README.md#hashkeysfunction)

Hash function used for hashing trie node and securing key.

#### Defined in

[packages/trie/src/types.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L54)

___

### useNodePruning

• `Optional` **useNodePruning**: `boolean`

Flag to prune the trie. When set to `true`, each time a value is overridden,
unreachable nodes will be pruned (deleted) from the trie

#### Defined in

[packages/trie/src/types.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L65)

___

### useRootPersistence

• `Optional` **useRootPersistence**: `boolean`

Store the root inside the database after every `write` operation

#### Defined in

[packages/trie/src/types.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L59)
