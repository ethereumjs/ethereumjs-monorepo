[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / executionPayloadFromBeaconPayload

# Function: executionPayloadFromBeaconPayload()

> **executionPayloadFromBeaconPayload**(`payload`): [`ExecutionPayload`](../type-aliases/ExecutionPayload.md)

Defined in: [from-beacon-payload.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/from-beacon-payload.ts#L41)

Converts a beacon block execution payload JSON object [BeaconPayloadJSON](../type-aliases/BeaconPayloadJSON.md) to the [ExecutionPayload](../type-aliases/ExecutionPayload.md) data needed to construct a [Block](../classes/Block.md).
The JSON data can be retrieved from a consensus layer (CL) client on this Beacon API `/eth/v2/beacon/blocks/[block number]`

## Parameters

### payload

[`BeaconPayloadJSON`](../type-aliases/BeaconPayloadJSON.md)

## Returns

[`ExecutionPayload`](../type-aliases/ExecutionPayload.md)
