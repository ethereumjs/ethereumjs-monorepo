[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / parseBlockTuple

# Function: parseBlockTuple()

> **parseBlockTuple**(`__namedParameters`): `Promise`\<\{ `body`: `any`; `header`: `any`; `receipts`: `any`; `totalDifficulty`: `any`; \}\>

Defined in: [packages/e2store/src/era1/blockTuple.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/era1/blockTuple.ts#L50)

Decompresses the four entries of one era1 block tuple.

## Parameters

### \_\_namedParameters

#### bodyEntry

[`e2StoreEntry`](../type-aliases/e2StoreEntry.md)

#### headerEntry

[`e2StoreEntry`](../type-aliases/e2StoreEntry.md)

#### receiptsEntry

[`e2StoreEntry`](../type-aliases/e2StoreEntry.md)

#### totalDifficultyEntry

[`e2StoreEntry`](../type-aliases/e2StoreEntry.md)

## Returns

`Promise`\<\{ `body`: `any`; `header`: `any`; `receipts`: `any`; `totalDifficulty`: `any`; \}\>
