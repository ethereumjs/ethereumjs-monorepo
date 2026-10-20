[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / createMPTFromProof

# Function: createMPTFromProof()

> **createMPTFromProof**(`proof`, `trieOpts?`): `Promise`\<[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)\>

Defined in: [constructors.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/constructors.ts#L74)

Reconstruct a sparse trie from an EIP-1186 proof.

## Parameters

### proof

[`Proof`](../type-aliases/Proof.md)

Serialized trie nodes from root to the proven leaf

### trieOpts?

[`MPTOpts`](../interfaces/MPTOpts.md)

Options for the returned trie (root verification, key hashing, etc.)

## Returns

`Promise`\<[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)\>

Trie populated with proof nodes, root set from the proof
