[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createBlockFromJSONRPCProvider

# Function: createBlockFromJSONRPCProvider()

> **createBlockFromJSONRPCProvider**(`provider`, `blockTag`, `opts`): `Promise`\<[`Block`](../classes/Block.md)\>

Defined in: [block/constructors.ts:238](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/constructors.ts#L238)

Fetch a block from a JSON-RPC provider and instantiate it.

## Parameters

### provider

`string` \| `EthersProvider`

### blockTag

`string` \| `bigint`

Block hash, number, or tag (`latest`, `pending`, …)

### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

## Returns

`Promise`\<[`Block`](../classes/Block.md)\>

## Throws

If `blockTag` is not a recognized hash, number, or tag

## Throws

If the provider returns no block data
