[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / createEVM

# Function: createEVM()

> **createEVM**(`createOpts?`): `Promise`\<[`EVM`](../classes/EVM.md)\>

Defined in: [constructors.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/constructors.ts#L19)

Async factory for initializing an [EVM](../classes/EVM.md) with sensible defaults.

Supplies a [NobleBN254](../classes/NobleBN254.md) precompile backend, mainnet [@ethereumjs/common!Common](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md),
[EVMMockBlockchain](../classes/EVMMockBlockchain.md), and [@ethereumjs/statemanager!SimpleStateManager](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/docs/classes/SimpleStateManager.md) when not provided.

## Parameters

### createOpts?

[`EVMOpts`](../interfaces/EVMOpts.md)

EVM configuration

## Returns

`Promise`\<[`EVM`](../classes/EVM.md)\>

Initialized EVM instance
