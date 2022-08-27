[@ethereumjs/trie](../README.md) / TrieOpts

# Interface: TrieOpts

## Table of contents

### Properties

- [db](TrieOpts.md#db)
- [deleteFromDB](TrieOpts.md#deletefromdb)
- [persistRoot](TrieOpts.md#persistroot)
- [root](TrieOpts.md#root)
- [useHashedKeys](TrieOpts.md#usehashedkeys)
- [useHashedKeysFunction](TrieOpts.md#usehashedkeysfunction)

## Properties

### db

• `Optional` **db**: [`DB`](DB.md)

A database instance.

#### Defined in

[packages/trie/src/types.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L27)

___

### deleteFromDB

• `Optional` **deleteFromDB**: `boolean`

Delete nodes from DB on delete operations (disallows switching to an older state root)
Default: `false`

#### Defined in

[packages/trie/src/types.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L36)

___

### persistRoot

• `Optional` **persistRoot**: `boolean`

Store the root inside the database after every `write` operation

#### Defined in

[packages/trie/src/types.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L60)

___

### root

• `Optional` **root**: `Buffer`

A `Buffer` for the root of a previously stored trie

#### Defined in

[packages/trie/src/types.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L31)

___

### useHashedKeys

• `Optional` **useHashedKeys**: `boolean`

Create as a secure Trie where the keys are automatically hashed using the
**keccak256** hash function or alternatively the custom hash function provided.
Default: `false`

This is the flavor of the Trie which is used in production Ethereum networks
like Ethereum Mainnet.

Note: This functionality has been refactored along the v5 release and was before
provided as a separate inherited class `SecureTrie`. Just replace with `Trie`
instantiation with `useHashedKeys` set to `true`.

#### Defined in

[packages/trie/src/types.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L50)

___

### useHashedKeysFunction

• `Optional` **useHashedKeysFunction**: [`HashKeysFunction`](../README.md#hashkeysfunction)

Hash function used for hashing trie node and securing key.

#### Defined in

[packages/trie/src/types.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L55)
