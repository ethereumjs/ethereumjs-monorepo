[@ethereumjs/trie](../README.md) / CheckpointDBOpts

# Interface: CheckpointDBOpts

## Table of contents

### Properties

- [cacheSize](CheckpointDBOpts.md#cachesize)
- [db](CheckpointDBOpts.md#db)
- [valueEncoding](CheckpointDBOpts.md#valueencoding)

## Properties

### cacheSize

• `Optional` **cacheSize**: `number`

Cache size (default: 0)

#### Defined in

[packages/trie/src/types.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L126)

___

### db

• **db**: `DB`<`string`, `string` \| `Uint8Array`\>

A database instance.

#### Defined in

[packages/trie/src/types.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L116)

___

### valueEncoding

• `Optional` **valueEncoding**: `ValueEncoding`

ValueEncoding of the database (the values which are `put`/`get` in the db are of this type). Defaults to `string`

#### Defined in

[packages/trie/src/types.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/trie/src/types.ts#L121)
