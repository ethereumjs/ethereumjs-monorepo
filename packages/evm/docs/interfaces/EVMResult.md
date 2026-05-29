[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMResult

# Interface: EVMResult

Defined in: [types.ts:442](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L442)

Result of executing a message via the [EVM](../classes/EVM.md).

## Properties

### createdAddress?

> `optional` **createdAddress**: `Address`

Defined in: [types.ts:446](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L446)

Address of created account during transaction, if any

***

### execResult

> **execResult**: [`ExecResult`](ExecResult.md)

Defined in: [types.ts:450](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L450)

Contains the results from running the code, if any, as described in runCode
