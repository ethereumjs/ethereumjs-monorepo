[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / BuildStatus

# Variable: BuildStatus

> **BuildStatus**: `object`

Defined in: [vm/src/buildBlock.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L53)

Status of an in-progress [BlockBuilder](../classes/BlockBuilder.md) session.

- `pending` — builder initialized, no transactions committed yet
- `build` — at least one transaction was successfully included
- `reverted` — the last transaction was reverted and excluded from the block

## Type Declaration

### Build

> `readonly` **Build**: `"build"` = `'build'`

### Pending

> `readonly` **Pending**: `"pending"` = `'pending'`

### Reverted

> `readonly` **Reverted**: `"reverted"` = `'reverted'`
