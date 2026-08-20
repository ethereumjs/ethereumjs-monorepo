[**@ethereumjs/blockchain**](../README.md)

***

[@ethereumjs/blockchain](../README.md) / OnBlock

# Type Alias: OnBlock

> **OnBlock** = (`block`, `reorg`) => `Promise`\<`void`\> \| `void`

Defined in: [types.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L8)

Callback invoked for each block during [BlockchainInterface.iterator](../interfaces/BlockchainInterface.md#iterator).

## Parameters

### block

`Block`

### reorg

`boolean`

## Returns

`Promise`\<`void`\> \| `void`
