[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMResult

# Interface: EVMResult

Defined in: [types.ts:480](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L480)

Result of executing a message via the [EVM](../classes/EVM.md).

## Properties

### createdAddress?

> `optional` **createdAddress?**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [types.ts:484](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L484)

Address of created account during transaction, if any

***

### execResult

> **execResult**: [`ExecResult`](ExecResult.md)

Defined in: [types.ts:488](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L488)

Contains the results from running the code, if any, as described in [@ethereumjs/evm!EVM.runCode](../classes/EVM.md#runcode).
