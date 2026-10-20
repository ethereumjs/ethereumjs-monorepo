[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMResult

# Interface: EVMResult

Defined in: [types.ts:478](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L478)

Result of executing a message via the [EVM](../classes/EVM.md).

## Properties

### createdAddress?

> `optional` **createdAddress?**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [types.ts:482](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L482)

Address of created account during transaction, if any

***

### execResult

> **execResult**: [`ExecResult`](ExecResult.md)

Defined in: [types.ts:486](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L486)

Contains the results from running the code, if any, as described in [@ethereumjs/evm!EVM.runCode](../classes/EVM.md#runcode).
