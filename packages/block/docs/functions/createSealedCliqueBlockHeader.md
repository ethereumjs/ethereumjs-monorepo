[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / createSealedCliqueBlockHeader

# Function: createSealedCliqueBlockHeader()

> **createSealedCliqueBlockHeader**(`headerData`, `cliqueSigner`, `opts`): [`BlockHeader`](../classes/BlockHeader.md)

Defined in: [header/constructors.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/constructors.ts#L87)

Creates a Clique block header with the seal applied during instantiation.

## Parameters

### headerData

[`HeaderData`](../interfaces/HeaderData.md) = `{}`

Header fields for the Clique block

### cliqueSigner

`Uint8Array`

Private key bytes used to sign the header

### opts

[`BlockOptions`](../interfaces/BlockOptions.md) = `{}`

[BlockOptions](../interfaces/BlockOptions.md)

## Returns

[`BlockHeader`](../classes/BlockHeader.md)

A sealed [BlockHeader](../classes/BlockHeader.md)
