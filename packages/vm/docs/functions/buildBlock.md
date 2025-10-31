[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / buildBlock

# Function: buildBlock()

> **buildBlock**(`vm`, `opts`): `Promise`\<[`BlockBuilder`](../classes/BlockBuilder.md)\>

Defined in: [vm/src/buildBlock.ts:466](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/buildBlock.ts#L466)

Build a block on top of the current state
by adding one transaction at a time.

Creates a checkpoint on the StateManager and modifies the state
as transactions are run. The checkpoint is committed on [BlockBuilder.build](../classes/BlockBuilder.md#build)
or discarded with [BlockBuilder.revert](../classes/BlockBuilder.md#revert).

## Parameters

### vm

[`VM`](../classes/VM.md)

### opts

[`BuildBlockOpts`](../interfaces/BuildBlockOpts.md)

## Returns

`Promise`\<[`BlockBuilder`](../classes/BlockBuilder.md)\>

An instance of [BlockBuilder](../classes/BlockBuilder.md) with methods:
- [BlockBuilder.addTransaction](../classes/BlockBuilder.md#addtransaction)
- [BlockBuilder.build](../classes/BlockBuilder.md#build)
- [BlockBuilder.revert](../classes/BlockBuilder.md#revert)
