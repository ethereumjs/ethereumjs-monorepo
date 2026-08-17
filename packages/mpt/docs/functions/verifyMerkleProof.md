[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / verifyMerkleProof

# Function: verifyMerkleProof()

> **verifyMerkleProof**(`key`, `proof`, `opts?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Defined in: [packages/mpt/src/proof/proof.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/proof/proof.ts#L17)

An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes
from the root node to the leaf node storing state data.

## Parameters

### key

`Uint8Array`

Key that is being verified and that the proof is created for

### proof

[`Proof`](../type-aliases/Proof.md)

An (EIP-1186)[https://eips.ethereum.org/EIPS/eip-1186] proof contains the encoded trie nodes from the root node to the leaf node storing state data.

### opts?

[`MPTOpts`](../interfaces/MPTOpts.md)

optional, the opts may include a custom hashing function to use with the trie for proof verification

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

The value from the key, or null if valid proof of non-existence.

## Throws

If proof is found to be invalid.
