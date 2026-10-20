[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createBlockFromRLP

# Function: createBlockFromRLP()

> **createBlockFromRLP**(`serialized`, `opts?`): [`Block`](../classes/Block.md)

Defined in: [block/constructors.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/block/constructors.ts#L183)

Instantiate a block from RLP-serialized bytes.

## Parameters

### serialized

`Uint8Array`

### opts?

[`BlockOptions`](../interfaces/BlockOptions.md)

## Returns

[`Block`](../classes/Block.md)

## Throws

If the serialized length exceeds EIP-7934 `maxRlpBlockSize` when active

## Throws

If RLP decode result is not an array

## Throws

If decoded values fail [createBlockFromBytesArray](createBlockFromBytesArray.md) checks
