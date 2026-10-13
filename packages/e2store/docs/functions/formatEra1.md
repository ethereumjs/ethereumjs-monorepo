[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / formatEra1

# Function: formatEra1()

> **formatEra1**(`blockTuples`, `headerRecords`, `epoch`): `Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>

Defined in: [packages/e2store/src/era1/era1.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/era1/era1.ts#L21)

Serializes an era1 file from compressed block tuples and epoch metadata.

## Parameters

### blockTuples

`object`[]

### headerRecords

`object`[]

### epoch

`number`

Epoch index (starting block number is `epoch * 8192`).

## Returns

`Promise`\<`Uint8Array`\<`ArrayBuffer`\>\>
