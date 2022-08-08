[@ethereumjs/evm](../README.md) / ExecResult

# Interface: ExecResult

Result of executing a call via the EVM.

## Table of contents

### Properties

- [exceptionError](ExecResult.md#exceptionerror)
- [executionGasUsed](ExecResult.md#executiongasused)
- [gas](ExecResult.md#gas)
- [gasRefund](ExecResult.md#gasrefund)
- [logs](ExecResult.md#logs)
- [returnValue](ExecResult.md#returnvalue)
- [runState](ExecResult.md#runstate)
- [selfdestruct](ExecResult.md#selfdestruct)

## Properties

### exceptionError

• `Optional` **exceptionError**: [`EvmError`](../classes/EvmError.md)

Description of the exception, if any occurred

#### Defined in

[packages/evm/src/evm.ts:953](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L953)

___

### executionGasUsed

• **executionGasUsed**: `bigint`

Amount of gas the code used to run

#### Defined in

[packages/evm/src/evm.ts:961](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L961)

___

### gas

• `Optional` **gas**: `bigint`

Amount of gas left

#### Defined in

[packages/evm/src/evm.ts:957](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L957)

___

### gasRefund

• `Optional` **gasRefund**: `bigint`

The gas refund counter

#### Defined in

[packages/evm/src/evm.ts:977](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L977)

___

### logs

• `Optional` **logs**: [`Log`](../README.md#log)[]

Array of logs that the contract emitted

#### Defined in

[packages/evm/src/evm.ts:969](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L969)

___

### returnValue

• **returnValue**: `Buffer`

Return value from the contract

#### Defined in

[packages/evm/src/evm.ts:965](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L965)

___

### runState

• `Optional` **runState**: `RunState`

#### Defined in

[packages/evm/src/evm.ts:949](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L949)

___

### selfdestruct

• `Optional` **selfdestruct**: `Object`

A map from the accounts that have self-destructed to the addresses to send their funds to

#### Index signature

▪ [k: `string`]: `Buffer`

#### Defined in

[packages/evm/src/evm.ts:973](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L973)
