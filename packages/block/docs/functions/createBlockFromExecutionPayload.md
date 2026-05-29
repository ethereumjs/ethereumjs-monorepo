[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createBlockFromExecutionPayload

# Function: createBlockFromExecutionPayload()

> **createBlockFromExecutionPayload**(`payload`, `opts?`): `Promise`\<[`Block`](../classes/Block.md)\>

Defined in: [block/constructors.ts:306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/constructors.ts#L306)

Method to retrieve a block from an execution payload

## Parameters

### payload

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

Execution payload constructed from beacon payload data

### opts?

[`BlockOptions`](../interfaces/BlockOptions.md)

[BlockOptions](../interfaces/BlockOptions.md)

## Returns

`Promise`\<[`Block`](../classes/Block.md)\>

The constructed [Block](../classes/Block.md) object
