[@ethereumjs/evm](../README.md) / InterpreterStep

# Interface: InterpreterStep

## Table of contents

### Properties

- [account](InterpreterStep.md#account)
- [address](InterpreterStep.md#address)
- [codeAddress](InterpreterStep.md#codeaddress)
- [depth](InterpreterStep.md#depth)
- [eei](InterpreterStep.md#eei)
- [gasLeft](InterpreterStep.md#gasleft)
- [gasRefund](InterpreterStep.md#gasrefund)
- [memory](InterpreterStep.md#memory)
- [memoryWordCount](InterpreterStep.md#memorywordcount)
- [opcode](InterpreterStep.md#opcode)
- [pc](InterpreterStep.md#pc)
- [returnStack](InterpreterStep.md#returnstack)
- [stack](InterpreterStep.md#stack)

## Properties

### account

• **account**: `Account`

#### Defined in

[interpreter.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L94)

___

### address

• **address**: `Address`

#### Defined in

[interpreter.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L95)

___

### codeAddress

• **codeAddress**: `Address`

#### Defined in

[interpreter.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L98)

___

### depth

• **depth**: `number`

#### Defined in

[interpreter.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L87)

___

### eei

• **eei**: [`EEIInterface`](EEIInterface.md)

#### Defined in

[interpreter.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L83)

___

### gasLeft

• **gasLeft**: `bigint`

#### Defined in

[interpreter.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L81)

___

### gasRefund

• **gasRefund**: `bigint`

#### Defined in

[interpreter.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L82)

___

### memory

• **memory**: `Buffer`

#### Defined in

[interpreter.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L96)

___

### memoryWordCount

• **memoryWordCount**: `bigint`

#### Defined in

[interpreter.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L97)

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

[interpreter.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L88)

___

### pc

• **pc**: `number`

#### Defined in

[interpreter.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L86)

___

### returnStack

• **returnStack**: `bigint`[]

#### Defined in

[interpreter.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L85)

___

### stack

• **stack**: `bigint`[]

#### Defined in

[interpreter.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L84)
