[**@ethereumjs/era**](../README.md)

***

[@ethereumjs/era](../README.md) / readBlockTupleAtOffset

# Function: readBlockTupleAtOffset()

> **readBlockTupleAtOffset**(`bytes`, `recordStart`, `offset`): `object`

Defined in: [src/blockTuple.ts:66](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/era/src/blockTuple.ts#L66)

## Parameters

### bytes

`Uint8Array`

### recordStart

`number`

### offset

`number`

## Returns

`object`

### bodyEntry

> **bodyEntry**: [`e2StoreEntry`](../type-aliases/e2StoreEntry.md)

### headerEntry

> **headerEntry**: [`e2StoreEntry`](../type-aliases/e2StoreEntry.md)

### length

> **length**: `number` = `totalLength`

### receiptsEntry

> **receiptsEntry**: [`e2StoreEntry`](../type-aliases/e2StoreEntry.md)

### totalDifficultyEntry

> **totalDifficultyEntry**: [`e2StoreEntry`](../type-aliases/e2StoreEntry.md)
