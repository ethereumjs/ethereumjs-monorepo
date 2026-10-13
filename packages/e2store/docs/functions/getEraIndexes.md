[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / getEraIndexes

# Function: getEraIndexes()

> **getEraIndexes**(`eraContents`): `object`

Defined in: [packages/e2store/src/era/era.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/era/era.ts#L47)

Extracts state and optional block [SlotIndex](../type-aliases/SlotIndex.md) records from a serialized era file.

## Parameters

### eraContents

`Uint8Array`

## Returns

`object`

Block index is `undefined` when `startSlot === 0` (state-only era).

### blockSlotIndex

> **blockSlotIndex**: [`SlotIndex`](../type-aliases/SlotIndex.md) \| `undefined`

### stateSlotIndex

> **stateSlotIndex**: [`SlotIndex`](../type-aliases/SlotIndex.md)
