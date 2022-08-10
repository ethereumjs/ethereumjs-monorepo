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

[packages/evm/src/interpreter.ts:97](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L97)

___

### address

• **address**: `Address`

#### Defined in

[packages/evm/src/interpreter.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L98)

___

### codeAddress

• **codeAddress**: `Address`

#### Defined in

[packages/evm/src/interpreter.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L101)

___

### depth

• **depth**: `number`

#### Defined in

[packages/evm/src/interpreter.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L90)

___

### eei

• **eei**: [`EEIInterface`](EEIInterface.md)

#### Defined in

[packages/evm/src/interpreter.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L86)

___

### gasLeft

• **gasLeft**: `bigint`

#### Defined in

[packages/evm/src/interpreter.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L84)

___

### gasRefund

• **gasRefund**: `bigint`

#### Defined in

[packages/evm/src/interpreter.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L85)

___

### memory

• **memory**: `Buffer`

#### Defined in

[packages/evm/src/interpreter.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L99)

___

### memoryWordCount

• **memoryWordCount**: `bigint`

#### Defined in

[packages/evm/src/interpreter.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L100)

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

[packages/evm/src/interpreter.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L91)

___

### pc

• **pc**: `number`

#### Defined in

[packages/evm/src/interpreter.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L89)

___

### returnStack

• **returnStack**: `bigint`[]

#### Defined in

[packages/evm/src/interpreter.ts:88](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L88)

___

### stack

• **stack**: `bigint`[]

#### Defined in

[packages/evm/src/interpreter.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L87)
