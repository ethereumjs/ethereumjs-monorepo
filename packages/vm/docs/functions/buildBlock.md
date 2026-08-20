[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / buildBlock

# Function: buildBlock()

> **buildBlock**(`vm`, `opts`): `Promise`\<[`BlockBuilder`](../classes/BlockBuilder.md)\>

Defined in: [vm/src/buildBlock.ts:544](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L544)

Incrementally assembles a block by executing transactions against a [VM](../classes/VM.md).

Opens a StateManagerInterface checkpoint; commits on [BlockBuilder.build](../classes/BlockBuilder.md#build)
or reverts with [BlockBuilder.revert](../classes/BlockBuilder.md#revert). See [BuildBlockOpts](../interfaces/BuildBlockOpts.md) for parent block
and header defaults.

## Parameters

### vm

[`VM`](../classes/VM.md)

### opts

[`BuildBlockOpts`](../interfaces/BuildBlockOpts.md)

## Returns

`Promise`\<[`BlockBuilder`](../classes/BlockBuilder.md)\>

[BlockBuilder](../classes/BlockBuilder.md) for [BlockBuilder.addTransaction](../classes/BlockBuilder.md#addtransaction),
[BlockBuilder.build](../classes/BlockBuilder.md#build), and [BlockBuilder.revert](../classes/BlockBuilder.md#revert)

## Example

```ts
const builder = await buildBlock(vm, { parentBlock })
await builder.addTransaction(signedTx)
const { block } = await builder.build()
```
