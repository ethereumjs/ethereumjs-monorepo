[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / runBlock

# Function: runBlock()

> **runBlock**(`vm`, `opts`): `Promise`\<[`RunBlockResult`](../interfaces/RunBlockResult.md)\>

Defined in: [vm/src/runBlock.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runBlock.ts#L87)

Processes the `block` running all of the transactions it contains and updating the miner's account

vm method modifies the state if successfully executed and header fields are valid.
state modifications will be reverted if an exception is raised during execution or validation.

## Parameters

### vm

[`VM`](../classes/VM.md)

### opts

[`RunBlockOpts`](../interfaces/RunBlockOpts.md)

Default values for options:
 - `generate`: false

## Returns

`Promise`\<[`RunBlockResult`](../interfaces/RunBlockResult.md)\>
