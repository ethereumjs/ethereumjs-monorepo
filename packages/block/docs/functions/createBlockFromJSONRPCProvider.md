[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createBlockFromJSONRPCProvider

# Function: createBlockFromJSONRPCProvider()

> **createBlockFromJSONRPCProvider**(`provider`, `blockTag`, `opts`): `Promise`\<[`Block`](../classes/Block.md)\>

Defined in: [block/constructors.ts:246](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/constructors.ts#L246)

Method to retrieve a block from a JSON-RPC provider and format as a [Block](../classes/Block.md)

## Parameters

### provider

either a url for a remote provider or an Ethers JSONRPCProvider object

`string` | `EthersProvider`

### blockTag

block hash or block number to be run

`string` | `bigint`

### opts

[`BlockOptions`](../interfaces/BlockOptions.md)

[BlockOptions](../interfaces/BlockOptions.md)

## Returns

`Promise`\<[`Block`](../classes/Block.md)\>

a new [Block](../classes/Block.md) object specified by `blockTag`
