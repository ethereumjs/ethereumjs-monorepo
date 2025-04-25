[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMResult

# Interface: EVMResult

Defined in: [types.ts:388](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L388)

Result of executing a message via the EVM.

## Properties

### createdAddress?

> `optional` **createdAddress**: `Address`

Defined in: [types.ts:392](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L392)

Address of created account during transaction, if any

***

### execResult

> **execResult**: [`ExecResult`](ExecResult.md)

Defined in: [types.ts:396](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L396)

Contains the results from running the code, if any, as described in runCode
