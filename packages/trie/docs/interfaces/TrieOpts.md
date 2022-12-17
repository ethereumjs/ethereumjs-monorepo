[@ethereumjs/trie](../README.md) / TrieOpts

# Interface: TrieOpts

## Table of contents

### Properties

- [db](TrieOpts.md#db)
- [root](TrieOpts.md#root)
- [useKeyHashing](TrieOpts.md#usekeyhashing)
- [useKeyHashingFunction](TrieOpts.md#usekeyhashingfunction)
- [useNodePruning](TrieOpts.md#usenodepruning)
- [useRootPersistence](TrieOpts.md#userootpersistence)

## Properties

### db

• `Optional` **db**: [`DB`](DB.md)

A database instance.

#### Defined in

[packages/trie/src/types.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L27)

___

### root

• `Optional` **root**: `Buffer`

A `Buffer` for the root of a previously stored trie

#### Defined in

[packages/trie/src/types.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L32)

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

[packages/trie/src/types.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L46)

___

### useKeyHashingFunction

• `Optional` **useKeyHashingFunction**: [`HashKeysFunction`](../README.md#hashkeysfunction)

Hash function used for hashing trie node and securing key.

#### Defined in

[packages/trie/src/types.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L51)

___

### useNodePruning

• `Optional` **useNodePruning**: `boolean`

Flag to prune the trie. When set to `true`, each time a value is overridden,
unreachable nodes will be pruned (deleted) from the trie

#### Defined in

[packages/trie/src/types.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L62)

___

### useRootPersistence

• `Optional` **useRootPersistence**: `boolean`

Store the root inside the database after every `write` operation

#### Defined in

[packages/trie/src/types.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L56)
