[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / runBlock

# Function: runBlock()

> **runBlock**(`vm`, `opts`): `Promise`\<[`RunBlockResult`](../interfaces/RunBlockResult.md)\>

Defined in: [vm/src/runBlock.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L91)

Executes a block's transactions, updates miner rewards, and optionally validates header fields.

Commits state on success; reverts the block checkpoint if execution or validation fails.
Options are documented on [RunBlockOpts](../interfaces/RunBlockOpts.md); defaults include `generate: false`.

## Parameters

### vm

[`VM`](../classes/VM.md)

### opts

[`RunBlockOpts`](../interfaces/RunBlockOpts.md)

## Returns

`Promise`\<[`RunBlockResult`](../interfaces/RunBlockResult.md)\>

## Throws

If header or block validation fails, receipts or roots mismatch expected values,
or a transaction reverts when validation is enabled

## Example

```ts
const result = await runBlock(vm, { block, generate: true })
```
