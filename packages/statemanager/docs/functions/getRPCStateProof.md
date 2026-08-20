[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / getRPCStateProof

# Function: getRPCStateProof()

> **getRPCStateProof**(`sm`, `address`, `storageSlots?`): `Promise`\<[`Proof`](../type-aliases/Proof.md)\>

Defined in: [proof/rpc.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/proof/rpc.ts#L12)

Fetch an EIP-1186 proof from the RPC provider backing a [RPCStateManager](../classes/RPCStateManager.md).

## Parameters

### sm

[`RPCStateManager`](../classes/RPCStateManager.md)

### address

`Address`

Account to prove

### storageSlots?

`Uint8Array`\<`ArrayBufferLike`\>[] = `[]`

Storage keys to include (defaults to none)

## Returns

`Promise`\<[`Proof`](../type-aliases/Proof.md)\>
