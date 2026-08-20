[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createBlockFromRPC

# Function: createBlockFromRPC()

> **createBlockFromRPC**(`blockParams`, `uncles?`, `options?`): [`Block`](../classes/Block.md)

Defined in: [block/constructors.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/constructors.ts#L207)

Instantiate a block from JSON-RPC block and uncle responses.

## Parameters

### blockParams

[`JSONRPCBlock`](../interfaces/JSONRPCBlock.md)

`eth_getBlockByNumber` / `eth_getBlockByHash` response

### uncles?

`any`[] = `[]`

Optional uncle headers from `eth_getUncleByBlockHashAndIndex`

### options?

[`BlockOptions`](../interfaces/BlockOptions.md)

## Returns

[`Block`](../classes/Block.md)
