[**@ethereumjs/era**](../README.md)

***

[@ethereumjs/era](../README.md) / formatEra1

# Function: formatEra1()

> **formatEra1**(`blockTuples`, `headerRecords`, `epoch`): `Promise`\<`Uint8Array`\>

Defined in: [src/era1.ts:15](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/era/src/era1.ts#L15)

Format era1 from epoch of history data

## Parameters

### blockTuples

`object`[]

header, body, receipts, totalDifficulty

### headerRecords

`object`[]

array of Header Records { blockHash: Uint8Array, totalDifficulty: bigint }

### epoch

`number`

epoch index

## Returns

`Promise`\<`Uint8Array`\>

serialized era1 file
