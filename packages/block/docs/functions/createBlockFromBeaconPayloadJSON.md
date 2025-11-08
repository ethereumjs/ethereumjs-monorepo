[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createBlockFromBeaconPayloadJSON

# Function: createBlockFromBeaconPayloadJSON()

> **createBlockFromBeaconPayloadJSON**(`payload`, `opts?`): `Promise`\<[`Block`](../classes/Block.md)\>

Defined in: [block/constructors.ts:365](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/constructors.ts#L365)

Method to retrieve a block from a beacon payload JSON

## Parameters

### payload

[`BeaconPayloadJSON`](../type-aliases/BeaconPayloadJSON.md)

JSON of a beacon beacon fetched from beacon apis

### opts?

[`BlockOptions`](../interfaces/BlockOptions.md)

[BlockOptions](../interfaces/BlockOptions.md)

## Returns

`Promise`\<[`Block`](../classes/Block.md)\>

the block constructed block
