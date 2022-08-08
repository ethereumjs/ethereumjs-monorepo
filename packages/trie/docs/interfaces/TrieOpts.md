[@ethereumjs/trie](../README.md) / TrieOpts

# Interface: TrieOpts

## Table of contents

### Properties

- [db](TrieOpts.md#db)
- [deleteFromDB](TrieOpts.md#deletefromdb)
- [hash](TrieOpts.md#hash)
- [persistRoot](TrieOpts.md#persistroot)
- [root](TrieOpts.md#root)

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

### hash

• `Optional` **hash**: [`HashFunc`](../README.md#hashfunc)

Hash function used for hashing trie node and securing key.

#### Defined in

[packages/trie/src/types.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L41)

___

### persistRoot

• `Optional` **persistRoot**: `boolean`

Store the root inside the database after every `write` operation

#### Defined in

[packages/trie/src/types.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L46)

___

### root

• `Optional` **root**: `Buffer`

A `Buffer` for the root of a previously stored trie

#### Defined in

[packages/trie/src/types.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L31)
