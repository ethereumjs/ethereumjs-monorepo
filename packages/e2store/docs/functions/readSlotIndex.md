[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / readSlotIndex

# Function: readSlotIndex()

> **readSlotIndex**(`bytes`): [`SlotIndex`](../type-aliases/SlotIndex.md)

Defined in: [packages/e2store/src/era/era.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/era/era.ts#L14)

Parses the trailing [SlotIndex](../type-aliases/SlotIndex.md) record from an era file byte string.

## Parameters

### bytes

`Uint8Array`

Full era buffer; the index is read from the end.

## Returns

[`SlotIndex`](../type-aliases/SlotIndex.md)

## Throws

If the trailing entry is not a SlotIndex type.
