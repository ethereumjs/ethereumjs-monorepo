[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMResult

# Interface: EVMResult

Defined in: [types.ts:385](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L385)

Result of executing a message via the [EVM](../classes/EVM.md).

## Properties

### createdAddress?

> `optional` **createdAddress**: `Address`

Defined in: [types.ts:389](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L389)

Address of created account during transaction, if any

***

### execResult

> **execResult**: [`ExecResult`](ExecResult.md)

Defined in: [types.ts:393](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L393)

Contains the results from running the code, if any, as described in runCode
