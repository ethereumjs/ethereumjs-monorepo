[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createBlockFromRPC

# Function: createBlockFromRPC()

> **createBlockFromRPC**(`blockParams`, `uncles`, `options?`): [`Block`](../classes/Block.md)

Defined in: [block/constructors.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/constructors.ts#L211)

Creates a new block object from Ethereum JSON RPC.

## Parameters

### blockParams

[`JSONRPCBlock`](../interfaces/JSONRPCBlock.md)

Ethereum JSON RPC of block (eth_getBlockByNumber)

### uncles

`any`[] = `[]`

Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex)

### options?

[`BlockOptions`](../interfaces/BlockOptions.md)

## Returns

[`Block`](../classes/Block.md)
