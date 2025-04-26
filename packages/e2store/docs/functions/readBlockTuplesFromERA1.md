[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / readBlockTuplesFromERA1

# Function: readBlockTuplesFromERA1()

> **readBlockTuplesFromERA1**(`bytes`, `count`, `offsets`, `recordStart`): `AsyncGenerator`\<\{ `bodyEntry`: [`e2StoreEntry`](../type-aliases/e2StoreEntry.md); `headerEntry`: [`e2StoreEntry`](../type-aliases/e2StoreEntry.md); `receiptsEntry`: [`e2StoreEntry`](../type-aliases/e2StoreEntry.md); `totalDifficultyEntry`: [`e2StoreEntry`](../type-aliases/e2StoreEntry.md); \}, `void`, `unknown`\>

Defined in: [packages/e2store/src/era1/era1.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/era1/era1.ts#L81)

## Parameters

### bytes

`Uint8Array`

### count

`number`

### offsets

`number`[]

### recordStart

`number`

## Returns

`AsyncGenerator`\<\{ `bodyEntry`: [`e2StoreEntry`](../type-aliases/e2StoreEntry.md); `headerEntry`: [`e2StoreEntry`](../type-aliases/e2StoreEntry.md); `receiptsEntry`: [`e2StoreEntry`](../type-aliases/e2StoreEntry.md); `totalDifficultyEntry`: [`e2StoreEntry`](../type-aliases/e2StoreEntry.md); \}, `void`, `unknown`\>
