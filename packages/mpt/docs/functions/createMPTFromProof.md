[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / createMPTFromProof

# Function: createMPTFromProof()

> **createMPTFromProof**(`proof`, `trieOpts?`): `Promise`\<[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)\>

Defined in: [packages/mpt/src/constructors.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/constructors.ts#L62)

Create a trie from a given (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof. A proof contains the encoded trie nodes
from the root node to the leaf node storing state data.

## Parameters

### proof

[`Proof`](../type-aliases/Proof.md)

an EIP-1186 proof to create trie from

### trieOpts?

[`MPTOpts`](../interfaces/MPTOpts.md)

trie opts to be applied to returned trie

## Returns

`Promise`\<[`MerklePatriciaTrie`](../classes/MerklePatriciaTrie.md)\>

new trie created from given proof
