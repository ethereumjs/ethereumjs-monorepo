[@ethereumjs/verkle](../README.md) / VerkleTreeOpts

# Interface: VerkleTreeOpts

## Table of contents

### Properties

- [cacheSize](VerkleTreeOpts.md#cachesize)
- [db](VerkleTreeOpts.md#db)
- [root](VerkleTreeOpts.md#root)
- [useRootPersistence](VerkleTreeOpts.md#userootpersistence)

## Properties

### cacheSize

• `Optional` **cacheSize**: `number`

LRU cache for tree nodes to allow for faster node retrieval.

Default: 0 (deactivated)

#### Defined in

[types.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L84)

___

### db

• `Optional` **db**: `DB`<`Uint8Array`, `Uint8Array`\>

A database instance.

#### Defined in

[types.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L67)

___

### root

• `Optional` **root**: `Uint8Array`

A `Uint8Array` for the root of a previously stored tree

#### Defined in

[types.ts:72](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L72)

___

### useRootPersistence

• `Optional` **useRootPersistence**: `boolean`

Store the root inside the database after every `write` operation

#### Defined in

[types.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/verkle/src/types.ts#L77)
