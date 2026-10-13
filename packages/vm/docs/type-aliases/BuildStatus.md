[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / BuildStatus

# Type Alias: BuildStatus

> **BuildStatus** = *typeof* [`BuildStatus`](../variables/BuildStatus.md)\[keyof *typeof* [`BuildStatus`](../variables/BuildStatus.md)\]

Defined in: [vm/src/buildBlock.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L53)

Status of an in-progress [BlockBuilder](../classes/BlockBuilder.md) session.

- `pending` — builder initialized, no transactions committed yet
- `build` — at least one transaction was successfully included
- `reverted` — the last transaction was reverted and excluded from the block
