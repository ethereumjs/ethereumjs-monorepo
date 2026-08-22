[**@ethereumjs/binarytree**](../README.md)

***

[@ethereumjs/binarytree](../README.md) / verifyBinaryProof

# Function: verifyBinaryProof()

> **verifyBinaryProof**(`rootHash`, `key`, `proof`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Defined in: [proof.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/binarytree/src/proof.ts#L36)

Verify a binary tree proof for `key` against `rootHash`.

## Parameters

### rootHash

`Uint8Array`

Expected tree root

### key

`Uint8Array`

Full 32-byte key (stem + suffix)

### proof

`Uint8Array`\<`ArrayBufferLike`\>[]

Serialized nodes along the key path

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `null`\>

Proven value, or `null` for a valid non-existence proof

## Throws

If the proof is invalid
