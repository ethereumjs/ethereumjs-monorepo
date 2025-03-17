[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / CODEHASH\_PREFIX

# Variable: CODEHASH\_PREFIX

> `const` **CODEHASH\_PREFIX**: `Uint8Array`

Defined in: [merkleStateManager.ts:45](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/merkleStateManager.ts#L45)

Prefix to distinguish between a contract deployed with code `0x80`
and `RLP([])` (also having the value `0x80`).

Otherwise the creation of the code hash for the `0x80` contract
will be the same as the hash of the empty trie which leads to
misbehaviour in the underlying trie library.
