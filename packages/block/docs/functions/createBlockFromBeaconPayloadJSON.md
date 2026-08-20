[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createBlockFromBeaconPayloadJSON

# Function: createBlockFromBeaconPayloadJSON()

> **createBlockFromBeaconPayloadJSON**(`payload`, `opts?`): `Promise`\<[`Block`](../classes/Block.md)\>

Defined in: [block/constructors.ts:361](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/constructors.ts#L361)

Instantiate a block from a beacon REST `execution_payload` JSON object.

## Parameters

### payload

[`BeaconPayloadJSON`](../type-aliases/BeaconPayloadJSON.md)

### opts?

[`BlockOptions`](../interfaces/BlockOptions.md)

## Returns

`Promise`\<[`Block`](../classes/Block.md)\>

## Throws

If delegated [createBlockFromExecutionPayload](createBlockFromExecutionPayload.md) validation fails
