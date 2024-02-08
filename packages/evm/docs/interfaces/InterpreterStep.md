[@ethereumjs/evm](../README.md) / InterpreterStep

# Interface: InterpreterStep

## Table of contents

### Properties

- [account](InterpreterStep.md#account)
- [address](InterpreterStep.md#address)
- [codeAddress](InterpreterStep.md#codeaddress)
- [depth](InterpreterStep.md#depth)
- [gasLeft](InterpreterStep.md#gasleft)
- [gasRefund](InterpreterStep.md#gasrefund)
- [memory](InterpreterStep.md#memory)
- [memoryWordCount](InterpreterStep.md#memorywordcount)
- [opcode](InterpreterStep.md#opcode)
- [pc](InterpreterStep.md#pc)
- [returnStack](InterpreterStep.md#returnstack)
- [stack](InterpreterStep.md#stack)
- [stateManager](InterpreterStep.md#statemanager)

## Properties

### account

• **account**: `Account`

#### Defined in

[interpreter.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L118)

___

### address

• **address**: `Address`

#### Defined in

[interpreter.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L119)

___

### codeAddress

• **codeAddress**: `Address`

#### Defined in

[interpreter.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L122)

___

### depth

• **depth**: `number`

#### Defined in

[interpreter.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L111)

___

### gasLeft

• **gasLeft**: `bigint`

#### Defined in

[interpreter.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L105)

___

### gasRefund

• **gasRefund**: `bigint`

#### Defined in

[interpreter.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L106)

___

### memory

• **memory**: `Uint8Array`

#### Defined in

[interpreter.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L120)

___

### memoryWordCount

• **memoryWordCount**: `bigint`

#### Defined in

[interpreter.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L121)

___

### opcode

• **opcode**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `dynamicFee?` | `bigint` |
| `fee` | `number` |
| `isAsync` | `boolean` |
| `name` | `string` |

#### Defined in

[interpreter.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L112)

___

### pc

• **pc**: `number`

#### Defined in

[interpreter.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L110)

___

### returnStack

• **returnStack**: `bigint`[]

#### Defined in

[interpreter.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L109)

___

### stack

• **stack**: `bigint`[]

#### Defined in

[interpreter.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L108)

___

### stateManager

• **stateManager**: `EVMStateManagerInterface`

#### Defined in

[interpreter.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L107)
