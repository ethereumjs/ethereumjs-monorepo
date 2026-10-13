[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / createMPT

# Function: createMPT()

> **createMPT**(`opts?`): `Promise`\<[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)\>

Defined in: [constructors.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/constructors.ts#L24)

Creates a Merkle Patricia Trie instance.

Preferred entry point over constructing [MerklePatriciaTrie](../classes/MerklePatriciaTrie.md) directly.
When `useRootPersistence` is enabled and a database is provided, loads or stores
the trie root under the internal root key.

## Parameters

### opts?

[`MPTOpts`](../interfaces/MPTOpts.md)

Trie configuration (database, root, key hashing, value encoding, etc.)

## Returns

`Promise`\<[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)\>

Initialized trie ready for reads and writes
