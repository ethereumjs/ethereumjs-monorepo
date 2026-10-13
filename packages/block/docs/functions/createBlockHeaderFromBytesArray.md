[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createBlockHeaderFromBytesArray

# Function: createBlockHeaderFromBytesArray()

> **createBlockHeaderFromBytesArray**(`values`, `opts?`): [`BlockHeader`](../classes/BlockHeader.md)

Defined in: [header/constructors.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/constructors.ts#L26)

Instantiate a block header from RLP-encoded field values.

## Parameters

### values

[`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

### opts?

[`BlockOptions`](../interfaces/BlockOptions.md) = `{}`

## Returns

[`BlockHeader`](../classes/BlockHeader.md)

## Throws

If the values array length is out of range (15–23 fields)

## Throws

If required EIP fields are missing for the active hardfork

## Throws

If header field validation fails in the [BlockHeader](../classes/BlockHeader.md) constructor
