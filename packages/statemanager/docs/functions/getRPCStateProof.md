[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / getRPCStateProof

# Function: getRPCStateProof()

> **getRPCStateProof**(`sm`, `address`, `storageSlots`): `Promise`\<[`Proof`](../type-aliases/Proof.md)\>

Defined in: [proofs/rpc.ts:12](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/proofs/rpc.ts#L12)

Get an EIP-1186 proof from the provider

## Parameters

### sm

[`RPCStateManager`](../classes/RPCStateManager.md)

### address

`Address`

address to get proof of

### storageSlots

`Uint8Array`[] = `[]`

storage slots to get proof of

## Returns

`Promise`\<[`Proof`](../type-aliases/Proof.md)\>

an EIP-1186 formatted proof
