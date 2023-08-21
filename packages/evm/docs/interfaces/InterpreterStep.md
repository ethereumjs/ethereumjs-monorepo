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

[interpreter.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L102)

___

### address

• **address**: `Address`

#### Defined in

[interpreter.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L103)

___

### codeAddress

• **codeAddress**: `Address`

#### Defined in

[interpreter.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L106)

___

### depth

• **depth**: `number`

#### Defined in

[interpreter.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L95)

___

### gasLeft

• **gasLeft**: `bigint`

#### Defined in

[interpreter.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L89)

___

### gasRefund

• **gasRefund**: `bigint`

#### Defined in

[interpreter.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L90)

___

### memory

• **memory**: `Uint8Array`

#### Defined in

[interpreter.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L104)

___

### memoryWordCount

• **memoryWordCount**: `bigint`

#### Defined in

[interpreter.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L105)

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

[interpreter.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L96)

___

### pc

• **pc**: `number`

#### Defined in

[interpreter.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L94)

___

### returnStack

• **returnStack**: `bigint`[]

#### Defined in

[interpreter.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L93)

___

### stack

• **stack**: `bigint`[]

#### Defined in

[interpreter.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L92)

___

### stateManager

• **stateManager**: `EVMStateManagerInterface`

#### Defined in

[interpreter.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L91)
