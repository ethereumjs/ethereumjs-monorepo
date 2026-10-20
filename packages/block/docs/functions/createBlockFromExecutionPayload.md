[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createBlockFromExecutionPayload

# Function: createBlockFromExecutionPayload()

> **createBlockFromExecutionPayload**(`payload`, `opts?`): `Promise`\<[`Block`](../classes/Block.md)\>

Defined in: [block/constructors.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/constructors.ts#L298)

Instantiate a block from an Engine API execution payload.

## Parameters

### payload

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

### opts?

[`BlockOptions`](../interfaces/BlockOptions.md)

## Returns

`Promise`\<[`Block`](../classes/Block.md)\>

## Throws

If any payload transaction fails RLP decode

## Throws

If the recomputed block hash does not match `payload.blockHash`
