[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / Log

# Type Alias: Log

> **Log** = \[`Uint8Array`, `Uint8Array`[], `Uint8Array`\]

Defined in: [types.ts:578](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L578)

Log emitted during EVM execution.

Tuple of `[emitterAddress, topics, data]` — the same shape used in transaction receipts
(`receipt.logs`) and JSON-RPC log objects (before field renaming). See the package README
section on event logs and
[Receipts and event logs](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#receipts-and-event-logs)
in `@ethereumjs/vm`.
