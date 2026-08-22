[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / createVM

# Function: createVM()

> **createVM**(`opts?`): `Promise`\<[`VM`](../classes/VM.md)\>

Defined in: [vm/src/constructors.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/constructors.ts#L24)

Async factory for initializing a [VM](../classes/VM.md) with sensible defaults.

Supplies mainnet [@ethereumjs/common!Common](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md), [@ethereumjs/evm!EVMMockBlockchain](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/docs/classes/EVMMockBlockchain.md), [@ethereumjs/statemanager!MerkleStateManager](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/docs/classes/MerkleStateManager.md),
and a nested [@ethereumjs/evm!createEVM](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/docs/functions/createEVM.md) instance when not provided.

## Parameters

### opts?

[`VMOpts`](../interfaces/VMOpts.md) = `{}`

## Returns

`Promise`\<[`VM`](../classes/VM.md)\>

## Throws

If both `evm` and `evmOpts` are set, or if conflicting profiler options are enabled
