[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createBlockHeaderFromRPC

# Function: createBlockHeaderFromRPC()

> **createBlockHeaderFromRPC**(`blockParams`, `options?`): [`BlockHeader`](../classes/BlockHeader.md)

Defined in: [header/constructors.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/constructors.ts#L99)

Creates a new block header object from Ethereum JSON RPC.

## Parameters

### blockParams

[`JSONRPCBlock`](../interfaces/JSONRPCBlock.md)

Ethereum JSON RPC of block (eth_getBlockByNumber)

### options?

[`BlockOptions`](../interfaces/BlockOptions.md)

An object describing the blockchain

## Returns

[`BlockHeader`](../classes/BlockHeader.md)
