[@ethereumjs/evm](../README.md) / ExecResult

# Interface: ExecResult

Result of executing a call via the EVM.

## Table of contents

### Properties

- [blobGasUsed](ExecResult.md#blobgasused)
- [createdAddresses](ExecResult.md#createdaddresses)
- [exceptionError](ExecResult.md#exceptionerror)
- [executionGasUsed](ExecResult.md#executiongasused)
- [gas](ExecResult.md#gas)
- [gasRefund](ExecResult.md#gasrefund)
- [logs](ExecResult.md#logs)
- [returnValue](ExecResult.md#returnvalue)
- [runState](ExecResult.md#runstate)
- [selfdestruct](ExecResult.md#selfdestruct)

## Properties

### blobGasUsed

• `Optional` **blobGasUsed**: `bigint`

Amount of blob gas consumed by the transaction

#### Defined in

[types.ts:331](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L331)

___

### createdAddresses

• `Optional` **createdAddresses**: `Set`<`string`\>

Map of addresses which were created (used in EIP 6780)

#### Defined in

[types.ts:323](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L323)

___

### exceptionError

• `Optional` **exceptionError**: [`EvmError`](../classes/EvmError.md)

Description of the exception, if any occurred

#### Defined in

[types.ts:299](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L299)

___

### executionGasUsed

• **executionGasUsed**: `bigint`

Amount of gas the code used to run

#### Defined in

[types.ts:307](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L307)

___

### gas

• `Optional` **gas**: `bigint`

Amount of gas left

#### Defined in

[types.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L303)

___

### gasRefund

• `Optional` **gasRefund**: `bigint`

The gas refund counter

#### Defined in

[types.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L327)

___

### logs

• `Optional` **logs**: [`Log`](../README.md#log)[]

Array of logs that the contract emitted

#### Defined in

[types.ts:315](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L315)

___

### returnValue

• **returnValue**: `Uint8Array`

Return value from the contract

#### Defined in

[types.ts:311](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L311)

___

### runState

• `Optional` **runState**: `RunState`

#### Defined in

[types.ts:295](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L295)

___

### selfdestruct

• `Optional` **selfdestruct**: `Set`<`string`\>

A set of accounts to selfdestruct

#### Defined in

[types.ts:319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L319)
