[@ethereumjs/trie](../README.md) / TrieOpts

# Interface: TrieOpts

## Table of contents

### Properties

- [cacheSize](TrieOpts.md#cachesize)
- [common](TrieOpts.md#common)
- [db](TrieOpts.md#db)
- [keyPrefix](TrieOpts.md#keyprefix)
- [root](TrieOpts.md#root)
- [useKeyHashing](TrieOpts.md#usekeyhashing)
- [useKeyHashingFunction](TrieOpts.md#usekeyhashingfunction)
- [useNodePruning](TrieOpts.md#usenodepruning)
- [useRootPersistence](TrieOpts.md#userootpersistence)
- [valueEncoding](TrieOpts.md#valueencoding)

## Properties

### cacheSize

• `Optional` **cacheSize**: `number`

LRU cache for trie nodes to allow for faster node retrieval.

Default: 0 (deactivated)

#### Defined in

[packages/trie/src/types.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L97)

___

### common

• `Optional` **common**: [`CommonInterface`](CommonInterface.md)

@ethereumjs/common `Common` instance (an alternative to passing in a `customHashingFunction`)

#### Defined in

[packages/trie/src/types.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L102)

___

### db

• `Optional` **db**: `DB`<`string`, `string` \| `Uint8Array`\>

A database instance.

#### Defined in

[packages/trie/src/types.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L42)

___

### keyPrefix

• `Optional` **keyPrefix**: `Uint8Array`

Add a prefix to the trie node keys

(potential performance benefits if multiple tries are stored within the same DB,
e.g. all storage tries being stored in the outer account state DB)

#### Defined in

[packages/trie/src/types.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L74)

___

### root

• `Optional` **root**: `Uint8Array`

A `Uint8Array` for the root of a previously stored trie

#### Defined in

[packages/trie/src/types.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L47)

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

[packages/trie/src/types.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L61)

___

### useKeyHashingFunction

• `Optional` **useKeyHashingFunction**: [`HashKeysFunction`](../README.md#hashkeysfunction)

Hash function used for hashing trie node and securing key.

#### Defined in

[packages/trie/src/types.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L66)

___

### useNodePruning

• `Optional` **useNodePruning**: `boolean`

Flag to prune the trie. When set to `true`, each time a value is overridden,
unreachable nodes will be pruned (deleted) from the trie

#### Defined in

[packages/trie/src/types.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L90)

___

### useRootPersistence

• `Optional` **useRootPersistence**: `boolean`

Store the root inside the database after every `write` operation

#### Defined in

[packages/trie/src/types.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L84)

___

### valueEncoding

• `Optional` **valueEncoding**: `ValueEncoding`

ValueEncoding of the database (the values which are `put`/`get` in the db are of this type). Defaults to `string`

#### Defined in

[packages/trie/src/types.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L79)
