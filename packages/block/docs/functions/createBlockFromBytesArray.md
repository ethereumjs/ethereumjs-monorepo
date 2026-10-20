[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createBlockFromBytesArray

# Function: createBlockFromBytesArray()

> **createBlockFromBytesArray**(`values`, `opts?`): [`Block`](../classes/Block.md)

Defined in: [block/constructors.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/constructors.ts#L109)

Instantiate a block from RLP-encoded field values.

## Parameters

### values

[`BlockBytes`](../type-aliases/BlockBytes.md)

### opts?

[`BlockOptions`](../interfaces/BlockOptions.md)

## Returns

[`Block`](../classes/Block.md)

## Throws

If more than five top-level RLP elements are present

## Throws

If EIP-4895 is active but withdrawals are missing

## Throws

If delegated header or transaction factory validation fails
