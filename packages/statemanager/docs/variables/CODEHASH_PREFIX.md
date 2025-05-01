[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / CODEHASH\_PREFIX

# Variable: CODEHASH\_PREFIX

> `const` **CODEHASH\_PREFIX**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [merkleStateManager.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L44)

Prefix to distinguish between a contract deployed with code `0x80`
and `RLP([])` (also having the value `0x80`).

Otherwise the creation of the code hash for the `0x80` contract
will be the same as the hash of the empty trie which leads to
misbehaviour in the underlying trie library.
