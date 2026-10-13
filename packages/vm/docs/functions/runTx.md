[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / runTx

# Function: runTx()

> **runTx**(`vm`, `opts`): `Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

Defined in: [vm/src/runTx.ts:479](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/runTx.ts#L479)

Executes a single transaction against the VM state and returns the receipt.

Options are documented on [RunTxOpts](../interfaces/RunTxOpts.md). Emits `beforeTx` / `afterTx` on the VM.

## Parameters

### vm

[`VM`](../classes/VM.md)

### opts

[`RunTxOpts`](../interfaces/RunTxOpts.md)

## Returns

`Promise`\<[`RunTxResult`](../interfaces/RunTxResult.md)\>

## Throws

If balance, nonce, or hardfork validation fails, or execution reverts
