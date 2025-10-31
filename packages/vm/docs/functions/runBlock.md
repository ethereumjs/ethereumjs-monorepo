[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / runBlock

# Function: runBlock()

> **runBlock**(`vm`, `opts`): `Promise`\<[`RunBlockResult`](../interfaces/RunBlockResult.md)\>

Defined in: [vm/src/runBlock.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L74)

Processes the `block` running all of the transactions it contains and updating the miner's account

vm method modifies the state. If `generate` is `true`, the state modifications will be
reverted if an exception is raised. If it's `false`, it won't revert if the block's header is
invalid. If an error is thrown from an event handler, the state may or may not be reverted.

## Parameters

### vm

[`VM`](../classes/VM.md)

### opts

[`RunBlockOpts`](../interfaces/RunBlockOpts.md)

Default values for options:
 - `generate`: false

## Returns

`Promise`\<[`RunBlockResult`](../interfaces/RunBlockResult.md)\>
