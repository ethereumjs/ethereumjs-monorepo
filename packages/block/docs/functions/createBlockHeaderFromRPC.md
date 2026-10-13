[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createBlockHeaderFromRPC

# Function: createBlockHeaderFromRPC()

> **createBlockHeaderFromRPC**(`blockParams`, `options?`): [`BlockHeader`](../classes/BlockHeader.md)

Defined in: [header/constructors.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/constructors.ts#L111)

Instantiate a block header from JSON-RPC block fields.

## Parameters

### blockParams

[`JSONRPCBlock`](../interfaces/JSONRPCBlock.md)

`eth_getBlockByNumber` / `eth_getBlockByHash` response

### options?

[`BlockOptions`](../interfaces/BlockOptions.md)

## Returns

[`BlockHeader`](../classes/BlockHeader.md)
