[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / getEraIndexes

# Function: getEraIndexes()

> **getEraIndexes**(`eraContents`): `object`

Defined in: [packages/e2store/src/era/era.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/era/era.ts#L46)

Reads a an era file and extracts the State and Block slot indices

## Parameters

### eraContents

`Uint8Array`

a bytestring representing a serialized era file

## Returns

`object`

a dictionary containing the State and Block Slot Indices (if present)

### blockSlotIndex

> **blockSlotIndex**: [`SlotIndex`](../type-aliases/SlotIndex.md) \| `undefined`

### stateSlotIndex

> **stateSlotIndex**: [`SlotIndex`](../type-aliases/SlotIndex.md)
