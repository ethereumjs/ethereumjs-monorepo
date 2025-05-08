[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / readSlotIndex

# Function: readSlotIndex()

> **readSlotIndex**(`bytes`): [`SlotIndex`](../type-aliases/SlotIndex.md)

Defined in: [packages/e2store/src/era/era.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/era/era.ts#L13)

Reads a Slot Index from the end of a bytestring representing an era file

## Parameters

### bytes

`Uint8Array`

a Uint8Array bytestring representing a [SlotIndex](../type-aliases/SlotIndex.md) plus any arbitrary prefixed data

## Returns

[`SlotIndex`](../type-aliases/SlotIndex.md)

a deserialized [SlotIndex](../type-aliases/SlotIndex.md)
