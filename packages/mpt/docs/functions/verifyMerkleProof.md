[**@ethereumjs/mpt**](../README.md)

***

[@ethereumjs/mpt](../README.md) / verifyMerkleProof

# Function: verifyMerkleProof()

> **verifyMerkleProof**(`key`, `proof`, `opts?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Defined in: [proof/proof.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/mpt/src/proof/proof.ts#L16)

Verify an EIP-1186 account or storage proof against an expected trie root.

## Parameters

### key

`Uint8Array`

Key whose value is being proven (hashed when `useKeyHashing` is set)

### proof

[`Proof`](../type-aliases/Proof.md)

Serialized trie nodes from root to leaf

### opts?

[`MPTOpts`](../interfaces/MPTOpts.md)

Trie options (root, key hashing) used when reconstructing the proof trie

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Proven value, or `null` for a valid non-existence proof

## Throws

If the proof is invalid
